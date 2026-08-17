import { test, expect } from '@playwright/test';

/**
 * Product-assurance regression tests for Bharat Electrosafe.
 *
 * These tests guard against the BharatMembrane duplicate-documentation bug
 * that was visible in production: the assurance strip beneath the hero
 * rendered both "Technical documentation available" and "Technical
 * documentation available on request" at the same time, because
 * `ProductHero` concatenated `product.trustPoints` with a hard-coded
 * `staticTrustIndicators` array and never deduplicated.
 *
 * The fix introduced a stable `AssuranceId` type, moved every product's
 * assurance items into `product.assuranceItems`, and rendered them through
 * a single shared `ProductAssuranceGrid` component that pulls items via
 * `getProductAssuranceItems()` — which merges product-specific items with
 * shared defaults and deduplicates by ID.
 *
 * These tests verify, for every product route:
 *
 *   1. Exactly one assurance section renders.
 *   2. Exactly one `documentation` item renders.
 *   3. No two rendered items share the same assurance ID.
 *   4. The legacy uppercase strings are absent.
 *   5. Civil products (BharatMembrane, Bharat Hydro Seal) do not inherit
 *      insulating-mat certifications (IS 15652:2006, BIS insulating-mat
 *      licence, ERDA / NTH insulating-mat testing).
 *   6. No horizontal overflow at mobile breakpoints.
 *
 * Run with: npx playwright test tests/a11y/product-assurance.spec.ts
 */

const productRoutes = [
  '/products/electrical-insulating-mats',
  '/products/coloured-strip-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
];

/** Returns the rendered assurance items as `{ id, label }` pairs. */
async function readAssuranceItems(page: import('@playwright/test').Page) {
  const items = page.locator('.be-assurance-item');
  const count = await items.count();
  const result: { id: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const id = await items.nth(i).getAttribute('data-assurance-id');
    const label = (await items.nth(i).textContent())?.trim() ?? '';
    if (id) result.push({ id, label });
  }
  return result;
}

