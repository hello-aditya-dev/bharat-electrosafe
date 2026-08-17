/**
 * Central site URL helper — single source for all URL construction.
 *
 * Every canonical, sitemap entry, robots.txt host, Open Graph URL and
 * JSON-LD url field must route through this module. No component, page
 * or data file may build production URLs independently.
 *
 * ── canonicalOrigin vs deploymentOrigin ──
 *
 * The two concepts are deliberately separated:
 *
 *   • `canonicalOrigin` — the permanent public domain. Hardcoded to
 *     `https://bharatelectrosafe.com`. Used in canonical <link>,
 *     sitemap <loc>, robots host, JSON-LD url, Open Graph url. Never
 *     varies by deployment — even a preview deployment must claim the
 *     real public domain as its canonical so search engines consolidate
 *     ranking signals on the right URL.
 *
 *   • `deploymentOrigin` — the origin the current deployment is actually
 *     reachable at. Resolved from `NEXT_PUBLIC_SITE_URL`, then
 *     `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, then the
 *     canonical origin as a final fallback. Used for metadataBase (so
 *     relative OG image URLs resolve against the deployment that
 *     actually serves them) and for the contact-form origin allow-list.
 *
 * On a production deployment where `NEXT_PUBLIC_SITE_URL` is set to the
 * canonical domain, the two are identical. On a preview deployment they
 * diverge — canonical stays on the real domain, deployment points at
 * `*.vercel.app`.
 *
 * ── Indexing guard ──
 *
 * Indexing is enabled ONLY when ALL of the following are true:
 *
 *   1. ALLOW_INDEXING === 'true' (server-only env var, not exposed to browser)
 *      Backwards compatible: also checks NEXT_PUBLIC_ALLOW_INDEXING if
 *      ALLOW_INDEXING is not set.
 *   2. The canonical origin is exactly https://bharatelectrosafe.com
 *      (always true — `canonicalOrigin` is hardcoded)
 *   3. The deployment is production (VERCEL_ENV === 'production'),
 *      or VERCEL_ENV is unset (local development / non-Vercel hosting
 *      where the operator is responsible for setting the env correctly)
 *   4. The request host matches the canonical domain (enforced by
 *      middleware which redirects non-canonical hosts)
 *
 * This prevents a preview deployment from becoming indexable even if
 * ALLOW_INDEXING=true is accidentally inherited from the Production
 * environment, because preview deployments have
 * VERCEL_ENV === 'preview' (condition 3 fails).
 *
 * By using a server-only ALLOW_INDEXING variable (no NEXT_PUBLIC_ prefix),
 * the indexing configuration is not exposed in browser bundles, making it
 * harder to misconfigure accidentally.
 */

/** The official production domain — hardcoded as the canonical origin. */
export const canonicalOrigin = 'https://bharatelectrosafe.com';

/**
 * Backwards-compatible alias. Older imports reference `PRODUCTION_DOMAIN`;
 * kept so external consumers don't break. New code should prefer
 * `canonicalOrigin` for clarity.
 */
export const PRODUCTION_DOMAIN = canonicalOrigin;

/**
 * Normalise a raw origin string: trim, strip trailing slashes, accept
 * values with or without a protocol. Returns null for empty / unparseable
 * input so callers can fall through to the next candidate.
 */
