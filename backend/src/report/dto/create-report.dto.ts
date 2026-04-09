import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';

export enum ReportStatus {
  EMAIL_SENT = 'EMAIL_SENT',
  TEST_RECEIVED = 'TEST_RECEIVED',
  TEST_SENT = 'TEST_SENT',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  WAITING_FOR_RESULT = 'WAITING_FOR_RESULT',
  PASSED = 'PASSED',
  NOT_PASSED = 'NOT_PASSED',
}

export class CreateReportDto {
  @IsUUID()
  @IsNotEmpty()
  appID!: string; 

  @IsString()
  @IsNotEmpty()
  repTopic!: string; 

  @IsEnum(ReportStatus)
  @IsNotEmpty()
  repStat!: ReportStatus; 

  @IsString()
  @IsOptional()
  descDetail?: string;

  @IsDateString()
  @IsOptional()
  interviewDate?: Date;
}