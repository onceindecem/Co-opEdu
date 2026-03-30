import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectManagerDto } from './create-project-manager.dto';

export class UpdateProjectManagerDto extends PartialType(CreateProjectManagerDto) {}
