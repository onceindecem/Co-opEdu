import { IsString, IsOptional, MaxLength, MinLength, IsEmail } from 'class-validator';
import { Op } from 'sequelize';

export class UpdateHRProfileDto {
  @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'first name is too long' })
    hrFirstName: string;
  
    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'last name is too long' })
    hrLastName: string;
  
    @IsString()
    @IsOptional({ message: 'position is required' })
    hrPosition: string;
  
    @IsString()
    @IsOptional()
    @MinLength(9, { message: 'telephone must be at least 9 characters long' })
    @MaxLength(10, { message: 'telephone must be at most 10 characters long' })
    hrTel: string;
  
    // company info
    @IsString()
    @IsOptional()
    coNameTH: string;
  
    @IsString()
    @IsOptional()
    coNameEN?: string;
  
    @IsEmail({}, { message: 'company email format is invalid' })
    @IsOptional()
    coEmail: string;
  
    @IsString()
    @IsOptional()
    @MinLength(9, { message: 'telephone must be at least 9 characters long' })
    @MaxLength(10, { message: 'telephone must be at most 10 characters long' })
    coTel: string;
  
    @IsString()
    @IsOptional()
    coAddr: string;
}