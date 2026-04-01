import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // 👈 เพิ่ม BadRequestException
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from './entities/project.entity';
import { ProjectManager } from '../project-manager/entities/project-manager.entity';
import { Company } from '../company/entities/company.entity';
import { HR } from '../hr/entities/hr.entity';
import { Advisor } from '../advisor/entities/advisor.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private projectModel: typeof Project,
    @InjectModel(ProjectManager) private pmModel: typeof ProjectManager,
    @InjectModel(Advisor) private advisorModel: typeof Advisor, // 🌟 1. เพิ่มบรรทัดนี้ เพื่อให้เรียกใช้ตาราง Advisor ได้
    private sequelize: Sequelize,
  ) {}

  // --- 1. สร้างโครงการใหม่ ---
  async create(dto: any, files?: Array<Express.Multer.File>) {
    try {
      return await this.sequelize.transaction(async (t) => {
        // แกะข้อมูลที่ส่งมาเป็น String (เพราะ FormData ส่ง Object ตรงๆ ไม่ได้)
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
          coID: dto.coID,
        }, { transaction: t });

        // 2. จัดการชื่อไฟล์ (ถ้ามีการอัปโหลดไฟล์มา)
       let filePaths: string[] = [];
        if (files && files.length > 0) {
          filePaths = files.map(f => f.filename); // เก็บชื่อไฟล์ที่ Multer ตั้งให้
        }

        // 3. สร้าง Project
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
          // fileAttach: JSON.stringify(filePaths) // ถ้าใน Entity มีฟิลด์เก็บชื่อไฟล์
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
      include: [Company, HR, ProjectManager, Advisor],
    });
  }

  // ==========================================
  // 3. ใส่ include เพื่อ Join ตารางตอนดึงข้อมูลรายตัว
  // ==========================================
  async findOne(id: string) {
    const project = await this.projectModel.findByPk(id, {
      include: [Company, HR, ProjectManager, Advisor],
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
    // หมายเหตุ: advisorId ปกติจะได้มาจาก JWT Token ใน Request
    // ถ้ายังไม่ได้ทำระบบ Login ให้ดึงทั้งหมดที่ APPROVED ไปก่อนเพื่อเช็ค UI
    const whereCondition = advisorId ? { advID: advisorId } : { projStat: 'APPROVED' };
    
    return await this.projectModel.findAll({
      where: whereCondition,
      include: [Company],
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
}