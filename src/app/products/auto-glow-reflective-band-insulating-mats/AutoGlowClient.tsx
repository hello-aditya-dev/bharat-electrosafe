'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { autoGlowVisuals } from '@/data/product-visuals';
import type { ProductData } from '@/data/products';

export default function AutoGlowClient({ product }: { product: ProductData }) {

  return <ProductDetailTemplate product={product} visuals={autoGlowVisuals} />;
}
