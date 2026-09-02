import { Metadata } from 'next';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { breadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/structured-data';
import { PRODUCT_ROUTES } from '@/data/product-routes';
import BiColorClient from './BiColorClient';

/* ────────────────────────────────────────────
   GLOBAL / INTERNATIONAL BI-COLOR — dedicated page.

   This page is the GLOBAL / INTERNATIONAL Bi-Color product
   (IEC 61111:2009, Class 0–4). It is a SEPARATE page from
   the DOMESTIC Bi-Color page (IS 15652:2006) at
   /products/electrical-insulating-mats/bi-color-insulating-mats.

   DO NOT MERGE. This page must never present IS 15652:2006
   data — all technical values come exclusively from
   src/data/iec-61111.ts.
   ──────────────────────────────────────────── */

const PAGE_TITLE = 'Bi-Color HV Electrical Insulating Mats';
const PAGE_DESCRIPTION =
  'Bharat Electrosafe Bi-Color HV Electrical Insulating Mats — an innovative safety solution designed in line with IEC 61111:2009, with a visible wear indication through contrasting dual-layer construction. From India to the World.';
const CANONICAL_PATH = PRODUCT_ROUTES.internationalBiColor;
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
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { name: 'International / Global (IEC 61111:2009)', href: PRODUCT_ROUTES.international },
  { name: 'Bi-Color', href: CANONICAL_PATH },
];

export default function BiColorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, CANONICAL_PATH)),
        }}
      />
      <BiColorClient />
    </>
  );
}
