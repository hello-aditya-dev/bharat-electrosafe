/**
 * Product Route Manifest — Bharat Electrosafe
 *
 * Single source of truth for all canonical product routes.
 * Components MUST consume routes from this file rather than
 * hardcoding path strings independently.
 *
 * This eliminates the class of defect where a route string is
 * updated in one location but not another.
 */

export interface ProductRoute {
  /** Unique key matching product slug or navigation group ID. */
  key: string;
  /** Human-readable display name for navigation. */
  displayName: string;
  /** The one canonical path — never a legacy path. */
  canonicalPath: string;
  /** Legacy paths that must permanently redirect to canonicalPath. */
  legacyPaths: string[];
  /** Parent route key (for breadcrumbs). */
  parentKey?: string;
  /** Fragment anchors available on this page. */
  anchors?: { id: string; label: string }[];
}

export const productRoutes: ProductRoute[] = [
  // ── Products Hub ──
  {
    key: 'products',
    displayName: 'Products',
    canonicalPath: '/products',
    legacyPaths: [],
  },

  // ── Electrical Insulating Mats Family ──
  {
    key: 'electrical-insulating-mats',
    displayName: 'Electrical Insulating Mats',
    canonicalPath: '/products/electrical-insulating-mats',
    legacyPaths: [],
    parentKey: 'products',
  },

  // ── HV Electrical Insulation Mats (Domestic) ──
  {
    key: 'high-voltage-electrical-insulation-mats',
    displayName: 'HV Electrical Insulating Mats',
    canonicalPath: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats',
    legacyPaths: [
      '/products/electrical-insulating-mats/domestic',
    ],
    parentKey: 'electrical-insulating-mats',
  },

  // ── Auto Glow ──
  {
    key: 'auto-glow-reflective-band-insulating-mats',
    displayName: 'Auto Glow',
    canonicalPath: '/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats',
    legacyPaths: [
      '/products/auto-glow-reflective-band-insulating-mats',
    ],
    parentKey: 'electrical-insulating-mats',
  },

  // ── Bi-Colour ──
  {
    key: 'bi-color-insulating-mats',
    displayName: 'Bi-Colour',
    canonicalPath: '/products/electrical-insulating-mats/bi-color-insulating-mats',
    legacyPaths: [
      '/products/bi-color-insulating-mats',
    ],
    parentKey: 'electrical-insulating-mats',
  },

  // ── Coloured Strip ──
  {
    key: 'coloured-strip-insulating-mats',
    displayName: 'Coloured Strip',
    canonicalPath: '/products/electrical-insulating-mats/coloured-strip-insulating-mats',
    legacyPaths: [
      '/products/coloured-strip-insulating-mats',
    ],
    parentKey: 'electrical-insulating-mats',
  },

  // ── International / Global (IEC 61111) ──
  {
    key: 'international-iec-61111',
    displayName: 'International / Global (IEC 61111:2009)',
    canonicalPath: '/products/electrical-insulating-mats/international-iec-61111',
    legacyPaths: [
      '/products/international-iec-61111',
    ],
    parentKey: 'electrical-insulating-mats',
    anchors: [
      { id: 'hv-insulating-mats', label: 'HV Insulating Mats' },
      { id: 'auto-glow', label: 'Auto Glow' },
      { id: 'bi-colour', label: 'Bi-Colour' },
    ],
  },

  // ── Waterproofing Solutions ──
  {
    key: 'waterproofing-solutions',
    displayName: 'Waterproofing Solutions',
    canonicalPath: '/products/waterproofing-solutions',
    legacyPaths: [],
    parentKey: 'products',
  },

  // ── Geo Membrane Lining (migrated from /products/bharat-membrane) ──
  {
    key: 'bharat-membrane',
    displayName: 'Geo Membrane Lining',
    canonicalPath: '/products/geo-membrane-lining',
    legacyPaths: ['/products/bharat-membrane'],
    parentKey: 'waterproofing-solutions',
  },

  // ── Water Stop Seal (migrated from /products/bharat-hydro-seal) ──
  {
    key: 'bharat-hydro-seal',
    displayName: 'Water Stop Seal',
    canonicalPath: '/products/water-stop-seal',
    legacyPaths: ['/products/bharat-hydro-seal'],
    parentKey: 'waterproofing-solutions',
  },

  // ── PVC Flooring ──
  {
    key: 'pvc-flooring-solutions',
    displayName: 'PVC Flooring Solutions',
    canonicalPath: '/products/pvc-flooring-solutions',
    legacyPaths: [],
    parentKey: 'products',
  },

  // ── Other Products ──
  {
    key: 'other-products',
    displayName: 'Other Products',
    canonicalPath: '/products/other-products',
    legacyPaths: [],
    parentKey: 'products',
    anchors: [
      { id: 'rubber-sheet', label: 'Rubber Sheet' },
      { id: 'rubber-hose-pipe', label: 'Rubber Hose Pipe' },
      { id: 'esd-mat', label: 'ESD Mat' },
      { id: 'conveyor-belt', label: 'Conveyor Belt' },
    ],
  },
];

