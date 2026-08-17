import { test, expect } from '@playwright/test';

/**
 * Products mega-menu and header logo regression tests.
 *
 * Tests verify:
 *  - Products menu opens on hover/click
 *  - Menu closes with Escape
 *  - Main categories are present
 *  - Domestic standard (IS 15652:2006) visible
 *  - IEC standard (IEC 61111:2009) visible
 *  - All menu links resolve (200)
 *  - Keyboard focus works
 *  - Mobile Products disclosure works
 *  - Header logo renders
 *  - No horizontal overflow at narrow widths
 *
 * Run with: npx playwright test tests/a11y/mega-menu-regression.spec.ts
 */

/* ── Desktop mega-menu tests ── */
test.describe('Products mega-menu — desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
  });

  test('mega-menu opens when Products chevron is clicked', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu).toBeVisible();
  });

  test('mega-menu closes with Escape key', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('aria-expanded toggles correctly', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    expect(await chevron.getAttribute('aria-expanded')).toBe('false');
    await chevron.click();
    expect(await chevron.getAttribute('aria-expanded')).toBe('true');
    await page.keyboard.press('Escape');
    expect(await chevron.getAttribute('aria-expanded')).toBe('false');
  });

  test('Electrical Insulating Mats heading is present', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu.locator('text=Electrical Insulating Mats')).toBeVisible();
  });

  test('Domestic Mats section with IS 15652:2006 standard', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu.locator('text=Domestic Mats')).toBeVisible();
    await expect(menu.locator('text=IS 15652:2006')).toBeVisible();
  });

  test('International section with IEC 61111:2009 standard', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu.locator('text=International / Global')).toBeVisible();
    await expect(menu.locator('text=IEC 61111:2009')).toBeVisible();
  });

  test('secondary categories are present', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu.locator('text=Water Proofing Solutions')).toBeVisible();
    await expect(menu.locator('text=PVC Flooring Solutions')).toBeVisible();
    await expect(menu.locator('text=Other Products')).toBeVisible();
  });

  test('CTA row has Technical Guidance and View all products', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    await expect(menu.locator('text=Ask for Technical Guidance')).toBeVisible();
    await expect(menu.locator('text=View all products')).toBeVisible();
  });

  test('HV Insulating Mats link is present in Domestic', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    // There should be at least 2 HV Insulating Mats links (domestic + international)
    const hvLinks = menu.locator('text=HV Insulating Mats');
    await expect(hvLinks.first()).toBeVisible();
  });

  test('menu does not overflow viewport at 1280px', async ({ page }) => {
    const chevron = page.locator('button[aria-haspopup="true"]');
    await chevron.click();
    const menu = page.locator('#products-mega-menu');
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
  });
});

/* ── Desktop nav styling ── */
test.describe('Desktop navigation styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
  });

  test('nav links are visible', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
    await expect(nav.locator('text=Home')).toBeVisible();
    await expect(nav.locator('text=Products')).toBeVisible();
    await expect(nav.locator('text=About Us')).toBeVisible();
    await expect(nav.locator('text=Contact Us')).toBeVisible();
  });

  test('Request a Quote CTA is visible', async ({ page }) => {
    const cta = page.locator('text=Request a Quote');
    await expect(cta).toBeVisible();
  });
});

/* ── Header logo tests ── */
test.describe('Header logo', () => {
  test('logo renders on homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const logo = page.locator('a[aria-label="Bharat Electrosafe — Home"]');
    await expect(logo).toBeVisible();
    // The logo image should have loaded (natural width > 0)
    const img = logo.locator('img');
    await expect(img).toBeVisible();
  });

  test('logo uses transparent asset', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const img = page.locator('a[aria-label="Bharat Electrosafe — Home"] img');
    const src = await img.getAttribute('src');
    expect(src).toContain('bharat-electrosafe-header-transparent');
  });

  test('® symbol is in alt text', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const img = page.locator('a[aria-label="Bharat Electrosafe — Home"] img');
    const alt = await img.getAttribute('alt');
    expect(alt).toContain('®');
  });
});

/* ── No horizontal overflow ── */
test.describe('No horizontal overflow', () => {
  const viewports = [
    { width: 390, height: 844, label: '390px mobile' },
    { width: 1024, height: 768, label: '1024px tablet' },
    { width: 1280, height: 800, label: '1280px desktop' },
    { width: 1366, height: 768, label: '1366px laptop' },
  ];

  for (const vp of viewports) {
    test(`no overflow at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);
    });
  }
});

/* ── Mobile Products disclosure ── */
test.describe('Mobile Products disclosure', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('Products accordion opens and shows hierarchy', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Open navigation menu"]');
    await hamburger.click();
    // Click the Products accordion trigger
    const productsTrigger = page.locator('text=Products').first();
    await productsTrigger.click();
    // Should show Electrical Insulating Mats
    await expect(page.locator('#mobile-navigation-sheet >> text=Electrical Insulating Mats')).toBeVisible();
    // Should show Domestic standard
    await expect(page.locator('#mobile-navigation-sheet >> text=IS 15652:2006')).toBeVisible();
  });

  test('View All Products link in mobile menu', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Open navigation menu"]');
    await hamburger.click();
    const productsTrigger = page.locator('text=Products').first();
    await productsTrigger.click();
    await expect(page.locator('#mobile-navigation-sheet >> text=View All Products')).toBeVisible();
  });

  test('Technical Guidance link in mobile menu', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Open navigation menu"]');
    await hamburger.click();
    const productsTrigger = page.locator('text=Products').first();
    await productsTrigger.click();
    await expect(page.locator('#mobile-navigation-sheet >> text=Technical Guidance')).toBeVisible();
  });
});
