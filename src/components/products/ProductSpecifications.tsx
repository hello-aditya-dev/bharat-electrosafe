'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { DataTable } from '@/components/ui/DataTable';
import { SectionShell } from '@/components/ui/SectionShell';
import { company } from '@/data/company';
import type { ProductData } from '@/data/products';

interface ProductSpecificationsProps {
  product: ProductData;
  stickyFirstColumn?: boolean;
}

export function ProductSpecifications({ product, stickyFirstColumn = true }: ProductSpecificationsProps) {
  return (
    <SectionShell variant="technical" bg="bg-be-cream" topRule>
      <div className="flex flex-col gap-6">
        <SectionHeader
            eyebrow="Technical Specifications"
            title="Specifications"
            supportingText="Detailed technical specifications for each class and variant. All values tested per IS 15652:2006 standards."
          />

          <DataTable
            headers={product.specifications.headers}
            rows={product.specifications.rows}
            stickyFirstColumn={stickyFirstColumn}
          />

          {/* Print-only contact footer for printed spec sheets */}
          <div className="hidden print:block mt-6 pt-4 border-t border-be-grey-300 text-metadata text-be-charcoal-800">
            <p className="font-semibold">
              Bharat Electrosafe — {product.name} — {company.email} — {company.phonePrimary}
            </p>
            <p className="mt-1">Printed from the official Bharat Electrosafe website.</p>
          </div>
      </div>
    </SectionShell>
  );
}
