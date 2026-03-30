// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterHRDto } from './dto/register-hr.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // receive POST Request at URL: /auth/register
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    // call the register method in AuthService to handle the registration logic
    return this.authService.registerUser(registerDto);
  }

  @Post('register-hr')
  registerHR(@Body() dto: RegisterHRDto) {
    return this.authService.registerHR(dto);
  }

  @Post('login')
  login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }

  // login with Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // google auth callback URL after user successfully logs in with Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // send the user information received from Google to AuthService to handle login or registration logic
    return this.authService.googleLogin(req.user);
  }
}