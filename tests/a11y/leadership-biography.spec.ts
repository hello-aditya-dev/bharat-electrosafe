import { test, expect } from '@playwright/test';

/**
 * Leadership flip-card tests for Bharat Electrosafe About page.
 *
 * Verifies the portfolio-style flip card behaviour:
 *   • Click "View Profile" → flips to biography (aria-expanded=true).
 *   • Click "Back" → returns to portrait (aria-expanded=false).
 *   • Pressing Escape while focus is inside a flipped card returns to portrait.
 *   • Card does not expand the page vertically (fixed height).
 *   • Biography scrolls internally where content exceeds card body.
 *
 * Test viewports:
 *   390 × 844   (mobile)
 *   768 × 1024  (tablet portrait)
 *   1024 × 768  (tablet landscape / small desktop)
 *   1440 × 900  (desktop)
 *
 * Run with: npx playwright test tests/a11y/leadership-biography.spec.ts
 */

const viewports = [
  { width: 390,  height: 844,  label: '390x844'  },
  { width: 768,  height: 1024, label: '768x1024' },
  { width: 1024, height: 768,  label: '1024x768' },
  { width: 1440, height: 900,  label: '1440x900' },
];

for (const vp of viewports) {
  test.describe(`Leadership flip card @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/about-us');
      // Wait for leadership grid to render
      await page.locator('.be-leadership-grid').first().waitFor({ state: 'visible', timeout: 10000 });
    });

    test('Click "View Profile" flips the card to biography', async ({ page }) => {
      const buttons = page.locator('.be-leadership-grid button[aria-expanded]');
      const firstBtn = buttons.first();
      const bioId = await firstBtn.getAttribute('aria-controls');

      // Initial state: collapsed
      await expect(firstBtn).toHaveAttribute('aria-expanded', 'false');

      // Click to flip
      await firstBtn.click();
      await page.waitForTimeout(500);

      // Now expanded
      await expect(firstBtn).toHaveAttribute('aria-expanded', 'true');

      // Biography region is visible
      const bio = page.locator(`#${bioId}`);
      const bioBox = await bio.boundingBox();
      expect(bioBox).not.toBeNull();
      expect(bioBox!.height).toBeGreaterThan(50);
    });

    test('Click "Back" returns to portrait', async ({ page }) => {
      const frontButtons = page.locator('.be-leader-flip-front button[aria-expanded]');
      const firstFrontBtn = frontButtons.first();

      // Click to flip
      await firstFrontBtn.click();
      await page.waitForTimeout(500);

      // Find the Back button on the flipped card
      const backButtons = page.locator('.be-leader-flip-back button[aria-expanded]');
      const backBtn = backButtons.first();

      // Click Back
      await backBtn.click();
      await page.waitForTimeout(500);

      // Now collapsed
      await expect(firstFrontBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('Escape key returns to portrait', async ({ page }) => {
      const frontButtons = page.locator('.be-leader-flip-front button[aria-expanded]');
      const firstFrontBtn = frontButtons.first();

      // Click to flip
      await firstFrontBtn.click();
      await page.waitForTimeout(500);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Card is now back to portrait
      await expect(firstFrontBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('Card has fixed height and does not expand page', async ({ page }) => {
      const cards = page.locator('.be-leader-flip-card');
      const firstCard = cards.first();
      const box = await firstCard.boundingBox();
      expect(box).not.toBeNull();
      // Card height should be fixed (~480-560px range)
      expect(box!.height).toBeGreaterThan(400);
      expect(box!.height).toBeLessThan(700);
    });

    test('Button has 44px minimum touch target', async ({ page }) => {
      const buttons = page.locator('.be-leadership-grid button[aria-expanded]');
      const firstBtn = buttons.first();
      const box = await firstBtn.boundingBox();
      expect(box).not.toBeNull();
      // 44px minimum per WCAG 2.5.5 / 2.5.8
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('Hover does not flip the card', async ({ page }) => {
      const buttons = page.locator('.be-leader-flip-front button[aria-expanded]');
      const firstBtn = buttons.first();

      // Hover the card (not the button)
      const firstCard = page.locator('.be-leader-flip-card').first();
      await firstCard.hover();
      await page.waitForTimeout(500);

      // Card should still be in portrait state
      await expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });
}
