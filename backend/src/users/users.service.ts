import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HR } from 'src/hr/entities/hr.entity';
import { Advisor } from 'src/advisor/entities/advisor.entity';
import { Student } from 'src/student/entities/student.entity';
import { Company } from 'src/company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from 'src/activity-log/activity-log.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Student) private studentModel: typeof Student,
    @InjectModel(Advisor) private advisorModel: typeof Advisor,
    @InjectModel(HR) private hrModel: typeof HR,
    private activityLogsService: ActivityLogsService,
  ) {}

  async getProfile(userID: string, role: string) {
    // get profile info for userID and role
    const userBase = await this.userModel.findByPk(userID, {
      attributes: { exclude: ['passwordHash'] }, 
    });

    if (!userBase) {
      throw new NotFoundException('user not found');
    }

    // get profile data based on role
    let profileData : any = null;

    if (role === 'STUDENT') {
      profileData = await this.studentModel.findOne({ where: { userID } });
    } else if (role === 'ADVISOR') {
      profileData = await this.advisorModel.findOne({ where: { userID } });
    } else if (role === 'HR') {
      profileData = await this.hrModel.findOne({ 
        where: { userID }, include: [Company]
      });
    }

    return {
      message: 'profile retrieved successfully',
      accountInfo: userBase,
      profile: profileData,
    };
  }
  
  // 🌟 ปรับแก้ฟังก์ชัน Create
 async create(userData: any, adminId?: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const plainTextPassword = userData.password || userData.passwordHash || '123456';
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    const { password, ...dataToSave } = userData;

    // 1. สร้างข้อมูลในตาราง Users ก่อน
  const newUser = await this.userModel.create({
      ...dataToSave,
      userID: uuidv4(),
      passwordHash: hashedPassword,
      provider: 'LOCAL',
    });

    // 🌟 ดึงชื่อ-นามสกุลจากที่ Admin กรอก (ถ้ามี) ถ้าไม่มีให้ใส่ '-' ไปก่อนกัน Database Error
    const fName = dataToSave.firstName || '-';
    const lName = dataToSave.lastName || '-';

    // 2. สร้าง Profile ผูกเข้ากับตารางตาม Role พร้อมใส่ค่าเริ่มต้น
    if (newUser.role === 'STUDENT') {
      await this.studentModel.create({ 
        userID: newUser.userID, 
        firstName: fName, 
        lastName: lName 
      });
    } else if (newUser.role === 'ADVISOR') {
      await this.advisorModel.create({ 
        userID: newUser.userID, 
        firstName: fName, 
        lastName: lName 
      });
    } else if (newUser.role === 'HR') {
      await this.hrModel.create({ 
        userID: newUser.userID, 
        firstName: fName, 
        lastName: lName 
      }); 
    }

    // 3. บันทึก Log การกระทำของ Admin
    if (adminId) {
      await this.activityLogsService.createLog(
        adminId,
        'CREATE_USER',
        `Admin เพิ่มผู้ใช้งานใหม่: ${newUser.email} (Role: ${newUser.role})`
      );
    }

    return newUser;
  }
  async findAll() {
    // ดึงผู้ใช้งานทั้งหมด โดยไม่ส่งรหัสผ่าน (passwordHash) กลับไปด้วยเพื่อความปลอดภัย
    return await this.userModel.findAll({
      attributes: { exclude: ['passwordHash'] }
    });
  }

  async findOne(id: string) {
    // ค้นหาผู้ใช้จาก Primary Key (userID)
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['passwordHash'] }
    });
    
    if (!user) {
      throw new NotFoundException(`ไม่พบผู้ใช้งาน ID: ${id}`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // 🌟 สำคัญ: สำหรับ Login ห้าม exclude passwordHash ออกนะครับ
    return this.userModel.findOne({ where: { email } });
  }

// 🌟 ปรับแก้ฟังก์ชัน Update
  async update(id: string, updateUserDto: UpdateUserDto, adminId: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`ไม่พบผู้ใช้งาน ID: ${id}`);

    const updateData: any = { ...updateUserDto };
    let logMessage = `Admin แก้ไขข้อมูลผู้ใช้งาน ${user.email}`;
    let logAction = 'UPDATE_USER';

    // ถ้ามีการ Reset Password
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
      delete updateData.password;
      
      logAction = 'RESET_PASSWORD';
      logMessage = `Admin รีเซ็ตรหัสผ่านของผู้ใช้งาน ${user.email}`;
    }

    // ถ้ามีการแก้ไข Role
    if (updateUserDto.role && updateUserDto.role !== user.role) {
      logAction = 'UPDATE_USER_ROLE';
      logMessage = `Admin เปลี่ยน Role ของผู้ใช้งาน ${user.email} จาก ${user.role} เป็น ${updateUserDto.role}`;
    }

    await this.userModel.update(updateData, { where: { userID: id } });

    // 🌟 บันทึก Log การแก้ไข
    await this.activityLogsService.createLog(adminId, logAction, logMessage);

    return this.findOne(id); 
  }
  // 🌟 ปรับแก้ฟังก์ชัน Remove
  async remove(id: string, adminId: string) {
    const user = await this.findOne(id); // ดึงข้อมูลมาก่อนเพื่อเอา email ไปลง Log
    
    await this.userModel.destroy({ where: { userID: id } });
    
    // 🌟 บันทึก Log การลบ
    await this.activityLogsService.createLog(
      adminId,
      'DELETE_USER',
      `Admin ลบผู้ใช้งาน: ${user.email}`
    );

    return { message: `ลบข้อมูลผู้ใช้งาน ID: ${id} สำเร็จ` };
  }
}