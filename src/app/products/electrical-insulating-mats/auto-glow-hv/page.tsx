import type { Metadata } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import AutoGlowHVClient from './AutoGlowHVClient';

const PAGE_TITLE = 'Auto Glow HV Electrical Insulating Mats';
const PAGE_DESCRIPTION =
  'Bharat Electrosafe Auto Glow HV Electrical Insulating Mats — an innovative electrical safety solution designed in line with IEC 61111, enhancing visibility in low-light conditions. From India to the World.';
const CANONICAL_PATH = PRODUCT_ROUTES.autoGlowHv;
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
  { name: 'Auto Glow HV', href: CANONICAL_PATH },
];

export default function AutoGlowHVPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <AutoGlowHVClient />
    </>
  );
}
