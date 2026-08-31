'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { autoGlowVisuals } from '@/data/product-visuals';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import type { ProductData } from '@/data/products';

export default function AutoGlowClient({ product }: { product: ProductData }) {

  return (
    <ProductDetailTemplate
      product={product}
      visuals={autoGlowVisuals}
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: PRODUCT_ROUTES.products },
        { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
        { label: product.name },
      ]}
    />
  );
}
