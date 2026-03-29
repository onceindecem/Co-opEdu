// src/users/entities/user.entity.ts
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'Users', timestamps: false })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare userID: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare passwordHash: string;

  @Column({
    type: DataType.ENUM('STUDENT', 'HR', 'ADVISOR', 'ADMIN'),
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.ENUM('LOCAL', 'GOOGLE'),
    allowNull: false,
  })
  declare provider: string;
}