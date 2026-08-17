/**
 * Asset Slot System
 *
 * Slots describe the non-product editorial imagery — hero, capability,
 * leadership, awards — where the page owns the image rather than a product.
 *
 * Product imagery is NOT here. Each product carries its own `images` block in
 * `src/data/products.ts`, so a product shows the same photograph on its card,
 * its hero and any related-product tile without components choosing for
 * themselves.
 *
 * Every slot below resolves to a real local file. A slot with no genuine
 * asset is deleted rather than left empty, so `EmptyMediaFallback` never
 * renders as a normal page state.
 */

export interface AssetSlot {
  /** Unique identifier for the slot, e.g. "HOME-HERO-01" */
  slotId: string;
  /** Path to the current image. */
  currentFallbackPath: string;
  /** Alt text for accessibility */
  altText: string;
  /** CSS aspect ratio for desktop viewport, e.g. "16/10" */
  desktopAspectRatio: string;
  /** CSS aspect ratio for mobile viewport, e.g. "4/3" */
  mobileAspectRatio: string;
  /** CSS object-position value, e.g. "center" or "top center" */
  objectPosition: string;
  /** Category grouping for replacement management */
  replacementCategory: string;
}

export const assetSlots: AssetSlot[] = [
  /* ── Home page ── */
  {
    slotId: 'HOME-HERO-01',
    currentFallbackPath: '/media/home/hero-product.webp',
    altText:
      'Bharat Electrosafe electrical insulating mat — Class B with anti-skid coin pattern surface',
    desktopAspectRatio: '16/10',
    mobileAspectRatio: '4/3',
    objectPosition: 'center',
    replacementCategory: 'product-hero',
  },
  {
    slotId: 'HOME-CAPABILITY-01',
    currentFallbackPath: '/media/manufacturing/production-line.webp',
    altText:
      'Insulating mat production line inside the Bharat Electrosafe manufacturing setup',
    desktopAspectRatio: '16/10',
    mobileAspectRatio: '4/3',
    objectPosition: 'center',
    replacementCategory: 'manufacturing',
  },

  /* ── About page ── */
  {
    slotId: 'ABOUT-INTRO-01',
    currentFallbackPath: '/media/home/about-overview.webp',
    altText: 'Bharat Electrosafe insulating mat range presented as a product overview',
    desktopAspectRatio: '16/10',
    mobileAspectRatio: '4/3',
    objectPosition: 'center',
    replacementCategory: 'company',
  },
  {
    slotId: 'ABOUT-MANUFACTURING-01',
    currentFallbackPath: '/media/manufacturing/production-line.webp',
    altText: 'Manufacturing setup and insulating mat production line',
    desktopAspectRatio: '16/10',
    mobileAspectRatio: '4/3',
    objectPosition: 'center',
    replacementCategory: 'manufacturing',
  },
  {
    slotId: 'ABOUT-VALUES-01',
    currentFallbackPath: '/media/home/core-values.webp',
    altText: 'Bharat Electrosafe core values illustration',
    desktopAspectRatio: '4/3',
    mobileAspectRatio: '4/3',
    objectPosition: 'center',
    replacementCategory: 'company',
  },
];

/**
 * Helper: find a slot by its ID.
 */
export function getSlotById(slotId: string): AssetSlot | undefined {
  return assetSlots.find((s) => s.slotId === slotId);
}

/**
 * Helper: get all slots in a given category.
 */
export function getSlotsByCategory(category: string): AssetSlot[] {
  return assetSlots.filter((s) => s.replacementCategory === category);
}
