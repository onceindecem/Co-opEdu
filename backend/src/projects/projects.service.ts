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
}