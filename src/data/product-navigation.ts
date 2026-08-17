/**
 * Product Navigation Hierarchy — Bharat Electrosafe
 *
 * Central hierarchical taxonomy for the client's final product information
 * architecture. Used by:
 *   - Desktop mega-menu (Header.tsx)
 *   - Mobile navigation drawer (Header.tsx)
 *   - /products overview page
 *   - Footer product links
 *   - Breadcrumbs
 *   - Sitemap
 *
 * This is NAVIGATION GROUPING, separate from PRODUCT TECHNICAL DATA.
 * A product can live beneath Domestic/International in navigation
 * without duplicating technical records.
 *
 * The old two-category taxonomy ("Electrical Insulation",
 * "Waterproofing and Civil Protection") is replaced by this four-group
 * hierarchy per client direction.
 */

/* ────────────────────────────────────────────
   Navigation node types
   ──────────────────────────────────────────── */

/** A product item that links to an existing product page. */
export interface ProductNavLeaf {
  /** Visible name in navigation. */
  name: string;
  /** Route path (may include anchor hash for multi-section pages). */
  href: string;
  /** Short description for tooltips/accessibility. */
  description: string;
}

/** A sub-group within a top-level group (e.g. "Domestic Mats" with standard "IS 15652:2006"). */
export interface ProductNavSubGroup {
  /** Visible sub-group heading. */
  name: string;
  /** Optional standard/certification reference (e.g. "IS 15652:2006", "IEC 61111:2009"). */
  standard?: string;
  /** Optional href if sub-group has its own page. */
  href?: string;
  /** Products within this sub-group. */
  items: ProductNavLeaf[];
}

/** A top-level product group in the navigation hierarchy. */
export interface ProductNavGroup {
  /** Unique identifier for the group. */
  id: string;
  /** Display number for the group (e.g. "01", "02", "03", "04"). */
  number: string;
  /** Visible group heading. */
  name: string;
  /** Optional href if the group itself is a page (e.g. PVC Flooring). */
  href?: string;
  /** Optional short description for the group. */
  description?: string;
  /** Sub-groups (e.g. Domestic / International) or direct items. */
  children: ProductNavSubGroup[] | ProductNavLeaf[];
  /** Whether children are sub-groups (true) or direct leaf items (false). */
  hasSubGroups: boolean;
}

/* ────────────────────────────────────────────
   Client-confirmed product hierarchy
   ──────────────────────────────────────────── */

export const productNavGroups: ProductNavGroup[] = [
  {
    id: 'electrical-insulating-mats',
    number: '01',
    name: 'Electrical Insulating Mats',
    href: '/products/electrical-insulating-mats',
    description: 'Operator protection near live electrical equipment',
    hasSubGroups: true,
    children: [
      {
        name: 'Domestic Mats',
        standard: 'IS 15652:2006',
        items: [
          {
            name: 'HV Insulating Mats',
            href: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats',
            description: 'Standard high-voltage insulating mats for operator protection',
          },
          {
            name: 'Auto Glow',
            href: '/products/auto-glow-reflective-band-insulating-mats',
            description: 'Insulating mats with reflective/glow visibility band for low-light conditions',
          },
          {
            name: 'Bi-Colour',
            href: '/products/bi-color-insulating-mats',
            description: 'Dual-colour insulating mats with visible layer differentiation',
          },
          {
            name: 'Colored Strip',
            href: '/products/coloured-strip-insulating-mats',
            description: 'Insulating mats with high-visibility coloured boundary strip',
          },
        ],
      },
      {
        name: 'International / Global',
        standard: 'IEC 61111:2009',
        href: '/products/international-iec-61111',
        items: [
          {
            name: 'HV Insulating Mats',
            href: '/products/international-iec-61111#hv-insulating-mats',
            description: 'IEC 61111 compliant high-voltage insulating mats',
          },
          {
            name: 'Auto Glow',
            href: '/products/international-iec-61111#auto-glow',
            description: 'IEC 61111 compliant insulating mats with auto-glow feature',
          },
          {
            name: 'Bi-Colour',
            href: '/products/international-iec-61111#bi-colour',
            description: 'IEC 61111 compliant bi-colour insulating mats',
          },
        ],
      },
    ],
  },
  {
    id: 'water-proofing-solutions',
    number: '02',
    name: 'Waterproofing Solutions',
    href: '/products/waterproofing-solutions',
    description: 'Waterproofing, containment and construction-joint sealing',
    hasSubGroups: true,
    children: [
      {
        name: 'Geo Membrane Lining',
        items: [
          {
            name: 'Geo Membrane Lining',
            href: '/products/geo-membrane-lining',
            description: 'Geo Membrane Lining PVC geo-membrane for containment and lining',
          },
        ],
      },
      {
        name: 'Water Stop Seal',
        items: [
          {
            name: 'Water Stop Seal',
            href: '/products/water-stop-seal',
            description: 'Water Stop Seal PVC water stop profile for construction joints',
          },
        ],
      },
    ],
  },
  {
    id: 'pvc-flooring-solutions',
    number: '03',
    name: 'PVC Flooring Solutions',
    href: '/products/pvc-flooring-solutions',
    description: 'PVC flooring for residential, office and commercial interiors (IS 3462:1986)',
    hasSubGroups: false,
    children: [
      {
        name: 'PVC Flooring Solutions',
        href: '/products/pvc-flooring-solutions',
        description: 'BharatSmart Floor™ — PVC flooring for homes, offices and commercial interiors',
      },
    ],
  },
  {
    id: 'other-products',
    number: '04',
    name: 'Other Products',
    href: '/products/other-products',
    description: 'Rubber Sheet, Rubber Hose Pipe, ESD Mat, Conveyor Belt',
    hasSubGroups: false,
    children: [
      {
        name: 'Rubber Sheet',
        href: '/products/other-products#rubber-sheet',
        description: 'Industrial rubber sheets',
      },
      {
        name: 'Rubber Hose Pipe',
        href: '/products/other-products#rubber-hose-pipe',
        description: 'Rubber hose pipes for industrial applications',
      },
      {
        name: 'ESD Mat',
        href: '/products/other-products#esd-mat',
        description: 'Electrostatic discharge protective mats',
      },
      {
        name: 'Conveyor Belt',
        href: '/products/other-products#conveyor-belt',
        description: 'Industrial conveyor belts',
      },
    ],
  },
];

