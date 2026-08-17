/**
 * Next.js Proxy — Canonical Domain Enforcement & Host Redirects.
 *
 * Guarantees that only https://bharatelectrosafe.com is the indexable
 * canonical origin. Non-canonical hosts are redirected.
 *
 * Redirect rules:
 *
 *   1. www.bharatelectrosafe.com → bharatelectrosafe.com  (308)
 *
 * The Vercel production alias (bharat-electrosafe.vercel.app) is NOT
 * redirected so the site is accessible while DNS for
 * bharatelectrosafe.com is not yet pointed at Vercel.
 *
 * Once DNS is configured, the Vercel alias redirect can be re-enabled
 * for SEO deduplication.
 *
 * Safety guards:
 *   - Never redirect localhost / 127.0.0.1 (local development)
 *   - Never redirect Vercel preview deployments (*-git-*.vercel.app)
 *     so they remain usable for QA / PR previews
 *   - Preserve path and query string during redirect
 *   - Use 308 (permanent) to preserve method and preclude redirect loops
 */

import { NextRequest, NextResponse } from 'next/server';

/** The canonical production origin — must match src/lib/site-url.ts */
const CANONICAL_ORIGIN = 'https://bharatelectrosafe.com';
const CANONICAL_HOST = 'bharatelectrosafe.com';

/** Hosts that must redirect to the canonical domain */
const WWW_HOST = 'www.bharatelectrosafe.com';

function shouldRedirectToCanonical(host: string): boolean {
  if (!host) return false;

  // Local development — never redirect
  if (host === 'localhost' || host === '127.0.0.1') return false;

  // Exact canonical host — no redirect needed
  if (host === CANONICAL_HOST) return false;

  // www subdomain — redirect to canonical
  if (host === WWW_HOST) return true;

  // All other hosts (bharat-electrosafe.vercel.app, preview deployments, etc.)
  // — serve the site directly. Do NOT redirect the Vercel alias while
  // bharatelectrosafe.com DNS is not yet pointed at Vercel.
  return false;
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const host = nextUrl.hostname;

  if (shouldRedirectToCanonical(host)) {
    const canonicalUrl = new URL(nextUrl.pathname + nextUrl.search, CANONICAL_ORIGIN);
    return NextResponse.redirect(canonicalUrl, 308);
  }

  return NextResponse.next();
}

/**
 * Matcher — run proxy on all routes except:
 *   - _next/static (static assets)
 *   - _next/image (image optimization)
 *   - favicon.ico and other static files in public/
 *
 * This avoids unnecessary proxy execution on static assets while
 * ensuring all page routes and API routes are covered.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except those starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon-*.png, apple-touch-icon.png
     * - icons/, og/, images/, media/, brand/, documents/ (static public assets)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon-|apple-touch-icon|icons/|og/|images/|media/|brand/|documents/|robots\\.txt|llms\\.txt).*)',
  ],
};
