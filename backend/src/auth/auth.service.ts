import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // retrieve UsersService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role, provider } = registerDto;

    // check if email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      // email is already in use, throw an error
      throw new HttpException('Email is already in use', HttpStatus.BAD_REQUEST);
    }

    // if registering with LOCAL provider, hash the password before saving
    let hashedPassword: string | undefined;
    if (provider === 'LOCAL' && password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // create the new user in the database
    const newUser = await this.usersService.create({
      email: email,
      passwordHash: hashedPassword, // store the hashed password
      role: role,
      provider: provider,
    });

    // return success response with user details (excluding password)
    return {
      message: 'User registered successfully',
      user: {
        userID: newUser.userID,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  // src/auth/auth.service.ts

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
}
