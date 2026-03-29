export class RegisterDto {
  email: string;
  password?: string;
  role: 'STUDENT' | 'HR' | 'ADVISOR' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
}