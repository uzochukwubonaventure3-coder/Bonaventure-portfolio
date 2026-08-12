import { NextRequest } from 'next/server';
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/server';
import { err, ok, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

const KEYS = ['more_links', 'more_uses', 'more_gallery', 'more_bucket_list'] as const;

export async function GET() {
  if (!hasSupabaseAdminEnv()) return ok({});
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('site_settings').select('key,value').in('key', KEYS as unknown as string[]);
  if (error) return err(error.message, 500);
  return ok((data ?? []).reduce((result: Record<string, unknown>, row: { key: string; value: string }) => {
    try { result[row.key] = JSON.parse(row.value); } catch { result[row.key] = []; }
    return result;
  }, {}));
}

export async function PUT(req: NextRequest) {
  if (!await requireAuth(req)) return unauthorized();
  try {
    const body = await req.json();
    const rows = KEYS.filter(key => key in body).map(key => ({ key, value: JSON.stringify(body[key]) }));
    if (!rows.length) return err('No content supplied');
    const supabase = createAdminClient();
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) return err(error.message, 500);
    return ok({ message: 'More content saved' });
  } catch (error: any) { return err(error.message, 500); }
}
