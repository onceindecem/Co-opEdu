import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { HR } from './entities/hr.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectModel(HR)
    private hrModel: typeof HR,
  ) {}

  async create(createHrDto: CreateHrDto) {
    return await this.hrModel.create({ ...createHrDto } as any);
  }

  async findAll() {
    return await this.hrModel.findAll();
  }

  async findOne(id: string) {
    const hr = await this.hrModel.findByPk(id);
    if (!hr) {
      throw new NotFoundException(`ไม่พบ HR รหัส ${id}`);
    }
    return hr;
  }

  async update(id: string, updateHrDto: UpdateHrDto) {
    // ⚠️ เปลี่ยน userID ให้ตรงกับชื่อ Primary Key ในตาราง HR ของคุณ
    const [numberOfAffectedRows] = await this.hrModel.update(
      { ...updateHrDto },
      { where: { userID: id } } 
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`ไม่สามารถอัปเดตได้: ไม่พบ HR รหัส ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const hr = await this.findOne(id);
    await hr.destroy();
    return { message: `ลบ HR รหัส ${id} เรียบร้อยแล้ว` };
  }
}
