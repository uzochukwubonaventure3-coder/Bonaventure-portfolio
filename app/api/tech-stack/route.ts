import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('tech_skills')
      .select('*')
      .order('category', { ascending: true })
      .order('order', { ascending: true });
    if (error) return err(error.message, 500);
    return ok(data ?? []);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    if (!body.name || !body.category) return err('Name and category are required');
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('tech_skills')
      .insert(body)
      .select()
      .single();
    if (error) return err(error.message, 500);
    return Response.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
