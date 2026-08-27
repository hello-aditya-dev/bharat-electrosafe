import type { Metadata } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import PoleShieldClient from './PoleShieldClient';

const PAGE_TITLE = 'Bharat PoleShield';
const PAGE_DESCRIPTION =
  'Bharat PoleShield — a distinct brand direction from Bharat Electrosafe. Protecting Every Pole • Protecting Every Life. Contact our team to learn more.';
const CANONICAL_PATH = PRODUCT_ROUTES.bharatPoleShield;
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
  { name: 'Bharat PoleShield', href: CANONICAL_PATH },
];

export default function BharatPoleShieldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <PoleShieldClient />
    </>
  );
}
