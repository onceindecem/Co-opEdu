import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // ==========================================
  // 🌟 เพิ่ม Route ใหม่ตรงนี้! (ต้องอยู่บน :id เสมอ)
  // ==========================================

  @Get('available')
  findAvailable() {
    // อย่าลืมไปเขียนฟังก์ชัน findAvailable() ใน projects.service.ts ด้วยนะครับ
    return this.projectsService.findAvailable(); 
  }

  @Get('my-projects')
  findMyProjects() {
    // สำหรับหน้า "โครงการในความดูแล" (ดึงเฉพาะของอาจารย์ที่ล็อกอิน)
    // อย่าลืมสร้าง findMyProjects() ใน Service ด้วย
    return this.projectsService.findMyProjects(); 
  }

  @Patch(':id/approve')
  approveProject(@Param('id') id: string) {
    // สำหรับปุ่ม "อนุมัติและรับดูแล"
    // อย่าลืมสร้าง approveProject(id) ใน Service ด้วย
    return this.projectsService.approveProject(id);
  }

  // ==========================================
  // 🌟 เส้นทางที่เป็น Dynamic Parameter (:id) ต้องอยู่ล่างสุด
  // ==========================================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}