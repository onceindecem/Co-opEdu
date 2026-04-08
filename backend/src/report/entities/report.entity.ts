import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Application } from 'src/applications/entities/application.entity'; // ⚠️ เช็ก Path ให้ตรงกับ Entity ของคุณ

@Table({ tableName: 'Reports', timestamps: true, createdAt: 'createAt', updatedAt: 'updateAt' })
export class Report extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  repID!: string; // 🌟 เติม ! ตรงนี้

  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  appID!: string; // 🌟 เติม ! ตรงนี้

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  repTopic!: string; // 🌟 เติม ! ตรงนี้

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
  repStat!: string; // 🌟 เติม ! ตรงนี้

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descDetail!: string; // 🌟 เติม ! ตรงนี้

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  interviewDate!: Date; // 🌟 เติม ! ตรงนี้

  @BelongsTo(() => Application)
  application!: Application; // 🌟 เติม ! ตรงนี้
}