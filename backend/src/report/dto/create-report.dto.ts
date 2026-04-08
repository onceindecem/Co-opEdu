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
  appID!: string; // 🌟 เติม ! ตรงนี้

  @IsString()
  @IsNotEmpty()
  repTopic!: string; // 🌟 เติม ! ตรงนี้

  @IsEnum(ReportStatus)
  @IsNotEmpty()
  repStat!: ReportStatus; // 🌟 เติม ! ตรงนี้

  // ส่วนตัวแปรที่บังคับใส่ @IsOptional() (อาจจะมีหรือไม่มีก็ได้) 
  // ตรงนี้ไม่ต้องใส่ ! ก็ได้ครับ ให้ใช้เครื่องหมาย ? (Optional) แทนแบบนี้ครับ
  @IsString()
  @IsOptional()
  descDetail?: string;

  @IsDateString()
  @IsOptional()
  interviewDate?: Date;
}