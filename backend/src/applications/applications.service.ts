import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Application } from './entities/application.entity'; // 👈 เช็กชื่อ Model ให้ตรงนะครับ
import { Project } from '../projects/entities/project.entity';
import { Company } from '../company/entities/company.entity';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { User } from 'src/users/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application) 
    private applicationModel: typeof Application,
  ) {}

  async create(createApplicationDto: any) {
    try {
      // สร้างข้อมูลการสมัครลง Database
      return await this.applicationModel.create({
        ...createApplicationDto,
        // ถ้าใน DTO ไม่มี status ให้ใส่ default เป็น 'PENDING'
        status: createApplicationDto.status || 'PENDING', 
      });
    } catch (error) {
      console.error('🔥 Create Application Error:', error);
      throw error;
    }
  }

  // 🌟 เพิ่มฟังก์ชันนี้ลงไปครับ
  async findMyApplications(userId: string) {
    return await this.applicationModel.findAll({
      where: { 
        userID: userId  // 👈 เช็กชื่อคีย์ใน Table 'Applications' ของคุณว่าใช้ userID หรือ studentID
      },
      include: [
        {
          model: Project,
          as: 'project', // 👈 เช็กให้ชัวร์ว่า import Project มาจาก entities แล้ว
          include: [Company] // 👈 ถ้าใน Project มีการผูก Company ไว้ ก็เปิดคอมเมนต์บรรทัดนี้ได้เลยครับ
        }
      ], // 👈 ใส่เพื่อให้หน้าบ้านเห็นชื่อโครงการ ไม่ใช่เห็นแค่ ID
    });
  }

  // 🌟 เพิ่มฟังก์ชันนี้ลงไปครับ
  async findByProjectId(projectId: string) {
    return await this.applicationModel.findAll({
      where: { 
        projID: projectId // ⚠️ เช็กชื่อคอลัมน์ ID โครงการใน DB ของคุณด้วยนะครับ
      },
     include: [
      {
        model: User,
        attributes: ['userID', 'email'], // ดึงแค่ Email จากตาราง User
        include: [
          {
            model: Student, // 🌟 ดึงทะลุมาที่ตาราง Student
            // ⚠️ เช็กชื่อคอลัมน์ในไฟล์ student.entity.ts ของคุณให้ตรงกันด้วยนะครับ
            attributes: ['studentID', 'firstName', 'lastName'], 
          }
          
        ]
      },
    ],
    });
  }
  findAll() {
    return `This action returns all applications`;
  }

async findOne(id: string) { // 🌟 แก้เป็น string
    // ...
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) { // 🌟 แก้เป็น string
    // ...
  }

  async remove(id: string) {
    try {
      // 1. ค้นหาใบสมัครที่ต้องการลบ
      const application = await this.applicationModel.findByPk(id);
      
      if (!application) {
        throw new NotFoundException(`ไม่พบข้อมูลการสมัครรหัส ${id}`);
      }

      // 2. สั่งลบออกจาก Database
      await application.destroy();

      return { message: 'ยกเลิกการสมัครเรียบร้อยแล้ว' };
    } catch (error) {
      console.error('🔥 Delete Application Error:', error);
      throw error;
    }
  }
  // ฟังก์ชันอัปเดต appStat
  async updateAppStatus(id: string, status: string) {
    const application = await this.applicationModel.findByPk(id);
    if (!application) throw new NotFoundException('ไม่พบใบสมัครนี้');

    await application.update({ appStat: status });
    return { message: 'อัปเดตสถานะสำเร็จ', data: application };
  }

  // ฟังก์ชันอัปเดต hiredStat
  async updateHiredStatus(id: string, hiredStat: string) {
    const application = await this.applicationModel.findByPk(id);
    if (!application) throw new NotFoundException('ไม่พบใบสมัครนี้');

    await application.update({ hiredStat });
    return { message: 'อัปเดตผลการจ้างงานสำเร็จ', data: application };
  }
  // ใน applications.service.ts
async getApplicationsByProject(projectId: string) {
  const apps = await this.applicationModel.findAll({ where: { projID: projectId } });
  
  // วนลูปเช็ค ถ้าอันไหนไม่มีค่า ให้เซ็ตเป็นค่าเริ่มต้น
  for (let app of apps) {
    if (!app.hiredStat) {
      await app.update({ hiredStat: 'WAITING' });
    }
  }
  return apps;
}
}
