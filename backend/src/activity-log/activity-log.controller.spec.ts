import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsController } from './activity-log.controller';
import { ActivityLogsService } from './activity-log.service';

describe('ActivityLogController', () => {
  let controller: ActivityLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogsController],
      providers: [ActivityLogsService],
    }).compile();

    controller = module.get<ActivityLogsController>(ActivityLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
