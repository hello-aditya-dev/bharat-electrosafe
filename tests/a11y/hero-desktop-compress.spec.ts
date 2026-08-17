import { test, expect } from '@playwright/test';

/**
 * Desktop / tablet hero compression tests for Bharat Electrosafe.
 *
 * Verifies the split hero composition on desktop and tablet viewports:
 *   • Two-column layout: copy left, photograph right.
 *   • Hero H1, paragraph, CTAs, proof badges all visible.
 *   • No horizontal overflow.
 *   • Hero fits comfortably in a 1366×768 laptop viewport (no forced
 *     min-height that pushes content below the fold).
 *
 * Test viewports:
 *   1024 × 768   (tablet landscape / small laptop)
 *   1366 × 768   (most common laptop)
 *   1440 × 900   (large laptop)
 *   1920 × 1080  (desktop)
 *
 * Run with: npx playwright test tests/a11y/hero-desktop-compress.spec.ts
 */

const desktopViewports = [
  { width: 1024, height: 768,  label: '1024x768'  },
  { width: 1366, height: 768,  label: '1366x768'  },
  { width: 1440, height: 900,  label: '1440x900'  },
  { width: 1920, height: 1080, label: '1920x1080' },
];

for (const vp of desktopViewports) {
  test.describe(`Hero desktop @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, 0));
    });

    test('H1 headline is visible and within viewport', async ({ page }) => {
      const h1 = page.locator('main h1');
      await expect(h1).toBeVisible();
      const h1Text = await h1.innerText();
      expect(h1Text).toContain('Protection engineered');
      expect(h1Text).toContain('electrical risk');

      const h1Box = await h1.boundingBox();
      expect(h1Box).not.toBeNull();
      expect(h1Box!.x).toBeGreaterThanOrEqual(0);
      expect(h1Box!.y).toBeGreaterThanOrEqual(0);
      expect(h1Box!.y + h1Box!.height).toBeLessThanOrEqual(vp.height + 1);
    });

    test('Supporting paragraph is visible', async ({ page }) => {
      const p = page.locator('main p').filter({ hasText: /Electrical insulating mats designed/ });
      await expect(p).toBeVisible();
    });

    test('Both CTA buttons are visible', async ({ page }) => {
      const explore = page.locator('main a[href="/products"]').filter({ hasText: 'Explore Products' });
      await expect(explore).toBeVisible();
      const quote = page.locator('main a[href="/contact-us"]').filter({ hasText: 'Request a Quote' });
      await expect(quote).toBeVisible();
    });

    test('All four proof badges are visible', async ({ page }) => {
      const heroSection = page.locator('main section').first();
      await expect(heroSection.locator('text=IS 15652:2006').first()).toBeVisible();
      await expect(heroSection.locator('text=BIS Licence CM/L:8800129617').first()).toBeVisible();
      await expect(heroSection.locator('text=ERDA / NTH Tested').first()).toBeVisible();
      await expect(heroSection.locator('text=Conforming to IEC 61111').first()).toBeVisible();
    });

    test('Desktop hero image (1200x900, 4:3) is rendered on desktop', async ({ page }) => {
      const desktopImg = page.locator('.be-split-hero__visual-desktop img').first();
      await expect(desktopImg).toBeVisible();
      const src = await desktopImg.getAttribute('src');
      // The desktop image src should NOT contain '-mobile'
      expect(src).not.toContain('-mobile');
      expect(src).toContain('bharat-electrosafe-insulating-mat-hero');
    });

    test('Two-column split layout: copy on left, photograph on right', async ({ page }) => {
      const h1 = page.locator('main h1');
      const img = page.locator('.be-split-hero__visual-desktop img').first();
      const h1Box = await h1.boundingBox();
      const imgBox = await img.boundingBox();
      expect(h1Box).not.toBeNull();
      expect(imgBox).not.toBeNull();
      // Image is to the right of the H1
      expect(imgBox!.x).toBeGreaterThan(h1Box!.x + h1Box!.width - 1);
      // Image vertically overlaps the H1 (both columns are roughly center-aligned)
      // Image top should be roughly within the hero section
      expect(imgBox!.y).toBeGreaterThanOrEqual(0);
      expect(imgBox!.y + imgBox!.height).toBeLessThanOrEqual(vp.height + 1);
    });

    test('No horizontal overflow', async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });
  });
}

// Mobile regression guard — verify mobile hero also works after desktop changes
test.describe('Hero mobile regression @ 390x844', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('H1 is fully visible on mobile', async ({ page }) => {
    const h1 = page.locator('main h1');
    await expect(h1).toBeVisible();
    const h1Text = await h1.innerText();
    expect(h1Text).toContain('Protection engineered');
    expect(h1Text).toContain('electrical risk');
    const h1Box = await h1.boundingBox();
    expect(h1Box).not.toBeNull();
    expect(h1Box!.x + h1Box!.width).toBeLessThanOrEqual(391);
  });

  test('Photograph appears between headline and paragraph on mobile', async ({ page }) => {
    const img = page.locator('.be-split-hero__visual-mobile img').first();
    await expect(img).toBeVisible();
    const imgBox = await img.boundingBox();
    const h1 = page.locator('main h1');
    const h1Box = await h1.boundingBox();
    const p = page.locator('main p').filter({ hasText: /Electrical insulating mats designed/ });
    const pBox = await p.boundingBox();
    // Image is below H1
    expect(imgBox!.y).toBeGreaterThanOrEqual(h1Box!.y + h1Box!.height - 1);
    // Image is above paragraph
    expect(imgBox!.y + imgBox!.height).toBeLessThanOrEqual(pBox!.y + 1);
  });

  test('CTAs and proof badges all visible', async ({ page }) => {
    await expect(page.locator('main a[href="/products"]').filter({ hasText: 'Explore Products' })).toBeVisible();
    await expect(page.locator('main a[href="/contact-us"]').filter({ hasText: 'Request a Quote' })).toBeVisible();

    const heroSection = page.locator('main section').first();
    await expect(heroSection.locator('text=IS 15652:2006').first()).toBeVisible();
    await expect(heroSection.locator('text=BIS Licence CM/L:8800129617').first()).toBeVisible();
    await expect(heroSection.locator('text=ERDA / NTH Tested').first()).toBeVisible();
    await expect(heroSection.locator('text=Conforming to IEC 61111').first()).toBeVisible();
  });

  test('No horizontal overflow on mobile', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
  });
});
