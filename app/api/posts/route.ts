import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query    = searchParams.get('query') ?? '';
    const section  = searchParams.get('section') ?? '';
    const tag      = searchParams.get('tag') ?? '';
    const platform = searchParams.get('platform') ?? '';
    const featured = searchParams.get('featured');
    const all      = searchParams.get('all') === 'true';
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));
    const from     = (page - 1) * limit;
    const to       = from + limit - 1;

    const supabase = createAdminClient();
    let q = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (!all) q = q.eq('published', true);
    if (query) q = q.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
    if (section && section !== 'all') q = q.eq('section', section);
    if (tag) q = q.contains('tags', [tag]);
    if (platform) q = q.eq('platform', platform);
    if (featured === 'true') q = q.eq('featured', true);
    q = q.range(from, to);

    const { data, error, count } = await q;
    if (error) return err(error.message, 500);

    return ok(data, 200);
    // Return with meta
    return Response.json({
      success: true,
      data,
      meta: { page, limit, total: count ?? 0, hasMore: (count ?? 0) > to + 1 },
    });
  } catch (e: any) {
    return err(e.message ?? 'Failed to fetch posts', 500);
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const { title, slug, content, excerpt, cover_image, cover_image_id,
            tags, section, platform, external_url, ai_summary, featured, published } = body;

    if (!title || !content) return err('Title and content are required');

    const words = content.trim().split(/\s+/).length;
    const reading_time = Math.max(1, Math.ceil(words / 200));
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title, slug: finalSlug, content,
        excerpt: excerpt || content.slice(0, 200).replace(/[#*`]/g, '') + '...',
        cover_image: cover_image ?? null,
        cover_image_id: cover_image_id ?? null,
        tags: tags ?? [],
        section: section ?? 'Latest Thoughts',
        platform: platform ?? 'self',
        external_url: external_url ?? null,
        reading_time,
        ai_summary: ai_summary ?? null,
        featured: featured ?? false,
        published: published ?? false,
        views: 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return err('A post with this slug already exists');
      return err(error.message, 500);
    }
    return Response.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    return err(e.message ?? 'Failed to create post', 500);
  }
}
