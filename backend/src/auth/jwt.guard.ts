// src/auth/jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    // 🔍 วางกับดักที่ 1: ดูว่ารับ Token มาจาก Thunder Client ได้ไหม?
    console.log('--- 👮‍♂️ คุณลุง รปภ. กำลังตรวจบัตร ---');
    console.log('1. Token ที่รับมาคือ:', token ? 'ได้รับ Token แล้ว!' : 'ไม่มี Token ส่งมา!');

    if (!token) {
      throw new UnauthorizedException('หยุดนะ! คุณไม่มีบัตรผ่านประตู (Token)');
    }
    
    try {
      // ⚠️ ตรง secret นี้ พิมพ์ให้ตรงกับในไฟล์ auth.module.ts เป๊ะๆ เลยนะครับ (เช่น 'my-secret-key')
      const secretKey = process.env.JWT_SECRET;
      console.log('2. กุญแจที่ใช้ถอดรหัสคือ:', secretKey);

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey, 
      });
      
      console.log('3. ถอดรหัสสำเร็จ! ข้อมูลข้างในคือ:', payload);
      request['user'] = payload;
      
    } catch (error) {
      // 🔍 วางกับดักที่ 2: ถ้าพัง มันพังเพราะอะไร?
      console.log('❌ ถอดรหัสพัง! สาเหตุจากระบบคือ:', error.message);
      throw new UnauthorizedException('บัตรผ่านประตูปลอม หรือ หมดอายุแล้ว!');
    }
    return true; 
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}