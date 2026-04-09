import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from '../users/entities/user.entity'; 

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog)
    private activityLogModel: typeof ActivityLog,
  ) {}

  async findAllLogs() {
    return await this.activityLogModel.findAll({
      include: [{ model: User, attributes: ['email'] }], 
      order: [['timestamp', 'DESC']],
    });
  }
  async createLog(userID: string, action: string, details: string) {
    return await this.activityLogModel.create({
      userID,
      action,
      details,
    });
  }
}