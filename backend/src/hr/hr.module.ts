import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { HR } from './entities/hr.entity';
import { Company } from 'src/company/entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([HR, Company]), AuthModule], 
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
