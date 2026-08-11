import { createAdminClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('posts').select('tags').eq('published', true);
    if (error) return err(error.message, 500);
    const all = (data ?? []).flatMap((r: { tags: string[] }) => r.tags ?? []);
    const unique = [...new Set(all)].sort();
    return ok(unique);
  } catch (e: any) {
    return err(e.message, 500);
  }
}
