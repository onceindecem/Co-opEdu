import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from './auth.guard';

@Controller()
export class AppController {
  
  @Get('users')
  @UseGuards(SupabaseAuthGuard)
  getUsers(@Request() req) {
    // จะเข้าถึงได้ก็ต่อเมื่อมี Token ส่งมา และจะได้เห็น role ด้วย
    return {
      message: 'Hello, ' + req.user.email,
      role: req.user.role
    };
  }
}