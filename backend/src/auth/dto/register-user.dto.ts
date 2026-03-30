import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'email format is invalid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsString()
  @IsOptional()
  role: string; 
}