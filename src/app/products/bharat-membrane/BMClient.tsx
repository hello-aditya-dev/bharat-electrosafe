'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { membraneVisuals } from '@/data/product-visuals';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DataTable } from '@/components/ui/DataTable';
import type { ProductData } from '@/data/products';

/**
 * BharatMembrane client page.
 *
 * Uses the shared ProductDetailTemplate with an extra "Variant Comparison"
 * section specific to the membrane product (three thickness variants).
 */
export default function BMClient({ product }: { product: ProductData }) {

  const variantComparison = (
    <SectionShell variant="technical" bg="bg-be-cream" topRule>
      <div className="flex flex-col gap-6">
        <SectionHeader
          eyebrow="Membrane Properties"
          title="Variant Comparison"
          supportingText="Geo Membrane Lining is available in three thickness variants. Each variant is optimised for different exposure levels and project requirements."
        />
        <DataTable
          headers={product.specifications.headers}
          rows={product.specifications.rows}
          stickyFirstColumn
        />
      </div>
    </SectionShell>
  );

  return (
    <ProductDetailTemplate
      product={product}
      visuals={membraneVisuals}
      ctaHeadingPrefix="Project enquiry for"
      extraContent={variantComparison}
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Waterproofing Solutions', href: '/products/waterproofing-solutions' },
        { label: product.name },
      ]}
    />
  );
}
