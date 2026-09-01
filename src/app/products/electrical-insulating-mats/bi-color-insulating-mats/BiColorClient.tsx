'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { biColourVisuals } from '@/data/product-visuals';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import Image from 'next/image';
import type { ProductData } from '@/data/products';

/**
 * Bi-Colour client page.
 *
 * Uses the shared ProductDetailTemplate but injects a "Layer Construction"
 * subsection showing the cross-section diagram. Per the specific image rules,
 * the cross-section goes in this subsection — NOT as the hero or card image.
 */
export default function BiColorClient({ product }: { product: ProductData }) {

  // Layer Construction subsection using the technicalDetail visual
  const layerConstruction = biColourVisuals.technicalDetail ? (
    <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
      <SectionHeader
        eyebrow="Layer Construction"
        title="Dual-Layer Cross-Section"
        supportingText="The Bi-Colour mat features two contrasting elastomer layers for immediate visual identification of wear-through, enhancing safety inspection in switchrooms."
      />
      <div className="mt-6 flex justify-center">
        <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden rounded-2xl border border-be-grey-200 bg-[#FAFAF7]">
          <Image
            src={biColourVisuals.technicalDetail.src}
            alt={biColourVisuals.technicalDetail.alt}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 480px"
            priority={false}
          />
        </div>
      </div>
    </SectionShell>
  ) : null;

  return (
    <ProductDetailTemplate
      product={product}
      visuals={biColourVisuals}
      extraContent={layerConstruction}
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: PRODUCT_ROUTES.products },
        { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
        { label: product.name },
      ]}
    />
  );
}
