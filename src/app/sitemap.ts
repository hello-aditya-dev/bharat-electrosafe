/**
 * Next.js Metadata API — sitemap.
 *
 * Contains all valid public routes: homepage, about, contact and
 * every product page. Uses the central site URL helper and the
 * canonical product-route resolver so that every entry resolves
 * against the official production domain using canonical paths only.
 *
 * When indexing is disabled, returns an empty array so that no
 * misleading production URLs are exposed from staging/preview.
 *
 * lastModified is intentionally omitted — we do not falsely tell search
 * engines that every page changes on every deployment. If reliable
 * content-modification dates become available in future, they can be
 * added per-entry.
 */

import type { MetadataRoute } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { products } from '@/data/products';
import { getCanonicalProductPath, productRoutes } from '@/data/product-routes';

const staticPages: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/products', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.8, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // When indexing is disabled, do not expose a misleading production sitemap
  if (!allowIndexing) {
    return [];
  }

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: buildUrl(path),
      changeFrequency,
      priority,
    }),
  );

  // Build product entries from the canonical route manifest.
  // This replaces the old `/products/${slug}` anti-pattern and ensures
  // nested routes (e.g. /products/electrical-insulating-mats/auto-glow-...)
  // are correctly represented.
  const seenUrls = new Set<string>();
  const productEntries: MetadataRoute.Sitemap = [];

  // Add all routes from the product route manifest (excluding the bare /products hub
  // which is already in staticPages).
  for (const route of productRoutes) {
    if (route.canonicalPath === '/products') continue; // already in staticPages
    const url = buildUrl(route.canonicalPath);
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      productEntries.push({
        url,
        changeFrequency: 'monthly',
        priority: route.canonicalPath.startsWith('/products/electrical-insulating-mats/') ? 0.8 : 0.8,
      });
    }
  }

  // Also add any products from the registry that aren't covered by the route manifest
  // (safety net — should be rare).
  for (const product of products) {
    const url = buildUrl(getCanonicalProductPath(product.slug));
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      productEntries.push({
        url,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return [...staticEntries, ...productEntries];
}
