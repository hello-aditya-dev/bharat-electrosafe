import { test, expect } from '@playwright/test';

/**
 * Mobile header and hamburger layout tests for Bharat Electrosafe.
 *
 * These tests verify that:
 *   - The hamburger button is visible, inside the viewport, and does not
 *     overlap the logo at narrow mobile widths.
 *   - The header has no horizontal overflow.
 *   - Accessible naming, aria-expanded, and keyboard interaction work.
 *   - Desktop navigation and hamburger swap at the correct breakpoint.
 *
 * Run with: npx playwright test tests/a11y/header-mobile.spec.ts
 */

/* ── Mobile viewports ── */
const mobileViewports = [
  { width: 320, height: 568, label: '320px' },
  { width: 360, height: 800, label: '360px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
];

for (const vp of mobileViewports) {
  test.describe(`Header mobile @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
    });

    test('hamburger button is visible', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      await expect(btn).toBeVisible();
    });

    test('hamburger is completely inside the viewport', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
      // Also verify the button is at least 44x44px
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('logo and hamburger do not overlap', async ({ page }) => {
      const logo = page.locator('a[aria-label="Bharat Electrosafe — Home"]');
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      const logoBox = await logo.boundingBox();
      const btnBox = await btn.boundingBox();
      expect(logoBox).not.toBeNull();
      expect(btnBox).not.toBeNull();
      // Logo right edge must be left of button left edge
      expect(logoBox!.x + logoBox!.width).toBeLessThanOrEqual(btnBox!.x + 1);
    });

    test('header has no horizontal overflow', async ({ page }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('button accessible name is "Open navigation menu"', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      const label = await btn.getAttribute('aria-label');
      expect(label).toBe('Open navigation menu');
    });

    test('clicking opens the mobile sheet', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      await btn.click();
      // Sheet content should be visible
      const sheet = page.locator('#mobile-navigation-sheet');
      await expect(sheet).toBeVisible();
    });

    test('aria-expanded changes to true when opened', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      const expandedBefore = await btn.getAttribute('aria-expanded');
      expect(expandedBefore).toBe('false');
      await btn.click();
      const expandedAfter = await btn.getAttribute('aria-expanded');
      expect(expandedAfter).toBe('true');
    });

    test('escape closes the sheet and focus returns', async ({ page }) => {
      const btn = page.locator('button[aria-label="Open navigation menu"]');
      await btn.click();
      await expect(page.locator('#mobile-navigation-sheet')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-navigation-sheet')).toBeHidden();
      // Focus should return to the trigger
      await expect(btn).toBeFocused();
    });

    test('desktop navigation is hidden below 1024px', async ({ page }) => {
      const desktopNav = page.locator('nav[aria-label="Main navigation"]');
      await expect(desktopNav).toBeHidden();
    });
  });
}

/* ── Desktop breakpoint tests ── */
test.describe('Header breakpoint transitions', () => {
  test('desktop navigation appears at 1024px and above', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeVisible();
  });

  test('hamburger disappears at the desktop breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    const btn = page.locator('button[aria-label="Open navigation menu"]');
    await expect(btn).toBeHidden();
  });

  test('hamburger is visible at 1023px', async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 768 });
    await page.goto('/');
    const btn = page.locator('button[aria-label="Open navigation menu"]');
    await expect(btn).toBeVisible();
  });

  test('desktop nav is hidden at 1023px', async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 768 });
    await page.goto('/');
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeHidden();
  });
});

/* ── Menu open-state integrity ── */
test.describe('Mobile menu open-state', () => {
  test('no horizontal displacement when menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const scrollBefore = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const btn = page.locator('button[aria-label="Open navigation menu"]');
    await btn.click();
    await expect(page.locator('#mobile-navigation-sheet')).toBeVisible();
    const scrollAfter = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    // Scroll width must not increase when menu opens
    expect(scrollAfter).toBeLessThanOrEqual(scrollBefore + 1);
  });

  test('header width does not jump when menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Get the header element's bounding box before and after opening
    const header = page.locator('header');
    const boxBefore = await header.boundingBox();
    await page.locator('button[aria-label="Open navigation menu"]').click();
    await expect(page.locator('#mobile-navigation-sheet')).toBeVisible();
    const boxAfter = await header.boundingBox();
    expect(boxBefore).not.toBeNull();
    expect(boxAfter).not.toBeNull();
    // Header width should remain the same (within 1px tolerance)
    expect(Math.abs(boxAfter!.width - boxBefore!.width)).toBeLessThanOrEqual(1);
  });
});
