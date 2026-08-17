'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { SectionShell } from '@/components/ui/SectionShell';
import { getProductBySlug } from '@/data/products';
import type { ProductData } from '@/data/products';
import { cn } from '@/lib/utils';
import { getCanonicalProductPath } from '@/data/product-routes';

/* ── Accent colors for differentiation ── */

const accentColors: Record<string, string> = {
  'electrical-insulating-mats': 'border-be-yellow-400',
  'coloured-strip-insulating-mats': 'border-be-yellow-100',
  'bi-color-insulating-mats': 'border-be-grey-400',
  'auto-glow-reflective-band-insulating-mats': 'border-be-yellow-500',
  'bharat-membrane': 'border-be-charcoal-800',
};

/* ── Component ── */

interface RelatedProductsProps {
  product: ProductData;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const related = product.relatedProducts
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is ProductData => p !== undefined);

  if (related.length === 0) {
    return null;
  }

  return (
    <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
      <SectionHeader
          eyebrow="Related Products"
          title="Explore Related Products"
          supportingText="Other Bharat Electrosafe products that complement or relate to this one."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {related.map((rp) => (
            <Link
              key={rp.slug}
              href={getCanonicalProductPath(rp.slug)}
              className={cn(
                'hover-card-lift flex flex-col rounded-lg border bg-be-white overflow-hidden group',
                accentColors[rp.slug] ?? 'border-be-grey-250'
              )}
            >
              {/* Image-led card */}
              <div className="relative">
                <ImageFrame
                  src={rp.images.thumbnail.src}
                  alt={rp.images.thumbnail.alt}
                  aspectRatio="landscape"
                  fit={rp.images.thumbnail.fit}
                  className="border-0 rounded-none"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-card-title text-be-charcoal-950 group-hover:text-be-yellow-text-hover transition-colors">
                  {rp.name}
                </h3>
                <p className="text-body text-be-grey-650 leading-relaxed line-clamp-2">
                  {rp.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {rp.badges.slice(0, 2).map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-md bg-be-yellow-50 text-be-charcoal-800 text-metadata font-semibold px-2 py-1"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all products link */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className="text-sm font-medium text-be-yellow-text hover:text-be-yellow-text-hover transition-colors"
          >
            View all products
          </Link>
        </div>
    </SectionShell>
  );
}