/* ────────────────────────────────────────────
   Helper functions
   ──────────────────────────────────────────── */

/** Get all product leaf links from the hierarchy (flat list). */
export function getAllProductLinks(): ProductNavLeaf[] {
  const links: ProductNavLeaf[] = [];
  for (const group of productNavGroups) {
    if (group.hasSubGroups) {
      for (const child of group.children as ProductNavSubGroup[]) {
        links.push(...child.items);
      }
    } else {
      links.push(...(group.children as ProductNavLeaf[]));
    }
  }
  return links;
}

/** Get all unique hrefs from the hierarchy (for sitemap/SEO). */
export function getAllProductHrefs(): string[] {
  return [...new Set(getAllProductLinks().map((l) => l.href.split('#')[0]))];
}

/** Get a group by its ID. */
export function getGroupById(id: string): ProductNavGroup | undefined {
  return productNavGroups.find((g) => g.id === id);
}

/**
 * Category visual slots — architecture for future ImageZai category visuals.
 *
 * Each entry names a category and points to its current visual asset.
 * When the ImageZai phase supplies new images, only the `src` field
 * needs to change — no component redesign.
 *
 * Current visuals use real product images where available,
 * or CSS/graphic fallbacks where no honest photograph exists.
 */
export interface CategoryVisual {
  /** Category group ID matching productNavGroups. */
  groupId: string;
  /** Current image path (real product image or graphic fallback). */
  src: string;
  /** Alt text. */
  alt: string;
  /** Whether this is a real photo or a CSS/graphic placeholder. */
  isPlaceholder: boolean;
}

export const categoryVisuals: CategoryVisual[] = [
  {
    groupId: 'electrical-insulating-mats',
    src: '/media/products/electrical-insulating-mats/electrical-insulating-mats-black-yellow-card.webp',
    alt: 'Black electrical insulating mat with a yellow guided center strip and raised circular dot surface texture',
    isPlaceholder: false,
  },
  {
    groupId: 'water-proofing-solutions',
    src: '/media/categories/waterproofing-solutions-category.png',
    alt: 'Waterproofing membrane being installed inside an infrastructure tunnel',
    isPlaceholder: false,
  },
  {
    groupId: 'pvc-flooring-solutions',
    src: '/media/categories/pvc-flooring-solutions-category.png',
    alt: 'BharatSmart Floor PVC flooring for residential and commercial interiors',
    isPlaceholder: false,
  },
  {
    groupId: 'other-products',
    src: '/media/categories/other-products-category.png',
    alt: 'Industrial rubber sheet, hose, ESD mat and conveyor belt products',
    isPlaceholder: false,
  },
];

/** Get a category visual by group ID. */
export function getCategoryVisual(groupId: string): CategoryVisual | undefined {
  return categoryVisuals.find((v) => v.groupId === groupId);
}
