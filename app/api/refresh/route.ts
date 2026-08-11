import { NextRequest, NextResponse } from 'next/server';
import { validateBearerToken } from '@/lib/webhooks/security';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!validateBearerToken(auth, process.env.WEBHOOK_SECRET_TOKEN ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath('/');
  revalidatePath('/blog');
  return NextResponse.json({ ok: true, revalidated: true });
}