for (const route of productRoutes) {
  const shortName = route.split('/').pop()!;

  test.describe(`Product assurance — ${shortName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('renders exactly one assurance section', async ({ page }) => {
      const sections = page.locator('section[aria-labelledby="product-assurance-heading"]');
      await expect(sections).toHaveCount(1);
    });

    test('renders exactly one documentation item', async ({ page }) => {
      const docItems = page.locator('.be-assurance-item[data-assurance-id="documentation"]');
      await expect(docItems).toHaveCount(1);
    });

    test('renders no duplicate assurance IDs', async ({ page }) => {
      const items = await readAssuranceItems(page);
      const ids = items.map((i) => i.id);
      const unique = new Set(ids);
      expect(unique.size, `items: ${JSON.stringify(items)}`).toBe(ids.length);
    });

    test('does not render the legacy uppercase documentation string', async ({ page }) => {
      // The legacy bug rendered the documentation label uppercased via a
      // Tailwind `uppercase` class. The new component uses sentence case
      // and a single documentation item, so the uppercased legacy strings
      // must never appear anywhere in the rendered body.
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('TECHNICAL DOCUMENTATION AVAILABLE');
      expect(bodyText).not.toContain('TECHNICAL DOCUMENTATION AVAILABLE ON REQUEST');
    });

    test('does not render the legacy duplicate delivery string', async ({ page }) => {
      // The legacy static strip said "Delivery confirmed with each quotation".
      // The new shared default says "Delivery schedule confirmed with quotation".
      // The legacy phrasing must not survive anywhere in the rendered body.
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('DELIVERY CONFIRMED WITH EACH QUOTATION');
    });

    test('uses sentence-case labels (no all-caps trust labels)', async ({ page }) => {
      const items = page.locator('.be-assurance-item');
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const text = (await items.nth(i).textContent())?.trim() ?? '';
        // A label is "all-caps" if it has at least 4 letters and every letter
        // is uppercase. IS 15652:2006 / IS 15909:2020 / IS 15058:2002 / BIS
        // Licence CM/L:8800129617 / ERDA / NTH tested are intentionally mixed
        // case (letters + digits + punctuation), so they will not trigger.
        const letters = text.replace(/[^A-Za-z]/g, '');
        if (letters.length < 4) continue;
        const isAllCaps = letters === letters.toUpperCase();
        expect(isAllCaps, `all-caps label found: "${text}"`).toBe(false);
      }
    });

    test('assurance strip is compact (no excessive empty height)', async ({ page }) => {
      // The legacy strip had a large empty cream rectangle below the items.
      // The new component renders items in a 3-col grid with 24-28px vertical
      // padding. The strip's height should be driven by content, not by a
      // fixed minimum. Sanity bound: at desktop, a 6-item grid fits in
      // ~150-180px; we allow up to 320px to cover 7-item BHS at 1366.
      const strip = page.locator('section[aria-labelledby="product-assurance-heading"]');
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.reload();
      const box = await strip.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeLessThan(320);
    });
  });
}

// Civil-product correctness — BharatMembrane must not inherit insulating-mat
// certifications. This is the regression that originally put
// "IS 15652:2006 Certified" on the geo-membrane page.
test.describe('BharatMembrane — civil-product certification correctness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/bharat-membrane');
  });

  test('does not list IS 15652:2006 in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    expect(labels, `items: ${JSON.stringify(items)}`).not.toContain('IS 15652:2006');
  });

  test('does not list the BIS insulating-mat licence in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    for (const label of labels) {
      expect(label).not.toMatch(/CM\/L:8800129617/);
    }
  });

  test('does not list ERDA / NTH insulating-mat testing in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    for (const label of labels) {
      expect(label).not.toMatch(/ERDA/);
      expect(label).not.toMatch(/NTH/);
    }
  });

  test('lists IS 15909:2020 as the standard', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const standard = items.find((i) => i.id === 'standard');
    expect(standard, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(standard!.label).toBe('IS 15909:2020');
  });

  test('lists PVC geo-membrane as the material', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const material = items.find((i) => i.id === 'material');
    expect(material, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(material!.label).toBe('PVC geo-membrane');
  });

  test('lists thermally welded seams as the joining method', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const joining = items.find((i) => i.id === 'joining');
    expect(joining, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(joining!.label).toBe('Thermally welded seams');
  });

  test('renders exactly six items (3 product-specific + 3 defaults)', async ({ page }) => {
    const items = await readAssuranceItems(page);
    expect(items.length).toBe(6);
  });
});

// Civil-product correctness — Bharat Hydro Seal must not inherit insulating-mat
// certifications either.
test.describe('Bharat Hydro Seal — civil-product certification correctness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/bharat-hydro-seal');
  });

  test('does not list IS 15652:2006 in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    expect(labels, `items: ${JSON.stringify(items)}`).not.toContain('IS 15652:2006');
  });

  test('does not list the BIS insulating-mat licence in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    for (const label of labels) {
      expect(label).not.toMatch(/CM\/L:8800129617/);
    }
  });

  test('does not list ERDA / NTH insulating-mat testing in the assurance strip', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const labels = items.map((i) => i.label);
    for (const label of labels) {
      expect(label).not.toMatch(/ERDA/);
      expect(label).not.toMatch(/NTH/);
    }
  });

  test('lists IS 15058:2002 as the standard', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const standard = items.find((i) => i.id === 'standard');
    expect(standard, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(standard!.label).toBe('IS 15058:2002');
  });

  test('lists PVC water stop as the material', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const material = items.find((i) => i.id === 'material');
    expect(material, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(material!.label).toBe('PVC water stop');
  });

  test('renders exactly seven items (4 product-specific + 3 defaults)', async ({ page }) => {
    const items = await readAssuranceItems(page);
    expect(items.length).toBe(7);
  });
});

// Insulating-mat products keep their full certification set.
test.describe('Electrical insulating mats — full certification set', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/electrical-insulating-mats');
  });

  test('lists IS 15652:2006 as the standard', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const standard = items.find((i) => i.id === 'standard');
    expect(standard, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(standard!.label).toBe('IS 15652:2006');
  });

  test('lists the BIS insulating-mat licence', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const licence = items.find((i) => i.id === 'bis-licence');
    expect(licence, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(licence!.label).toBe('BIS Licence CM/L:8800129617');
  });

  test('lists ERDA / NTH testing', async ({ page }) => {
    const items = await readAssuranceItems(page);
    const testing = items.find((i) => i.id === 'testing');
    expect(testing, `items: ${JSON.stringify(items)}`).toBeDefined();
    expect(testing!.label).toBe('ERDA / NTH tested');
  });

  test('renders exactly six items (3 product-specific + 3 defaults)', async ({ page }) => {
    const items = await readAssuranceItems(page);
    expect(items.length).toBe(6);
  });
});

// Responsive smoke — assurance strip must not cause horizontal overflow.
const responsiveBreakpoints = [
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

for (const route of productRoutes) {
  const shortName = route.split('/').pop()!;
  for (const bp of responsiveBreakpoints) {
    test(`${shortName} @ ${bp.name} — no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(route);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `overflow at ${bp.name}`).toBeLessThanOrEqual(clientWidth + 1);

      // Every assurance item must be fully inside the viewport (no clipping).
      const items = page.locator('.be-assurance-item');
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const box = await items.nth(i).boundingBox();
        if (!box) continue;
        expect(box.x, `item ${i} x at ${bp.name}`).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, `item ${i} right edge at ${bp.name}`).toBeLessThanOrEqual(
          bp.width
        );
      }
    });
  }
}
