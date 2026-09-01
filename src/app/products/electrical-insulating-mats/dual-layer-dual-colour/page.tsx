import type { Metadata } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import DualLayerClient from './DualLayerClient';

const PAGE_TITLE = 'Dual Layer Bi-Colour HV Electrical Insulating Mats';
const PAGE_DESCRIPTION =
  'Bharat Electrosafe Dual Layer Bi-Colour HV Electrical Insulating Mats — an innovative safety solution designed in line with IEC 61111:2009, with a visible wear indication through contrasting layers. From India to the World.';
const CANONICAL_PATH = PRODUCT_ROUTES.dualLayerDualColour;
const canonicalUrl = buildUrl(CANONICAL_PATH);

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `${PAGE_TITLE} | Bharat Electrosafe`,
    description: PAGE_DESCRIPTION,
    url: canonicalUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGE_TITLE} | Bharat Electrosafe`,
    description: PAGE_DESCRIPTION,
  },
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { name: 'Dual Layer Bi-Colour', href: CANONICAL_PATH },
];

export default function DualLayerDualColourPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <DualLayerClient />
    </>
  );
}
