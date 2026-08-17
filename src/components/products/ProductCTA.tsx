'use client';

import { company } from '@/data/company';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SectionShell } from '@/components/ui/SectionShell';
import { Phone } from 'lucide-react';
import type { ProductData } from '@/data/products';

interface ProductCTAProps {
  product: ProductData;
  headingPrefix?: string;
}

export function ProductCTA({ product, headingPrefix = 'Request a quote for' }: ProductCTAProps) {
  return (
    <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
      <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
        <h2 className="text-section-h2 text-be-charcoal-950">
          {headingPrefix} {product.name}
        </h2>
        <p className="text-body-large text-be-grey-650">
          Get pricing, custom dimensions, and delivery timelines for your project. Our sales team responds within 24 hours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="/contact-us?type=quote" size="lg">
            Request a Quote
          </PrimaryButton>
          <SecondaryButton href={`/contact-us?type=technical-guidance&product=${product.slug}`}>
            Technical Guidance
          </SecondaryButton>
          <SecondaryButton href={`tel:${company.phonePrimaryTel}`}>
            <Phone className="size-4 mr-1.5" />
            Call Sales
          </SecondaryButton>
        </div>
      </div>
    </SectionShell>
  );
}
