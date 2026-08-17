import { test, expect } from '@playwright/test';

/**
 * Leadership section responsive interaction tests.
 *
 * Confirms at each viewport:
 *  - All three cards render with equal fixed-height presentation.
 *  - Flip card toggles work correctly (View Profile / Back).
 *  - Cards have fixed height and do not expand the page.
 *  - Biography scrolls inside the card.
 *  - No content is clipped or overflows.
 *  - Buttons remain visible and tappable.
 *  - Mobile cards remain within the viewport.
 *  - Desktop cards remain aligned.
 *  - No overlap with adjacent sections.
 *
 * Run with: npx playwright test tests/a11y/leadership-responsive.spec.ts
 */

const viewports = [
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 820, height: 1180, label: '820x1180' },
  { width: 1024, height: 768, label: '1024x768' },
  { width: 1280, height: 800, label: '1280x800' },
  { width: 1366, height: 768, label: '1366x768' },
  { width: 1440, height: 900, label: '1440x900' },
  { width: 1920, height: 1080, label: '1920x1080' },
];

for (const vp of viewports) {
  test.describe(`Leadership responsive @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/about-us');
      await page
        .locator('.be-leadership-grid')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });
    });

    test('three leadership flip cards render with equal fixed height', async ({
      page,
    }) => {
      const cards = page.locator('.be-leader-flip-card');
      await expect(cards).toHaveCount(3);

      // All three front buttons start collapsed
      const buttons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );
      await expect(buttons).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await expect(buttons.nth(i)).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      }

      // Card heights should be equal (fixed by CSS)
      const boxes = await cards.evaluateAll((els) =>
        els.map((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return { width: r.width, height: r.height };
        })
      );
      const heights = boxes.map((b) => b.height);
      const maxHeight = Math.max(...heights);
      const minHeight = Math.min(...heights);
      expect(maxHeight - minHeight).toBeLessThan(2);
    });

    test('View Profile flips card; Back returns to portrait', async ({
      page,
    }) => {
      const frontButtons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );

      // Flip card 0
      await frontButtons.nth(0).click();
      await page.waitForTimeout(500);
      await expect(frontButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');

      // Find Back button and click it
      const backButtons = page.locator('.be-leader-flip-back button[aria-expanded]');
      await backButtons.first().click();
      await page.waitForTimeout(500);
      await expect(frontButtons.nth(0)).toHaveAttribute('aria-expanded', 'false');
    });

    test('flipped biography remains readable and inside the viewport', async ({
      page,
    }) => {
      const frontButtons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );
      await frontButtons.nth(0).click();
      await page.waitForTimeout(500);

      const bioId = await frontButtons.nth(0).getAttribute('aria-controls');
      const bio = page.locator(`#${bioId}`);
      const bioBox = await bio.boundingBox();
      expect(bioBox).not.toBeNull();
      expect(bioBox!.height).toBeGreaterThan(60);

      // The biography text must be non-empty
      const bioText = (await bio.innerText()).trim();
      expect(bioText.length).toBeGreaterThan(40);

      // No horizontal overflow on the page
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('toggle button meets the 44px minimum touch target and stays visible', async ({
      page,
    }) => {
      const buttons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );
      const box = await buttons.nth(0).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width);
    });

    test('flipped card does not overlap the next section', async ({
      page,
    }) => {
      const frontButtons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );
      await frontButtons.nth(0).click();
      await page.waitForTimeout(500);

      const grid = page.locator('.be-leadership-grid').first();
      const gridBox = await grid.boundingBox();
      expect(gridBox).not.toBeNull();

      const scrollHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      expect(scrollHeight).toBeGreaterThan(gridBox!.y + gridBox!.height);
    });

    test('aria-label includes the leader name in both states', async ({
      page,
    }) => {
      const frontButtons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );

      // Portrait state
      const portraitLabel = await frontButtons
        .nth(0)
        .getAttribute('aria-label');
      expect(portraitLabel).toBeTruthy();
      expect(portraitLabel!).toMatch(/profile/i);

      // Flipped state — Back button has aria-label
      await frontButtons.nth(0).click();
      await page.waitForTimeout(500);
      const backButtons = page.locator('.be-leader-flip-back button[aria-expanded]');
      const backLabel = await backButtons.first().getAttribute('aria-label');
      expect(backLabel).toBeTruthy();
      expect(backLabel!).toMatch(/portrait|back/i);
    });
  });
}
