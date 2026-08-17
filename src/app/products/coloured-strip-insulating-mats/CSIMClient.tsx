'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { coloredStripVisuals } from '@/data/product-visuals';
import type { ProductData } from '@/data/products';

export default function CSIMClient({ product }: { product: ProductData }) {

  return <ProductDetailTemplate product={product} visuals={coloredStripVisuals} />;
}
