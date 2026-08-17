import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { generateProductMetadata } from '@/lib/product-metadata';
import { ProductPageStructuredData } from '@/components/structured-data';
import AutoGlowClient from './AutoGlowClient';

const product = getProductBySlug('auto-glow-reflective-band-insulating-mats');

if (!product) {
  throw new Error('Product "auto-glow-reflective-band-insulating-mats" not found in registry');
}

export const metadata: Metadata = generateProductMetadata(product!);

export default function AutoGlowReflectiveBandMatsPage() {
  return (
    <>
      <ProductPageStructuredData productSlug="auto-glow-reflective-band-insulating-mats" />
      <AutoGlowClient product={product!} />
    </>
  );
}
