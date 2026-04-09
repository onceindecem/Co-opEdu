import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from './entities/report.entity'; 
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

async create(createReportDto: CreateReportDto, userId: string) { 
    const app = await this.applicationModel.findByPk(createReportDto.appID);
    
    if (app && app.appStat === 'NOT_PASSED') { 
      throw new BadRequestException('ไม่สามารถเพิ่มบันทึกในโครงการที่ไม่ผ่านการคัดเลือกได้');
    }

    const report = await this.reportModel.create({ ...createReportDto });

    if (userId) {
      await this.activityLogsService.createLog(
        userId,
        'CREATE_PROGRESS_REPORT',
        `นักศึกษาส่งรายงานความคืบหน้า`
      );
    }

    return report;
  }
  async findAllByAppId(appId: string) {
    return await this.reportModel.findAll({
      where: { appID: appId },
      order: [['createAt', 'DESC']], 
    });
  }

  async update(repID: string, updateData: Partial<CreateReportDto>, userId: string) { // 🌟 รับ userId
    const report = await this.reportModel.findByPk(repID);
    if (!report) throw new NotFoundException('ไม่พบข้อมูลบันทึกความคืบหน้านี้');
    
    const updatedReport = await report.update(updateData);

    if (userId) {
      await this.activityLogsService.createLog(
        userId,
        'UPDATE_PROGRESS_REPORT',
        `นักศึกษาแก้ไขรายงานความคืบหน้า`
      );
    }

    return updatedReport;
  }


 async remove(repID: string, userId: string) { 
    const report = await this.reportModel.findByPk(repID);
    if (!report) throw new NotFoundException('ไม่พบข้อมูลบันทึกความคืบหน้านี้');
    
    await report.destroy();

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

  return await this.reportModel.findAll({
    include: [{
      model: Application,
      where: { userID: userId }, 
      attributes: [] 
    }],
    order: [['createAt', 'DESC']],
  });
}

async findAllForAdvisor() {
    const allReports = await this.reportModel.findAll({
      include: [
        {
          model: Application,
          required: false, 
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
                  required: false 
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
      const currentAppId = report.get('appID') as string || report.appID;

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