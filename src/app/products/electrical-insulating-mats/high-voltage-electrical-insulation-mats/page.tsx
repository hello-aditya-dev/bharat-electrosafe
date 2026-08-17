import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { buildUrl, allowIndexing } from '@/lib/site-url';
import { ProductPageStructuredData } from '@/components/structured-data';
import EIMClient from '../EIMClient';

const product = getProductBySlug('electrical-insulating-mats');

if (!product) {
  throw new Error('Product "electrical-insulating-mats" not found in registry');
}

/* High Voltage Electrical Insulation Mats — dedicated detail page.
   The family hub remains at /products/electrical-insulating-mats.
   This page uses the product-specific title "High Voltage Electrical Insulation Mats"
   rather than the generic family name. */
const HV_PAGE_TITLE = 'High Voltage Electrical Insulation Mats';
const HV_SOCIAL_TITLE = 'High Voltage Electrical Insulation Mats | Bharat Electrosafe';
const HV_DESCRIPTION =
  'High voltage electrical insulation mats manufactured to IS 15652:2006 for operator protection near live switchgear, control panels and substations.';

export const metadata: Metadata = {
  title: `${HV_PAGE_TITLE} to IS 15652:2006`,
  description: HV_DESCRIPTION,
  alternates: {
    canonical: buildUrl('/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats'),
  },
  openGraph: {
    title: HV_SOCIAL_TITLE,
    description: HV_DESCRIPTION,
    url: buildUrl('/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats'),
    type: 'website',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electrical Insulating Mats', href: '/products/electrical-insulating-mats' },
  { label: 'High Voltage Electrical Insulation Mats' },
];

export default function HighVoltageElectricalInsulationMatsPage() {
  return (
    <>
      <ProductPageStructuredData productSlug="electrical-insulating-mats" routeKey="high-voltage-electrical-insulation-mats" />
      <EIMClient product={product!} breadcrumbItems={breadcrumbItems} displayName={HV_PAGE_TITLE} />
    </>
  );
}
