/**
 * Product metadata helper — generates route-specific metadata from the
 * central product registry.
 *
 * Uses the real product name, description and slug. BharatMembrane uses its
 * own verified information and does not inherit BIS insulating-mat claims.
 *
 * Title convention:
 *   - The normal Metadata.title does NOT include the "| Bharat Electrosafe"
 *     suffix because the root layout template (`%s | Bharat Electrosafe`)
 *     appends it automatically. Otherwise we would get
 *     "Electrical Insulating Mats IS 15652:2006 | Bharat Electrosafe | Bharat Electrosafe".
 *   - Open Graph and Twitter receive the final full branded title
 *     (`socialTitle`), because social platforms read the absolute title
 *     and do not apply the root template.
 *   - Product brands such as "BharatMembrane" may remain in product-specific
 *     titles because those are product names, not accidental repetition of
 *     the website suffix.
 */

import type { Metadata } from 'next';
import { ProductData } from '@/data/products';
import { allowIndexing, buildUrl, canonicalOrigin } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { getCanonicalProductPath } from '@/data/product-routes';

/**
 * SEO titles per product slug — specific and factual, not keyword-stuffed.
 * `pageTitle` is the value passed to Metadata.title (the root template will
 * append " | Bharat Electrosafe"). `socialTitle` is the final full branded
 * title used by Open Graph and Twitter.
 */
interface ProductTitleSet {
  pageTitle: string;
  socialTitle: string;
}

const productTitles: Record<string, ProductTitleSet> = {
  'electrical-insulating-mats': {
    pageTitle: 'High Voltage Electrical Insulation Mats to IS 15652:2006',
    socialTitle: 'High Voltage Electrical Insulation Mats to IS 15652:2006 | Bharat Electrosafe',
  },
  'coloured-strip-insulating-mats': {
    pageTitle: 'Coloured Strip Electrical Insulating Mats',
    socialTitle: 'Coloured Strip Electrical Insulating Mats | Bharat Electrosafe',
  },
  'bi-color-insulating-mats': {
    pageTitle: 'Bi-Color Electrical Insulating Mats',
    socialTitle: 'Bi-Color Electrical Insulating Mats | Bharat Electrosafe',
  },
  'auto-glow-reflective-band-insulating-mats': {
    pageTitle: 'Auto-Glow and Reflective Band Insulating Mats',
    socialTitle: 'Auto-Glow and Reflective Band Insulating Mats | Bharat Electrosafe',
  },
  /* Geo Membrane Lining — product brand name updated to public display name */
  'bharat-membrane': {
    pageTitle: 'Geo Membrane Lining PVC Geo-Membrane',
    socialTitle: 'Geo Membrane Lining PVC Geo-Membrane | Bharat Electrosafe',
  },
  'bharat-hydro-seal': {
    pageTitle: 'Water Stop Seal PVC and Rubber Water Stops',
    socialTitle: 'Water Stop Seal PVC and Rubber Water Stops | Bharat Electrosafe',
  },
};

/**
 * Social-card image per product.
 *
 * Chosen separately from the on-page hero because a social card is a wide
 * landscape crop: a portrait or square asset gets letterboxed or cut. Every
 * entry below is landscape, and every one shows the product — the previous
 * BharatMembrane card was the brand logo on a black field, which told a reader
 * nothing about a geomembrane.
 *
 * Products WITHOUT an entry here (e.g. bharat-hydro-seal) fall back to the
 * site-wide OG/Twitter image from `@/lib/social-image` so every product
 * route still gets a complete social card.
 */
const productOgImages: Partial<Record<string, string>> = {
  'electrical-insulating-mats':
    '/media/products/electrical-insulating-mats/gallery/01-blue-coin-mat.webp',
  'coloured-strip-insulating-mats':
    '/media/products/coloured-strip-insulating-mats/gallery/01-yellow-strip-hexa-mat.webp',
  /* The bi-colour set is square; the widest of them crops most gracefully. */
  'bi-color-insulating-mats':
    '/media/products/bi-color-insulating-mats/gallery/04-layer-cross-section.webp',
  'auto-glow-reflective-band-insulating-mats':
    '/media/products/auto-glow-reflective-band-insulating-mats/gallery/01-reflective-bands-daylight.webp',
  'bharat-membrane':
    '/media/products/bharat-membrane/gallery/01-tunnel-membrane-lining.webp',
};

/**
 * Generate a full Metadata object for a product page from the central
 * product data. Returns not-found metadata for invalid slugs.
 *
 * When a product has a dedicated social-card image (see `productOgImages`),
 * both `openGraph.images` and `twitter.images` use that product-specific
 * asset. When no product-specific image exists (e.g. bharat-hydro-seal),
 * both fall back to the site-wide OG/Twitter image from
 * `@/lib/social-image` so the route always has a complete social card.
 */
export function generateProductMetadata(product: ProductData): Metadata {
  const slug = product.slug;
  const titleSet = productTitles[slug] ?? {
    pageTitle: product.name,
    socialTitle: `${product.name} | Bharat Electrosafe`,
  };
  const description = product.description;
  const canonicalPath = getCanonicalProductPath(slug);
  const canonicalUrl = buildUrl(canonicalPath);
  const ogImage = productOgImages[slug];

  const ogImages = ogImage
    ? [
        {
          url: `${canonicalOrigin}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${product.name} — ${description}`,
        },
      ]
    : [siteOgImage];
  // Twitter image — when a product-specific image exists, wrap it as an
  // object so `twitter:image:alt` is emitted alongside `twitter:image`.
  // Without alt, screen-reader users browsing Twitter link previews get
  // no description of the image.
  const twitterImages = ogImage
    ? [
        {
          url: `${canonicalOrigin}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${product.name} — ${description}`,
        },
      ]
    : [siteTwitterImage];

  return {
    title: titleSet.pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleSet.socialTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleSet.socialTitle,
      description,
      images: twitterImages,
    },
    robots: allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
