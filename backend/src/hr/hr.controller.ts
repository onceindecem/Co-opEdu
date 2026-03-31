import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHRProfileDto } from './dto/update-hr-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('HR')
  @Patch('profile')
  async updateProfile(
    @Req() req, 
    @Body() updateProfileDto: UpdateHRProfileDto
  ) {
    const userId = req.user.sub; 
    return this.hrService.updateHrProfile(userId, updateProfileDto);
  }
}
