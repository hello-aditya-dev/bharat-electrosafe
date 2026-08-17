'use client';

import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';

/**
 * BESBrands — BES Brands section.
 *
 * Shows the two brand identities under the BES umbrella:
 *   1. Bharat Electrosafe (®) — parent brand
 *   2. INSULATICAA — product-line brand
 *
 * Uses existing brand logo assets from /brand/.
 */

const brands = [
  {
    name: 'Bharat Electrosafe®',
    description:
      'Manufacturer of electrical insulating mats, waterproofing, PVC flooring and related industrial products.',
    logo: '/brand/bharat-electrosafe-logo-header.png',
    alt: 'Bharat Electrosafe registered trademark logo',
  },
  {
    name: 'INSULATICAA',
    description:
      'Specialised brand for high-voltage electrical insulating mat solutions — representing safety, reliability and compliance in electrical insulation.',
    logo: '/brand/insulaticaa-logo.webp',
    alt: 'INSULATICAA brand logo',
  },
];

export default function BESBrands() {
  return (
    <SectionShell variant="compact" bg="bg-be-cream" topRule>
      <div className="reveal-up mb-8">
        <SectionHeader
          eyebrow="BES Brands"
          title="Our brand family"
          supportingText="Two complementary brands serving the electrical safety, industrial protection and infrastructure markets."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="reveal-up flex flex-col items-center text-center gap-5 rounded-lg border border-be-grey-250 bg-be-white p-6 lg:p-8"
          >
            {/* Logo container */}
            <div className="relative w-full max-w-[280px] aspect-[3/1] flex items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 280px, 280px"
              />
            </div>

            {/* Brand name */}
            <h3 className="text-lg font-bold text-be-charcoal-950 tracking-tight">
              {brand.name}
            </h3>

            {/* Description */}
            <p className="text-body text-be-grey-650 max-w-sm">
              {brand.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
