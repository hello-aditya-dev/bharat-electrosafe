'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { ProductHero } from '@/components/products/ProductHero';
import { ProductOverview } from '@/components/products/ProductOverview';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductSpecifications } from '@/components/products/ProductSpecifications';
import { ProductMaterialDimensions } from '@/components/products/ProductMaterialDimensions';
import { ProductDocuments } from '@/components/products/ProductDocuments';
import { ProductFAQ } from '@/components/products/ProductFAQ';
import { ProductCTA } from '@/components/products/ProductCTA';
import type { ProductData } from '@/data/products';
import type { ProductVisuals } from '@/data/product-visuals';

/**
 * ProductDetailTemplate — shared polished layout template for all 6 domestic
 * product detail pages.
 *
 * Layout order:
 * 1. Breadcrumb (inside ProductHero)
 * 2. Product Hero — LEFT ~55% gallery, RIGHT ~45% product info
 * 3. Quick Technical Facts (ProductAssuranceGrid — compact horizontal strip)
 * 4. Product Overview + Key Features
 * 5. Applications
 * 6. Technical Specifications
 * 7. Material & Dimensions (standards / compliance detail)
 * 8. Documents & Certifications
 * 9. FAQ
 * 10. Technical Guidance CTA
 */

interface ProductDetailTemplateProps {
  product: ProductData;
  visuals: ProductVisuals;
  /** Override the CTA heading prefix (e.g. "Project enquiry for"). */
  ctaHeadingPrefix?: string;
  /** Optional extra content injected between sections. */
  extraContent?: React.ReactNode;
  /** Override the breadcrumb trail (default: Home → Products → product.name). */
  breadcrumbItems?: { label: string; href?: string }[];
  /** Override the product display name (H1, carousel alt) without changing product.name data. */
  displayName?: string;
}

export function ProductDetailTemplate({
  product,
  visuals,
  ctaHeadingPrefix,
  extraContent,
  breadcrumbItems,
  displayName,
}: ProductDetailTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">
        {/* 1–3. Hero + breadcrumb + assurance strip */}
        <ProductHero product={product} visuals={visuals} breadcrumbItems={breadcrumbItems} displayName={displayName} />

        {/* 4. Overview + key features */}
        <ProductOverview product={product} />

        {/* 5. Applications */}
        <ProductApplications product={product} />

        {/* 6. Technical specifications */}
        <ProductSpecifications product={product} stickyFirstColumn />

        {/* 7. Material, dimensions, standards/compliance */}
        <ProductMaterialDimensions product={product} />

        {/* Extra content slot — for product-specific sections like
            Bi-Colour cross-section, membrane variant comparison, etc. */}
        {extraContent}

        {/* 8. Documents & certifications */}
        <ProductDocuments product={product} />

        {/* 9. FAQ */}
        <ProductFAQ product={product} />

        {/* 10. Technical guidance CTA */}
        <ProductCTA
          product={product}
          headingPrefix={ctaHeadingPrefix ?? 'Request a quote for'}
        />
      </main>
      <Footer />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
