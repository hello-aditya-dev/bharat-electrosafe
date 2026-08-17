'use client';

import {
  Award,
  BadgeCheck,
  FlaskConical,
  Layers,
  Hammer,
  Shapes,
  GitMerge,
  FileText,
  Truck,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AssuranceId, ProductData } from '@/data/products';
import { getProductAssuranceItems } from '@/data/products';

/**
 * ProductAssuranceGrid — compact horizontal facts strip beneath every product hero.
 *
 * Renders 3–5 assurance/compliance items in a compact horizontal band.
 * Desktop: inline row of items separated by dividers.
 * Tablet: 2-column grid.
 * Mobile: stacked single column.
 *
 * Items are sourced from `getProductAssuranceItems()` which merges
 * product-specific items with shared defaults and deduplicates by stable
 * semantic ID — so no product can ever render two items in the same category.
 */
const assuranceIconMap: Record<AssuranceId, LucideIcon> = {
  standard: Award,
  'bis-licence': BadgeCheck,
  testing: FlaskConical,
  material: Layers,
  construction: Hammer,
  profile: Shapes,
  joining: GitMerge,
  documentation: FileText,
  delivery: Truck,
  'technical-support': Headphones,
};

interface ProductAssuranceGridProps {
  product: ProductData;
}

export function ProductAssuranceGrid({ product }: ProductAssuranceGridProps) {
  const items = getProductAssuranceItems(product);

  return (
    <section
      aria-labelledby="product-assurance-heading"
      className="border-y border-be-grey-200 bg-[#FAFAF7]"
    >
      <div className="container-site page-horizontal-padding py-4 md:py-5">
        <h2 id="product-assurance-heading" className="sr-only">
          Product assurance &amp; compliance
        </h2>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-2 lg:gap-x-8">
          {items.map((item, index) => {
            const Icon = assuranceIconMap[item.id] ?? ShieldCheck;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2.5"
                data-assurance-id={item.id}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-be-yellow-50 border border-be-yellow-100"
                  aria-hidden="true"
                >
                  <Icon className="h-3.5 w-3.5 text-be-yellow-text" />
                </span>
                <span className="text-[13px] leading-snug font-medium text-be-charcoal-950">
                  {item.label}
                </span>
                {/* Divider between items on desktop */}
                {index < items.length - 1 && (
                  <span className="hidden lg:block h-4 w-px bg-be-grey-250 ml-2" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
