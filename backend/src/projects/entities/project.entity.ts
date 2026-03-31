import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Company } from '../../company/entities/company.entity';
import { HR } from '../../hr/entities/hr.entity';
import { ProjectManager } from '../../project-manager/entities/project-manager.entity';
import { Advisor } from '../../advisor/entities/advisor.entity';

@Table({
  tableName: 'Projects',
  timestamps: true, // ให้ Sequelize จัดการ createAt / updateAt
})
export class Project extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  projID: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false })
  coID: string;

  @ForeignKey(() => HR)
  @Column({ type: DataType.UUID, allowNull: false })
  userID: string; 

  @ForeignKey(() => ProjectManager)
  @Column({ type: DataType.UUID, allowNull: false })
  pmID: string;

  @ForeignKey(() => Advisor)
  @Column({ type: DataType.UUID, allowNull: true })
  advID: string;

  @Column({
    type: DataType.ENUM('PM', 'COORD'),
    allowNull: false,
  })
  contact: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  contDetail: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  projName: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  obj: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quota: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  jd: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  skills: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  mentor: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  workAddr: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  file: string;

  @Column({
    type: DataType.ENUM('1', '2'),
    allowNull: false,
  })
  round: string;

  @Column({
    type: DataType.ENUM('PENDING', 'APPROVED', 'DENIED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  projStat: string;

  @CreatedAt
  @Column({ field: 'createAt' })
  createAt: Date;

  @UpdatedAt
  @Column({ field: 'updateAt' })
  updateAt: Date;

  /* ==============================================
     ส่วนของการทำ Associations (ความสัมพันธ์ตาราง)
  ============================================== */

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => HR)
  hr: HR;

  @BelongsTo(() => ProjectManager)
  projectManager: ProjectManager;

  @BelongsTo(() => Advisor)
  advisor: Advisor;
}