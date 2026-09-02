import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
);

// Security headers on every response
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

function withHeaders(res: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token =
    req.cookies.get('admin_token')?.value ??
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return false;
  try {
    await jwtVerify(token, ADMIN_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!(await isAuthenticated(request))) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return withHeaders(NextResponse.redirect(url));
    }
  }

  return withHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|site.webmanifest|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)',
  ],
};
