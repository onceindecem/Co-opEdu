import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'Students', timestamps: true })
export class Student extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare userID: string;

  @Column({ type: DataType.STRING, allowNull: false }) // เช่น 66050393
  declare studentID: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;
}

