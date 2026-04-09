import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Application } from 'src/applications/entities/application.entity'; // ⚠️ เช็ก Path ให้ตรงกับ Entity ของคุณ

@Table({ tableName: 'Reports', timestamps: true, createdAt: 'createAt', updatedAt: 'updateAt' })
export class Report extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  repID!: string; 

  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  appID!: string; 

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  repTopic!: string; 
  @Column({
    type: DataType.ENUM(
      'EMAIL_SENT',
      'TEST_RECEIVED',
      'TEST_SENT',
      'INTERVIEW_SCHEDULED',
      'WAITING_FOR_RESULT',
      'PASSED',
      'NOT_PASSED'
    ),
    allowNull: false,
  })
  repStat!: string; 

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descDetail!: string;
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  interviewDate!: Date; 

  @BelongsTo(() => Application)
  application!: Application; 
}