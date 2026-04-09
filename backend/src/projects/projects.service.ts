import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'; // 👈 เพิ่ม BadRequestException
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from './entities/project.entity';
import { ProjectManager } from '../project-manager/entities/project-manager.entity';
import { Company } from '../company/entities/company.entity';
import { HR } from '../hr/entities/hr.entity';
import { Advisor } from '../advisor/entities/advisor.entity';
import { randomUUID } from 'crypto';
import { Application } from '../applications/entities/application.entity'; // เช็ก Path ให้ตรง
import { ActivityLogsService } from '../activity-log/activity-log.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(ProjectManager) private pmModel: typeof ProjectManager,
    @InjectModel(Advisor) private advisorModel: typeof Advisor,
    private sequelize: Sequelize,
    private activityLogsService: ActivityLogsService,
  ) { }

  async create(userId: string, dto: any, files?: Array<Express.Multer.File>) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const pmData = typeof dto.pmData === 'string' ? JSON.parse(dto.pmData) : dto.pmData;
        const mentors = typeof dto.mentor === 'string' ? JSON.parse(dto.mentor) : dto.mentor;
        const contDetail = dto.contDetail && typeof dto.contDetail === 'string' ? JSON.parse(dto.contDetail) : dto.contDetail;

        // create PM
        const pm = await this.pmModel.create({
          pmID: randomUUID(),
          pmName: pmData.pmName,
          pmPos: pmData.pmPos,
          pmDept: pmData.pmDept,
          pmTel: pmData.pmTel,
          pmEmail: pmData.pmEmail,
          coID: dto.coID,
        }, { transaction: t });

        // create Project
        const project = await this.projectModel.create({
          projID: randomUUID(),
          projName: dto.projName,
          obj: dto.obj,
          quota: Number(dto.quota),
          jd: dto.jd,
          skills: dto.skills,
          workAddr: dto.workAddr,
          contact: dto.contact,
          contDetail: JSON.stringify(contDetail),
          mentor: JSON.stringify(mentors),
          pmID: pm.pmID,
          projStat: 'PENDING',

          coID: dto.coID,
          userID: userId,
          round: dto.round,
        }, { transaction: t });

        // log
        try {
          const logUserId = userId || dto.userID;
          if (logUserId) {
            await this.activityLogsService.createLog(
              logUserId,
              'CREATE_PROJECT',
              `เพิ่มโครงการใหม่: ${project.projName}`
            );
          }
        } catch (logErr) {
          console.error('Save log failed:', logErr);
        }

        return project;
      });
    } catch (error) {
      console.error('Create Project Error:', error);
      throw error;
    }
  }

  async update(id: string, userId: string, dto: any, files?: Array<Express.Multer.File>) { // 🌟 รับ userId เพิ่ม
    try {
      return await this.sequelize.transaction(async (t) => {
        const pmData = typeof dto.pmData === 'string' ? JSON.parse(dto.pmData) : dto.pmData;
        const mentors = typeof dto.mentor === 'string' ? JSON.parse(dto.mentor) : dto.mentor;
        const contDetail = dto.contDetail && typeof dto.contDetail === 'string' ? JSON.parse(dto.contDetail) : dto.contDetail;

        // update PM
        if (pmData && pmData.pmID) {
          await this.pmModel.update({
            pmName: pmData.pmName,
            pmPos: pmData.pmPos,
            pmDept: pmData.pmDept,
            pmTel: pmData.pmTel,
            pmEmail: pmData.pmEmail,
          }, {
            where: { pmID: pmData.pmID },
            transaction: t
          });
        }

        // find project
        const project = await this.projectModel.findByPk(id);
        if (!project) throw new NotFoundException('ไม่พบโครงการที่ต้องการแก้ไข');

        // update project
        await project.update({
          projName: dto.projName,
          obj: dto.obj,
          quota: Number(dto.quota),
          jd: dto.jd,
          skills: dto.skills,
          workAddr: dto.workAddr,
          contact: dto.contact,
          contDetail: JSON.stringify(contDetail),
          mentor: JSON.stringify(mentors),
          projStat: 'PENDING',
          advID: null,
        }, { transaction: t });

        // log
        try {
          const logUserId = userId || dto.userID;
          if (logUserId) {
            await this.activityLogsService.createLog(
              logUserId,
              'UPDATE_PROJECT',
              `แก้ไขข้อมูลโครงการ: ${project.projName}`
            );
          }
        } catch (logErr) {
          console.error('Save log failed:', logErr);
        }

        return { message: 'อัปเดตโครงการและข้อมูลผู้จัดการเรียบร้อยแล้ว', project };
      });
    } catch (error) {
      console.error('Update Project Error:', error);
      throw error;
    }
  }

  async findAll() {
    return await this.projectModel.findAll({
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }

  async findHRProjects(userId: string) {
    return await this.projectModel.findAll({
      where: { userID: userId },
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }

  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
    if (!project) {
      throw new NotFoundException(`ไม่พบโปรเจกต์รหัส ${id}`);
    }
    return project;
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await project.destroy();
    return { message: `ลบโปรเจกต์รหัส ${id} เรียบร้อยแล้ว` };
  }

  async findAvailable() {
    return await this.projectModel.findAll({
      where: {
        projStat: 'PENDING',
        advID: null
      },
      include: [Company, ProjectManager],
    });
  }


  async findMyProjects(advisorId?: string) {
    const whereCondition = advisorId ? { advID: advisorId } : { projStat: 'APPROVED' };

    return await this.projectModel.findAll({
      where: whereCondition,
      include: [
        Company,
        {
          model: Application,
        }
      ],
    });
  }

  async approveProject(id: string, userIdFromToken: string) {

    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโปรเจกต์รหัส ${id}`);

    const advisor = await this.advisorModel.findOne({
      where: { userID: userIdFromToken }
    });

    if (!advisor) {
      throw new BadRequestException('ไม่พบข้อมูลโปรไฟล์อาจารย์ที่ผูกกับรหัสผู้ใช้นี้');
    }

    await project.update({
      projStat: 'APPROVED',
      advID: advisor.userID
    });

    await this.activityLogsService.createLog(
      userIdFromToken,
      'APPROVE_PROJECT',
      `อาจารย์อนุมัติโครงการ: ${project.projName || 'ไม่ระบุชื่อ'}`
    );

    const updatedProject = await this.findOne(id);
    return { message: 'อนุมัติเรียบร้อยแล้ว', data: updatedProject };
  }
  async rejectProject(id: string, userIdFromToken: string) {
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

    await project.update({
      projStat: 'DENIED'
    });

    await this.activityLogsService.createLog(
      userIdFromToken,
      'REJECT_PROJECT',
      `อาจารย์ปฏิเสธโครงการ: ${project.projName || 'ไม่ระบุชื่อ'}`
    );

    return { message: 'ปฏิเสธเรียบร้อยแล้ว', project };
  }

  async findByCompanyId(coId: string) {
    return await this.projectModel.findAll({
      where: { coID: coId },
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }

  async getPendingDeleteRequests() {

    const data = await this.projectModel.findAll({
      where: { isPendingDelete: true },
      include: [{ model: Company }],
    });
    return data;
  }

  async approveDeleteRequest(id: string, adminId: string) {
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

    const projectName = project.projName || 'ไม่ระบุชื่อ';

    await project.destroy();

    await this.activityLogsService.createLog(
      adminId,
      'APPROVE_DELETE_PROJECT',
      `Admin อนุมัติการลบโครงการ`
    );

    return { message: `อนุมัติการลบโครงการ ${projectName} เรียบร้อยแล้ว` };
  }

  async rejectDeleteRequest(id: string, adminId: string) { 
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

    await project.update({
      projStat: 'APPROVED',
      isPendingDelete: false, 
      deleteReason: null  
    });

    await this.activityLogsService.createLog(
      adminId,
      'REJECT_DELETE_PROJECT',
      `Admin ปฏิเสธคำขอลบโครงการ `
    );

    return { message: `ปฏิเสธคำขอลบโครงการรหัส ${id} เรียบร้อยแล้ว`, project };
  }


  async requestDeleteProject(id: string, userId: string, reason?: string) {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);
    }
    await project.update({
      isPendingDelete: true,
      deleteReason: reason || 'ต้องการลบโครงการ'
    });

    await this.activityLogsService.createLog(
      userId,
      'REQUEST_DELETE_PROJECT',
      `HR ยื่นขอลบโครงการ`
    );
    return {
      message: 'ส่งคำขอลบเรียบร้อยแล้ว',
      project
    };
  }
}