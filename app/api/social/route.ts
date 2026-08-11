import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform  = searchParams.get('platform') ?? '';
    const category  = searchParams.get('category') ?? '';
    const tag       = searchParams.get('tag') ?? '';
    const limit     = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const page      = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const from      = (page - 1) * limit;
    const to        = from + limit - 1;

    const supabase = createAdminClient();
    let q = supabase
      .from('social_posts')
      .select('*', { count: 'exact' })
      .eq('hidden', false)
      .order('published_at', { ascending: false });

    if (platform) q = q.eq('platform', platform);
    if (category) q = q.eq('ai_category', category);
    if (tag)      q = q.contains('ai_tags', [tag]);
    q = q.range(from, to);

    const { data, error, count } = await q;
    if (error) return err(error.message, 500);

    return Response.json({
      success: true,
      data,
      meta: { page, limit, total: count ?? 0, hasMore: (count ?? 0) > to + 1 },
    });
  } catch (e: any) {
    return err(e.message, 500);
  }
}

// Admin: manually insert a post (for testing / backfill)
export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('social_posts')
      .insert(body)
      .select()
      .single();
    if (error) return err(error.message, 500);
    return Response.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
