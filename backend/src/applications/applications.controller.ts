import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete,
  UseGuards, 
  Request, 
  Patch
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard'; // ⚠️ เช็ก Path ให้เป๊ะนะครับ
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // 🌟 1. เพิ่ม Route นี้ และ "ต้อง" อยู่ก่อน @Get(':id')
  @UseGuards(JwtAuthGuard,RolesGuard) // 🌟 ป้องกัน Route นี้ด้วย JWT Guard
  @Get('my-applications')
  @Roles('STUDENT') // 🌟 ถ้าอยากจำกัดให้เฉพาะ STUDENT เท่านั้นที่เข้าถึงได้
  async findMyApplications(@Request() req) {
    const userId = req.user.sub; 
    return this.applicationsService.findMyApplications(userId);
  }

 @UseGuards(JwtAuthGuard, RolesGuard) // อย่าลืมใส่ Guard เพราะต้องใช้ JWT
  @Get('project/:projectId')
  async getApplicationsByProject(@Param('projectId') projectId: string) {
    console.log('ยิงเข้า Route project/:projectId สำเร็จ!'); // ใส่ Log ไว้เช็กที่ Terminal ของ NestJS
    return this.applicationsService.findByProjectId(projectId);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  @Roles('STUDENT') // 🌟 ถ้าอยากจำกัดให้เฉพาะ STUDENT เท่านั้นที่เข้าถึงได้
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    const currentUserId = req.user.sub; 
    const applicationData = {
      ...createApplicationDto,
      userID: currentUserId,
    };
    return this.applicationsService.create(applicationData);
  }

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  // ⚠️ อันนี้ต้องอยู่ล่างสุดของกลุ่ม Get
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }
  @Delete(':id')
remove(@Param('id') id: string) {
  return this.applicationsService.remove(id);
  }

  // อัปเดตสถานะการสมัคร (appStat)
  @Patch(':id/status')
  async updateAppStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.applicationsService.updateAppStatus(id, status);
  }

  // อัปเดตผลการจ้างงาน (hiredStat)
  @Patch(':id/hired-status')
  async updateHiredStatus(@Param('id') id: string, @Body('hiredStat') hiredStat: string) {
    return await this.applicationsService.updateHiredStatus(id, hiredStat);
  }
}