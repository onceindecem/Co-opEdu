import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './report.service';
import { ReportsController } from './report.controller';
import { Report } from './entities/report.entity'; 
import { AuthModule } from 'src/auth/auth.module';
import { Application } from 'src/applications/entities/application.entity';
import { ActivityLogsModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [SequelizeModule.forFeature([Report, Application]), AuthModule, ActivityLogsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}