import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

// ==========================================
// 1. Import โมเดลเพื่อนบ้านเข้ามาให้ครบ
// ==========================================
import { Company } from '../company/entities/company.entity';
import { HR } from '../hr/entities/hr.entity';
import { ProjectManager } from '../project-manager/entities/project-manager.entity';
import { Advisor } from '../advisor/entities/advisor.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectModel.create({ ...createProjectDto } as any);
  }

  // ==========================================
  // 2. ใส่ include เพื่อ Join ตารางตอนดึงข้อมูลทั้งหมด
  // ==========================================
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

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const [numberOfAffectedRows] = await this.projectModel.update(
      { ...updateProjectDto },
      { where: { projID: id } }
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`ไม่สามารถอัปเดตได้: ไม่พบโปรเจกต์รหัส ${id}`);
    }

    return this.findOne(id); // <--- ตรงนี้จะไปเรียก findOne ด้านบน ซึ่งมี include อยู่แล้ว
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

  // ==========================================
  // 🌟 6. อัปเดตสถานะเป็น APPROVED และผูกชื่ออาจารย์ที่ปรึกษา
  // ==========================================
  async approveProject(id: string, advisorId?: string) {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException(`ไม่พบโปรเจกต์รหัส ${id}`);
    }

    // อัปเดตข้อมูลใน Database
    await project.update({
      projStat: 'APPROVED',
      advID: advisorId || null // ใส่ ID ของอาจารย์ที่กดรับ (ถ้ามีระบบ Login แล้ว)
    });

    return { message: 'อนุมัติและรับดูแลโครงการเรียบร้อยแล้ว', project };
  }
}