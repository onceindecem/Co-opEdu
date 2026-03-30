import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectManagerService } from './project-manager.service';
import { ProjectManagerController } from './project-manager.controller';
import { ProjectManager } from './entities/project-manager.entity';

@Module({
  imports: [SequelizeModule.forFeature([ProjectManager])], 
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}