import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const supabase = createAdminClient();
  let q = supabase.from('testimonials').select('*').order('order', { ascending: true });
  if (!all) q = q.eq('approved', true).eq('featured', true);
  const { data, error } = await q;
  if (error) return err(error.message, 500);
  return ok(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quote, name, title } = body;
    if (!quote || !name || !title) return err('Quote, name and title are required');
    const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    const supabase = createAdminClient();
    await supabase.from('testimonials').insert({ ...body, initials: body.initials || initials, approved: false, featured: false, order: 999 });
    return Response.json({ success: true, data: { message: 'Thank you! Your testimonial will be reviewed.' } }, { status: 201 });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
