import { Metadata } from 'next';
import { allowIndexing, buildUrl } from '@/lib/site-url';
import WaterproofingHubClient from './WaterproofingHubClient';

export const metadata: Metadata = {
  title: 'Waterproofing Solutions — Geo Membrane & Water Stop',
  description:
      'Bharat Electrosafe waterproofing solutions: Geo Membrane Lining PVC geo-membrane lining for tunnels and containment, and Water Stop Seal PVC water-stop profiles for construction joints.',
  alternates: {
    canonical: buildUrl('/products/waterproofing-solutions'),
  },
  openGraph: {
    title: 'Waterproofing Solutions — Geo Membrane & Water Stop | Bharat Electrosafe',
    description:
      'Geo Membrane Lining geo-membrane lining and Water Stop Seal water-stop profiles for civil infrastructure waterproofing.',
    url: buildUrl('/products/waterproofing-solutions'),
    type: 'website',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function WaterproofingSolutionsPage() {
  return <WaterproofingHubClient />;
}
