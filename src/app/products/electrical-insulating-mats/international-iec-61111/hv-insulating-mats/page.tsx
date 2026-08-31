import { Metadata } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import GlobalHVClient from './GlobalHVClient';

/* ────────────────────────────────────────────
   GLOBAL HV INSULATING MATS — dedicated page.

   This page is the GLOBAL / INTERNATIONAL HV product
   (IEC 61111:2009, Class 0–4). It is a SEPARATE page from
   the DOMESTIC HV page (IS 15652:2006, Class A/B/C) at
   /products/electrical-insulating-mats/high-voltage-electrical-insulation-mats.

   DO NOT MERGE. This page must never present IS 15652:2006
   Class A/B/C data — all technical values come exclusively
   from src/data/iec-61111.ts.
   ──────────────────────────────────────────── */

const PAGE_TITLE = 'HV Insulating Mats IEC 61111:2009';
const PAGE_DESCRIPTION =
  'HV insulating mats certified to IEC 61111:2009 for international markets — Classes 0 to 4, maximum working voltage 1.0 kV to 36.0 kV AC, thickness 2.0–5.2 mm.';
const CANONICAL_PATH = PRODUCT_ROUTES.internationalHv;
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
   Structured data — breadcrumb walks through the
   Global IEC 61111 hub, keeping the GLOBAL context.
   ──────────────────────────────────────────── */

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { name: 'International / Global (IEC 61111:2009)', href: PRODUCT_ROUTES.international },
  { name: 'HV Insulating Mats', href: CANONICAL_PATH },
];

export default function GlobalHVInsulatingMatsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <GlobalHVClient />
    </>
  );
}
