import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity'; // ⚠️ เช็ก Path ให้ตรงกับไฟล์ Entity ของคุณนะครับ
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Application,]),AuthModule // 🌟 เพิ่มบรรทัดนี้เพื่อให้ NestJS รู้จักตารางนี้
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService], // (เผื่อไว้) ถ้า Module อื่นอยากเรียกใช้ ApplicationsService ด้วย
})
export class ApplicationsModule {}