import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard'; 
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================================
  // 🟢 โซน PUBLIC / ผู้ใช้งานทั่วไป
  // =========================================

  // ดูข้อมูล Profile ของตัวเอง (ใครล็อกอินเข้ามาก็ดูของตัวเองได้)
  @UseGuards(JwtAuthGuard) 
  @Get('profile')
  async getProfile(@Req() req) {
    console.log('data from token:', req.user);
    const userID = req.user.sub;
    const role = req.user.role;
    return this.usersService.getProfile(userID, role);
  }

  // สมัครสมาชิก / สร้างบัญชี
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // =========================================
  // 🔴 โซน ADMIN เท่านั้น (จัดการคนอื่น)
  // =========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    // ⚠️ เอาเครื่องหมาย + ออกแล้ว เพื่อให้รับ UUID (String) ได้
    return this.usersService.findOne(id); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin')
  createAsAdmin(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const adminId = req.user.sub || req.user.id || req.user.userID;
    return this.usersService.create(createUserDto, adminId);
  }

  // 🌟 ส่ง adminId ไปเก็บ Log ตอน Update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const adminId = req.user.sub || req.user.id || req.user.userID;
    return this.usersService.update(id, updateUserDto, adminId); 
  }

  // 🌟 ส่ง adminId ไปเก็บ Log ตอน Delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.sub || req.user.id || req.user.userID;
    return this.usersService.remove(id, adminId); 
  }
}