import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';

@Module({
  imports: [SequelizeModule.forFeature([Company])], 
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