function normaliseOrigin(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

/**
 * The origin the current deployment is actually reachable at.
 *
 * Resolution order (first non-empty, parseable value wins):
 *   1. NEXT_PUBLIC_SITE_URL           (explicit operator override)
 *   2. VERCEL_PROJECT_PRODUCTION_URL  (production alias, e.g. project.vercel.app)
 *   3. VERCEL_URL                     (per-deployment URL, e.g. project-xyz.vercel.app)
 *   4. canonicalOrigin                (final fallback so metadataBase is never empty)
 *
 * VERCEL_PROJECT_PRODUCTION_URL is preferred over VERCEL_URL because the
 * production alias is stable across deployments, while VERCEL_URL changes
 * on every commit. Using the stable alias makes cached OG image URLs
 * remain valid across redeploys.
 */
export const deploymentOrigin: string =
  normaliseOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  normaliseOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normaliseOrigin(process.env.VERCEL_URL) ??
  canonicalOrigin;

/**
 * The site URL — used for canonical <link>, sitemap <loc>, robots host,
 * JSON-LD @id/url, and Open Graph url. Aliased to `canonicalOrigin` so
 * that preview deployments never claim their *.vercel.app URL as the
 * canonical origin in any structured metadata.
 *
 * The deployment origin (for metadataBase / OG image URL resolution
 * against the actual serving deployment) is exported separately as
 * `deploymentOrigin` — see `buildDeploymentUrl` for the helper that
 * routes through it.
 */
export const siteUrl: string = canonicalOrigin;

/**
 * Whether the current deployment is a Vercel production deployment.
 * VERCEL_ENV is set by Vercel to 'production', 'preview', or 'development'.
 * When VERCEL_ENV is unset (local dev or non-Vercel hosting), we treat it
 * as 'production' so the operator controls indexing via ALLOW_INDEXING
 * alone.
 */
const isVercelProduction =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

/**
 * Resolve the indexing flag from environment.
 *
 * Prefers the server-only ALLOW_INDEXING variable. Falls back to
 * NEXT_PUBLIC_ALLOW_INDEXING for backwards compatibility with existing
 * Vercel deployments that have already set NEXT_PUBLIC_ALLOW_INDEXING.
 *
 * Both are checked so a migration from NEXT_PUBLIC_ALLOW_INDEXING to
 * ALLOW_INDEXING is seamless — set the new variable in Vercel, then
 * optionally remove the old one.
 */
function resolveIndexingFlag(): boolean {
  // Server-only variable takes priority (not exposed to browser)
  if (process.env.ALLOW_INDEXING !== undefined) {
    return process.env.ALLOW_INDEXING === 'true';
  }
  // Backwards compatibility: fall back to public variable
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
}

/**
 * Whether indexing is enabled. Triple-gated so that no single
 * misconfiguration can expose a non-production deployment:
 *
 *   1. ALLOW_INDEXING === 'true' (explicit opt-in, server-only)
 *   2. canonicalOrigin is the official domain (always true — hardcoded)
 *   3. VERCEL_ENV is 'production' or unset (not a Vercel preview)
 *
 * Defaults to false for local, preview and staging environments.
 */
export const allowIndexing: boolean =
  resolveIndexingFlag() && isVercelProduction;

/**
 * Build an absolute URL against the canonical origin — used for canonical
 * <link>, sitemap <loc>, robots host, and JSON-LD url fields.
 *
 * ALWAYS routes through `canonicalOrigin`, never `deploymentOrigin`, so
 * preview deployments never claim their *.vercel.app URL as canonical.
 *
 * @param path — route path, e.g. '/', '/about-us', '/products/electrical-insulating-mats'
 * @returns absolute canonical URL, e.g. 'https://bharatelectrosafe.com/about-us'
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') return canonicalOrigin;
  return `${canonicalOrigin}${cleanPath}`;
}

/**
 * Build an absolute URL against the deployment origin — used for
 * metadataBase-relative URLs (OG image, Twitter image) that must resolve
 * against the deployment that actually serves them.
 *
 * In production where deploymentOrigin === canonicalOrigin, this returns
 * canonical URLs. In preview deployments, it returns the preview URL so
 * social platforms can actually fetch the image.
 *
 * @param path — route path, e.g. '/opengraph-image.png'
 * @returns absolute deployment URL
 */
export function buildDeploymentUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') return deploymentOrigin;
  return `${deploymentOrigin}${cleanPath}`;
}

/**
 * Backwards-compatible alias for `buildCanonicalUrl`. Older imports
 * reference `buildUrl`; kept so external consumers don't break. New code
 * should prefer `buildCanonicalUrl` for clarity.
 */
export function buildUrl(path: string): string {
  return buildCanonicalUrl(path);
}
