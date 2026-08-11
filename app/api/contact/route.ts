import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, budget, message } = await req.json();
    if (!name || !email || !message) return err('Name, email and message are required');
    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_messages').insert({ name, email, budget: budget ?? null, message });
    if (error) return err(error.message, 500);
    return Response.json({ success: true, data: { message: "Message received! I'll get back to you within 24 hours." } }, { status: 201 });
  } catch (e: any) {
    return err(e.message ?? 'Failed to send message', 500);
  }
}

export async function GET(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) return err(error.message, 500);
  return ok(data);
}
