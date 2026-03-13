export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  full_name?: string;
}