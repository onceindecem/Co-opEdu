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
import model from 'sequelize/lib/model';
import { ActivityLogsService } from '../activity-log/activity-log.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(ProjectManager) private pmModel: typeof ProjectManager,
    @InjectModel(Advisor) private advisorModel: typeof Advisor, // 🌟 1. เพิ่มบรรทัดนี้ เพื่อให้เรียกใช้ตาราง Advisor ได้
    private sequelize: Sequelize,
    private activityLogsService: ActivityLogsService,
  ) {}

  // --- 1. สร้างโครงการใหม่ ---
async create(dto: any, files?: Array<Express.Multer.File>) {
  try {
    return await this.sequelize.transaction(async (t) => {
      // ... โค้ดส่วน Parse JSON ของคุณเหมือนเดิม ...
      const pmData = typeof dto.pmData === 'string' ? JSON.parse(dto.pmData) : dto.pmData;
      const mentors = typeof dto.mentor === 'string' ? JSON.parse(dto.mentor) : dto.mentor;
      const contDetail = dto.contDetail && typeof dto.contDetail === 'string' ? JSON.parse(dto.contDetail) : dto.contDetail;

      // 1. สร้าง Project Manager
      const pm = await this.pmModel.create({
        pmID: randomUUID(),
        pmName: pmData.pmName,
        pmPos: pmData.pmPos,
        pmDept: pmData.pmDept,
        pmTel: pmData.pmTel,
        pmEmail: pmData.pmEmail,
        coID: dto.coID, // 👈 ต้องมั่นใจว่า dto มี coID ส่งมา
      }, { transaction: t });

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
        
        // ✨ เพิ่ม 3 ฟิลด์ที่ขาดไปตรงนี้ครับ ✨
       coID: dto.coID,     // 👈 เพิ่ม: รับจากหน้าบ้าน หรือ Token
  userID: dto.userID, // 👈 เพิ่ม: ID ของคนสร้าง (HR)
  round: dto.round,   // 👈 เพิ่ม: รอบปีการศึกษา
        
      }, { transaction: t });

      return project;
    });
    } catch (error) {
      console.error('🔥 Create Project Error:', error);
      throw error;
    }
  }

  // --- 2. อัปเดตโครงการ (โหมด Edit) ---
  async update(id: string, dto: any, files?: Array<Express.Multer.File>) {
    try {
      return await this.sequelize.transaction(async (t) => {
        // แปลงข้อมูลจาก String เป็น Object
        const pmData = typeof dto.pmData === 'string' ? JSON.parse(dto.pmData) : dto.pmData;
        const mentors = typeof dto.mentor === 'string' ? JSON.parse(dto.mentor) : dto.mentor;
        const contDetail = dto.contDetail && typeof dto.contDetail === 'string' ? JSON.parse(dto.contDetail) : dto.contDetail;

        // 1. อัปเดต Project Manager (ใช้ pmID จาก pmData ที่หน้าบ้านส่งมา)
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

        // 2. ค้นหาโครงการเดิม
        const project = await this.projectModel.findByPk(id);
        if (!project) throw new NotFoundException('ไม่พบโครงการที่ต้องการแก้ไข');

        // 3. จัดการไฟล์ใหม่ (ถ้ามีการอัปโหลดเพิ่ม)
        let updatedFiles: string[] = [];
        if (files && files.length > 0) {
          updatedFiles = files.map(f => f.filename);
        }

        // 4. อัปเดตข้อมูลโครงการ
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
          projStat: 'PENDING', // แก้ไขแล้วให้กลับไปรอตรวจใหม่
          advID: null,
        }, { transaction: t });

        return { message: 'อัปเดตโครงการและข้อมูลผู้จัดการเรียบร้อยแล้ว', project };
      });
    } catch (error) {
      console.error('🔥 Update Project Error:', error);
      throw error;
    }
  }

  // --- 3. ฟังก์ชันอื่นๆ (เหมือนเดิม) ---
 async findAll() {
    return await this.projectModel.findAll({
      // 🌟 เพิ่ม Application เข้าไปใน list การ Join
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }

  async findHRProjects(userId: string) {
    return await this.projectModel.findAll({
      where: { userID: userId },
      // 🌟 เพิ่ม Application เข้าไป
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }

  // ... ฟังก์ชัน findOne ...
  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      // 🌟 เพิ่ม Application เข้าไป
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
  // ==========================================
  // 🌟 4. ดึงโครงการที่รอการอนุมัติ (Status: PENDING และยังไม่มีอาจารย์)
  // ==========================================
  async findAvailable() {
    return await this.projectModel.findAll({
      where: {
        projStat: 'PENDING', // กรองเฉพาะที่รออนุมัติ
        advID: null          // และยังไม่มีอาจารย์รับไปดูแล
      },
      include: [Company, ProjectManager], // Join ข้อมูลที่จำเป็นต้องโชว์ในตารางหน้าบ้าน
    });
  }

  // ==========================================
  // 🌟 5. ดึงโครงการที่อาจารย์ท่านนี้ดูแลอยู่ (Status: APPROVED)
  // ==========================================
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
    console.log("🛠️ ตรวจสอบค่าที่ส่งมา -> ProjectID:", id, "UserID (จาก Token):", userIdFromToken);

    // 1. ค้นหา Project
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโปรเจกต์รหัส ${id}`);
    
    // 2. ค้นหาอาจารย์จาก userId ที่รับมา
    const advisor = await this.advisorModel.findOne({ 
      where: { userID: userIdFromToken } 
    });

    if (!advisor) {
      throw new BadRequestException('ไม่พบข้อมูลโปรไฟล์อาจารย์ที่ผูกกับรหัสผู้ใช้นี้ (มีแต่บัญชี User แต่ยังไม่ได้สร้างประวัติอาจารย์)');
    }

    console.log("✅ ค้นหาอาจารย์เจอแล้ว! advID คือ:", advisor.userID);

    // 3. อัปเดตข้อมูล โดยใช้ advID ที่ถูกต้อง
    await project.update({ 
      projStat: 'APPROVED', 
      advID: advisor.userID // 👈 ใช้ advID ที่หาเจอไปบันทึก
    });
    
    // ดึงข้อมูลใหม่พร้อม Join ตาราง Advisor กลับไปโชว์
    const updatedProject = await this.findOne(id); 

    return { message: 'อนุมัติเรียบร้อยแล้ว', data: updatedProject };
}
 async rejectProject(id: string) {
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

    await project.update({
      projStat: 'DENIED' // 👈 ลองใช้คำนี้แทน
    });

    return { message: 'ปฏิเสธเรียบร้อยแล้ว', project };
  }

  async findByCompanyId(coId: string) {
    return await this.projectModel.findAll({
      where: { coID: coId }, // ค้นหาเฉพาะโปรเจกต์ที่มี coID ตรงกับที่ส่งมา
      include: [Company, HR, ProjectManager, Advisor, Application],
    });
  }
  // ==========================================
  // 🌟 ส่วนจัดการคำขอลบโครงการ (Admin อนุมัติ/ปฏิเสธ)
  // ==========================================

  // 1. ดึงข้อมูลโครงการที่รอการอนุมัติลบ (สำหรับหน้าตาราง Admin)
async getPendingDeleteRequests() {
    console.log(`🔵 [Admin] กำลังดึงข้อมูลโปรเจกต์ที่รออนุมัติลบ...`);

    const data = await this.projectModel.findAll({
      where: { isPendingDelete: true },
      include: [ { model: Company } ], // 👈 บางทีอาจจะพังตรงการ Join ตาราง ลองแก้เป็นแบบนี้ดูครับ
    });

    console.log(`✅ [Admin] ดึงข้อมูลได้ทั้งหมด: ${data.length} รายการ`); // 👈 ดักดูว่าดึงมาได้กี่ตัว (ถ้าเป็น 0 แปลว่าใน Database ไม่มี)
    return data;
  }

 // 1. ตรวจสอบว่ารับ adminId เข้ามา (ไม่มีเครื่องหมาย ?)
async approveDeleteRequest(id: string, adminId: string) { 
  const project = await this.projectModel.findByPk(id);
  if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

  // เก็บชื่อโครงการไว้ก่อนสั่งลบ (เอาไว้ใส่ใน Log)
  const projectName = project.projName || 'ไม่ระบุชื่อ';

  // 🔥 คำสั่งลบจริงใน Database
  await project.destroy(); 

  // 🌟 บันทึก Log ด้วย ID คนกดจริง และใส่ชื่อโครงการที่โดนลบ
  await this.activityLogsService.createLog(
    adminId,
    'APPROVE_DELETE_PROJECT',
    `Admin อนุมัติการลบโครงการ`
  );

  return { message: `อนุมัติการลบโครงการ ${projectName} เรียบร้อยแล้ว` };
}

  // 3. ปฏิเสธคำขอลบโครงการ (Admin กดปฏิเสธ)
async rejectDeleteRequest(id: string, adminId: string) { // 👈 เพิ่ม adminId
  const project = await this.projectModel.findByPk(id);
  if (!project) throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);

  // เปลี่ยนสถานะกลับไปเป็นปกติ
  await project.update({
    projStat: 'APPROVED', 
    isPendingDelete: false, // 🌟 เคลียร์ flag ออกเพื่อให้ปุ่มลบกลับมาขึ้นใหม่ได้
    deleteReason: null      // 🌟 ลบเหตุผลทิ้ง
  });

  // 🌟 บันทึก Log
  await this.activityLogsService.createLog(
    adminId,
    'REJECT_DELETE_PROJECT',
    `Admin ปฏิเสธคำขอลบโครงการ `
  );

  return { message: `ปฏิเสธคำขอลบโครงการรหัส ${id} เรียบร้อยแล้ว`, project };
}
  

async requestDeleteProject(id: string, userId: string, reason?: string) { 
  console.log(`🟡 [HR] กำลังยื่นขอลบโปรเจกต์ ID: ${id} โดย User ID: ${userId}`);

  // 1. ค้นหา Project
  const project = await this.projectModel.findByPk(id);
  if (!project) {
    throw new NotFoundException(`ไม่พบโครงการรหัส ${id}`);
  }

  // TODO: แนะนำให้ใช้ Transaction ครอบการทำงานส่วนนี้ (Sequelize Transaction)
  // 2. อัปเดตสถานะโครงการ
  await project.update({
    isPendingDelete: true,
    deleteReason: reason || 'ต้องการลบโครงการ'
  });

  // 3. บันทึก Activity Log (นำ if เช็ก service ออก เพื่อให้ชัวร์ว่าระบบบังคับบันทึก Log เสมอ)
  await this.activityLogsService.createLog(
  userId, 
  'REQUEST_DELETE_PROJECT', 
  `HR ยื่นขอลบโครงการ`
);

  console.log(`✅ [HR] อัปเดต isPendingDelete เป็น true สำเร็จ!`);
  
  return { 
    message: 'ส่งคำขอลบเรียบร้อยแล้ว', 
    project 
  };
}
}