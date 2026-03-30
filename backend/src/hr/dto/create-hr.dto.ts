import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHrDto {
  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  hrName: string;

  @IsString()
  @IsNotEmpty()
  hrPosition: string;

  @IsString()
  @IsNotEmpty()
  hrTel: string;

  @IsString()
  @IsNotEmpty()
  coID: string;
}