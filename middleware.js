/**
 * Vercel Edge Middleware — Server-side sh_uid cookie
 *
 * Sets a persistent, HttpOnly sh_uid cookie that survives Safari ITP
 * (client-side cookies are limited to 7 days; server-set HttpOnly cookies are not).
 *
 * Behavior:
 * - If sh_uid cookie exists → refresh expiry, pass value via x-sh-uid header
 * - If sh_uid cookie missing → generate UUID v4, set cookie + header
 * - Respects existing client-side _sh_uid cookies (reads that value if present)
 * - Only runs on page requests (skips /api/*, static assets, etc.)
 */

import { next } from '@vercel/functions';

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /api/*          (API routes)
     * - /_next/*        (Next.js/Vercel internals)
     * - /_vercel/*      (Vercel internals)
     * - /fonts/*        (static fonts)
     * - /images/*       (static images)
     * - /blog/*         (if static assets)
     * - Files with common static extensions
     */
    '/((?!api/|_next/|_vercel/|fonts/|images/|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|css|js|map|woff2?|ttf|eot|xml|txt|json)$).*)',
  ],
};

/**
 * Parse cookies from a Request's Cookie header.
 * Returns a Map of cookie name → value.
 */
function parseCookies(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = new Map();
  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) cookies.set(name.trim(), rest.join('=').trim());
  }
  return cookies;
}

export default function middleware(request) {
  const cookies = parseCookies(request);

  // Check both server-side "sh_uid" and legacy client-side "_sh_uid"
  const existingServerUid = cookies.get('sh_uid');
  const existingClientUid = cookies.get('_sh_uid');

  // Priority: server-side sh_uid > client-side _sh_uid > generate new
  const uid = existingServerUid || existingClientUid || crypto.randomUUID();

  // Build Set-Cookie header for HttpOnly server-side cookie (1-year expiry)
  const serverCookie = [
    `sh_uid=${uid}`,
    'Path=/',
    'Max-Age=31536000',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ].join('; ');

  const setCookies = [serverCookie];

  // If we adopted the value from the client-side _sh_uid cookie, clear it
  // to avoid a stale duplicate. The server-side HttpOnly cookie is now
  // the single source of truth.
  if (existingClientUid) {
    setCookies.push('_sh_uid=; Path=/; Max-Age=0; Secure; SameSite=Lax');
  }

  return next({
    headers: {
      'Set-Cookie': setCookies.join(', '),
      'x-sh-uid': uid,
    },
  });
}
