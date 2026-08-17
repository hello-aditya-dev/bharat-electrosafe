/**
 * Origin validation utilities for cross-site form protection.
 *
 * Origins are compared exactly — substring/startsWith matching is never used.
 * The allow-list is built from environment variables so that preview deploys
 * and local development work without code changes.
 *
 * The canonical production domain is always included as an allowed origin,
 * even if it differs from the deployment origin (e.g. on preview deploys).
 * The www subdomain is also allowed so that form submissions from
 * www.bharatelectrosafe.com are accepted (middleware redirects www to
 * non-www, but the browser may submit from the www origin before the
 * redirect completes).
 */

/** The canonical production origin */
const CANONICAL_ORIGIN = 'https://bharatelectrosafe.com';
/** The www variant — accepted for origin validation (redirected by middleware) */
const WWW_ORIGIN = 'https://www.bharatelectrosafe.com';

/**
 * Parse a raw header value (origin, referer, etc.) and return its origin.
 * Returns null if the value is empty or not a valid URL.
 */
export function parseOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Build the list of origins that are allowed to submit the contact form.
 * Computed fresh on every call so environment changes (preview deploys,
 * local dev) are picked up without module-level caching.
 */
export function getAllowedOrigins(): string[] {
  const allowed = new Set<string>();

  // Always allow the canonical production domain
  allowed.add(CANONICAL_ORIGIN);

  // Always allow the www variant (middleware redirects it, but form
  // submissions may originate from www before redirect)
  allowed.add(WWW_ORIGIN);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const parsed = parseOrigin(siteUrl);
    if (parsed) allowed.add(parsed);
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    // VERCEL_URL comes in as "project-xyz.vercel.app" (no protocol).
    const withProtocol = /^https?:\/\//i.test(vercelUrl)
      ? vercelUrl
      : `https://${vercelUrl}`;
    const parsed = parseOrigin(withProtocol);
    if (parsed) allowed.add(parsed);
  }

  // Production alias (e.g. "bharat-electrosafe.vercel.app") — distinct from
  // the per-deployment VERCEL_URL. Without this, form submissions from the
  // production alias are rejected even though they are legitimate.
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl) {
    const withProtocol = /^https?:\/\//i.test(vercelProdUrl)
      ? vercelProdUrl
      : `https://${vercelProdUrl}`;
    const parsed = parseOrigin(withProtocol);
    if (parsed) allowed.add(parsed);
  }

  if (process.env.NODE_ENV !== 'production') {
    allowed.add('http://localhost:3000');
  }

  return Array.from(allowed);
}

/**
 * Exact-origin comparison. Rejects null and any value whose parsed origin
 * is not in the allow-list. Never uses substring/startsWith matching.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  const parsed = parseOrigin(origin);
  if (!parsed) return false;
  return getAllowedOrigins().includes(parsed);
}
