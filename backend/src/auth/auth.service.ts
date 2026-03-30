import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { RegisterHRDto } from './dto/register-hr.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { HR } from '../hr/entities/hr.entity';
import { Company } from '../company/entities/company.entity';
import { v4 as uuidv4 } from 'uuid';
import { Student } from '../student/entities/student.entity';
import { Advisor } from '../advisor/entities/advisor.entity';

@Injectable()
export class AuthService {
  // retrieve UsersService
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(HR) private hrModel: typeof HR,
    @InjectModel(Company) private companyModel: typeof Company,
    @InjectModel(Student) private studentModel: typeof Student,
    @InjectModel(Advisor) private advisorModel: typeof Advisor,
    private sequelize: Sequelize,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto) { 
    // check if email already exists
    const existingUser = await this.userModel.findOne({ 
      where: { email: dto.email } 
    });

    if (existingUser) {
      throw new HttpException('อีเมลนี้ถูกใช้งานแล้ว', HttpStatus.BAD_REQUEST);
    }

    // hash the password before saving to database
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // create new user record in the database
    const newUser = await this.userModel.create({
      userID: uuidv4(),
      email: dto.email,
      passwordHash: hashedPassword,
      role: dto.role, 
      provider: 'LOCAL', 
    });

    return {
      message: 'registration successful',
      userID: newUser.userID,
      email: newUser.email,
      role: newUser.role
    };
  }

  async registerHR(dto: RegisterHRDto) {
    // check if email already exists
    const existingUser = await this.userModel.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // start transaction
    const t = await this.sequelize.transaction();

    try {
      // create User
      const newUser = await this.userModel.create(
        {
          userID: uuidv4(),
          email: dto.email,
          passwordHash: hashedPassword,
          role: 'HR',
          provider: 'LOCAL',
        },
        { transaction: t }
      );

      // create Company
      const newCompanyID = uuidv4();
      await this.companyModel.create(
        {
          coID: newCompanyID,
          coNameTH: dto.coNameTH,
          coNameEN: dto.coNameEN,
          coEmail: dto.coEmail,
          coTel: dto.coTel,
          coAddr: dto.coAddr,
        },
        { transaction: t }
      );

      // create HR profile connected to User and Company
      await this.hrModel.create(
        {
          userID: newUser.userID, 
          coID: newCompanyID,   
          hrFirstName: dto.hrFirstName,
          hrLastName: dto.hrLastName,
          hrPosition: dto.hrPosition,
          hrTel: dto.hrTel,
        },
        { transaction: t }
      );

      // commit transaction
      await t.commit();

      return { message: 'HR registered successfully' };

    } catch (error) {
      // rollback transaction on error
      await t.rollback();
      throw new HttpException('Failed to register HR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginData: any) {
    const { email, password } = loginData;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('อีเมล หรือ รหัสผ่านไม่ถูกต้อง (หาอีเมลไม่เจอ)', HttpStatus.UNAUTHORIZED);
    }

    if (!user.passwordHash || !password) {
      throw new HttpException('อีเมล หรือ รหัสผ่านไม่ถูกต้อง (ไม่มีรหัสให้เทียบ)', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatching) {
      throw new HttpException('อีเมล หรือ รหัสผ่านไม่ถูกต้อง (รหัสไม่ตรง)', HttpStatus.UNAUTHORIZED);
    }

    const payload = { userID: user.userID, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        email: user.email,
        role: user.role,
      }
    };
  }

  async googleLogin(reqUser: any) {
    if (!reqUser) {
      throw new HttpException('No user from google', HttpStatus.BAD_REQUEST);
    }

    const { email, firstName, lastName } = reqUser;

    // ensure the email is from the institution domain
    // if (!email.endsWith('@kmitl.ac.th')) {
    //   throw new HttpException('กรุณาใช้อีเมลสถาบัน (@kmitl.ac.th) เท่านั้น', HttpStatus.FORBIDDEN);
    // }

    // check if user already exists in our database
    let user = await this.userModel.findOne({ where: { email } });

    // if not, create a new user with role STUDENT and provider GOOGLE, and also create a Student profile
    if (!user) {
      const newUserID = uuidv4();
      const prefix = email.split('@')[0];

      const isStudent = /^[0-9]+$/.test(prefix); 
      const role = isStudent ? 'STUDENT' : 'ADVISOR';

      const t = await this.sequelize.transaction();
      try {
        // create User with a placeholder password 
        user = await this.userModel.create({
          userID: newUserID,
          email: email,
          passwordHash: 'GOOGLE_SSO_NO_PASSWORD',
          role: role, 
          provider: 'GOOGLE',
        }, { transaction: t });

        if (isStudent) {
          // create Student profile linked to the new User
          await this.studentModel.create({
            userID: newUserID,
            studentID: prefix,
            firstName: firstName,
            lastName: lastName,
          }, { transaction: t });
        } else {
          // create Advisor profile linked to the new User
          await this.advisorModel.create({
            userID: newUserID,
            firstName: firstName,
            lastName: lastName,
          }, { transaction: t });
        }

        await t.commit();
      } catch (error) {
        await t.rollback();
        throw new HttpException('Failed to create user profile', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // generate JWT token for the user
    const payload = { sub: user.userID, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Login with Google successful',
      role: user.role
    };
  }
}
