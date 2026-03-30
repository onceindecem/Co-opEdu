import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { StudentsModule } from './students/students.module';
import { CompanyModule } from './company/company.module';
import { HrModule } from './hr/hr.module';
import { ProjectManagerModule } from './project-manager/project-manager.module';
import { AdvisorModule } from './advisor/advisor.module';

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
    UsersModule,
    AuthModule,
    ProjectsModule,
    StudentsModule,
    CompanyModule,
    HrModule,
    ProjectManagerModule,
    AdvisorModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }