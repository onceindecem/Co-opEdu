import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAdvisorDto {
  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  advName: string;
}