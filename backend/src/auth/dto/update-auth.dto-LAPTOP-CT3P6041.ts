import { PartialType } from '@nestjs/mapped-types';
import { RegisterHRDto } from './register-hr.dto';

export class UpdateAuthDto extends PartialType(RegisterHRDto) {}
