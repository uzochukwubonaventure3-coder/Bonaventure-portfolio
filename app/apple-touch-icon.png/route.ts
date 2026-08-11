import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/favicon.svg', req.url), 308);
}
