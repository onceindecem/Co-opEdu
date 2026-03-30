import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';

// TODO: รอปลดคอมเมนต์เมื่อนำไปเชื่อมกับตาราง Project
// import { Project } from './project.model'; 

@Table({
  tableName: 'Company',
  timestamps: false, // ปิดการสร้าง createAt/updateAt อัตโนมัติ เพราะใน SQL ไม่ได้ระบุไว้
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

  /* ==============================================
     ส่วนของการทำ Associations (ความสัมพันธ์ตาราง)
     ปลดคอมเมนต์เมื่อคุณพร้อมเชื่อมกับตาราง Project
  ============================================== */

  // บริษัท 1 แห่ง สามารถมีได้หลายโปรเจกต์ (1-to-Many)
  // @HasMany(() => Project)
  // projects: Project[];
}