import { redirect } from 'next/navigation';

/* Permanent redirect from the old /domestic route to the new canonical
   /high-voltage-electrical-insulation-mats route.
   This preserves the old URL and sends a 308 permanent redirect. */
export default function DomesticRedirect() {
  redirect('/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats');
}

export const dynamic = 'force-static';
