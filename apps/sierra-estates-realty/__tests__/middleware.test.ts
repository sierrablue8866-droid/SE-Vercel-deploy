/**
<<<<<<< HEAD
 * Tests: Edge Proxy (proxy.ts)
 *
 * Target architecture (INTEGRATION.md — two-domain host split):
 *   - CLIENT host (sierra-estates.net): serves the public site; /admin
 *     requests are 307-redirected to the admin host when ADMIN_HOST is set.
 *   - ADMIN host (admin.sierra-estates.net): the root `/` is rewritten to
 *     /admin so the console is served directly on its own domain.
 *   - Single-deployment mode (no ADMIN_HOST): /admin renders locally — the
 *     split is entirely inert.
 *
 * The proxy also handles:
 *   1. CORS preflight for /api routes
 *   2. Shared-secret gate on /api/orchestrate
 */
import { NextRequest } from 'next/server';
import { config, middleware } from '../middleware';

const ORIGINAL_SBR = process.env.SBR_SECRET_KEY;
const ORIGINAL_ADMIN_HOST = process.env.ADMIN_HOST;

function request(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(url, init as any);
}

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

afterEach(() => {
  restore('SBR_SECRET_KEY', ORIGINAL_SBR);
  restore('ADMIN_HOST', ORIGINAL_ADMIN_HOST);
});

describe('proxy config', () => {
  it('matches the root, /api and /admin routes', () => {
    expect(config.matcher).toEqual(['/', '/api/:path*', '/admin/:path*']);
  });
});

describe('proxy — admin / public host split', () => {
  it('redirects /admin on the client host to the admin host (307)', () => {
    process.env.ADMIN_HOST = 'admin.sierra-estates.net';
    const res = middleware(request('https://sierra-estates.net/admin'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://admin.sierra-estates.net/admin');
  });

  it('serves /admin as-is on the admin host', () => {
    process.env.ADMIN_HOST = 'admin.sierra-estates.net';
    const res = middleware(request('https://admin.sierra-estates.net/admin'));
=======
 * Tests: Admin Host Routing Proxy (proxy.ts)
 *
 * The middleware splits one codebase across two domains: when ADMIN_HOST is
 * set, /admin/* requests on the public domain are 307-redirected to the admin
 * host. Without ADMIN_HOST the middleware is inert (single-deploy topology).
 */
import { NextRequest } from 'next/server';
import { config, proxy as middleware } from '../proxy';

const ADMIN_HOST = 'admin.sierra-estates.net';
const ORIGINAL_ADMIN_HOST = process.env.ADMIN_HOST;

function request(url: string): NextRequest {
  return new NextRequest(url);
}

afterEach(() => {
  if (ORIGINAL_ADMIN_HOST === undefined) {
    delete process.env.ADMIN_HOST;
  } else {
    process.env.ADMIN_HOST = ORIGINAL_ADMIN_HOST;
  }
});

describe('middleware — ADMIN_HOST unset (single-deploy topology)', () => {
  beforeEach(() => {
    delete process.env.ADMIN_HOST;
  });

  describe('middleware config', () => {
    it('matches admin routes and API routes', () => {
      expect(config.matcher).toEqual(['/api/:path*', '/admin/:path*']);
    });
  });

  it('passes /admin requests through untouched', () => {
    const res = middleware(request('https://sierra-estates.net/admin/leads'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes public routes through untouched', () => {
    const res = middleware(request('https://sierra-estates.net/listings'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});

describe('middleware — ADMIN_HOST set (host-split topology)', () => {
  beforeEach(() => {
    process.env.ADMIN_HOST = ADMIN_HOST;
  });

  it('307-redirects public-domain /admin requests to the admin host', () => {
    const res = middleware(request('https://sierra-estates.net/admin'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(`https://${ADMIN_HOST}/admin`);
  });

  it('preserves the path and query string on redirect', () => {
    const res = middleware(
      request('https://sierra-estates.net/admin/intelligence-os?tab=agents'),
    );
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(
      `https://${ADMIN_HOST}/admin/intelligence-os?tab=agents`,
    );
  });

  it('serves /admin normally on the admin host itself', () => {
    const res = middleware(request(`https://${ADMIN_HOST}/admin/leads`));
>>>>>>> origin/client
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

<<<<<<< HEAD
  it('rewrites the admin-host root `/` to /admin', () => {
    process.env.ADMIN_HOST = 'admin.sierra-estates.net';
    const res = middleware(request('https://admin.sierra-estates.net/'));
    const rewrite = res.headers.get('x-middleware-rewrite');
    expect(rewrite).toContain('/admin');
  });

  it('leaves the client-host root `/` untouched', () => {
    process.env.ADMIN_HOST = 'admin.sierra-estates.net';
    const res = middleware(request('https://sierra-estates.net/'));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
    expect(res.headers.get('location')).toBeNull();
  });

  it('is fully inert in single-deployment mode (no ADMIN_HOST)', () => {
    delete process.env.ADMIN_HOST;
    const admin = middleware(request('https://example.com/admin'));
    expect(admin.status).toBe(200);
    expect(admin.headers.get('location')).toBeNull();
    const root = middleware(request('https://example.com/'));
    expect(root.status).toBe(200);
    expect(root.headers.get('x-middleware-rewrite')).toBeNull();
  });
});

describe('proxy — CORS preflight', () => {
  it('answers OPTIONS /api with 204', () => {
    const res = middleware(
      request('https://sierra-estates.net/api/listings', { method: 'OPTIONS' }),
    );
    expect(res.status).toBe(204);
  });

  it('does not hijack OPTIONS on non-api routes', () => {
    const res = middleware(
      request('https://sierra-estates.net/', { method: 'OPTIONS' }),
    );
    expect(res.status).toBe(200);
  });
});

describe('proxy — /api/orchestrate shared-secret gate', () => {
  beforeEach(() => {
    process.env.SBR_SECRET_KEY = 'test-secret';
  });

  it('blocks /api/orchestrate without X-SBR-SECRET-KEY', () => {
    const res = middleware(
      request('https://sierra-estates.net/api/orchestrate', { method: 'POST' }),
    );
    expect(res.status).toBe(401);
  });

  it('blocks /api/orchestrate with wrong X-SBR-SECRET-KEY', () => {
    const res = middleware(
      request('https://sierra-estates.net/api/orchestrate', {
        method: 'POST',
        headers: { 'X-SBR-SECRET-KEY': 'wrong' },
      }),
    );
    expect(res.status).toBe(401);
  });

  it('allows /api/orchestrate with correct X-SBR-SECRET-KEY', () => {
    const res = middleware(
      request('https://sierra-estates.net/api/orchestrate', {
        method: 'POST',
        headers: { 'X-SBR-SECRET-KEY': 'test-secret' },
      }),
    );
    expect(res.status).toBe(200);
  });

  it('allows /api/orchestrate when SBR_SECRET_KEY is unset (local dev)', () => {
    delete process.env.SBR_SECRET_KEY;
    const res = middleware(
      request('https://sierra-estates.net/api/orchestrate', { method: 'POST' }),
    );
    expect(res.status).toBe(200);
  });
=======
  it('leaves non-admin public routes alone', () => {
    const res = middleware(request('https://sierra-estates.net/about'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
>>>>>>> origin/client
});
