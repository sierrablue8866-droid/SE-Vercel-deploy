import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsHeaders } from '@/lib/server/cors';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

/**
 * Edge proxy (middleware.ts).
 * Concerns:
 * 0. Host split & RBAC Session Protection for /admin routes.
 * 1. CORS for /api routes.
 * 2. Shared-secret gate for internal automation routes (/api/orchestrate).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminHost = process.env.ADMIN_HOST;
  const requestHost = request.headers.get('host') ?? request.nextUrl.hostname;
  const onAdminHost = Boolean(adminHost) && requestHost === adminHost;

  // 0a) On the admin host, the console IS the site: rewrite root to /admin
  if (onAdminHost && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // 0b) Admin route protection & host split
  if (pathname.startsWith('/admin')) {
    if (adminHost && !onAdminHost) {
      const url = new URL(request.url);
      url.hostname = adminHost;
      url.protocol = 'https:';
      url.port = '';
      return NextResponse.redirect(url, 307);
    }

    // Allow /admin/login without session verification
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Guard all other /admin routes with RBAC session token
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  // 1) Answer CORS preflight immediately for any /api route.
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    return new NextResponse(null, { status: 204, headers: cors });
  }

  // 2) Shared-secret gate — internal automation route(s) only.
  if (pathname.startsWith('/api/orchestrate')) {
    const inboundSecretHeader = request.headers.get('X-SBR-SECRET-KEY');
    const systemSecureToken = process.env.SBR_SECRET_KEY;

    // Token configured but missing/mismatched → block. No token (local dev) → allow.
    if (systemSecureToken && inboundSecretHeader !== systemSecureToken) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid or missing X-SBR-SECRET-KEY' }),
        { status: 401, headers: { 'content-type': 'application/json', ...cors } }
      );
    }
  }

  // 3) Forward the request, attaching CORS headers to the response.
  const res = NextResponse.next();
  for (const [key, value] of Object.entries(cors)) res.headers.set(key, value);
  return res;
}

// Matches the root (admin-host rewrite), every /api route (CORS) and every
// /admin route (host split). The secret gate inside the handler still
// restricts itself to /api/orchestrate — do NOT move that check into the
// matcher, or public/cron/webhook routes break.
export const config = { matcher: ['/', '/api/:path*', '/admin/:path*'] };
