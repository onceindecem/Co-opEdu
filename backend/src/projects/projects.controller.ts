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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Req() req: any,
    @Body() createDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const userId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.create(userId, createDto, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('pending-delete')
  async getPendingDeleteRequests() {
    return await this.projectsService.getPendingDeleteRequests();
  }

  @Patch(':id/approve-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async approveDelete(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user?.sub || req.user?.id || req.user?.userID;

    if (!adminId) {
      throw new UnauthorizedException('ไม่พบข้อมูลผู้ใช้งาน');
    }

    return await this.projectsService.approveDeleteRequest(id, adminId);
  }

  @Patch(':id/reject-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async rejectDelete(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user?.sub || req.user?.id || req.user?.userID;
    if (!adminId) {
      throw new UnauthorizedException('ไม่พบ ID ของผู้ใช้งาน กรุณาล็อกอินใหม่');
    }
    return await this.projectsService.rejectDeleteRequest(id, adminId);
  }

  @Patch(':id/request-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  async requestDelete(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any
  ) {
    const userId = req.user?.sub || req.user?.id || req.user?.userID;

    if (!userId) {
      throw new UnauthorizedException('ไม่พบ ID ของผู้ใช้งาน กรุณาล็อกอินใหม่');
    }

    return await this.projectsService.requestDeleteProject(id, userId, reason);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('hr-projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  findHRProjects(@Req() req) {
    return this.projectsService.findHRProjects(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:coId')
  async getProjectsByCompany(@Param('coId') coId: string) {
    return this.projectsService.findByCompanyId(coId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADVISOR")
  @Get('available')
  findAvailable() {
    return this.projectsService.findAvailable();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADVISOR')
  @Get('my-projects')
  findMyProjects() {
    return this.projectsService.findMyProjects();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard) 
  @Roles('ADVISOR')
  approveProject(
    @Param('id') id: string,
    @Req() req: any 
  ) {
    const advisorId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.approveProject(id, advisorId);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard) 
  @Roles('ADVISOR')
  async rejectProject(@Param('id') id: string, @Req() req: any) {
    const advisorId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.rejectProject(id, advisorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string,
    @Req() req: any, // 
    @Body() updateDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const userId = req.user?.sub || req.user?.id || req.user?.userID;
    return this.projectsService.update(id, userId, updateDto, files); 
  }

}