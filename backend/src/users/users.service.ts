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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Student) private studentModel: typeof Student,
    @InjectModel(Advisor) private advisorModel: typeof Advisor,
    @InjectModel(HR) private hrModel: typeof HR,
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
  
  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    // 1. ตรวจสอบก่อนว่า User คนนี้มีตัวตนไหม
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`ไม่พบผู้ใช้งาน ID: ${id}`);
    }

    // เตรียมก๊อปปี้ข้อมูลจาก DTO เพื่อนำมาปรับแต่งก่อนบันทึก
    const updateData: any = { ...updateUserDto };

    // 2. ถ้ามีการส่ง Password มา (สำหรับการ Reset Password)
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      // 🌟 แปลงค่าจาก password เป็น passwordHash ให้ตรงกับหัวข้อคอลัมน์ใน Database
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
      
      // ลบฟิลด์ password ทิ้ง เพื่อไม่ให้ Sequelize ส่งไปผิดคอลัมน์
      delete updateData.password;
    }

    // 3. ทำการอัปเดตข้อมูล โดยใช้ข้อมูลที่เตรียมไว้ (updateData)
    await this.userModel.update(updateData, {
      where: { userID: id }
    });

    // อัปเดตเสร็จให้ดึงข้อมูลล่าสุดกลับไป
    return this.findOne(id); 
  }

  async remove(id: string) {
    // เช็คก่อนว่ามี User นี้อยู่จริงไหม (ถ้าไม่มี findOne จะโยน Error ให้เอง)
    await this.findOne(id);
    
    // ลบข้อมูล
    await this.userModel.destroy({
      where: { userID: id }
    });
    
    return { message: `ลบข้อมูลผู้ใช้งาน ID: ${id} สำเร็จ` };
  }
}