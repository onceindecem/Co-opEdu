import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdvisorService } from './advisor.service';
import { AdvisorController } from './advisor.controller';
import { Advisor } from './entities/advisor.entity';

@Module({
  imports: [SequelizeModule.forFeature([Advisor])], 
  controllers: [AdvisorController],
  providers: [AdvisorService],
})
export class AdvisorModule {}
