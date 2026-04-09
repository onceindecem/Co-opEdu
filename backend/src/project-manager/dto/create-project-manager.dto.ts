import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateProjectManagerDto {
  @IsString() @IsNotEmpty() pmID!: string;
  @IsString() @IsNotEmpty() pmName!: string;
  @IsString() @IsNotEmpty() pmPos!: string;
  @IsString() @IsNotEmpty() pmDept!: string;
  @IsString() @IsNotEmpty() pmTel!: string;
  @IsEmail() @IsNotEmpty() pmEmail!: string;
  @IsString() @IsNotEmpty() coID!: string;
}