import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { CompanyModule } from './company/company.module';
import { HrModule } from './hr/hr.module';
import { ProjectManagerModule } from './project-manager/project-manager.module';
import { StudentModule } from './student/student.module';
import { AdvisorModule } from './advisor/advisor.module';
import { ApplicationsModule } from './applications/applications.module';
import { ReportsModule } from './report/report.module';
import { ActivityLogsModule } from './activity-log/activity-log.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: process.env.DATABASE_URL, 
      autoLoadModels: true,          
      synchronize: true,          
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, 
        },
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 5,   
    }]),
    UsersModule,
    AuthModule,
    ProjectsModule,
    CompanyModule,
    HrModule,
    ProjectManagerModule,
    CompanyModule,
    HrModule,
    StudentModule,
    AdvisorModule,
    ApplicationsModule,
    ReportsModule,
    ActivityLogsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }