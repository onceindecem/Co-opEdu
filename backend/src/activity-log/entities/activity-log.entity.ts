import { Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity'; 

@Table({ tableName: 'ActivityLogs', timestamps: false }) 
export class ActivityLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  logID!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userID!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  action!: string;

  @Column({ type: DataType.TEXT })
  details!: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  timestamp!: Date;

  @BelongsTo(() => User)
  user!: User;
}