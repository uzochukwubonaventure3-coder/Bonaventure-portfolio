import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { enrichContent } from '@/lib/ai/enrichment';
import {
  validateLinkedInSignature,
  isDuplicate,
  extractLinkedInMedia,
  logWebhook,
  withRetry,
} from '@/lib/webhooks/security';
import { uploadImage } from '@/lib/cloudinary';

const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET ?? '';

// ── LinkedIn sends a verification challenge on setup ────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('hub.challenge');
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');

  if (mode === 'subscribe' && token === process.env.LINKEDIN_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ── Incoming LinkedIn Event ─────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-li-signature');
  const supabase = createAdminClient();

  // 1. Validate signature
  if (
    LINKEDIN_CLIENT_SECRET &&
    !validateLinkedInSignature(rawBody, signature, LINKEDIN_CLIENT_SECRET)
  ) {
    await logWebhook(supabase, 'linkedin', null, 'failed', null, 'Invalid signature');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // LinkedIn sends events array
  const events: any[] = payload?.events ?? [payload];
  await logWebhook(supabase, 'linkedin', payload?.requestId, 'received', payload);

  const results = await Promise.allSettled(
    events.map(event => processLinkedInEvent(event, supabase))
  );

  const processed = results.filter(r => r.status === 'fulfilled').length;
  return NextResponse.json({ ok: true, processed });
}

async function processLinkedInEvent(event: any, supabase: any) {
  // Only handle UGC posts / shares
  const eventType = event?.type ?? event?.['com.linkedin.eventType'] ?? '';
  if (!['SHARE_CREATE', 'UGC_POST_CREATE', 'SHARE'].includes(eventType) &&
      !eventType.includes('share') && !eventType.includes('post')) {
    await logWebhook(supabase, 'linkedin', event?.id, 'skipped', event, `Event type: ${eventType}`);
    return;
  }

  // Extract URN as external_id
  const urn = event?.activity ?? event?.id ?? event?.urn ?? '';
  const externalId = urn.split(':').pop() ?? urn;
  if (!externalId) return;

  // 2. Deduplicate
  if (await isDuplicate('linkedin', externalId, supabase)) {
    await logWebhook(supabase, 'linkedin', externalId, 'duplicate', null);
    return;
  }

  // 3. Extract content
  const shareContent = event?.specificContent?.['com.linkedin.ugc.ShareContent'] ??
    event?.content ?? event?.commentary ?? {};
  const textContent = typeof shareContent === 'string'
    ? shareContent
    : (shareContent?.shareCommentary?.text ??
       shareContent?.text ??
       event?.text?.text ??
       event?.message ??
       '');

  if (!textContent) return;

  const externalUrl = `https://www.linkedin.com/feed/update/${urn}`;
  const publishedAt = event?.created?.time
    ? new Date(event.created.time).toISOString()
    : new Date().toISOString();

  // 4. Save media
  const rawMediaUrls = extractLinkedInMedia(event);
  const savedMedia: { url: string; id: string }[] = [];
  for (const url of rawMediaUrls.slice(0, 4)) {
    try {
      const result = await withRetry(() =>
        uploadImage(url, 'misc', `linkedin_${externalId}_${savedMedia.length}`)
      );
      savedMedia.push({ url: result.url, id: result.publicId });
    } catch (e) {
      console.error('[LinkedIn] media upload failed:', e);
    }
  }

  // 5. AI enrichment
  const enriched = await withRetry(() => enrichContent('LinkedIn Post', textContent));

  // 6. Upsert
  const { error } = await supabase.from('social_posts').upsert(
    {
      platform: 'linkedin',
      external_id: externalId,
      content: textContent,
      external_url: externalUrl,
      media_urls: savedMedia.map(m => m.url),
      media_ids: savedMedia.map(m => m.id),
      likes: event?.socialCounts?.numLikes ?? 0,
      reposts: event?.socialCounts?.numShares ?? 0,
      replies: event?.socialCounts?.numComments ?? 0,
      impressions: event?.socialCounts?.numImpressions ?? 0,
      published_at: publishedAt,
      raw_payload: event,
      ai_summary: enriched.ai_summary,
      ai_tags: enriched.ai_tags,
      ai_category: enriched.ai_category,
      ai_seo_desc: enriched.ai_seo_desc,
      reading_time: enriched.reading_time,
    },
    { onConflict: 'platform,external_id' }
  );

  if (error) {
    await logWebhook(supabase, 'linkedin', externalId, 'failed', event, error.message);
    throw new Error(error.message);
  }
  await logWebhook(supabase, 'linkedin', externalId, 'processed', null);
}
