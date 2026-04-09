import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(15, { message: 'password must be at least 15 characters' })
  @MaxLength(128, { message: 'password must be at most 128 characters' })
  password!: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  provider?: string;
}