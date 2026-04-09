import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseInterceptors, UploadedFiles,
  UseGuards,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  // 1. สร้างโครงการ (ปรับให้รับ FormData/Files ได้เหมือนกัน)
 @Post()
  @UseGuards(JwtAuthGuard) // 🌟 1. ป้องกันไม่ให้คนนอกสร้างโครงการ
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Req() req: any, // 🌟 2. ดึง Token เพื่อเอา userID
    @Body() createDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const userId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.create(userId, createDto, files); // 🌟 3. ส่ง userId ไปให้ Service
  }


  // 🌟 1. API ดึงข้อมูลโครงการที่รอการลบทั้งหมด
  @Get('pending-delete')
  async getPendingDeleteRequests() {
    return await this.projectsService.getPendingDeleteRequests();
  }

  @Patch(':id/approve-delete')
  @UseGuards(JwtAuthGuard)
  async approveDelete(@Param('id') id: string, @Req() req: any) {
    // ดึง ID จาก Token (เช็กชื่อฟิลด์ให้ตรงกับที่ console.log ออกมา)
    const adminId = req.user?.sub || req.user?.id || req.user?.userID;

    if (!adminId) {
      throw new UnauthorizedException('ไม่พบข้อมูลผู้ใช้งาน');
    }

    return await this.projectsService.approveDeleteRequest(id, adminId);
  }

  // 🌟 3. API ปฏิเสธการลบ
  @Patch(':id/reject-delete')
  @UseGuards(JwtAuthGuard)
  async rejectDelete(@Param('id') id: string, @Req() req: any) {
    // 🌟 1. ปริ้นดูเลยว่า Token ส่งอะไรมาให้เราบ้าง!
    console.log('🕵️‍♂️ ข้อมูล User ที่กดปฏิเสธ:', req.user);

    // 🌟 2. ลองดึงจากหลายๆ ชื่อที่คนนิยมตั้ง (เดี๋ยวเราค่อยมาลบอันที่ผิดออกทีหลัง)
    const adminId = req.user?.sub || req.user?.id || req.user?.userID;

    // 🌟 3. ถ้าหา ID ไม่เจอจริงๆ ให้เด้ง Error ไปเลย ไม่ยอมให้บันทึกมั่วๆ
    if (!adminId) {
      throw new UnauthorizedException('ไม่พบ ID ของผู้ใช้งาน กรุณาล็อกอินใหม่');
    }

    return await this.projectsService.rejectDeleteRequest(id, adminId);
  }

  // 🌟 4. API สำหรับ HR กดยื่นคำขอลบ
  @Patch(':id/request-delete')
  @UseGuards(JwtAuthGuard)
  async requestDelete(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any
  ) {
    // 🌟 1. ปริ้นดูเลยว่า Token ของ HR ส่งอะไรมา
    console.log('🕵️‍♂️ ข้อมูล User (HR) ที่กดขอลบ:', req.user);

    // 🌟 2. ดึงจากค่าที่มีโอกาสเป็นไปได้ (ลบไอดี 0000 ทิ้งไปเลย!)
    const userId = req.user?.sub || req.user?.id || req.user?.userID;

    // 🌟 3. ถ้าไม่มี ID จริงๆ เด้ง Error ไปเลย
    if (!userId) {
      throw new UnauthorizedException('ไม่พบ ID ของผู้ใช้งาน กรุณาล็อกอินใหม่');
    }

    // 🌟 4. ส่ง ID ตัวจริงเสียงจริงไปให้ Service
    return await this.projectsService.requestDeleteProject(id, userId, reason);
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

  @Get('company/:coId')
  async getProjectsByCompany(@Param('coId') coId: string) {
    return this.projectsService.findByCompanyId(coId);
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
  @UseGuards(JwtAuthGuard) // 🌟 บังคับล็อกอิน
  approveProject(
    @Param('id') id: string,
    @Req() req: any // 🌟 ดึงข้อมูลจาก Token
  ) {
    const advisorId = req.user?.sub || req.user?.id || req.user?.userID;
    console.log('✅ ก๊อกๆ! อาจารย์กดอนุมัติโปรเจกต์:', id, 'โดย ID:', advisorId);
    
    return this.projectsService.approveProject(id, advisorId);
  }
 @Patch(':id/reject')
  @UseGuards(JwtAuthGuard) // 🌟 บังคับล็อกอิน
  async rejectProject(@Param('id') id: string, @Req() req: any) {
    const advisorId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.rejectProject(id, advisorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // 2. แก้ไขโครงการ (เหลือแค่อันนี้อันเดียวพอ)
 @Patch(':id')
  @UseGuards(JwtAuthGuard) // 🌟 1. ป้องกัน
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string,
    @Req() req: any, // 🌟 2. ดึง Token
    @Body() updateDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const userId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.update(id, userId, updateDto, files); // 🌟 3. ส่ง userId ไปให้ Service
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

}