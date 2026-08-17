/**
 * Structured data (JSON-LD) for Bharat Electrosafe.
 *
 * Server component — no 'use client'.
 * Uses the centralised structured-data utility (src/lib/structured-data.ts)
 * so that all schemas use consistent entity IDs, the production domain,
 * and verified data from central sources.
 *
 * SEO strategy (spec section 17):
 *
 *   - Homepage: Organization + WebSite (no LocalBusiness — registered
 *     office is not independently verified as customer-facing premises).
 *   - Products hub: CollectionPage + ItemList + BreadcrumbList.
 *   - Product pages: WebPage + BreadcrumbList (no Product schema — site
 *     is quotation-led, no public Offer).
 *   - About / Contact: BreadcrumbList.
 *   - FAQPage structured data is removed entirely (spec section 17).
 *     Visible FAQ content is retained.
 *
 * No fake prices, ratings, reviews, SKUs, GTINs, MPNs, stock status,
 * shipping data, or offer expiry dates are ever emitted.
 */

import {
  websiteSchema,
  organisationSchema,
  productPageSchema,
  productsCollectionPageSchema,
  breadcrumbSchema,
  serializeJsonLd,
  type BreadcrumbItem,
} from '@/lib/structured-data';
import { products } from '@/data/products';
import { getCanonicalProductPath, getProductBreadcrumb } from '@/data/product-routes';

/* ────────────────────────────────────────────
   Homepage: Organization + WebSite
   ──────────────────────────────────────────── */

export function HomepageStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organisationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(websiteSchema()),
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   Product page: WebPage + Breadcrumb schema
   ──────────────────────────────────────────── */

interface ProductPageStructuredDataProps {
  productSlug: string;
  /** Route key for canonical path resolution. Defaults to productSlug. */
  routeKey?: string;
}

export function ProductPageStructuredData({ productSlug, routeKey }: ProductPageStructuredDataProps) {
  const product = products.find((p) => p.slug === productSlug);
  if (!product) return null;

  const key = routeKey ?? productSlug;
  const canonicalPath = getCanonicalProductPath(key);
  const breadcrumbItems: BreadcrumbItem[] = getProductBreadcrumb(key, product.name)
    .filter((item) => item.label !== 'Home' || item.href)
    .map((item) => ({
      name: item.label,
      href: item.href ?? canonicalPath,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productPageSchema(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, canonicalPath)),
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   Products index: CollectionPage + Breadcrumb schema
   ──────────────────────────────────────────── */

export function ProductsPageStructuredData() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productsCollectionPageSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, '/products')),
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   About Us: Breadcrumb schema
   ──────────────────────────────────────────── */

export function AboutPageStructuredData() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, '/about-us')),
      }}
    />
  );
}

/* ────────────────────────────────────────────
   Contact Us: Breadcrumb schema
   ──────────────────────────────────────────── */

export function ContactPageStructuredData() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, '/contact-us')),
      }}
    />
  );
}
