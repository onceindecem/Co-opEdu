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

// TODO: ปลดคอมเมนต์เมื่อสร้าง Model Users, Company และ Project เสร็จแล้ว
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
// import { Project } from './project.model';

@Table({
  tableName: 'HR',
  timestamps: false, // ปิดการสร้าง timestamps เพราะใน SQL ไม่ได้ระบุไว้
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

  /* ==============================================
     ส่วนของการทำ Associations (ความสัมพันธ์ตาราง)
     ปลดคอมเมนต์เมื่อคุณพร้อมเชื่อมกับตารางอื่นๆ
  ============================================== */

  // เชื่อมกับตาราง Users (HR 1 คน คือ User 1 ไอดี) พร้อมทำ Cascade Delete
  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;

//   เชื่อมกับตาราง Company (HR 1 คน สังกัด 1 บริษัท)
  @BelongsTo(() => Company)
  declare company: Company;

  // อ้างอิงจากตาราง Project ที่เราทำไปก่อนหน้า HR 1 คนสามารถรับผิดชอบได้หลายโปรเจกต์
  // @HasMany(() => Project)
  // projects: Project[];
}