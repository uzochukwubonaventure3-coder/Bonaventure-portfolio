import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  const body = await req.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('testimonials').update(body).eq('id', params.id).select().single();
  if (error) return err(error.message, 500);
  return ok(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  const supabase = createAdminClient();
  const { data } = await supabase.from('testimonials').select('avatar_id').eq('id', params.id).single();
  if (data?.avatar_id) await deleteImage(data.avatar_id).catch(console.error);
  await supabase.from('testimonials').delete().eq('id', params.id);
  return ok({ message: 'Deleted' });
}
