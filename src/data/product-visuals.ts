/**
 * Product Visual Mapping — Bharat Electrosafe
 *
 * Central source-of-truth for all product imagery used across the site.
 * Every component that renders a product image MUST reference this file
 * instead of hardcoding paths independently.
 *
 * Image roles:
 *   card         — product card on /products overview
 *   hero         — product detail page hero image (first in carousel)
 *   gallery      — product detail page carousel images (after hero)
 *   application  — contextual installation/application photo
 *   technicalDetail — diagrams, cross-sections, markings
 *   menuPreview  — mega-menu hover preview
 *   homePreview  — homepage product range section
 */

export interface ProductVisualRole {
  src: string;
  alt: string;
  /** 'contain' for isolated product, 'cover' for contextual photography */
  fit: 'contain' | 'cover';
}

export interface ProductVisuals {
  card: ProductVisualRole;
  hero: ProductVisualRole;
  gallery: ProductVisualRole[];
  application?: ProductVisualRole;
  technicalDetail?: ProductVisualRole;
  video?: ProductVisualRole;
  menuPreview: ProductVisualRole;
  homePreview: ProductVisualRole;
}

/* ────────────────────────────────────────────
   Base paths
   ──────────────────────────────────────────── */

const ORIG = '/media/products/original-site';
const PROD = '/media/products';
const BRAND = '/brand';

/* ────────────────────────────────────────────
   HV Insulating Mats
   Carousel: 01 → 02 → 03 → existing gallery
   ──────────────────────────────────────────── */

