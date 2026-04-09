import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity'; 
import { AuthModule } from '../auth/auth.module';
import { ActivityLogsModule } from '../activity-log/activity-log.module'; 

@Module({
  imports: [
    SequelizeModule.forFeature([Application,]),AuthModule,ActivityLogsModule 
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService], 
})
export class ApplicationsModule {}