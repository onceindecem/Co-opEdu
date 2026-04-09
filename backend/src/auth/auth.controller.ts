// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterHRDto } from './dto/register-hr.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';
import type { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';

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

  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Body() loginData: any,
    @Res({ passthrough: true }) res: Response) {
      // call service to check user and create token
    const result = await this.authService.login(loginData);

    // put token in cookie
    res.cookie('accessToken', result.access_token, {
      httpOnly: true, // XSS protect
      secure: process.env.NODE_ENV === 'production', // https only
      sameSite: 'lax', // CSRF protect
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return {
      message: 'Login successful',
      role: result.role,
      user: result.user
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
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
    res.cookie('accessToken', result.access_token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 24 * 60 * 60 * 1000, 
    });

    const frontendUrl = process.env.FRONTEND_URL+`/login?role=${result.role}`;
    return res.redirect(frontendUrl);
  }
}