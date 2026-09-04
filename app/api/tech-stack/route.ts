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
    const skills = data ?? [];
    const legacyIcons = skills.filter(skill => skill.icon && !/^https?:\/\//.test(skill.icon));
    await Promise.all(legacyIcons.map(skill =>
      supabase.from('tech_skills').update({ icon: '' }).eq('id', skill.id)
    ));
    return ok(skills.map(skill => ({ ...skill, icon: '' })));
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
      .insert({ name: body.name, category: body.category, order: body.order ?? 0, icon: '' })
      .select()
      .single();
    if (error) return err(error.message, 500);
    return Response.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
