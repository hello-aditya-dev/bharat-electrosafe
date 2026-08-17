import { Metadata } from 'next';
import { buildUrl, canonicalOrigin, allowIndexing } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { serializeJsonLd, webPageId, breadcrumbId, breadcrumbSchema } from '@/lib/structured-data';
import PVCFlooringClient from './PVCFlooringClient';

const pageTitle = 'PVC Flooring Solutions IS 3462:1986';
const socialTitle = 'PVC Flooring Solutions IS 3462:1986 | Bharat Electrosafe';
const description =
  'BharatSmart Floor™ PVC flooring for homes, offices and commercial interiors, including residential spaces, workspaces, reception areas, retail interiors and similar applications — IS 3462:1986.';
const path = '/products/pvc-flooring-solutions';
const canonicalUrl = buildUrl(path);

export const metadata: Metadata = {
  title: pageTitle,
  description,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: socialTitle,
    description,
    url: canonicalUrl,
    type: 'website',
    images: [siteOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description,
    images: [siteTwitterImage],
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/** WebPage + BreadcrumbList JSON-LD — matches the pattern used by existing
 *  product pages in structured-data.tsx, but without a ProductData registry
 *  entry (PVC Flooring has no full product record yet). */
function PVCFlooringStructuredData() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'PVC Flooring Solutions', href: path },
  ];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': webPageId(path),
    url: canonicalUrl,
    name: pageTitle,
    description,
    isPartOf: { '@id': `${canonicalOrigin}/#website` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbItems, path)),
        }}
      />
    </>
  );
}

export default function PVCFlooringSolutionsPage() {
  return (
    <>
      <PVCFlooringStructuredData />
      <PVCFlooringClient />
    </>
  );
}
