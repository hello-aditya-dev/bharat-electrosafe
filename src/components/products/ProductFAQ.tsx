'use client';

import { FAQ, type FAQItem } from '@/components/ui/FAQ';
import { SectionShell } from '@/components/ui/SectionShell';
import type { ProductData } from '@/data/products';
import { getProductFaqs } from '@/data/faqs';

interface ProductFAQProps {
  product: ProductData;
}

/**
 * Product FAQ — visible accordion.
 *
 * Consumes the same `getProductFaqs(product)` array that the matching
 * product route's `ProductPageStructuredData` consumes for FAQPage JSON-LD,
 * so the visible questions and the schema questions are always
 * character-for-character identical.
 *
 * The FAQ content lives entirely in src/data/faqs.ts. This component never
 * owns FAQ text. Civil products (BharatMembrane) receive their own
 * product-specific FAQs and never inherit IS 15652:2006,
 * electrical insulation classes, the BIS insulating-mat licence, or
 * ERDA/NTH electrical-mat claims.
 */
export function ProductFAQ({ product }: ProductFAQProps) {
  const items: FAQItem[] = getProductFaqs(product);

  if (items.length === 0) return null;

  return (
    <SectionShell variant="compact" bg="bg-be-warm-white" topRule>
      <FAQ
        eyebrow="FAQ"
        title={`Questions about ${product.shortName}`}
        items={items}
        className="max-w-3xl"
      />
    </SectionShell>
  );
}
