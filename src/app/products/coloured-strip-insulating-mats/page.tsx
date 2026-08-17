import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { generateProductMetadata } from '@/lib/product-metadata';
import { ProductPageStructuredData } from '@/components/structured-data';
import CSIMClient from './CSIMClient';

const product = getProductBySlug('coloured-strip-insulating-mats');

if (!product) {
  throw new Error('Product "coloured-strip-insulating-mats" not found in registry');
}

export const metadata: Metadata = generateProductMetadata(product!);

export default function ColouredStripInsulatingMatsPage() {
  return (
    <>
      <ProductPageStructuredData productSlug="coloured-strip-insulating-mats" />
      <CSIMClient product={product!} />
    </>
  );
}
