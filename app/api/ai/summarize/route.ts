import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { enrichContent } from '@/lib/ai/enrichment';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();

  try {
    const { resource_id, resource_type, title, content } = await req.json();
    if (!content) return err('content is required');

    const enriched = await enrichContent(title ?? 'Post', content);

    // Optionally update the resource in DB
    if (resource_id && resource_type) {
      const supabase = createAdminClient();
      const table = resource_type === 'social_post' ? 'social_posts' : 'posts';
      await supabase.from(table).update({
        ai_summary:  enriched.ai_summary,
        ai_tags:     enriched.ai_tags,
        ai_category: enriched.ai_category,
        reading_time: enriched.reading_time,
      }).eq('id', resource_id);
    }

    return ok(enriched);
  } catch (e: any) {
    return err(e.message ?? 'AI enrichment failed', 500);
  }
}
