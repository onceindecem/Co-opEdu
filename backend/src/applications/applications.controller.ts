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
import { JwtAuthGuard } from 'src/auth/jwt.guard'; 
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get('my-applications')
  @Roles('STUDENT')
  async findMyApplications(@Request() req) {
    const userId = req.user.sub; 
    return this.applicationsService.findMyApplications(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('project/:projectId')
  @Roles('ADVISOR')
  async getApplicationsByProject(@Param('projectId') projectId: string) {
    return this.applicationsService.findByProjectId(projectId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('STUDENT') 
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    const currentUserId = req.user?.sub || req.user?.userID; 
    const applicationData = {
      ...createApplicationDto,
      userID: currentUserId,
    };
    return this.applicationsService.create(applicationData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const currentUserId = req.user?.sub || req.user?.userID; 
    return this.applicationsService.remove(id, currentUserId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADVISOR')
  @Patch(':id/status')
  async updateAppStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    const advisorId = req.user?.sub || req.user?.userID; 
    return await this.applicationsService.updateAppStatus(id, status, advisorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADVISOR')
  @Patch(':id/hired-status')
  async updateHiredStatus(@Param('id') id: string, @Body('hiredStat') hiredStat: string, @Request() req) {
    const advisorId = req.user?.sub || req.user?.userID; 
    return await this.applicationsService.updateHiredStatus(id, hiredStat, advisorId);
  }
}