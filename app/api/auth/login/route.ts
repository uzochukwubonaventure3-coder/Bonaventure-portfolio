import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/server';
import { signToken } from '@/lib/auth';
import { err, ok } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    let credentials: { email?: string; password?: string };
    try {
      credentials = await req.json();
    } catch {
      return err('Invalid JSON body');
    }

    const { email, password } = credentials;

    if (!email || !password) {
      return err('Email and password are required');
    }

    if (!hasSupabaseAdminEnv()) {
      return err('Supabase admin environment variables are not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart the dev server.', 500);
    }

    const supabase = createAdminClient();
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, email, password, name')
      .eq('email', email)
      .maybeSingle();

    if (adminError) {
      console.error(adminError);
      if (adminError.code === 'PGRST205') {
        return err('Supabase table public.admins was not found. Run lib/supabase/migration.sql in the Supabase SQL Editor, then restart the dev server.', 500);
      }
      return err('Unable to verify admin credentials. Check your Supabase admins table and service role key.', 500);
    }

    if (!admin) return err('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return err('Invalid credentials', 401);

    const token = await signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = ok({ name: admin.name, email: admin.email });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (e) {
    console.error(e);
    return err('Internal server error', 500);
  }
}
