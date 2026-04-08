import { Controller, Get, Post, Body } from '@nestjs/common';
import { ActivityLogsService } from './activity-log.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  async getAllLogs() {
    return await this.activityLogsService.findAllLogs();
  }
  @Post('test')
  async testCreateLog(@Body() body: { userID: string, action: string, details: string }) {
    return await this.activityLogsService.createLog(body.userID, body.action, body.details);
  }
}