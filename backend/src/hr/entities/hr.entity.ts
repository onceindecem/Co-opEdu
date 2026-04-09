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

import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Project } from 'src/projects/entities/project.entity';

@Table({
  tableName: 'HR',
  timestamps: false, 
})
export class HR extends Model {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare userID: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare hrFirstName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare hrLastName: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare hrPosition: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare hrTel: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false })
  declare coID: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;

  @BelongsTo(() => Company)
  declare company: Company;

  @HasMany(() => Project)
  projects!: Project[];
}
