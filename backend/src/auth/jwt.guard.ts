import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // retrieve the token from the Authorization header
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('no token provided');
    }
    
    try {
      // check if the token is valid and not expired
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secretpaepeemdefaultkey',
      });
      // if valid, attach the payload (user info) to the request object for use in controllers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('token is invalid or expired');
    }
    return true; // allow the request to proceed if the token is valid
  }

  // function to extract the token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}