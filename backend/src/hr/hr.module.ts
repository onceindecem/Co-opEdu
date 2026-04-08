import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { HR } from './entities/hr.entity';
import { Company } from 'src/company/entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogsModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [SequelizeModule.forFeature([HR, Company]), AuthModule, ActivityLogsModule],
  controllers: [HrController],
  providers: [HrService],
  
})
export class HrModule {}
