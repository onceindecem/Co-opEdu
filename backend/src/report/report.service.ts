import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from './entities/report.entity'; // เปลี่ยน path ให้ตรงกับไฟล์ model ของคุณ
import { CreateReportDto } from './dto/create-report.dto';
import { Application } from 'src/applications/entities/application.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Student } from 'src/student/entities/student.entity';
import { ActivityLogsService } from 'src/activity-log/activity-log.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report)
    private reportModel: typeof Report,
    @InjectModel(Application)
    private applicationModel: typeof Application,
    private activityLogsService: ActivityLogsService,
  ) {}

async create(createReportDto: CreateReportDto, userId: string) { // 🌟 รับ userId
    const app = await this.applicationModel.findByPk(createReportDto.appID);
    
    if (app && app.appStat === 'NOT_PASSED') { 
      throw new BadRequestException('ไม่สามารถเพิ่มบันทึกในโครงการที่ไม่ผ่านการคัดเลือกได้');
    }

    const report = await this.reportModel.create({ ...createReportDto });

    // 🌟 บันทึก Log
    if (userId) {
      await this.activityLogsService.createLog(
        userId,
        'CREATE_PROGRESS_REPORT',
        `นักศึกษาส่งรายงานความคืบหน้า`
      );
    }

    return report;
  }
  // 2. ดึง Report ทั้งหมดของ Application ID นั้นๆ (เอาไว้โชว์ใน Timeline ของนักศึกษา)
  async findAllByAppId(appId: string) {
    return await this.reportModel.findAll({
      where: { appID: appId },
      order: [['createAt', 'DESC']], // เรียงจากใหม่ไปเก่า
    });
  }

  // 3. อัปเดต Report
  async update(repID: string, updateData: Partial<CreateReportDto>, userId: string) { // 🌟 รับ userId
    const report = await this.reportModel.findByPk(repID);
    if (!report) throw new NotFoundException('ไม่พบข้อมูลบันทึกความคืบหน้านี้');
    
    const updatedReport = await report.update(updateData);

    // 🌟 บันทึก Log
    if (userId) {
      await this.activityLogsService.createLog(
        userId,
        'UPDATE_PROGRESS_REPORT',
        `นักศึกษาแก้ไขรายงานความคืบหน้า`
      );
    }

    return updatedReport;
  }

  // 4. ลบ Report
 async remove(repID: string, userId: string) { // 🌟 รับ userId
    const report = await this.reportModel.findByPk(repID);
    if (!report) throw new NotFoundException('ไม่พบข้อมูลบันทึกความคืบหน้านี้');
    
    await report.destroy();

    // 🌟 บันทึก Log
    if (userId) {
      await this.activityLogsService.createLog(
        userId,
        'DELETE_PROGRESS_REPORT',
        `นักศึกษาลบรายงานความคืบหน้า`
      );
    }

    return { message: 'ลบข้อมูลสำเร็จ' };
  }

async findAllByUserId(userId: string) {
  if (!userId) return [];

  // 🌟 เอากลับมา Join ตารางเพื่อกรองเฉพาะของนักศึกษาคนนี้
  return await this.reportModel.findAll({
    include: [{
      model: Application,
      where: { userID: userId }, // ตรงนี้จะทำงานได้แล้ว เพราะ userId ไม่ว่างแล้ว!
      attributes: [] 
    }],
    order: [['createAt', 'DESC']],
  });
}

// ดึงข้อมูล Report ทั้งหมดสำหรับอาจารย์ (Join ข้อมูลแบบจัดเต็ม)
 // ดึงข้อมูล Report ทั้งหมดสำหรับอาจารย์ (Join ข้อมูลแบบจัดเต็ม)
async findAllForAdvisor() {
    const allReports = await this.reportModel.findAll({
      include: [
        {
          model: Application,
          required: false, // 🌟 ป้องกันข้อมูลหาย
          include: [
            { 
              model: Project, 
              required: false,
              include: [{ model: Company, required: false }] 
            },
            { 
              model: User, 
              required: false,
              include: [
                { 
                  model: Student, 
                  required: false // 🌟 สำคัญมาก! บังคับ LEFT JOIN (ถ้ายังไม่มีชื่อ ก็ดึงมาโชว์เป็นอีเมลไปก่อน ห้ามตัดทิ้ง)
                } 
              ]
            }
          ]
        }
      ],
      order: [['createAt', 'DESC']],
    });

    const latestReports: Report[] = [];
    const seenAppIds = new Set();

    for (const report of allReports) {
      // 🌟 ใช้ .get() เพื่อดึงข้อมูลชัวร์ๆ ป้องกันบั๊ก undefined ของ Sequelize
      // ดักไว้ทั้ง D ใหญ่ และ d เล็ก
      const currentAppId = report.get('appID') as string || report.appID;

      // ถ้าหา ID ไม่เจอจริงๆ ให้ปล่อยผ่านไปเลย จะได้ไม่บั๊กโดนยุบรวมกันหมด
      if (!currentAppId) {
        latestReports.push(report);
        continue;
      }

      if (!seenAppIds.has(currentAppId)) {
        latestReports.push(report);
        seenAppIds.add(currentAppId);
      }
    }

    return latestReports;
  }
}