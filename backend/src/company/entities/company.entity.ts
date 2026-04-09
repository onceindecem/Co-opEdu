import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { HR } from 'src/hr/entities/hr.entity';
import { Project } from 'src/projects/entities/project.entity'; 

@Table({
  tableName: 'Company',
  timestamps: false,
})
export class Company extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare coID: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare coNameTH: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare coNameEN: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare coEmail: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare coTel: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare coAddr: string;

  @HasMany(() => Project)
  projects!: Project[];
  
  @HasMany(() => HR)
  hrs?: HR[];
}