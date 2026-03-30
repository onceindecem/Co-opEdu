import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ NestJS
  timeout: 5000, // ถ้า Backend ไม่ตอบใน 5 วิ ให้ตัดการเชื่อมต่อ
  headers: {
    'Content-Type': 'application/json',
  },
});

// (Option) ใส่ Interceptor ไว้ดัก Error กลาง
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || 'Something went wrong');
    return Promise.reject(error);
  }
);

export default api;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);    
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
