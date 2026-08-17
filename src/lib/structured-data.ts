/**
 * Structured Data (JSON-LD) — Centralised utility for Bharat Electrosafe.
 *
 * SEO strategy (spec section 17):
 *
 *   - Homepage emits Organization + WebSite only. LocalBusiness is omitted
 *     because the registered-office address is not independently verified
 *     as a customer-facing premises, and the spec forbids emitting
 *     conflicting Organization + LocalBusiness entities.
 *   - Products hub emits CollectionPage + ItemList + BreadcrumbList.
 *   - Product pages emit WebPage + BreadcrumbList. The previous Product
 *     schema is replaced with WebPage because the site is quotation-led
 *     with no public fixed price, availability or review data — emitting
 *     Product without an Offer triggers Google Rich Results errors.
 *   - FAQPage structured data is removed entirely. Google removed FAQ
 *     rich-result display in 2026, and obsolete FAQ schema provides no
 *     meaningful search-result benefit. Visible FAQ content is retained.
 *   - No fake prices, ratings, reviews, SKUs, GTINs, MPNs, stock status,
 *     shipping data, or offer expiry dates are ever emitted.
 *
 * Entity IDs use the production domain and stable fragment identifiers so
 * that Google can merge entities across pages.
 */

import { siteUrl, buildUrl } from '@/lib/site-url';
import { company, phones } from '@/data/company';
import {
  products,
  type ProductData,
} from '@/data/products';
import { getCanonicalProductPath, getProductBreadcrumb } from '@/data/product-routes';

/* ────────────────────────────────────────────
   Stable entity IDs
   ──────────────────────────────────────────── */

export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

export function productId(slug: string): string {
  return `${siteUrl}${getCanonicalProductPath(slug)}#product`;
}

export function webPageId(path: string): string {
  return `${buildUrl(path)}#webpage`;
}

export function breadcrumbId(path: string): string {
  return `${siteUrl}${path}#breadcrumb`;
}

/* ────────────────────────────────────────────
   Organisation schema
   ──────────────────────────────────────────── */

export function organisationSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: company.name,
    legalName: company.legalName,
    url: siteUrl,
    email: company.email,
    telephone: phones.length === 1 ? phones[0].display : phones.map((p) => p.display),
    description: company.description,
    logo: `${siteUrl}/brand/bharat-electrosafe-logo-final.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.pincode,
      addressCountry: company.address.country,
    },
  };

  // Only add sameAs when a genuine social profile URL is verified.
  // The generic LinkedIn homepage is NOT Bharat Electrosafe's company page.
  // When a real profile URL is confirmed, add it here.
  if (company.social.linkedin) {
    schema.sameAs = [company.social.linkedin];
  }

  return schema;
}

/* ────────────────────────────────────────────
   WebSite schema
   ──────────────────────────────────────────── */

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteUrl,
    name: company.name,
    description: company.description,
    publisher: {
      '@id': ORG_ID,
    },
    // No SearchAction — the site has no real internal search UI.
  };
}

/* ────────────────────────────────────────────
   WebPage schema (used for product pages)
   ──────────────────────────────────────────── */

/**
 * Product-page WebPage schema.
 *
 * The previous Product schema is replaced with WebPage because the site
 * is quotation-led — there is no public fixed price, availability, or
 * review data. Emitting Product without an Offer triggers Google Rich
 * Results errors. WebPage + BreadcrumbList is the accurate, truthful
 * representation.
 */
export function productPageSchema(product: ProductData) {
  const canonicalPath = getCanonicalProductPath(product.slug);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': webPageId(canonicalPath),
    name: product.name,
    description: product.description,
    url: buildUrl(canonicalPath),
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': ORG_ID,
    },
  };

  /* Product images — the approved gallery, in its curated order, so the hero
     is first. Deduplicated because `overview` and `application` point at
     gallery members. */
  if (product.images.gallery.length > 0) {
    schema.image = Array.from(
      new Set(product.images.gallery.map((image) => image.src))
    ).map((src) => (src.startsWith('http') ? src : `${siteUrl}${src}`));
  }

  return schema;
}

/* ────────────────────────────────────────────
   Breadcrumb schema
   ──────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(path),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildUrl(item.href),
    })),
  };
}

/* ────────────────────────────────────────────
   CollectionPage + ItemList — products hub
   ──────────────────────────────────────────── */

/**
 * CollectionPage schema for the /products hub.
 *
 * Combines a CollectionPage with an ItemList of all six genuine product
 * pages, so search engines understand the catalogue structure without
 * any fabricated SKUs, prices or availability.
 */
export function productsCollectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': webPageId('/products'),
    name: 'Electrical Insulating Mats, Waterproofing, PVC Flooring & Other Products',
    description:
      'Explore electrical insulating mats (IS 15652 & IEC 61111), waterproofing solutions, PVC flooring and other industrial products from Bharat Electrosafe.',
    url: buildUrl('/products'),
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': ORG_ID,
    },
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${siteUrl}/products#product-list`,
      name: 'Bharat Electrosafe product range',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: buildUrl(getCanonicalProductPath(product.slug)),
      })),
    },
  };
}

/* ────────────────────────────────────────────
   JSON-LD serialisation helper
   Safely escapes < characters to prevent XSS in script tags.
   ──────────────────────────────────────────── */

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
