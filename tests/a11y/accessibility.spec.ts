import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility smoke tests for Bharat Electrosafe public routes.
 *
 * These tests use @axe-core/playwright (dev-only dependency) to verify
 * no critical or serious axe violations exist on each route. They also
 * check for specific Lighthouse accessibility audit concerns:
 *
 *   - No buttons without accessible names
 *   - No links without discernible text
 *   - Exactly one <h1> per page
 *   - A <main> landmark present
 *   - <html lang> attribute present
 *   - <title> present
 *
 * Run with: npx playwright test
 *
 * NOTE: These tests are not part of the production bundle. The
 * @axe-core/playwright and @playwright/test packages are devDependencies
 * only and are never shipped to users.
 */

const publicRoutes = [
  '/',
  '/products',
  '/products/electrical-insulating-mats',
  '/products/coloured-strip-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
  '/about-us',
  '/contact-us',
];

for (const route of publicRoutes) {
  test.describe(`${route} — accessibility`, () => {
    test('has no critical or serious axe violations', async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });

    test('has exactly one h1', async ({ page }) => {
      await page.goto(route);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('has a main landmark', async ({ page }) => {
      await page.goto(route);
      const mainCount = await page.locator('main').count();
      expect(mainCount).toBeGreaterThanOrEqual(1);
    });

    test('has html lang attribute', async ({ page }) => {
      await page.goto(route);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
    });

    test('has a page title', async ({ page }) => {
      await page.goto(route);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('has no buttons without accessible names', async ({ page }) => {
      await page.goto(route);
      const buttons = page.locator('button');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        // Skip buttons that are not visible (e.g. inside hidden mobile sheet)
        if (!(await btn.isVisible())) continue;
        const ariaLabel = await btn.getAttribute('aria-label');
        const ariaLabelledby = await btn.getAttribute('aria-labelledby');
        const text = (await btn.innerText()).trim();
        const accessibleName = ariaLabel || ariaLabelledby || text;
        expect(
          accessibleName && accessibleName.length > 0,
          `Button at index ${i} has no accessible name`
        ).toBeTruthy();
      }
    });
  });
}

test.describe('Products menu trigger', () => {
  test('desktop chevron button has state-aware accessible name', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
    const chevron = page.locator('button[aria-controls="products-mega-menu"]');
    await expect(chevron).toBeVisible();
    const closedLabel = await chevron.getAttribute('aria-label');
    expect(closedLabel).toContain('Open products menu');
    await chevron.click();
    const openLabel = await chevron.getAttribute('aria-label');
    expect(openLabel).toContain('Close products menu');
  });

  test('escape closes the products menu', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
    const chevron = page.locator('button[aria-controls="products-mega-menu"]');
    await chevron.click();
    await expect(page.locator('#products-mega-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#products-mega-menu')).toBeHidden();
  });
});

test.describe('Back-to-top button', () => {
  test('becomes visible after scrolling and has accessible name', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    const backToTop = page.locator('button[aria-label*="top" i]');
    await expect(backToTop).toBeVisible();
  });
});

test.describe('Contact form keyboard navigation', () => {
  test('can tab through visible form controls', async ({ page }) => {
    await page.goto('/contact-us');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('input#name').focus();
    await expect(page.locator('input#name')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('input#company')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('input#email')).toBeFocused();
  });
});

test.describe('404 page', () => {
  test('returns 404 for invalid product slug', async ({ page }) => {
    const response = await page.goto('/products/does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
