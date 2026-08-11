import crypto from 'crypto';

// ─── TWITTER HMAC-SHA256 SIGNATURE VALIDATION ──────────────
export function validateTwitterSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

// ─── TWITTER CRC CHALLENGE (account activity API) ──────────
export function twitterCRC(token: string, secret: string): string {
  return 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(token)
    .digest('base64');
}

// ─── LINKEDIN HMAC-SHA256 VALIDATION ───────────────────────
export function validateLinkedInSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature.toLowerCase()),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

// ─── GENERIC BEARER TOKEN ──────────────────────────────────
export function validateBearerToken(
  authHeader: string | null,
  expected: string
): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ─── DEDUP HELPER ──────────────────────────────────────────
export async function isDuplicate(
  platform: string,
  externalId: string,
  supabase: any
): Promise<boolean> {
  const { data } = await supabase
    .from('social_posts')
    .select('id')
    .eq('platform', platform)
    .eq('external_id', externalId)
    .maybeSingle();
  return data !== null;
}

// ─── RETRY WITH EXPONENTIAL BACKOFF ────────────────────────
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500
): Promise<T> {
  let lastError: Error | unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt < maxAttempts) {
        await sleep(baseDelayMs * Math.pow(2, attempt - 1));
      }
    }
  }
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── EXTRACT MEDIA URLS ────────────────────────────────────
export function extractTwitterMedia(tweet: any): string[] {
  const media: string[] = [];
  const attachments = tweet?.attachments?.media_keys ?? [];
  const includes = tweet?.includes?.media ?? [];
  for (const m of includes) {
    if (attachments.includes(m.media_key)) {
      const url = m.url ?? m.preview_image_url;
      if (url) media.push(url);
    }
  }
  return media;
}

export function extractLinkedInMedia(post: any): string[] {
  const media: string[] = [];
  const content = post?.specificContent?.['com.linkedin.ugc.ShareContent'];
  const mediaArr = content?.media ?? [];
  for (const m of mediaArr) {
    if (m?.originalUrl) media.push(m.originalUrl);
  }
  return media;
}

// ─── LOG WEBHOOK ───────────────────────────────────────────
export async function logWebhook(
  supabase: any,
  platform: string,
  eventId: string | null,
  status: 'received' | 'processed' | 'failed' | 'duplicate' | 'skipped',
  payload: any,
  error?: string
): Promise<void> {
  await supabase.from('webhook_logs').insert({
    platform,
    event_id: eventId,
    status,
    payload,
    error: error ?? null,
  }).then(() => {});
}
