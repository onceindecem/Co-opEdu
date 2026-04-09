import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  IsUUID,
} from 'class-validator';

enum ContactType {
  PM = 'PM',
  COORD = 'COORD',
}

enum RoundType {
  ONE = '1',
  TWO = '2',
}

export class CreateProjectDto {

  @IsUUID('all', { message: 'projID ต้องเป็น UUID' })
  @IsNotEmpty()
  projI!: string;

  @IsString()
  @IsNotEmpty()
  coID!: string;

  @IsString()
  @IsNotEmpty()
  userID!: string;

  @IsString()
  @IsNotEmpty()
  pmID!: string;

  @IsString()
  @IsOptional() 
  advID?: string;

  @IsEnum(ContactType, { message: 'contact ต้องเป็น PM หรือ COORD เท่านั้น' })
  @IsNotEmpty()
  contact!: string;

  @IsString()
  @IsOptional()
  contDetail?: string;

  @IsString()
  @IsNotEmpty()
  projName!: string;

  @IsString()
  @IsNotEmpty()
  obj!: string;

  @IsInt({ message: 'โควต้าต้องเป็นตัวเลขจำนวนเต็ม' })
  @Min(1, { message: 'โควต้าต้องไม่น้อยกว่า 1' })
  @IsNotEmpty()
  quota!: number;

  @IsString()
  @IsNotEmpty()
  jd!: string;

  @IsString()
  @IsNotEmpty()
  skills!: string;

  @IsString()
  @IsNotEmpty()
  mentor!: string;

  @IsString()
  @IsNotEmpty()
  workAddr!: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsEnum(RoundType, { message: 'รอบต้องเป็น 1 หรือ 2 เท่านั้น' })
  @IsNotEmpty()
  round!: string;
}