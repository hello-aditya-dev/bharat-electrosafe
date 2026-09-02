import { permanentRedirect } from 'next/navigation';

/* ────────────────────────────────────────────
   LEGACY ROUTE REDIRECT.

   The canonical Global / International Bi-Color page has moved to:
   /products/electrical-insulating-mats/international-iec-61111/bi-color

   This old route (/products/electrical-insulating-mats/dual-layer-dual-colour)
   now permanently redirects to the canonical route so existing links,
   bookmarks and search-engine indexes are preserved.
   ──────────────────────────────────────────── */

export default function LegacyDualLayerRedirect() {
  permanentRedirect('/products/electrical-insulating-mats/international-iec-61111/bi-color');
}
