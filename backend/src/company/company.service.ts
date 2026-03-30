import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return await this.companyModel.create({ ...createCompanyDto } as any);
  }

  async findAll() {
    return await this.companyModel.findAll();
  }

  async findOne(id: string) {
    const company = await this.companyModel.findByPk(id);
    if (!company) {
      throw new NotFoundException(`ไม่พบบริษัทรหัส ${id}`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const [numberOfAffectedRows] = await this.companyModel.update(
      { ...updateCompanyDto },
      { where: { coID: id } }
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`ไม่สามารถอัปเดตได้: ไม่พบบริษัทรหัส ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    await company.destroy();
    return { message: `ลบบริษัทรหัส ${id} เรียบร้อยแล้ว` };
  }
}