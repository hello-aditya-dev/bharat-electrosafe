/**
 * Brand Showcase Data — Bharat Electrosafe
 *
 * Centralized data for the homepage rotating brand showcase. Two banner
 * compositions alternate automatically:
 *
 *   1. Electrical Safety & Specialized Brands — Bharat Electrosafe (BES®),
 *      INSULATICAA™, Bharat ElectroShield, Bharat PoleShield™.
 *   2. Flooring & Waterproofing Brands — Bharat SmartFloor (PVC) +
 *      BharatMembrane (Waterproofing).
 *
 * Each slide is a single centered logo group (NOT a two-column divider
 * table). The slide's `label` is shown as the category context above the
 * logos.
 *
 * Logos use the actual client-supplied brand assets from /brand/.
 * Each logo is rendered with `object-contain` inside a consistent visual
 * stage so its native aspect ratio is preserved.
 *
 * ™/® marks (BES®, INSULATICAA™, Bharat PoleShield™) are already embedded
 * in the supplied logo artwork — no duplicate overlay marks are added.
 *
 * A brand is linked only when a legitimate internal destination already
 * exists. The link is NOT used for navigation from the brand showcase —
 * every logo opens a view-only preview popup instead. The `href` is kept
 * only as a data-level reference.
 */

export interface BrandShowcaseItem {
  /** Brand display name (also used for alt text fallback). */
  name: string;
  /** Logo asset paths under /public. */
  logo: string;
  /** Accessible alt text for the logo image. */
  alt: string;
  /** Optional internal destination (data-level reference; not used for navigation from the showcase). */
  href?: string;
}

export interface BrandShowcaseSlide {
  /** Unique slide id. */
  id: 'electrical' | 'flooring-waterproofing';
  /** Slide title (used for aria labels / dot tooltips). */
  title: string;
  /** Category context label shown above the logos in this slide. */
  label: string;
  /** Brands displayed in this slide — rendered as one centered group. */
  brands: BrandShowcaseItem[];
}

/**
 * Single source of truth for the brand carousel. Exactly two logical
 * slides — the carousel's `active` index and pagination dot count are
 * derived directly from this array's length. Each slide is a single
 * centered logo group (no two-column divider).
 */
export const brandShowcaseSlides: BrandShowcaseSlide[] = [
  {
    id: 'electrical',
    title: 'Electrical Safety & Specialized Brands',
    label: 'Electrical Safety & Specialized Brands',
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
  {
    id: 'flooring-waterproofing',
    title: 'Flooring & Waterproofing Brands',
    label: 'Flooring & Waterproofing Brands',
    brands: [
      {
        name: 'Bharat SmartFloor',
        logo: '/brand/bharat-smart-floor-logo.webp',
        alt: 'Bharat SmartFloor logo',
        href: '/products/pvc-flooring-solutions',
      },
      {
        name: 'BharatMembrane',
        logo: '/brand/bharat-membrane-logo.webp',
        alt: 'BharatMembrane logo',
        href: '/products/waterproofing-solutions',
      },
    ],
  },
];
