import { Metadata } from 'next';
import { allowIndexing, buildUrl } from '@/lib/site-url';
import EIMHubClient from './EIMHubClient';

/* Category hub page for Electrical Insulating Mats.
   The detailed HV product experience lives at
   /products/electrical-insulating-mats/high-voltage-electrical-insulation-mats. */
export const metadata: Metadata = {
  title: 'Electrical Insulating Mats — Domestic & International',
  description:
    'Bharat Electrosafe provides domestic IS 15652:2006 and international IEC 61111:2009 electrical insulating mats. Select the range and product for your application.',
  alternates: {
    canonical: buildUrl('/products/electrical-insulating-mats'),
  },
  openGraph: {
    title: 'Electrical Insulating Mats — Domestic & International | Bharat Electrosafe',
    description:
      'Domestic IS 15652:2006 and international IEC 61111:2009 electrical insulating mats.',
    url: buildUrl('/products/electrical-insulating-mats'),
    type: 'website',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function ElectricalInsulatingMatsHubPage() {
  return <EIMHubClient />;
}
