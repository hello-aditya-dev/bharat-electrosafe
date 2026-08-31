'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import DomesticClassSelector from '@/components/products/DomesticClassSelector';
import { hvVisuals } from '@/data/product-visuals';
import type { ProductData } from '@/data/products';

export default function EIMClient({
  product,
  breadcrumbItems,
  displayName,
}: {
  product: ProductData;
  breadcrumbItems?: { label: string; href?: string }[];
  displayName?: string;
}) {
  return (
    <ProductDetailTemplate
      product={product}
      visuals={hvVisuals}
      breadcrumbItems={breadcrumbItems}
      displayName={displayName}
      /* Interactive IS 15652:2006 class selector — rendered directly after
         the specification table. Data comes exclusively from the domestic
         product registry (Class A/B/C); no IEC 61111 data appears here. */
      extraContentAfterSpecifications={
        <DomesticClassSelector specifications={product.specifications} />
      }
    />
  );
}
