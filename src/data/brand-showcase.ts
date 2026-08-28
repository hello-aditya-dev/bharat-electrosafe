/**
 * Brand Showcase Data — Bharat Electrosafe
 *
 * Centralized data for the homepage rotating brand showcase. Two banner
 * compositions alternate automatically:
 *
 *   1. Insulating Mat Brands — Bharat Electrosafe, INSULATICAA,
 *      Bharat ElectroShield, Bharat PoleShield.
 *   2. PVC Floor + Waterproofing Brands — Bharat SmartFloor (PVC) +
 *      BharatMembrane (Waterproofing) shown as two labeled sub-groups.
 *
 * Logos use the actual client-supplied brand assets from /brand/.
 * Each logo is rendered with `object-contain` so its native aspect
 * ratio is preserved inside a consistent visual area.
 *
 * A brand is linked only when a legitimate internal destination already
 * exists. Brands without a dedicated route remain non-clickable
 * (informational only) — no routes are invented.
 */

export interface BrandShowcaseItem {
  /** Brand display name (also used for alt text fallback). */
  name: string;
  /** Logo asset paths under /public. */
  logo: string;
  /** Accessible alt text for the logo image. */
  alt: string;
  /** Optional internal destination if a real product/brand page exists. */
  href?: string;
}

/**
 * A labeled sub-group of brands within a slide. Slide 1 has a single
 * sub-group ("Insulating Mat Brands"). Slide 2 has two sub-groups
 * ("PVC Floor Brands" and "Waterproofing Brands") shown side by side
 * with a subtle divider.
 */
export interface BrandShowcaseSubGroup {
  /** Small category label shown above the logos in this sub-group. */
  label: string;
  /** Brands in this sub-group. */
  brands: BrandShowcaseItem[];
}

export interface BrandShowcaseSlide {
  /** Unique slide id. */
  id: 'electrical' | 'pvc-waterproofing';
  /** Slide title (used for aria labels / dot tooltips). */
  title: string;
  /** One or two labeled sub-groups. */
  subGroups: BrandShowcaseSubGroup[];
}

/**
 * Single source of truth for the brand carousel. Exactly two logical
 * slides — the carousel's `active` index and pagination dot count are
 * derived directly from this array's length.
 */
export const brandShowcaseSlides: BrandShowcaseSlide[] = [
  {
    id: 'electrical',
    title: 'Insulating Mat Brands',
    subGroups: [
      {
        label: 'Insulating Mat Brands',
        brands: [
          {
            name: 'Bharat Electrosafe',
            logo: '/brand/bharat-electrosafe-brand-logo.png',
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
    ],
  },
  {
    id: 'pvc-waterproofing',
    title: 'PVC Floor + Waterproofing Brands',
    subGroups: [
      {
        label: 'PVC Floor Brands',
        brands: [
          {
            name: 'Bharat SmartFloor',
            logo: '/brand/bharat-smart-floor-logo.webp',
            alt: 'Bharat SmartFloor logo',
            href: '/products/pvc-flooring-solutions',
          },
        ],
      },
      {
        label: 'Waterproofing Brands',
        brands: [
          {
            name: 'BharatMembrane',
            logo: '/brand/bharat-membrane-logo.webp',
            alt: 'BharatMembrane logo',
            href: '/products/waterproofing-solutions',
          },
        ],
      },
    ],
  },
];
