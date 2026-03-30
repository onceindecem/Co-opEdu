import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';
import { Advisor } from './entities/advisor.entity';

@Injectable()
export class AdvisorService {
  constructor(
    @InjectModel(Advisor)
    private advisorModel: typeof Advisor,
  ) {}

  async create(createAdvisorDto: CreateAdvisorDto) {
    return await this.advisorModel.create({ ...createAdvisorDto } as any);
  }

  async findAll() {
    return await this.advisorModel.findAll();
  }

  async findOne(id: string) {
    const advisor = await this.advisorModel.findByPk(id);
    if (!advisor) {
      throw new NotFoundException(`ไม่พบ Advisor รหัส ${id}`);
    }
    return advisor;
  }

 async update(id: string, updateAdvisorDto: UpdateAdvisorDto) {
    const [numberOfAffectedRows] = await this.advisorModel.update(
      { ...updateAdvisorDto },
      { where: { userID: id } } 
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`ไม่สามารถอัปเดตได้: ไม่พบ Advisor รหัส ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const advisor = await this.findOne(id);
    await advisor.destroy();
    return { message: `ลบ Advisor รหัส ${id} เรียบร้อยแล้ว` };
  }
}