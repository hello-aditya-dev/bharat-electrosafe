import { Metadata } from 'next';
import { buildUrl, canonicalOrigin, allowIndexing } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { serializeJsonLd, webPageId, breadcrumbId, breadcrumbSchema } from '@/lib/structured-data';
import OtherProductsClient from './OtherProductsClient';

const pageTitle = 'Rubber Sheet, ESD Mat, Conveyor Belt & More';
const socialTitle = 'Rubber Sheet, ESD Mat, Conveyor Belt & More | Bharat Electrosafe';
const description =
  'Rubber sheets, rubber hose pipes, ESD mats and conveyor belts from Bharat Electrosafe — request specifications and quotes.';
const path = '/products/other-products';
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
 *  entry (Other Products has no full product record). */
function OtherProductsStructuredData() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Other Products', href: path },
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

export default function OtherProductsPage() {
  return (
    <>
      <OtherProductsStructuredData />
      <OtherProductsClient />
    </>
  );
}
