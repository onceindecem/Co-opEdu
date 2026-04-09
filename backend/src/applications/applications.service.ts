import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Application } from './entities/application.entity';
import { Project } from '../projects/entities/project.entity';
import { Company } from '../company/entities/company.entity';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { User } from 'src/users/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { ActivityLogsService } from 'src/activity-log/activity-log.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private applicationModel: typeof Application,
    private activityLogsService: ActivityLogsService,
  ) { }

  async create(createApplicationDto: any) {
    try {
      const application = await this.applicationModel.create({
        ...createApplicationDto,
        status: createApplicationDto.status || 'PENDING',
      });

      if (createApplicationDto.userID) {
        await this.activityLogsService.createLog(
          createApplicationDto.userID,
          'APPLY_PROJECT',
          `นักศึกษาสมัครเข้าร่วมโครงการรหัส: ${createApplicationDto.projID || 'ไม่ระบุ'}`
        );
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  async findMyApplications(userId: string) {
    return await this.applicationModel.findAll({
      where: {
        userID: userId
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [Company]
        }
      ],
    });
  }

  async findByProjectId(projectId: string) {
    return await this.applicationModel.findAll({
      where: {
        projID: projectId
      },
      include: [
        {
          model: User,
          attributes: ['userID', 'email'],
          include: [
            {
              model: Student,
              attributes: ['studentID', 'firstName', 'lastName'],
            }

          ]
        },
      ],
    });
  }

  async remove(id: string, userId: string) {
    try {
      const application = await this.applicationModel.findByPk(id);

      if (!application) {
        throw new NotFoundException(`ไม่พบข้อมูลการสมัครรหัส ${id}`);
      }

      await application.destroy();

      if (userId) {
        await this.activityLogsService.createLog(
          userId,
          'CANCEL_APPLICATION',
          `นักศึกษายกเลิกการสมัครโครงการรหัส: ${application.projID}`
        );
      }

      return { message: 'ยกเลิกการสมัครเรียบร้อยแล้ว' };
    } catch (error) {
      throw error;
    }
  }

  async updateAppStatus(id: string, status: string, advisorId: string) {
    const application = await this.applicationModel.findByPk(id);
    if (!application) throw new NotFoundException('ไม่พบใบสมัครนี้');

    await application.update({ appStat: status });

    if (advisorId) {
      await this.activityLogsService.createLog(
        advisorId,
        'UPDATE_APP_STATUS',
        `อาจารย์อัปเดตสถานะใบสมัครเป็น: ${status}`
      );
    }

    return { message: 'อัปเดตสถานะสำเร็จ', data: application };
  }

  async updateHiredStatus(id: string, hiredStat: string, advisorId: string) {
    const application = await this.applicationModel.findByPk(id);
    if (!application) throw new NotFoundException('ไม่พบใบสมัครนี้');

    await application.update({ hiredStat });

    if (advisorId) {
      await this.activityLogsService.createLog(
        advisorId,
        'UPDATE_HIRED_STATUS',
        `อาจารย์อัปเดตผลการจ้างงานเป็น: ${hiredStat}`
      );
    }

    return { message: 'อัปเดตผลการจ้างงานสำเร็จ', data: application };
  }

  async getApplicationsByProject(projectId: string) {
    const apps = await this.applicationModel.findAll({ where: { projID: projectId } });
    for (let app of apps) {
      if (!app.hiredStat) {
        await app.update({ hiredStat: 'WAITING' });
      }
    }
    return apps;
  }
}
