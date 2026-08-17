import { Metadata } from 'next';
import { buildUrl, canonicalOrigin, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import IECClient from './IECClient';

/* ────────────────────────────────────────────
   Metadata
   ──────────────────────────────────────────── */

const PAGE_TITLE = 'International Insulating Mats IEC 61111:2009';
const PAGE_DESCRIPTION =
  'IEC 61111:2009 compliant insulating mats for international markets — Class 0 to Class 4, including auto-glow and bi-colour variants.';
const CANONICAL_PATH = '/products/international-iec-61111';
const canonicalUrl = buildUrl(CANONICAL_PATH);

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: canonicalUrl,
  },
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
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/* ────────────────────────────────────────────
   Structured data (breadcrumb only — no Product schema)
   ──────────────────────────────────────────── */

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'International / Global (IEC 61111:2009)', href: CANONICAL_PATH },
];

export default function InternationalIEC61111Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <IECClient />
    </>
  );
}
