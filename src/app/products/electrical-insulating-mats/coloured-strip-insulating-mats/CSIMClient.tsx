'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { coloredStripVisuals } from '@/data/product-visuals';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import type { ProductData } from '@/data/products';

export default function CSIMClient({ product }: { product: ProductData }) {

  return (
    <ProductDetailTemplate
      product={product}
      visuals={coloredStripVisuals}
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: PRODUCT_ROUTES.products },
        { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
        { label: product.name },
      ]}
    />
  );
}
