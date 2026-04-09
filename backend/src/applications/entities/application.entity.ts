import { 
  Column, 
  DataType, 
  Model, 
  Table, 
  ForeignKey, 
  BelongsTo,
  PrimaryKey 
} from 'sequelize-typescript';

import { User } from 'src/users/entities/user.entity'; 
import { Project } from 'src/projects/entities/project.entity';

@Table({
  tableName: 'Applications',
  createdAt: 'createAt', 
  updatedAt: false,      
})
export class Application extends Model {
  
  @PrimaryKey
  @Column({ 
    type: DataType.UUID, 
    defaultValue: DataType.UUIDV4 
  })
  declare appID: string;

  @ForeignKey(() => User)
  @Column({ 
    type: DataType.UUID, 
    allowNull: false 
  })
  declare userID: string;

  @ForeignKey(() => Project)
  @Column({ 
    type: DataType.UUID, 
    allowNull: false 
  })
  declare projID: string;

  @Column({
    type: DataType.ENUM('PENDING', 'APPROVED', 'DENIED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  declare appStat: string;

  @Column({
    type: DataType.ENUM('HIRED', 'NOT_HIRED', 'WAITING'),
    allowNull: true,
    defaultValue: 'WAITING',
  })
  declare hiredStat: string;
  
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Project)
  declare project: Project;
}