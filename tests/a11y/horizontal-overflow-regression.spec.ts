import { test, expect } from '@playwright/test';

/**
 * Horizontal-overflow regression suite.
 *
 * Guarantees that NO public route produces a horizontal scrollbar at any of
 * the required viewport widths. Prevents regressions of the homepage
 * sideways-shift bug (decorative hero pseudo-elements, long unbreakable H1
 * words, the product image carousel `aspect-ratio + min-height` width blowup,
 * and the ProductHero quick-facts row at the 1024px lg breakpoint).
 *
 * Assertion matches the spec:
 *   document.documentElement.scrollWidth - clientWidth <= 1
 *
 * Run with: npx playwright test tests/a11y/horizontal-overflow-regression.spec.ts
 */

/* Every public route (matches src/app/sitemap.ts + all page.tsx routes). */
const ROUTES = [
  '/',
  '/products',
  '/about-us',
  '/contact-us',
  '/products/electrical-insulating-mats',
  '/products/international-iec-61111',
  '/products/pvc-flooring-solutions',
  '/products/other-products',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/coloured-strip-insulating-mats',
];

/* Every viewport width required by the overflow QA spec. */
const WIDTHS = [320, 360, 390, 430, 768, 820, 1024, 1280, 1366, 1440, 1920];

/**
 * Measures document-level horizontal overflow on the current page.
 * Returns scrollWidth - clientWidth (0 or negative = no overflow).
 */
async function horizontalOverflow(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => {
    return (
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
    );
  });
}

/* ── Per route × per width: no horizontal overflow ── */
for (const route of ROUTES) {
  test.describe(`Horizontal overflow — ${route}`, () => {
    for (const width of WIDTHS) {
      test(`no horizontal scrollbar at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        // Allow fonts / images / reveal animations to settle.
        await page.waitForTimeout(400);
        const overflow = await horizontalOverflow(page);
        expect(overflow, `scrollWidth exceeded clientWidth by ${overflow}px`).toBeLessThanOrEqual(1);
      });
    }
  });
}

/* ── Homepage: opening the Products mega-menu must not add page width ── */
test.describe('Mega-menu does not cause overflow (desktop)', () => {
  for (const width of [1024, 1280, 1366, 1440, 1920]) {
    test(`mega-menu open stays within viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      const trigger = page
        .locator('header button[aria-haspopup="true"], header a[aria-haspopup="true"]')
        .first();
      if ((await trigger.count()) === 0) {
        // No mega-menu trigger on this width/config — skip gracefully.
        test.skip(true, 'no mega-menu trigger present');
      }
      await trigger.hover();
      await page.waitForTimeout(500);
      const overflow = await horizontalOverflow(page);
      expect(overflow).toBeLessThanOrEqual(1);
      // Also confirm the menu panel itself stays inside the viewport.
      const menuBox = await page
        .locator('div.absolute.left-1\\/2')
        .first()
        .boundingBox();
      if (menuBox) {
        expect(menuBox.x).toBeGreaterThanOrEqual(0);
        expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width + 1);
      }
    });
  }
});

/* ── Homepage: opening the mobile nav sheet must not add page width ── */
test.describe('Mobile nav sheet does not cause overflow', () => {
  for (const width of [320, 360, 390, 430]) {
    test(`mobile drawer open stays within viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      const toggle = page
        .locator('button[aria-label="Open navigation menu"]')
        .first();
      if ((await toggle.count()) === 0) {
        test.skip(true, 'no mobile menu toggle present');
      }
      await toggle.click();
      await page.waitForTimeout(500);
      const overflow = await horizontalOverflow(page);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