/** Get a route by key. */
export function getRoute(key: string): ProductRoute | undefined {
  return productRoutes.find((r) => r.key === key);
}

/** Get the canonical path for a key. */
export function getCanonicalPath(key: string): string | undefined {
  return getRoute(key)?.canonicalPath;
}

/**
 * Resolve a product slug to its canonical path.
 *
 * This is the CRITICAL function that prevents the `/products/${slug}`
 * anti-pattern. Every component that constructs a product URL MUST
 * go through this function (or use PRODUCT_ROUTES directly).
 *
 * For products nested under Electrical Insulating Mats, this returns
 * the full nested path. For top-level products, it returns the simple
 * `/products/${slug}` path.
 */
export function getCanonicalProductPath(slug: string): string {
  const route = getRoute(slug);
  if (route) return route.canonicalPath;

  // Fallback: if the slug is not in the route manifest, construct
  // the default top-level path. This should NOT happen for known
  // products — it's a safety net only.
  return `/products/${slug}`;
}

/**
 * Build the full breadcrumb trail for a product by walking the
 * parentKey chain up to the root.
 */
export function getProductBreadcrumb(
  slug: string,
  displayName?: string,
): { label: string; href?: string }[] {
  const route = getRoute(slug);
  if (!route) {
    return [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: displayName ?? slug },
    ];
  }

  // Walk the parent chain
  const trail: { label: string; href?: string }[] = [];
  let current: ProductRoute | undefined = route;

  while (current) {
    trail.unshift({
      label: current.displayName,
      // The current (leaf) item has no href — it's the current page
      ...(current.key !== slug ? { href: current.canonicalPath } : {}),
    });
    current = current.parentKey ? getRoute(current.parentKey) : undefined;
  }

  // Prepend Home
  trail.unshift({ label: 'Home', href: '/' });

  return trail;
}

/** Get all legacy paths that must redirect. */
export function getAllLegacyRedirects(): { from: string; to: string }[] {
  const redirects: { from: string; to: string }[] = [];
  for (const route of productRoutes) {
    for (const legacy of route.legacyPaths) {
      redirects.push({ from: legacy, to: route.canonicalPath });
    }
  }
  return redirects;
}

/** Check if a path is a known legacy route. */
export function isLegacyPath(path: string): boolean {
  return productRoutes.some((r) => r.legacyPaths.includes(path));
}

/**
 * Static PRODUCT_ROUTES object for direct imports.
 * Use this when you need a specific route without a function call.
 */
export const PRODUCT_ROUTES = {
  products: '/products' as const,
  electricalInsulatingMats: '/products/electrical-insulating-mats' as const,
  hv: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats' as const,
  autoGlow: '/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats' as const,
  biColour: '/products/electrical-insulating-mats/bi-color-insulating-mats' as const,
  colouredStrip: '/products/electrical-insulating-mats/coloured-strip-insulating-mats' as const,
  international: '/products/electrical-insulating-mats/international-iec-61111' as const,
  waterproofingSolutions: '/products/waterproofing-solutions' as const,
  geoMembrane: '/products/geo-membrane-lining' as const,
  hydroSeal: '/products/water-stop-seal' as const,
  pvcFlooring: '/products/pvc-flooring-solutions' as const,
  otherProducts: '/products/other-products' as const,
};
