import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectManager } from 'src/project-manager/entities/project-manager.entity';
import { MulterModule } from '@nestjs/platform-express'; // 👈 เพิ่ม
import { diskStorage } from 'multer';
import { extname } from 'path'; // 👈 เพิ่มบรรทัดนี้
import { Advisor } from '../advisor/entities/advisor.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Project, ProjectManager, Advisor]),
    // 🌟 ตั้งค่าการเก็บไฟล์ PDF
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // โฟลเดอร์ที่เก็บไฟล์
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
