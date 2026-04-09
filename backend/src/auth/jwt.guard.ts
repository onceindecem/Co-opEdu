// src/auth/jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    
    // have a checkpoint here to see if token is received correctly
    if (!token) {
      throw new UnauthorizedException('access denied, no token provided');
    }
    
    try {
      const secretKey = process.env.JWT_SECRET;

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey, 
      });
      
      request['user'] = payload;
      
    } catch (error) {
      throw new UnauthorizedException('access denied, invalid or expired token');
    }
    return true; 
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.accessToken;
  }
}