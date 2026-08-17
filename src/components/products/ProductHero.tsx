'use client';

import { useMemo } from 'react';
import {
  Zap,
  Ruler,
  Award,
  Palette,
  Route,
  Eye,
  Clock,
  Sun,
  Scan,
  Droplets,
  Building,
  Shield,
  Download,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { TechnicalBadge } from '@/components/ui/TechnicalBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SectionShell } from '@/components/ui/SectionShell';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { ProductAssuranceGrid } from '@/components/products/ProductAssuranceGrid';
import type { ProductData } from '@/data/products';
import type { ProductVisuals } from '@/data/product-visuals';

/* ── Icon mapping ── */

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  ruler: Ruler,
  award: Award,
  palette: Palette,
  road: Route,
  eye: Eye,
  clock: Clock,
  sun: Sun,
  mirror: Scan,
  droplets: Droplets,
  building: Building,
  shield: Shield,
};

/* ── Component ── */

interface ProductHeroProps {
  product: ProductData;
  visuals: ProductVisuals;
  /** Override the breadcrumb trail (default: Home → Products → product.name). */
  breadcrumbItems?: { label: string; href?: string }[];
  /** Override the product display name (H1, carousel alt) without changing product.name data. */
  displayName?: string;
}

export function ProductHero({ product, visuals, breadcrumbItems: overrideBreadcrumb, displayName }: ProductHeroProps) {
  const breadcrumbItems = useMemo(
    () =>
      overrideBreadcrumb ?? [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: product.name },
      ],
    [overrideBreadcrumb, product.name]
  );

  return (
    <>
      {/* ── Main product hero: LEFT gallery (~55%) + RIGHT info (~45%) ── */}
      <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
        {/* Breadcrumb — first on every breakpoint */}
        <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

        {/*
          Desktop: 12-column CSS grid.
            • lg (1024–1279px): 7/5 split — gallery left ~55%, info right ~45%
            • xl (1280px+): 7/5 split — same editorial ratio with more room
          Mobile/tablet (<1024px): single column, image first, then product info
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ── LEFT: Media / Gallery side ── */}
          <div className="min-w-0 lg:col-span-7 order-first">
            <ProductImageCarousel
              hero={visuals.hero}
              gallery={visuals.gallery}
              video={visuals.video}
              productName={displayName ?? product.name}
              className="product-hero-carousel"
            />
          </div>

          {/* ── RIGHT: Text / Product info side ── */}
          <div className="min-w-0 lg:col-span-5 flex flex-col">
            {/* Technical badges */}
            <div className="flex flex-wrap gap-2 mb-2.5 lg:mb-3">
              {product.badges.map((badge) => (
                <TechnicalBadge key={badge} label={badge} />
              ))}
            </div>

            {/* H1 */}
            <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
              {displayName ?? product.name}
            </h1>

            {/* Introduction */}
            <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
              {product.introduction}
            </p>

            {/* Quick facts */}
            <div className="product-hero-facts flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mb-5 lg:mb-6">
              {product.quickFacts.map((fact) => {
                const Icon = iconMap[fact.icon] ?? Shield;
                return (
                  <div key={fact.label} className="flex items-center gap-3">
                    <span className="flex items-center justify-center size-8 rounded-md bg-be-yellow-50 shrink-0" aria-hidden="true">
                      <Icon className="size-4 text-be-yellow-text" />
                    </span>
                    <div>
                      <div className="text-metadata text-be-grey-650 font-medium">{fact.label}</div>
                      <div className="text-body font-semibold text-be-charcoal-950">{fact.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/contact-us" size="lg">
                Request a Quote
              </PrimaryButton>
              {product.hasDatasheet && (
                <SecondaryButton href="#documents">
                  <Download className="size-4 mr-1.5" />
                  Download Datasheet
                </SecondaryButton>
              )}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ── Shared product assurance strip ── */}
      <ProductAssuranceGrid product={product} />
    </>
  );
}
