import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';

@Injectable()
export class ProjectManagerService {
  constructor(
    @InjectModel(ProjectManager)
    private projectManagerModel: typeof ProjectManager,
  ) {}

  async create(createProjectManagerDto: CreateProjectManagerDto) {
    return await this.projectManagerModel.create({ ...createProjectManagerDto } as any);
  }

  async findAll() {
    return await this.projectManagerModel.findAll();
  }

  async findOne(id: string) {
    const pm = await this.projectManagerModel.findByPk(id);
    if (!pm) {
      throw new NotFoundException(`ไม่พบ Project Manager รหัส ${id}`);
    }
    return pm;
  }

  async update(id: string, updateProjectManagerDto: UpdateProjectManagerDto) {
    // ⚠️ เปลี่ยน pmID ให้ตรงกับชื่อ Primary Key ในตาราง PM ของคุณ
    const [numberOfAffectedRows] = await this.projectManagerModel.update(
      { ...updateProjectManagerDto },
      { where: { pmID: id } }
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`ไม่สามารถอัปเดตได้: ไม่พบ Project Manager รหัส ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const pm = await this.findOne(id);
    await pm.destroy();
    return { message: `ลบ Project Manager รหัส ${id} เรียบร้อยแล้ว` };
  }
}