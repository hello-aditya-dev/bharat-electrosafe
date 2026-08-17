import type { Metadata } from 'next';
import { allowIndexing, buildUrl } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { AboutPageStructuredData } from '@/components/structured-data';
import AboutUsShell from './AboutUsShell';

/* Title convention: the normal Metadata.title does NOT include the
   "| Bharat Electrosafe" suffix because the root layout template appends
   it automatically. Open Graph and Twitter receive the final full branded
   title. */
const PAGE_TITLE = 'About Bharat Electrosafe';
const FULL_TITLE = `${PAGE_TITLE} | Bharat Electrosafe`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    'Bharat Electrosafe — India\'s trusted manufacturer of electrical safety products, Geo Membrane Lining, Water Stop Seal, PVC flooring and industrial rubber products. Leadership, manufacturing and compliance.',
  alternates: {
    canonical: buildUrl('/about-us'),
  },
  openGraph: {
    title: FULL_TITLE,
    description:
      'Bharat Electrosafe — India\'s trusted manufacturer of electrical safety products, Geo Membrane Lining, Water Stop Seal, PVC flooring and industrial rubber products. Leadership, manufacturing and compliance.',
    url: buildUrl('/about-us'),
    type: 'website',
    images: [siteOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: FULL_TITLE,
    description:
      'Bharat Electrosafe — India\'s trusted manufacturer of electrical safety products, Geo Membrane Lining, Water Stop Seal, PVC flooring and industrial rubber products. Leadership, manufacturing and compliance.',
    images: [siteTwitterImage],
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function AboutUsPage() {
  return (
    <>
      <AboutPageStructuredData />
      <AboutUsShell />
    </>
  );
}
