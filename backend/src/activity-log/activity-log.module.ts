import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityLogsController } from './activity-log.controller';
import { ActivityLogsService } from './activity-log.service';
import { ActivityLog } from './entities/activity-log.entity'; 

@Module({
  imports: [SequelizeModule.forFeature([ActivityLog])], 
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService], 
})
export class ActivityLogsModule {}