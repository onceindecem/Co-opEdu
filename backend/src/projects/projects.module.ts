import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectManager } from 'src/project-manager/entities/project-manager.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'; 
import { Advisor } from '../advisor/entities/advisor.entity';
import { AuthModule } from '../auth/auth.module';
import { ActivityLogsModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Project, ProjectManager, Advisor]),
    AuthModule,
    ActivityLogsModule,

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', 
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
