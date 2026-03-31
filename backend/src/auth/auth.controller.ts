// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterHRDto } from './dto/register-hr.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // receive POST Request at URL: /auth/register
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    // call the register method in AuthService to handle the registration logic
    return this.authService.registerUser(registerUserDto);
  }

  @Post('register-hr')
  registerHR(@Body() registerHRDto: RegisterHRDto) {
    return this.authService.registerHR(registerHRDto);
  }

  @Post('login')
  login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }

  // login with Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  // google auth callback URL after user successfully logs in with Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const frontendUrl = `http://localhost:5173/login?token=${result.access_token}&role=${result.role}`;
    return res.redirect(frontendUrl);
  }
}