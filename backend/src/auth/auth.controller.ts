// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // receive POST Request at URL: /auth/register
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    // call the register method in AuthService to handle the registration logic
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }

  @UseGuards(JwtAuthGuard) // require a valid JWT token to access this route
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'ยินดีต้อนรับสู่พื้นที่หวงห้าม! 🎉',
      user_info: req.user, 
    };
  }
}