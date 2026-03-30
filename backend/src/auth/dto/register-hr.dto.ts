import { IsNotEmpty, IsOptional, IsString, MinLength, IsEmail } from "class-validator";

export class RegisterHRDto {
  // login info
  @IsEmail({}, { message: 'email format is invalid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'password is required' })
  password: string; 

  // hr info
  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  hrFirstName: string;

  @IsString()
  @IsNotEmpty({ message: 'last name is required' })
  hrLastName: string;

  @IsString()
  @IsNotEmpty({ message: 'position is required' })
  hrPosition: string;

  @IsString()
  @IsNotEmpty()
  hrTel: string;

  // company info
  @IsString()
  @IsNotEmpty({ message: 'company name (TH) is required' })
  coNameTH: string;

  @IsString()
  @IsOptional()
  coNameEN?: string;

  @IsEmail({}, { message: 'company email format is invalid' })
  @IsNotEmpty({ message: 'company email is required' })
  coEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'company telephone is required' })
  coTel: string;

  @IsString()
  @IsNotEmpty()
  coAddr: string;
}