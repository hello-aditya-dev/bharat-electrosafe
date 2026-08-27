/**
 * Brand Showcase Data — Bharat Electrosafe
 *
 * Centralized data for the homepage rotating brand showcase. Two banner
 * compositions alternate automatically:
 *
 *   1. Insulating Mat Brands — Bharat Electrosafe, INSULATICAA,
 *      Bharat ElectroShield, Bharat PoleShield.
 *   2. PVC Floor + Waterproofing Brands — Bharat SmartFloor,
 *      BharatMembrane.
 *
 * Logos use the actual client-supplied brand assets from /brand/.
 * Each logo is rendered with `object-contain` so its native aspect
 * ratio is preserved inside a consistent visual area.
 *
 * A brand is linked only when a legitimate internal destination already
 * exists. Brands without a dedicated route remain non-clickable
 * (informational only) — no routes are invented for this showcase.
 */

export interface BrandShowcaseItem {
  /** Brand display name (also used for alt text fallback). */
  name: string;
  /** Logo asset path under /public. */
  logo: string;
  /** Accessible alt text for the logo image. */
  alt: string;
  /** Optional internal destination if a real product/brand page exists. */
  href?: string;
}

export interface BrandShowcaseSlide {
  /** Unique slide id. */
  id: 'electrical' | 'pvc-waterproofing';
  /** Small category label shown above the logos. */
  title: string;
  /** Brands displayed in this slide. */
  brands: BrandShowcaseItem[];
}

export const brandShowcaseSlides: BrandShowcaseSlide[] = [
  {
    id: 'electrical',
    title: 'Insulating Mat Brands',
    brands: [
      {
        name: 'Bharat Electrosafe',
        logo: '/brand/bharat-electrosafe-logo-clean.png',
        alt: 'Bharat Electrosafe logo',
      },
      {
        name: 'INSULATICAA',
        logo: '/brand/insulaticaa-logo.webp',
        alt: 'INSULATICAA logo',
      },
      {
        name: 'Bharat ElectroShield',
        logo: '/brand/bharat-electro-shield-logo.webp',
        alt: 'Bharat ElectroShield logo',
      },
      {
        name: 'Bharat PoleShield',
        logo: '/brand/bharat-poleshield-logo.jpeg',
        alt: 'Bharat PoleShield logo',
        href: '/products/bharat-poleshield',
      },
    ],
  },
  {
    id: 'pvc-waterproofing',
    title: 'PVC Floor Brands',
    brands: [
      {
        name: 'Bharat SmartFloor',
        logo: '/brand/bharat-smart-floor-logo.webp',
        alt: 'Bharat SmartFloor logo',
        href: '/products/pvc-flooring-solutions',
      },
    ],
  },
];

/**
 * The second visual group inside slide 2 — the waterproofing brands.
 * Kept as a separate constant so slide 2 can render two labeled
 * sub-groups (PVC Floor + Waterproofing) from the same data shape.
 */
export const waterproofingBrands: BrandShowcaseItem[] = [
  {
    name: 'BharatMembrane',
    logo: '/brand/bharat-membrane-logo.webp',
    alt: 'BharatMembrane logo',
    href: '/products/waterproofing-solutions',
  },
];
