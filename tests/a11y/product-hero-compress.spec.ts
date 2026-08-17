import { test, expect } from '@playwright/test';

/**
 * Product-detail hero compression tests for Bharat Electrosafe.
 *
 * Verifies all six product pages have compressed heroes that fit within
 * a laptop viewport (1366x768) without scrolling past key content.
 *
 * Run with: npx playwright test tests/a11y/product-hero-compress.spec.ts
 */

const productRoutes = [
  '/products/electrical-insulating-mats',
  '/products/coloured-strip-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
];

const desktopViewports = [
  { width: 1024, height: 768, label: '1024x768' },
  { width: 1366, height: 768, label: '1366x768' },
  { width: 1440, height: 900, label: '1440x900' },
];

for (const route of productRoutes) {
  const shortName = route.split('/').pop()!.replace(/-/g, ' ');
  for (const vp of desktopViewports) {
    test.describe(`${shortName} @ ${vp.label}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);
        await page.evaluate(() => window.scrollTo(0, 0));
      });

      test('Product H1 is visible and within viewport', async ({ page }) => {
        const h1 = page.locator('main h1');
        await expect(h1).toBeVisible();
        const h1Box = await h1.boundingBox();
        expect(h1Box).not.toBeNull();
        expect(h1Box!.y + h1Box!.height).toBeLessThanOrEqual(vp.height + 1);
      });

      test('CTA "Request a Quote" is visible and within viewport', async ({ page }) => {
        const cta = page.locator('main a[href="/contact-us"]').filter({ hasText: 'Request a Quote' }).first();
        await expect(cta).toBeVisible();
        const box = await cta.boundingBox();
        expect(box).not.toBeNull();
        // Allow slight overflow at 1024x768 (small laptop) — primary target is 1366x768
        expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 30);
      });

      test('Main carousel is visible and within viewport', async ({ page }) => {
        const gallery = page.locator('main [role="group"][aria-label*="image gallery" i]');
        await expect(gallery).toBeVisible();
        const box = await gallery.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 1);
      });

      test('No horizontal overflow', async ({ page }) => {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
      });
    });
  }
}

// Trust strip visibility at 1366x768
for (const route of productRoutes) {
  const shortName = route.split('/').pop()!.replace(/-/g, ' ');
  test.describe(`Trust strip @ 1366x768 — ${shortName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto(route);
    });

    test('Trust strip is visible in a connected band', async ({ page }) => {
      // The shared ProductAssuranceGrid renders a section with the semantic
      // heading "Product assurance" and one <li> per assurance item.
      const trustItems = page.locator(
        'section[aria-labelledby="product-assurance-heading"] .be-assurance-item'
      );
      const firstTrust = trustItems.first();
      await expect(firstTrust).toBeVisible();
      // Trust strip should be near or below viewport (it's in the connected band)
      const box = await firstTrust.boundingBox();
      expect(box).not.toBeNull();
      // Should be reasonably close to the viewport bottom (within 200px)
      expect(box!.y).toBeLessThan(768 + 200);
    });
  });
}

// Mobile regression — one representative product
test.describe('Product hero mobile regression @ 390x844', () => {
  const testRoute = '/products/electrical-insulating-mats';

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(testRoute);
  });

  test('Product name, CTA and carousel are visible', async ({ page }) => {
    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    await expect(page.locator('main a[href="/contact-us"]').filter({ hasText: 'Request a Quote' }).first()).toBeVisible();
    await expect(page.locator('main [role="group"][aria-label*="image gallery" i]')).toBeVisible();
  });

  test('Carousel thumbnails are accessible', async ({ page }) => {
    const thumbs = page.locator('main [role="group"] button[aria-current]');
    const count = await thumbs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('No horizontal overflow', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
  });
});
