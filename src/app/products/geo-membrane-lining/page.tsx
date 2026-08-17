import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { generateProductMetadata } from '@/lib/product-metadata';
import { ProductPageStructuredData } from '@/components/structured-data';
import BMClient from '../bharat-membrane/BMClient';

const product = getProductBySlug('bharat-membrane');

if (!product) {
  throw new Error('Product "bharat-membrane" not found in registry');
}

export const metadata: Metadata = generateProductMetadata(product!);

export default function GeoMembraneLiningPage() {
  return (
    <>
      <ProductPageStructuredData productSlug="bharat-membrane" />
      <BMClient product={product!} />
    </>
  );
}
