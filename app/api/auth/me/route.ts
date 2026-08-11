import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ok, unauthorized } from '@/lib/api';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  return ok(session);
}

export async function DELETE() {
  const response = ok({ message: 'Logged out' });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