export const hvVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/electrical-insulating-mats/client-hv/coined-insulating-mat-11.webp`,
    alt: 'Coined pattern high voltage insulating mat — complete product view',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/electrical-insulating-mats/client-hv/coined-insulating-mat-11.webp`,
    alt: 'Coined pattern high voltage insulating mat — complete product view',
    fit: 'contain',
  },
  gallery: [
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/dotted-insulating-mat-7.webp`,
      alt: 'Dotted pattern insulating mat — product view',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/dotted-mat-guided-strip-2.webp`,
      alt: 'Dotted insulating mat with guided strip — product view',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-02.webp`,
      alt: 'Hexagon pattern insulating mat — view 02',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-03.webp`,
      alt: 'Hexagon pattern insulating mat — view 03',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-04.webp`,
      alt: 'Hexagon pattern insulating mat — view 04',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-05.webp`,
      alt: 'Hexagon pattern insulating mat — view 05',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-06.webp`,
      alt: 'Hexagon pattern insulating mat — view 06',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-07.webp`,
      alt: 'Hexagon pattern insulating mat — view 07',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-thumb-02.webp`,
      alt: 'Hexagon insulating mat thumbnail — view 02',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-thumb-03.webp`,
      alt: 'Hexagon insulating mat thumbnail — view 03',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-thumb-04.webp`,
      alt: 'Hexagon insulating mat thumbnail — view 04',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-thumb-05.webp`,
      alt: 'Hexagon insulating mat thumbnail — view 05',
      fit: 'contain',
    },
    {
      src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-thumb-06.webp`,
      alt: 'Hexagon insulating mat thumbnail — view 06',
      fit: 'contain',
    },
  ],
  application: {
    src: `${PROD}/electrical-insulating-mats/client-hv/hexagon-insulating-mat-04.webp`,
    alt: 'Hexagon insulating mat in application',
    fit: 'cover',
  },
  menuPreview: {
    src: `${PROD}/electrical-insulating-mats/client-hv/coined-insulating-mat-11.webp`,
    alt: 'HV insulating mat preview',
    fit: 'cover',
  },
  homePreview: {
    src: `${PROD}/electrical-insulating-mats/client-hv/coined-insulating-mat-11.webp`,
    alt: 'Coined insulating mat preview',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   Auto Glow / Reflective Band
   Carousel: 10 → 11 → 12 → existing gallery
   ──────────────────────────────────────────── */

export const autoGlowVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-1.webp`,
    alt: 'Auto Glow insulating mat — product view 1',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-1.webp`,
    alt: 'Auto Glow reflective band insulating mat — product view',
    fit: 'contain',
  },
  gallery: [
    {
      src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-2.webp`,
      alt: 'Auto Glow insulating mat — product view 2',
      fit: 'contain',
    },
    {
      src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-3.webp`,
      alt: 'Auto Glow insulating mat — product view 3',
      fit: 'contain',
    },
    {
      src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-4.webp`,
      alt: 'Auto Glow insulating mat — product view 4',
      fit: 'cover',
    },
    {
      src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-17.webp`,
      alt: 'Auto Glow insulating mat — product view 17',
      fit: 'contain',
    },
  ],
  application: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-3.webp`,
    alt: 'Auto Glow mat in application',
    fit: 'cover',
  },
  video: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-video-11.mp4`,
    alt: 'Auto Glow reflective band insulating mat — product demonstration video',
    fit: 'contain',
  },
  menuPreview: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-1.webp`,
    alt: 'Auto Glow mat preview',
    fit: 'cover',
  },
  homePreview: {
    src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/autoglow-1.webp`,
    alt: 'Auto Glow reflective band preview',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   Bi-Colour
   Carousel: 07 → 08 → 09 → existing gallery
   ──────────────────────────────────────────── */

export const biColourVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/bi-color-insulating-mats/client-approved/bi-colour-card-cross-section.webp`,
    alt: 'Blue dual-layer insulating mat with contrasting red lower layer',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/bi-color-insulating-mats/client-bi-colour/product-01.png`,
    alt: 'Bi-Colour dual-layer insulating mat — complete product view',
    fit: 'contain',
  },
  gallery: [
    {
      src: `${PROD}/bi-color-insulating-mats/client-bi-colour/product-02.png`,
      alt: 'Bi-Colour insulating mat — alternate view showing dual-layer construction',
      fit: 'contain',
    },
    {
      src: `${PROD}/bi-color-insulating-mats/client-bi-colour/product-03.png`,
      alt: 'Bi-Colour insulating mat — close-up detail',
      fit: 'contain',
    },
    {
      src: `${PROD}/bi-color-insulating-mats/gallery/01-dual-layer-roll.webp`,
      alt: 'Bi-Colour dual-layer mat roll',
      fit: 'cover',
    },
  ],
  technicalDetail: {
    src: `${PROD}/bi-color-insulating-mats/product-demo-bi-color.webp`,
    alt: 'Bi-Colour layer identification diagram — cross-section',
    fit: 'contain',
  },
  menuPreview: {
    src: `${PROD}/bi-color-insulating-mats/bcim-hero-dual-layer-insulating-mat.webp`,
    alt: 'Bi-Colour mat preview',
    fit: 'cover',
  },
  homePreview: {
    src: `${PROD}/bi-color-insulating-mats/bcim-hero-dual-layer-insulating-mat.webp`,
    alt: 'Bi-Colour insulating mats',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   Colored Strip
   Carousel: 04 → 05 → 06 → existing gallery
   ──────────────────────────────────────────── */

export const coloredStripVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/coloured-strip-insulating-mats/client-approved/colored-strip-card-installation.webp`,
    alt: 'Blue insulating mat with yellow safety boundary strips',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/coloured-strip-insulating-mats/gallery/01-yellow-strip-hexa-mat.webp`,
    alt: 'Coloured strip insulating mat with yellow safety boundary — complete product view',
    fit: 'cover',
  },
  gallery: [
    {
      src: `${PROD}/coloured-strip-insulating-mats/gallery/02-yellow-strip-dot-mat.webp`,
      alt: 'Coloured strip mat with dot pattern and yellow boundary strip',
      fit: 'cover',
    },
    {
      src: `${PROD}/coloured-strip-insulating-mats/gallery/03-yellow-strip-angled.webp`,
      alt: 'Coloured strip insulating mat — angled view',
      fit: 'cover',
    },
    {
      src: `${PROD}/coloured-strip-insulating-mats/csim-application-switchgear-pathway.webp`,
      alt: 'Coloured strip mat installed beside switchgear as safety pathway',
      fit: 'cover',
    },
  ],
  application: {
    src: `${PROD}/coloured-strip-insulating-mats/csim-application-switchgear-pathway.webp`,
    alt: 'Colored strip insulating mat installed as safety pathway boundary',
    fit: 'cover',
  },
  menuPreview: {
    src: `${PROD}/coloured-strip-insulating-mats/csim-hero-coloured-strip-insulating-mat.webp`,
    alt: 'Colored Strip mat preview',
    fit: 'cover',
  },
  homePreview: {
    src: `${PROD}/coloured-strip-insulating-mats/csim-hero-coloured-strip-insulating-mat.webp`,
    alt: 'Colored Strip insulating mats',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   IEC 61111:2009 International
   Reuses: 01 (HV), 10 (Auto Glow), 07 (Bi-Colour)
   ──────────────────────────────────────────── */

export const iecVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/electrical-insulating-mats/eim-hero-electrical-insulating-mat.webp`,
    alt: 'IEC 61111:2009 compliant insulating mat',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/electrical-insulating-mats/client-hv-approved/domestic-hv-card.webp`,
    alt: 'Insulating mats to IEC 61111:2009',
    fit: 'cover',
  },
  gallery: [
    {
      src: `${PROD}/auto-glow-reflective-band-insulating-mats/client-approved/auto-glow-card-dark.webp`,
      alt: 'IEC Auto Glow variant — reflective boundary band',
      fit: 'cover',
    },
    {
      src: `${PROD}/bi-color-insulating-mats/client-approved/bi-colour-card-cross-section.webp`,
      alt: 'IEC Bi-Colour variant — dual-layer insulating mat',
      fit: 'cover',
    },
    {
      src: `${PROD}/international-iec/iec-61111-class-0-2-2mm.webp`,
      alt: 'IEC 61111 Class 0–2, 2mm insulating mat',
      fit: 'contain',
    },
    {
      src: `${PROD}/international-iec/iec-61111-class-2.webp`,
      alt: 'IEC 61111 Class 2 insulating mat marking',
      fit: 'contain',
    },
  ],
  menuPreview: {
    src: `${PROD}/electrical-insulating-mats/eim-hero-electrical-insulating-mat.webp`,
    alt: 'IEC 61111 mat preview',
    fit: 'cover',
  },
  homePreview: {
    src: '/media/categories/electrical-insulating-mats-category.png',
    alt: 'International IEC 61111 insulating mats',
    fit: 'contain',
  },
};

/* ────────────────────────────────────────────
   Geo Membrane (BharatMembrane)
   Carousel: 13 (white tunnel) → 14 (seam) → 15 (containment) → existing orange tunnel
   ──────────────────────────────────────────── */

export const membraneVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/bharat-membrane/bharatmembrane-tunnel-lining-clean.webp`,
    alt: 'PVC waterproof membrane lining inside an underground tunnel',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/bharat-membrane/bharatmembrane-tunnel-lining-clean.webp`,
    alt: 'White waterproof membrane lining installed inside an underground tunnel',
    fit: 'cover',
  },
  gallery: [
    {
      src: `${PROD}/bharat-membrane/bharatmembrane-overview-thermal-seam.webp`,
      alt: 'Geo Membrane Lining thermal seam welding detail',
      fit: 'cover',
    },
    {
      src: `${PROD}/bharat-membrane/bharatmembrane-application-containment.webp`,
      alt: 'Large containment basin lined with geomembrane',
      fit: 'cover',
    },
    {
      src: `${PROD}/bharat-membrane/gallery/01-tunnel-membrane-lining.webp`,
      alt: 'Original Geo Membrane Lining tunnel membrane lining installation',
      fit: 'cover',
    },
    {
      src: `${PROD}/bharat-membrane/gallery/02-yellow-membrane-tunnel.webp`,
      alt: 'Yellow membrane in tunnel installation',
      fit: 'cover',
    },
    {
      src: `${PROD}/bharat-membrane/gallery/03-membrane-seam-welding.webp`,
      alt: 'Membrane seam welding detail',
      fit: 'cover',
    },
    {
      src: `${PROD}/bharat-membrane/gallery/04-grey-tunnel-membrane.webp`,
      alt: 'Grey membrane lining installed inside a large tunnel structure with construction equipment',
      fit: 'cover',
    },
  ],
  application: {
    src: `${PROD}/bharat-membrane/bharatmembrane-application-containment.webp`,
    alt: 'Geo-membrane containment basin lining application',
    fit: 'cover',
  },
  menuPreview: {
    src: `${PROD}/bharat-membrane/bharatmembrane-tunnel-lining-clean.webp`,
    alt: 'Geo Membrane tunnel preview',
    fit: 'cover',
  },
  homePreview: {
    src: '/media/categories/waterproofing-solutions-category.png',
    alt: 'Waterproofing membrane being installed inside an infrastructure tunnel',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   Bharat Hydro Seal (Water Stop)
   Carousel: 16 → existing profile → existing application
   ──────────────────────────────────────────── */

export const hydroSealVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-card-black.webp`,
    alt: 'PVC water-stop profile with central bulb and ribbed wings',
    fit: 'contain',
  },
  hero: {
    src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-black-profile-01.webp`,
    alt: 'Black water-stop profile with central bulb on light background',
    fit: 'contain',
  },
  gallery: [
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-black-profile-01.webp`,
      alt: 'Black water-stop profile with central bulb on light background',
      fit: 'contain',
    },
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-white-profile-01.webp`,
      alt: 'White water-stop profile',
      fit: 'contain',
    },
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-black-profile-02.webp`,
      alt: 'Black water-stop profile alternate view',
      fit: 'contain',
    },
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-light-profile.webp`,
      alt: 'Light water-stop profile',
      fit: 'contain',
    },
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-black-ribbed-profile.webp`,
      alt: 'Black ribbed water-stop profile top view',
      fit: 'contain',
    },
    {
      src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-black-alternate.webp`,
      alt: 'Black water-stop alternate profile',
      fit: 'contain',
    },
  ],
  menuPreview: {
    src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-card-black.webp`,
    alt: 'Water Stop Seal preview',
    fit: 'contain',
  },
  homePreview: {
    src: `${PROD}/bharat-hydro-seal/client-approved/water-stop-card-black.webp`,
    alt: 'Water Stop Seal',
    fit: 'contain',
  },
};

