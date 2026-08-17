import type { Metadata } from 'next';
import { allowIndexing, buildUrl } from '@/lib/site-url';
import { siteOgImage, siteTwitterImage } from '@/lib/social-image';
import { ContactPageStructuredData } from '@/components/structured-data';
import ContactUsClient from './ContactUsClient';

/* Title convention: the normal Metadata.title does NOT include the
   "| Bharat Electrosafe" suffix because the root layout template appends
   it automatically. Open Graph and Twitter receive the final full branded
   title. */
const PAGE_TITLE = 'Contact Bharat Electrosafe for Product Enquiries';
const FULL_TITLE = `${PAGE_TITLE} | Bharat Electrosafe`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    'Contact Bharat Electrosafe for product specifications, technical documentation, dimensions, availability and quotations.',
  alternates: {
    canonical: buildUrl('/contact-us'),
  },
  openGraph: {
    title: FULL_TITLE,
    description:
      'Contact Bharat Electrosafe for product specifications, technical documentation, dimensions, availability and quotations.',
    url: buildUrl('/contact-us'),
    type: 'website',
    images: [siteOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: FULL_TITLE,
    description:
      'Contact Bharat Electrosafe for product specifications, technical documentation, dimensions, availability and quotations.',
    images: [siteTwitterImage],
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function ContactUsPage() {
  return (
    <>
      <ContactPageStructuredData />
      <ContactUsClient />
    </>
  );
}
