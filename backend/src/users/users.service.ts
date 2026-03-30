import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HR } from 'src/hr/entities/hr.entity';
import { Advisor } from 'src/advisor/entities/advisor.entity';
import { Student } from 'src/student/entities/student.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Student) private studentModel: typeof Student,
    @InjectModel(Advisor) private advisorModel: typeof Advisor,
    @InjectModel(HR) private hrModel: typeof HR,
  ) {}

  async getProfile(userID: string, role: string) {
    // get profile info for userID and role
    const userBase = await this.userModel.findByPk(userID, {
      attributes: { exclude: ['passwordHash'] }, 
    });

    if (!userBase) {
      throw new NotFoundException('user not found');
    }

    // get profile data based on role
    let profileData : any = null;

    if (role === 'STUDENT') {
      profileData = await this.studentModel.findOne({ where: { userID } });
    } else if (role === 'ADVISOR') {
      profileData = await this.advisorModel.findOne({ where: { userID } });
    } else if (role === 'HR') {
      profileData = await this.hrModel.findOne({ 
        where: { userID }, include: [Company]
      });
    }

    return {
      message: 'ดึงข้อมูล Profile สำเร็จ',
      accountInfo: userBase,
      profile: profileData,
    };
  }
  
  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
