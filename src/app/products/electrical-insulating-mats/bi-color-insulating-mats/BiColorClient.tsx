'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { biColourVisuals } from '@/data/product-visuals';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import ColourwaySchematic from '@/components/products/ColourwaySchematic';
import type { ProductData } from '@/data/products';

/**
 * Bi-Colour client page.
 *
 * Uses the shared ProductDetailTemplate but injects a "Layer Construction"
 * subsection showing the documented colourway schematic. Per the specific
 * image rules, the schematic goes in this subsection — NOT as the hero or
 * card image. The documented colourway is BLACK / YELLOW; superseded
 * two-layer renders are withdrawn from display.
 */
export default function BiColorClient({ product }: { product: ProductData }) {

  // Layer Construction subsection using the documented colourway schematic
  const layerConstruction = (
    <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
      <SectionHeader
        eyebrow="Layer Construction"
        title="Dual-Layer Cross-Section"
        supportingText="The Bi-Colour mat features two contrasting elastomer layers for immediate visual identification of wear-through, enhancing safety inspection in switchrooms. Documented colourway: black walking surface with a yellow wear-indicator layer."
      />
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-lg">
          <ColourwaySchematic
            size="full"
            topLabel="Black"
            bottomLabel="Yellow"
            note="Documented colourway — construction diagram (illustration). Product photograph shown in the gallery above."
          />
        </div>
      </div>
    </SectionShell>
  );

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
