import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from '../users/entities/user.entity'; // ปรับ path ให้ตรงกับโปรเจกต์คุณ

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog)
    private activityLogModel: typeof ActivityLog,
  ) {}

  async findAllLogs() {
    return await this.activityLogModel.findAll({
      include: [{ model: User, attributes: ['email'] }], // ดึง email ของ User มาด้วย
      order: [['timestamp', 'DESC']], // เรียงจากล่าสุดไปเก่าสุด
    });
  }
  async createLog(userID: string, action: string, details: string) {
    return await this.activityLogModel.create({
      userID,
      action,
      details,
      // ไม่ต้องใส่ timestamp เพราะ Database จะใส่เวลาปัจจุบันให้อัตโนมัติ
    });
  }
}