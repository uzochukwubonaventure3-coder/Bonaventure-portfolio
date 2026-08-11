import { NextRequest } from 'next/server';
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasSupabaseAdminEnv()) return ok({});

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) return err(error.message, 500);
  const map = (data ?? []).reduce((acc: Record<string,string>, r: any) => { acc[r.key] = r.value; return acc; }, {});
  return ok(map);
}

export async function PUT(req: NextRequest) {
  const admin = await requireAuth(req);
  if (!admin) return unauthorized();
  try {
    const updates: Record<string, string> = await req.json();
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
    const supabase = createAdminClient();
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) return err(error.message, 500);
    return ok({ message: 'Settings updated' });
  } catch (e: any) {
    return err(e.message, 500);
  }
}
