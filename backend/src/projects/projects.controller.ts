import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFiles, 
  UseGuards,
  Req
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // 1. สร้างโครงการ (ปรับให้รับ FormData/Files ได้เหมือนกัน)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createDto: any, 
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.projectsService.create(createDto, files);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // ==========================================
  // 🌟 เพิ่ม Route ใหม่ตรงนี้! (ต้องอยู่บน :id เสมอ)
  // ==========================================

  @Get('hr-projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  findHRProjects(@Req() req) {
    console.log('🔍 ตรวจสอบข้อมูลใน JWT Token:', req.user); // 🌟 เช็คข้อมูลที่ได้จาก Token ว่ามีอะไรบ้าง
    return this.projectsService.findHRProjects(req.user.sub);
  }

  @Get('available')
  findAvailable() {
    // อย่าลืมไปเขียนฟังก์ชัน findAvailable() ใน projects.service.ts ด้วยนะครับ
    return this.projectsService.findAvailable(); 
  }

  @Get('my-projects')
  findMyProjects() {
    return this.projectsService.findMyProjects(); 
  }

@Patch(':id/approve')
  approveProject(
    @Param('id') id: string, 
    @Body('advisorId') advisorId: string
  ) {
    // 🌟 วางกับดัก! ดูว่าข้อมูลวิ่งมาถึง NestJS ไหม
    console.log('✅ ก๊อกๆ! มีการเรียก API อนุมัติโปรเจกต์:', id);
    console.log('✅ รหัสอาจารย์ที่ส่งมาคือ:', advisorId);

    return this.projectsService.approveProject(id, advisorId);
  }
 @Patch(':id/reject')
  async rejectProject(@Param('id') id: string) {
    return this.projectsService.rejectProject(id); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // 2. แก้ไขโครงการ (เหลือแค่อันนี้อันเดียวพอ)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string, 
    @Body() updateDto: any, 
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.projectsService.update(id, updateDto, files);
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}