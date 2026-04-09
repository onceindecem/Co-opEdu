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

@Table({
  tableName: 'Advisor',
  timestamps: false,
})
export class Advisor extends Model {
  @ForeignKey(() => User)  
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare userID: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;
}