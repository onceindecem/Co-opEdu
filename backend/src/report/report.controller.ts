import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADVISOR')
  @Get('advisor/all')
  findAllForAdvisor() {
    return this.reportsService.findAllForAdvisor();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Post()
  create(@Body() createReportDto: CreateReportDto, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.reportsService.create(createReportDto, userId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.reportsService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT', 'ADVISOR')
  @Get('application/:appId')
  findAllByAppId(@Param('appId') appId: string) {
    return this.reportsService.findAllByAppId(appId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Patch(':repID')
  update(
    @Param('repID') repID: string,
    @Body() updateReportDto: Partial<CreateReportDto>,
    @Request() req: any
  ) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.reportsService.update(repID, updateReportDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Delete(':repID')
  remove(@Param('repID') repID: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.reportsService.remove(repID, userId);
  }
}