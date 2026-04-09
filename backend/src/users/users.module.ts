import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { HR } from 'src/hr/entities/hr.entity';
import { Student } from 'src/student/entities/student.entity';
import { Advisor } from 'src/advisor/entities/advisor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogsModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Student, Advisor, HR, Company]), 
    forwardRef(() => AuthModule),
    ActivityLogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}