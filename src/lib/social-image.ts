/**
 * Centralised social-preview image metadata for Bharat Electrosafe.
 *
 * Two parallel copies of each social image exist:
 *   • `src/app/opengraph-image.png` and `src/app/twitter-image.png` —
 *     served at the site root by Next.js App Router file conventions
 *     (auto-emitted as <meta property="og:image"> / <meta name="twitter:image">).
 *   • `public/og/bharat-electrosafe-og-v3.png` and
 *     `public/og/bharat-electrosafe-twitter-v3.png` — explicit versioned
 *     copies served from /og/ with a `-v3` suffix so social-platform
 *     caches (which key on URL) are forced to re-fetch after the 2026
 *     brand logo refresh. These are the URLs declared in `openGraph.images` /
 *     `twitter.images` so crawlers hit the versioned file directly.
 *
 * Both copies are byte-identical 1200×630 PNGs composed from the 2026
 * approved Bharat Electrosafe logo centred on a navy (#0A1B3D) background.
 *
 * Social image URLs always use the canonical domain (bharatelectrosafe.com)
 * so that preview/staging deployments never leak their *.vercel.app host
 * into social metadata. Next.js resolves relative URLs against metadataBase
 * (which is deploymentOrigin), but we provide absolute URLs here so the
 * domain is always canonical regardless of metadataBase.
 *
 * Routes that DO NOT have a product-specific social image should import
 * `siteOgImage` and `siteTwitterImage` and spread them into the route's
 * `openGraph` and `twitter` metadata objects. This guarantees every
 * route shares the same site-wide social card with accurate alt text —
 * Next.js does NOT auto-inherit the file-convention image to child
 * routes when the child route defines its own `openGraph` object
 * (even with `images` omitted), so explicit wiring is required.
 */

import { canonicalOrigin } from '@/lib/site-url';

/**
 * OG image URL — absolute canonical URL so social platforms always
 * reference the production domain, never a staging/preview host.
 * The `-v3` suffix forces social-platform caches to re-fetch after
 * the 2026 brand logo refresh; a future `...-v4.png` rotation is cache-bustable.
 */
export const SITE_OG_IMAGE_URL = `${canonicalOrigin}/og/bharat-electrosafe-og-v3.png`;
/** Twitter image URL — absolute canonical URL, same versioning rationale. */
export const SITE_TWITTER_IMAGE_URL = `${canonicalOrigin}/og/bharat-electrosafe-twitter-v3.png`;

/**
 * Accurate alt text describing the OG/Twitter image contents.
 * Reads naturally to screen readers and social-platform crawlers.
 */
export const SITE_SOCIAL_IMAGE_ALT =
  'Bharat Electrosafe logo — manufacturer of electrical insulating mats, waterproofing, PVC flooring and related industrial products.';

/** OG image dimensions — both files are 1200×630 PNGs. */
export const SITE_SOCIAL_IMAGE_WIDTH = 1200;
export const SITE_SOCIAL_IMAGE_HEIGHT = 630;

/**
 * Site-wide OG image entry — spread into `openGraph.images` on routes
 * without a product-specific image.
 *
 * Uses absolute canonical URL so social platforms always see the
 * production domain, never a staging/preview host.
 *
 * @example
 * import { siteOgImage } from '@/lib/social-image';
 * export const metadata = {
 *   openGraph: { ..., images: [siteOgImage] },
 * };
 */
export const siteOgImage = {
  url: SITE_OG_IMAGE_URL,
  width: SITE_SOCIAL_IMAGE_WIDTH,
  height: SITE_SOCIAL_IMAGE_HEIGHT,
  alt: SITE_SOCIAL_IMAGE_ALT,
} as const;

/**
 * Site-wide Twitter image entry — spread into `twitter.images` on
 * routes without a product-specific image.
 *
 * Uses absolute canonical URL so Twitter card validators always see
 * the production domain.
 *
 * @example
 * import { siteTwitterImage } from '@/lib/social-image';
 * export const metadata = {
 *   twitter: { ..., images: [siteTwitterImage] },
 * };
 */
export const siteTwitterImage = {
  url: SITE_TWITTER_IMAGE_URL,
  width: SITE_SOCIAL_IMAGE_WIDTH,
  height: SITE_SOCIAL_IMAGE_HEIGHT,
  alt: SITE_SOCIAL_IMAGE_ALT,
} as const;
