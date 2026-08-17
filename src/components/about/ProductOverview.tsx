'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextLink } from '@/components/ui/TextLink';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { TechnicalBadge } from '@/components/ui/TechnicalBadge';

interface ProductItem {
  name: string;
  description: string;
  href: string;
  badge?: string;
  slotId: string;
  accentColor: string;
}

const products: ProductItem[] = [
  {
    name: 'Electrical Insulating Mats',
    description: 'Class A, B & C voltage-rated insulation for electrical safety',
    href: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats',
    badge: 'IS 15652',
    slotId: 'HOME-PRODUCT-EIM-01',
    accentColor: 'bg-be-yellow-400',
  },
  {
    name: 'Coloured Strip Insulating Mats',
    description: 'Colour-coded boundary marking for hazard zones',
    href: '/products/coloured-strip-insulating-mats',
    slotId: 'HOME-PRODUCT-CSIM-01',
    accentColor: 'bg-be-yellow-100',
  },
  {
    name: 'Bi-Color Insulating Mats',
    description: 'Wear-visible contrasting dual-layer mats',
    href: '/products/bi-color-insulating-mats',
    slotId: 'HOME-PRODUCT-BCIM-01',
    accentColor: 'bg-be-grey-400',
  },
  {
    name: 'Auto-Glow / Reflective Band Mats',
    description: 'Low-light and emergency guidance insulation',
    href: '/products/auto-glow-reflective-band-insulating-mats',
    badge: 'Auto-Glow',
    slotId: 'HOME-PRODUCT-AGRIM-01',
    accentColor: 'bg-be-yellow-500',
  },
  {
    name: 'Geo Membrane Lining',
    description: 'Engineered waterproofing membrane for infrastructure',
    href: '/products/geo-membrane-lining',
    slotId: 'HOME-PRODUCT-BM-01',
    accentColor: 'bg-be-charcoal-800',
  },
];

export default function ProductOverview() {
  const leadProduct = products[0];
  const sideProducts = products.slice(1);

  return (
    <section className="bg-be-white section-padding-supporting page-horizontal-padding">
      <div className="container-site">
        <div className="reveal-up mb-10">
          <SectionHeader
            eyebrow="Our Products"
            title="What We Manufacture"
            supportingText="A complete range of certified electrical insulation and engineered protection products for critical infrastructure."
          />
        </div>

        {/* Lead product card (left) + side product links (right) */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Large lead product card */}
          <div className="lg:w-[55%] reveal-up">
            <div className="hover-card-lift flex flex-col rounded-lg border border-be-grey-250 bg-be-warm-white overflow-hidden">
              {/* Yellow accent bar */}
              <div className="h-2 bg-be-yellow-500" />
              {/* Image */}
              <div className="p-4">
                <ImageFrame
                  alt={leadProduct.name}
                  slotId={leadProduct.slotId}
                  aspectRatio="landscape"
                />
              </div>
              {/* Content */}
              <div className="flex flex-col gap-3 p-6 pt-2">
                {leadProduct.badge && <TechnicalBadge label={leadProduct.badge} />}
                <h3 className="text-card-title text-be-charcoal-950">{leadProduct.name}</h3>
                <p className="text-body text-be-grey-650">{leadProduct.description}</p>
                <TextLink href={leadProduct.href}>View product details</TextLink>
              </div>
            </div>
          </div>

          {/* Side products — stacked */}
          <div className="lg:w-[45%] flex flex-col gap-4">
            {sideProducts.map((product) => (
              <div key={product.href} className="reveal-up">
                <div className="hover-card-lift flex flex-row items-center gap-4 rounded-lg border border-be-grey-250 bg-be-warm-white p-4 overflow-hidden">
                  {/* Small thumbnail */}
                  <div
                    className="shrink-0 w-16 h-16 rounded-md overflow-hidden relative"
                  >
                    <ImageFrame
                      alt={product.name}
                      slotId={product.slotId}
                      aspectRatio="square"
                      className="!rounded-md"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    {product.badge && <TechnicalBadge label={product.badge} />}
                    <h3 className="text-card-title text-be-charcoal-950">{product.name}</h3>
                    <p className="text-metadata text-be-grey-650">{product.description}</p>
                    <TextLink href={product.href} className="text-metadata">
                      Learn more
                    </TextLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
