import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { RegisterHRDto } from './dto/register-hr.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { HR } from '../hr/entities/hr.entity';
import { Company } from '../company/entities/company.entity';
import { v4 as uuidv4 } from 'uuid';
import { Student } from '../student/entities/student.entity';
import { Advisor } from '../advisor/entities/advisor.entity';
import { ActivityLogsService } from 'src/activity-log/activity-log.service';
import * as crypto from 'crypto';

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
    private activityLogsService: ActivityLogsService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    // check if email already exists
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const isPwned = await this.isPasswordPwned(dto.password);
    if (isPwned) {
      throw new HttpException(
        'This password has been breached. Please change your password for security reasons.', 
        HttpStatus.BAD_REQUEST
      );
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

    const isPwned = await this.isPasswordPwned(dto.password);
    if (isPwned) {
      throw new HttpException(
        'This password has been breached. Please change your password for security reasons.', 
        HttpStatus.BAD_REQUEST
      );
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
      throw new HttpException('email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    if (!user.passwordHash || !password) {
      throw new HttpException('email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new HttpException('email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    let companyId: string | null = null;

    if (user.role === 'HR') {
      const hrProfile = await this.hrModel.findOne({
        where: { userID: user.userID }
      });
      companyId = hrProfile ? hrProfile.coID : null;
    }

    const payload = {
      sub: user.userID,
      email: user.email,
      role: user.role,
      coID: companyId
    };
    const token = await this.jwtService.signAsync(payload);

    await this.activityLogsService.createLog(
      user.userID,
      'LOGIN_SUCCESS',
      `เข้าสู่ระบบสำเร็จ (Email)`
    );

    return {
      message: 'Login successful',
      access_token: token,
      role: user.role,
      user: {
        email: user.email,
        role: user.role,
        coID: companyId
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

    if (user) {
      if (user.provider === 'LOCAL') {
        await user.update({ provider: 'LOCAL_AND_GOOGLE' });
      }
      else if (user.provider === 'GOOGLE' || user.provider === 'LOCAL_AND_GOOGLE') {
      }
    }
    else {
      // if not, create a new user with role STUDENT and provider GOOGLE, and also create a Student profile
      const newUserID = uuidv4();
      const prefix = email.split('@')[0];

      const isStudent = /^[0-9]+$/.test(prefix);
      const role = isStudent ? 'STUDENT' : 'ADVISOR';

      const t = await this.sequelize.transaction();
      try {
        // create new user
        user = await this.userModel.create({
          userID: newUserID,
          email: email,
          passwordHash: 'GOOGLE_SSO_NO_PASSWORD',
          role: role,
          provider: 'GOOGLE', 
        }, { transaction: t });

        if (isStudent) {
          await this.studentModel.create({
            userID: newUserID,
            studentID: prefix,
            firstName: firstName,
            lastName: lastName,
          }, { transaction: t });
        } else {
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
    const token = await this.jwtService.signAsync(payload);

    await this.activityLogsService.createLog(
      user.userID,
      'LOGIN_SUCCESS',
      `เข้าสู่ระบบสำเร็จ (Google SSO)`
    );

    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Login with Google successful',
      role: user.role
    };
  }

  private async isPasswordPwned(password: string): Promise<boolean> {
    try {
      // convert to SHA-1
      const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      
      // get first 5 letter
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      // api fetch
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) {
        return false;
      }

      const text = await response.text();
      
      // check suffix
      return text.includes(suffix);
    } catch (error) {
      console.error('Pwned password check failed:', error);
      return false; 
    }
  }
}
