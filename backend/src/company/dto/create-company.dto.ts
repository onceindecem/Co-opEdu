import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  coID: string;

  @IsString()
  @IsNotEmpty()
  coNameTH: string;

  @IsString()
  @IsOptional() // ใส่เผื่อไว้ถ้าไม่ได้บังคับ
  coNameEN: string;

  @IsString()
  @IsNotEmpty()
  coEmail: string;

  @IsString()
  @IsNotEmpty()
  coTel: string;

  @IsString()
  @IsNotEmpty()
  coAddr: string;
}
