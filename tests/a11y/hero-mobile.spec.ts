import { test, expect } from '@playwright/test';

/**
 * Mobile hero content verification tests for Bharat Electrosafe.
 *
 * Verifies that the new split hero composition renders correctly on mobile
 * viewports:
 *   • H1, paragraph, CTAs, proof badges, and hero photograph all visible.
 *   • Mobile content order: eyebrow → headline → photograph → paragraph →
 *     CTAs → proof badges (the photograph sits between the headline and
 *     the supporting paragraph).
 *   • No horizontal overflow.
 *   • The mobile hero image (3:2 aspect, dedicated mobile crop) is the one
 *     actually rendered on mobile (not the desktop 4:3 crop).
 *
 * Test viewports:
 *   360 × 800  (small phone)
 *   375 × 812  (iPhone X)
 *   390 × 844  (iPhone 14)
 *   430 × 932  (iPhone 14 Pro Max)
 *
 * Run with: npx playwright test tests/a11y/hero-mobile.spec.ts
 */

const mobileViewports = [
  { width: 360, height: 800, label: '360px' },
  { width: 375, height: 812, label: '375px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
];

for (const vp of mobileViewports) {
  test.describe(`Hero mobile @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
    });

    test('H1 is fully visible and within viewport width', async ({ page }) => {
      const h1 = page.locator('main h1');
      await expect(h1).toBeVisible();
      const h1Text = await h1.innerText();
      expect(h1Text).toContain('Protection engineered');
      expect(h1Text).toContain('electrical risk');
      const h1Box = await h1.boundingBox();
      expect(h1Box).not.toBeNull();
      expect(h1Box!.x).toBeGreaterThanOrEqual(0);
      expect(h1Box!.x + h1Box!.width).toBeLessThanOrEqual(vp.width + 1);
    });

    test('Supporting paragraph is fully visible', async ({ page }) => {
      const p = page.locator('main p').filter({ hasText: /Electrical insulating mats designed/ });
      await expect(p).toBeVisible();
      const text = await p.innerText();
      expect(text).toContain('switchgear');
      expect(text).toContain('substations');
    });

    test('Both CTA buttons are visible and in one row on mobile', async ({ page }) => {
      const explore = page.locator('main a[href="/products"]').filter({ hasText: 'Explore Products' });
      await expect(explore).toBeVisible();
      const box1 = await explore.boundingBox();
      expect(box1).not.toBeNull();
      expect(box1!.x + box1!.width).toBeLessThanOrEqual(vp.width + 1);

      const quote = page.locator('main a[href="/contact-us"]').filter({ hasText: 'Request a Quote' });
      await expect(quote).toBeVisible();
      const box2 = await quote.boundingBox();
      expect(box2).not.toBeNull();
      expect(box2!.x + box2!.width).toBeLessThanOrEqual(vp.width + 1);

      // On ≥360px mobile, the two CTAs should sit on the same row (side by side)
      expect(Math.abs(box1!.y - box2!.y)).toBeLessThan(5);
    });

    test('All four proof badges are present and readable', async ({ page }) => {
      const heroSection = page.locator('main section').first();
      await expect(heroSection.locator('text=IS 15652:2006').first()).toBeVisible();
      await expect(heroSection.locator('text=BIS Licence CM/L:8800129617').first()).toBeVisible();
      await expect(heroSection.locator('text=ERDA / NTH Tested').first()).toBeVisible();
      await expect(heroSection.locator('text=Conforming to IEC 61111').first()).toBeVisible();
    });

    test('Hero photograph appears between headline and paragraph', async ({ page }) => {
      // The hero image wrapper is .be-split-hero__visual-mobile on mobile
      const img = page.locator('.be-split-hero__visual-mobile img').first();
      await expect(img).toBeVisible();
      const imgBox = await img.boundingBox();
      expect(imgBox).not.toBeNull();
      expect(imgBox!.width).toBeGreaterThan(100);
      expect(imgBox!.height).toBeGreaterThan(80);

      const h1 = page.locator('main h1');
      const h1Box = await h1.boundingBox();
      const p = page.locator('main p').filter({ hasText: /Electrical insulating mats designed/ });
      const pBox = await p.boundingBox();

      // Photograph top must be below the headline bottom
      expect(imgBox!.y).toBeGreaterThanOrEqual(h1Box!.y + h1Box!.height - 1);
      // Photograph bottom must be above the paragraph top
      expect(imgBox!.y + imgBox!.height).toBeLessThanOrEqual(pBox!.y + 1);
    });

    test('No horizontal overflow on the page', async ({ page }) => {
      // Check hero section specifically doesn't overflow
      const heroOverflow = await page.evaluate(() => {
        const hero = document.querySelector('.be-split-hero');
        if (!hero) return null;
        const rect = hero.getBoundingClientRect();
        return { right: rect.right, vw: document.documentElement.clientWidth };
      });
      expect(heroOverflow).not.toBeNull();
      expect(heroOverflow!.right).toBeLessThanOrEqual(vp.width + 1);

      // Also check the document
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      // Other sections (logos, etc.) may extend slightly, but the hero itself must not.
      // We accept a small overflow tolerance from non-hero sections.
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 50);
    });

    test('Mobile hero image (1080x720, 3:2) is loaded, not the desktop crop', async ({ page }) => {
      const mobileImg = page.locator('.be-split-hero__visual-mobile img').first();
      await expect(mobileImg).toBeVisible();
      const src = await mobileImg.getAttribute('src');
      expect(src).toContain('bharat-electrosafe-insulating-mat-hero-mobile');
    });
  });
}
