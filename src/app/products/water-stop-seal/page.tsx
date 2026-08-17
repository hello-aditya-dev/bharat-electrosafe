import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { generateProductMetadata } from '@/lib/product-metadata';
import { ProductPageStructuredData } from '@/components/structured-data';
import BHSClient from '../bharat-hydro-seal/BHSClient';

const product = getProductBySlug('bharat-hydro-seal');

if (!product) {
  throw new Error('Product "bharat-hydro-seal" not found in registry');
}

export const metadata: Metadata = generateProductMetadata(product!);

export default function WaterStopSealPage() {
  return (
    <>
      <ProductPageStructuredData productSlug="bharat-hydro-seal" />
      <BHSClient product={product!} />
    </>
  );
}
