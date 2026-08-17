'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
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
    />
  );
}
