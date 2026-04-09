import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsString, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'email format is invalid' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string;

  @IsString()
  @MinLength(15, { message: 'password must be at least 15 characters long without MFA' })
  @MaxLength(128, { message: 'password is too long' }) // รองรับ Passphrase
  @IsNotEmpty({ message: 'password is required' })
  password!: string;

  @IsString()
  @IsOptional()
  role!: string;
}