import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { Company } from 'src/company/entities/company.entity';
import { Project } from 'src/projects/entities/project.entity';
@Table({
  tableName: 'ProjectManager',
  timestamps: false,
})
export class ProjectManager extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare pmID: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare pmName: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare pmPos: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare pmDept: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare pmTel: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare pmEmail: string;

  @Column({ type: DataType.UUID, allowNull: false })
  declare coID: string;
}