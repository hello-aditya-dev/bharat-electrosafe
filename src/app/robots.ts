/**
 * Next.js Metadata API — robots.
 *
 * Indexing is gated by ALLOW_INDEXING (server-only). Defaults to off
 * (false) for local, preview and staging. When enabled (true) only
 * in the production environment, public content is allowed for
 * crawling and the production sitemap URL is exposed.
 *
 * When indexing is disabled, robots.txt disallows all crawling and
 * page-level metadata emits noindex/nofollow — this prevents search
 * engines from accidentally indexing non-production URLs.
 *
 * API routes and internal paths are always disallowed regardless of
 * indexing state.
 *
 * robots.txt and page-level robots metadata must agree:
 * - Production: robots.txt allows public routes; page metadata allows index.
 * - Preview/staging: robots.txt disallows all; page metadata noindex.
 */

import type { MetadataRoute } from 'next';
import { siteUrl, allowIndexing } from '@/lib/site-url';

const sitemapUrl = `${siteUrl}/sitemap.xml`;

export default function robots(): MetadataRoute.Robots {
  if (allowIndexing) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
          ],
        },
      ],
      sitemap: sitemapUrl,
      host: siteUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    /* When indexing is disabled, do not expose the sitemap URL —
       it would point crawlers at pages that are noindex. */
  };
}
