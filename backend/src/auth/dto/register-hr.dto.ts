import { IsNotEmpty, IsOptional, IsString, MinLength, IsEmail } from "class-validator";

export class RegisterHRDto {
  // login info
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  password: string; 

  // hr info
  @IsString()
  @IsNotEmpty()
  hrFirstName: string;

  @IsString()
  @IsNotEmpty()
  hrLastName: string;

  @IsString()
  @IsNotEmpty()
  hrPosition: string;

  @IsString()
  @IsNotEmpty()
  hrTel: string;

  // company info
  @IsString()
  @IsNotEmpty()
  coNameTH: string;

  @IsString()
  @IsOptional()
  coNameEN?: string;

  @IsEmail()
  @IsNotEmpty()
  coEmail: string;

  @IsString()
  @IsNotEmpty()
  coTel: string;

  @IsString()
  @IsNotEmpty()
  coAddr: string;
}