/* ────────────────────────────────────────────
   PVC Flooring (Bharat Smart Floor)
   Carousel: 17 → 18 → 19
   ──────────────────────────────────────────── */

export const pvcFlooringVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-residential-interior.webp`,
    alt: 'Wood-look BharatSmart Floor PVC flooring in a modern residential living and home-office interior',
    fit: 'cover',
  },
  hero: {
    src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-residential-interior.webp`,
    alt: 'Wood-look BharatSmart Floor PVC flooring in a modern residential living and home-office interior',
    fit: 'cover',
  },
  gallery: [
    {
      src: `${PROD}/pvc-flooring-solutions/pvc-flooring-overview-surface-detail.webp`,
      alt: 'PVC flooring material surface detail and flexible edge',
      fit: 'cover',
    },
    {
      src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-office-reception.webp`,
      alt: 'Wood-look BharatSmart Floor PVC flooring in a modern office reception and waiting area',
      fit: 'cover',
    },
  ],
  application: {
    src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-office-reception.webp`,
    alt: 'Wood-look BharatSmart Floor PVC flooring in a modern office reception and waiting area',
    fit: 'cover',
  },
  menuPreview: {
    src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-residential-interior.webp`,
    alt: 'BharatSmart Floor PVC flooring for residential and commercial interiors',
    fit: 'cover',
  },
  homePreview: {
    src: `${PROD}/pvc-flooring-solutions/bharatsmart-floor-residential-interior.webp`,
    alt: 'BharatSmart Floor PVC flooring in a residential and commercial interior',
    fit: 'cover',
  },
};

/* ────────────────────────────────────────────
   Other Products
   Carousel: 20 → 21 → 22 → hose crop → 24 → 23
   ──────────────────────────────────────────── */

export const otherProductsVisuals: ProductVisuals = {
  card: {
    src: `${PROD}/other-products/other-products-hero-industrial-range.webp`,
    alt: 'Industrial rubber sheet, hose, ESD mat and conveyor products',
    fit: 'cover',
  },
  hero: {
    src: '/media/categories/other-products-category.png',
    alt: 'Industrial rubber sheet, hose, ESD mat and conveyor products',
    fit: 'contain',
  },
  gallery: [
    {
      src: `${PROD}/other-products/rubber-sheet-product-angle-01.webp`,
      alt: 'Rubber sheet product — industrial grade',
      fit: 'cover',
    },
    {
      src: `${PROD}/other-products/rubber-sheet-product-angle-02.webp`,
      alt: 'Rubber sheet product — alternate angle',
      fit: 'cover',
    },
    {
      src: `${PROD}/other-products/rubber-hose-derived-from-other-products.webp`,
      alt: 'Rubber hose pipe coil from industrial product range',
      fit: 'cover',
    },
    {
      src: `${PROD}/other-products/esd-mat-electronics-workbench.webp`,
      alt: 'ESD protective work mat on an electronics workbench',
      fit: 'cover',
    },
    {
      src: `${PROD}/other-products/conveyor-belt-industrial-application.webp`,
      alt: 'Industrial rubber conveyor belt installed on conveyor rollers',
      fit: 'cover',
    },
  ],
  menuPreview: {
    src: `${PROD}/other-products/other-products-hero-industrial-range.webp`,
    alt: 'Other products preview',
    fit: 'cover',
  },
  homePreview: {
    src: '/media/categories/other-products-category.png',
    alt: 'Industrial rubber sheet, hose, ESD mat and conveyor belt products',
    fit: 'contain',
  },
};

/* ────────────────────────────────────────────
   Aggregate export
   ──────────────────────────────────────────── */

export const productVisuals = {
  'electrical-insulating-mats': hvVisuals,
  'auto-glow-reflective-band-insulating-mats': autoGlowVisuals,
  'bi-color-insulating-mats': biColourVisuals,
  'coloured-strip-insulating-mats': coloredStripVisuals,
  'international-iec-61111': iecVisuals,
  'bharat-membrane': membraneVisuals,
  'bharat-hydro-seal': hydroSealVisuals,
  'pvc-flooring-solutions': pvcFlooringVisuals,
  'other-products': otherProductsVisuals,
} as const;

export type ProductVisualKey = keyof typeof productVisuals;

/** Get visuals for a product by slug. */
export function getProductVisuals(slug: string): ProductVisuals | undefined {
  return productVisuals[slug as ProductVisualKey];
}
