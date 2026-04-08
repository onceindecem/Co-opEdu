import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt.guard'; // 🛡️ Import Guard ของคุณมา

@UseGuards(JwtAuthGuard) // 🔒 บังคับว่าต้องมี JWT Token ถึงจะเข้าใช้งาน API ในนี้ได้ทั้งหมด
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 🌟 ใช้ @UseGuards(JwtAuthGuard) เพื่อบังคับว่าต้องมี Token เท่านั้น
  @UseGuards(JwtAuthGuard) 
  @Get('advisor/all')
  findAllForAdvisor() {
    // 💡 ถ้ามี Guard เช็คสิทธิ์ (RolesGuard) ว่าเป็น 'ADVISOR' ค่อยเพิ่มได้ในอนาคตครับ
    return this.reportsService.findAllForAdvisor();
  }

  @Post()
  create(@Body() createReportDto: CreateReportDto, @Request() req: any) {
    // 💡 คุณสามารถดึง userID จาก Token มาตรวจสอบได้ที่ req.user.id
    console.log('User ID from Token:', req.user.id);
    return this.reportsService.create(createReportDto);
  }

@Get()
findAll(@Request() req: any) {
  // 1. ลองดักจับดูว่าใน req.user มีหน้าตาแบบไหน
  console.log('🕵️‍♂️ ข้อมูล User จาก Token:', req.user); 

  // 2. ปรับให้ดักทุกทาง! (ส่วนใหญ่ NestJS จะเก็บ ID ไว้ใน req.user.sub หรือ req.user.id)
  const userId = req.user?.id || req.user?.sub || req.user?.userId;

  // 3. ถ้ายังหาไม่เจออีก ให้มันโวยวายออกมาใน Terminal ของ NestJS
  if (!userId) {
    console.log('❌ หา userId ไม่เจอ! เช็ค JWT Strategy ด่วน!');
  }

  return this.reportsService.findAllByUserId(userId);
}

  @Get('application/:appId')
  findAllByAppId(@Param('appId') appId: string) {
    return this.reportsService.findAllByAppId(appId);
  }

  // PATCH /reports/:repID - แก้ไขข้อมูล
  @Patch(':repID')
  update(@Param('repID') repID: string, @Body() updateReportDto: Partial<CreateReportDto>) {
    return this.reportsService.update(repID, updateReportDto);
  }

  // DELETE /reports/:repID - ลบข้อมูล
  @Delete(':repID')
  remove(@Param('repID') repID: string) {
    return this.reportsService.remove(repID);
  }
}