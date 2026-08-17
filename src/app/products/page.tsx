import type { Metadata } from 'next';
import { allowIndexing, buildUrl } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { ProductsPageStructuredData } from '@/components/structured-data';
import ProductsClient from './ProductsClient';

/* Title convention: the normal Metadata.title does NOT include the
   "| Bharat Electrosafe" suffix because the root layout template appends
   it automatically. Open Graph and Twitter receive the final full branded
   title. */
const PAGE_TITLE = 'Electrical Insulating Mats, Waterproofing, PVC Flooring & Other Products';
const FULL_TITLE = `${PAGE_TITLE} | Bharat Electrosafe`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    'Explore electrical insulating mats (IS 15652 & IEC 61111), waterproofing solutions, PVC flooring and other industrial products from Bharat Electrosafe.',
  alternates: {
    canonical: buildUrl('/products'),
  },
  openGraph: {
    title: FULL_TITLE,
    description:
      'Explore electrical insulating mats (IS 15652 & IEC 61111), waterproofing solutions, PVC flooring and other industrial products from Bharat Electrosafe.',
    url: buildUrl('/products'),
    type: 'website',
    images: [siteOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: FULL_TITLE,
    description:
      'Explore electrical insulating mats (IS 15652 & IEC 61111), waterproofing solutions, PVC flooring and other industrial products from Bharat Electrosafe.',
    images: [siteTwitterImage],
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function ProductsPage() {
  return (
    <>
      <ProductsPageStructuredData />
      <ProductsClient />
    </>
  );
}
