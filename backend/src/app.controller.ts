import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SupabaseAuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller()
export class AppController {

  constructor(private readonly prisma: PrismaService) {}

  @Get('profile')
  @UseGuards(SupabaseAuthGuard) 
  getProfile(@Request() req) {
    return {
      message: 'นี่คือข้อมูลส่วนตัวของคุณ',
      email: req.user.email,
      role: req.user.role
    };
  }

  @Get('admin-only')
  @UseGuards(SupabaseAuthGuard, RolesGuard) 
  @Roles('admin') 
  getAdminData() {
    return {
      message: 'ยินดีต้อนรับ Admin!',
      secretData: 'นี่คือข้อมูลลับสุดยอดที่ Admin เท่านั้นที่เห็นได้ 😎'
    };
  }

  @Get('staff-tools')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  getStaffData() {
    return {
      message: 'ยินดีต้อนรับทีมงาน (Staff/Admin)',
      data: 'เครื่องมือจัดการระบบสำหรับเจ้าหน้าที่'
    };
  }

  @Get('users')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    
    const usersList = await this.prisma.public_users.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      }
    });

    return {
      message: 'ดึงรายชื่อผู้ใช้สำเร็จ!',
      total: usersList.length,
      data: usersList,
    };
  }
}