import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  try {
    const body = await req.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('experience').update(body).eq('id', params.id).select().single();
    if (error) return err(error.message, 500);
    return ok(data);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  const supabase = createAdminClient();
  const { error } = await supabase.from('experience').delete().eq('id', params.id);
  if (error) return err(error.message, 500);
  return ok({ message: 'Deleted' });
}
