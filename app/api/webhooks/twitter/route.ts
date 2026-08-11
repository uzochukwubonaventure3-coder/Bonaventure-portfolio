import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { enrichContent } from '@/lib/ai/enrichment';
import {
  validateTwitterSignature,
  twitterCRC,
  isDuplicate,
  extractTwitterMedia,
  logWebhook,
  withRetry,
} from '@/lib/webhooks/security';
import { uploadImage } from '@/lib/cloudinary';

const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET ?? '';
const WEBHOOK_TOKEN = process.env.WEBHOOK_SECRET_TOKEN ?? '';

// ── CRC Challenge (Twitter verifies your endpoint) ──────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crc = searchParams.get('crc_token');
  if (!crc) {
    return NextResponse.json({ error: 'Missing crc_token' }, { status: 400 });
  }
  const response_token = twitterCRC(crc, TWITTER_CONSUMER_SECRET);
  return NextResponse.json({ response_token });
}

// ── Incoming Tweet Webhook ───────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-twitter-webhooks-signature');
  const supabase = createAdminClient();

  // 1. Validate signature
  if (
    TWITTER_CONSUMER_SECRET &&
    !validateTwitterSignature(rawBody, signature, TWITTER_CONSUMER_SECRET)
  ) {
    await logWebhook(supabase, 'twitter', null, 'failed', null, 'Invalid signature');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  await logWebhook(supabase, 'twitter', payload?.for_user_id, 'received', payload);

  // 2. Extract tweets from payload
  const tweets: any[] = [
    ...(payload?.tweet_create_events ?? []),
    ...(payload?.quoted_tweet?.data ? [payload.quoted_tweet] : []),
  ].filter(Boolean);

  if (tweets.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  const results = await Promise.allSettled(
    tweets.map(tweet => processTweet(tweet, payload, supabase))
  );

  const processed = results.filter(r => r.status === 'fulfilled').length;
  return NextResponse.json({ ok: true, processed });
}

async function processTweet(tweet: any, payload: any, supabase: any) {
  const externalId = tweet.id_str ?? tweet.id?.toString();
  if (!externalId) return;

  // 3. Deduplicate
  if (await isDuplicate('twitter', externalId, supabase)) {
    await logWebhook(supabase, 'twitter', externalId, 'duplicate', null);
    return;
  }

  // Skip retweets
  if (tweet.retweeted_status) return;

  const content = tweet.full_text ?? tweet.text ?? '';
  const externalUrl = `https://twitter.com/i/web/status/${externalId}`;
  const publishedAt = tweet.created_at
    ? new Date(tweet.created_at).toISOString()
    : new Date().toISOString();

  // 4. Save media to Cloudinary
  const rawMediaUrls = extractTwitterMedia(tweet);
  const photoUrls = (tweet.extended_entities?.media ?? tweet.entities?.media ?? [])
    .filter((m: any) => m.type === 'photo')
    .map((m: any) => m.media_url_https as string);
  const allMedia = [...new Set([...rawMediaUrls, ...photoUrls])];

  const savedMedia: { url: string; id: string }[] = [];
  for (const url of allMedia.slice(0, 4)) {
    try {
      const result = await withRetry(() =>
        uploadImage(url, 'misc', `twitter_${externalId}_${savedMedia.length}`)
      );
      savedMedia.push({ url: result.url, id: result.publicId });
    } catch (e) {
      console.error('[Twitter] media upload failed:', e);
    }
  }

  // 5. AI enrichment
  const enriched = await withRetry(() => enrichContent('Twitter Post', content));

  // 6. Upsert to DB
  const { error } = await supabase.from('social_posts').upsert(
    {
      platform: 'twitter',
      external_id: externalId,
      content,
      external_url: externalUrl,
      media_urls: savedMedia.map(m => m.url),
      media_ids: savedMedia.map(m => m.id),
      likes: tweet.favorite_count ?? 0,
      reposts: tweet.retweet_count ?? 0,
      replies: tweet.reply_count ?? 0,
      impressions: tweet.impression_count ?? 0,
      published_at: publishedAt,
      raw_payload: tweet,
      ai_summary: enriched.ai_summary,
      ai_tags: enriched.ai_tags,
      ai_category: enriched.ai_category,
      ai_seo_desc: enriched.ai_seo_desc,
      reading_time: enriched.reading_time,
    },
    { onConflict: 'platform,external_id' }
  );

  if (error) {
    await logWebhook(supabase, 'twitter', externalId, 'failed', tweet, error.message);
    throw new Error(error.message);
  }

  await logWebhook(supabase, 'twitter', externalId, 'processed', null);
}
