import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing in .env file!');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await this.supabase.auth.getUser(token);

    if (error || !user) throw new UnauthorizedException('Invalid token');

    // ดึง Role จากตาราง users
    const { data: profile } = await this.supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    // แนบ user และ role ไปกับ request
    request.user = { ...user, role: profile?.role };
    return true;
  }
}