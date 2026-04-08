import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityLogsController } from './activity-log.controller';
import { ActivityLogsService } from './activity-log.service';
import { ActivityLog } from './entities/activity-log.entity'; // นำเข้า Entity ที่เราสร้างไว้

@Module({
  // 🌟 บรรทัดนี้แหละครับคือพระเอกที่จะแก้ Error นี้!
  imports: [SequelizeModule.forFeature([ActivityLog])], 
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService], // เผื่อเอาไปใช้บันทึก Log จาก Module อื่นๆ ในอนาคต
})
export class ActivityLogsModule {}