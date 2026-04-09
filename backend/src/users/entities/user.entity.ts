import { Column, DataType, Model, Table, HasMany, HasOne } from 'sequelize-typescript'; // 🌟 เพิ่ม HasMany
import { Application } from 'src/applications/entities/application.entity'; // 🌟 Import Application (เช็ก Path ให้ตรงกับโฟลเดอร์ของคุณนะครับ)
import { Student } from 'src/student/entities/student.entity';

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
    type: DataType.ENUM('LOCAL', 'GOOGLE', 'LOCAL_AND_GOOGLE'),
    allowNull: false,
  })
  declare provider: string;

  @HasMany(() => Application)
  declare applications: Application[];

  @HasOne(() => Student)
declare student: Student;
}