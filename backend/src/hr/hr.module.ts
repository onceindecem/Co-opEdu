import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { HR } from './entities/hr.entity';

@Module({
  imports: [SequelizeModule.forFeature([HR])], 
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
