import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (error || !data) return notFound('Post');

    // Increment views in background
    supabase.rpc('increment_post_views', { post_id: data.id }).then(() => {});
    return ok(data);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    if (body.content) {
      body.reading_time = Math.max(1, Math.ceil(body.content.trim().split(/\s+/).length / 200));
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('slug', params.slug)
      .select()
      .single();
    if (error) return err(error.message, 500);
    return ok(data);
  } catch (e: any) {
    return err(e.message, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('posts').select('cover_image_id').eq('slug', params.slug).single();
    if (data?.cover_image_id) await deleteImage(data.cover_image_id).catch(console.error);
    const { error } = await supabase.from('posts').delete().eq('slug', params.slug);
    if (error) return err(error.message, 500);
    return ok({ message: 'Post deleted' });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
