import { Module } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { AdvisorController } from './advisor.controller';

@Module({
  controllers: [AdvisorController],
  providers: [AdvisorService],
})
export class AdvisorModule {}
