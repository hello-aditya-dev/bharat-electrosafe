import { test, expect } from '@playwright/test';

/**
 * Focused regression test: Leadership card Back button (mobile + desktop).
 *
 * Root cause this guards against:
 *   The card container's onClick (handleCardClick) re-toggled the flip on
 *   clicks bubbling up from inside the card. Before the fix, its guard
 *   only excluded the FRONT "View Profile" button (by id), so a Back-button
 *   tap would (1) Back onClick → close, then (2) bubble to card onClick →
 *   reopen. The two toggles cancelled, so the card stayed open and Back
 *   appeared not to work — visible on mobile (tap is the only interaction)
 *   and masked on desktop (users close via hover-leave).
 *
 *   Fix: Back button calls event.stopPropagation(); the card-level handler
 *   now ignores clicks originating from ANY button (closest('button')).
 *
 * Why cards are opened with the keyboard (Enter) in this spec:
 *   Playwright's Desktop chromium reports `(hover: hover)` as TRUE, so
 *   moving the mouse to a card fires onMouseEnter and pre-flips it; a
 *   subsequent click then toggles it back to unflipped, which confounds
 *   mouse-based "open" assertions. Opening via Enter/Space avoids mouse
 *   movement entirely, is fully representative of the toggle logic, AND
 *   validates the keyboard-activation accessibility requirement. The Back
 *   button is then exercised both by real mouse click and by Enter/Space,
 *   which is the behaviour this regression is about. (On a real touch
 *   device `(hover: hover)` is false, so tap-open works identically to
 *   Enter-open here — the stopPropagation fix applies to both.)
 *
 * Covers every card at every required width:
 *   320, 360, 390, 430, 768, 1280.
 *
 * Run with: npx playwright test tests/a11y/leadership-back-button.spec.ts
 */

const viewports = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 1280, height: 800, label: '1280x800' },
];

/** Open a card via keyboard (focus + Enter) — reliable in hover-capable chromium. */
async function openViaKeyboard(
  page: import('@playwright/test').Page,
  frontBtn: import('@playwright/test').Locator
) {
  await frontBtn.focus();
  await page.keyboard.press('Enter');
}

for (const vp of viewports) {
  test.describe(`Leadership Back button @ ${vp.label}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/about-us');
      await page
        .locator('.be-leadership-grid')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });
    });

    test('every card: open → Back (mouse) → closes and STAYS closed', async ({
      page,
    }) => {
      const frontButtons = page.locator(
        '.be-leader-flip-front button[aria-expanded]'
      );
      const cardCount = await frontButtons.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);

      for (let i = 0; i < cardCount; i++) {
        const frontBtn = frontButtons.nth(i);

        // Start closed.
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');

        // Open card i via keyboard.
        await openViaKeyboard(page, frontBtn);
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'true');

        // Tap Back on this card's back-face button (real mouse click).
        const backBtn = page
          .locator('.be-leader-flip-back button[aria-expanded]')
          .nth(i);
        await backBtn.click();

        // Must be closed immediately after the Back tap.
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');

        // Must STAY closed — the old bug reopened the card synchronously
        // via the bubbled card-level toggle. Wait and re-assert.
        await page.waitForTimeout(300);
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');
      }
    });

    test('Back also works via keyboard (Space) — Enter/Space activation', async ({
      page,
    }) => {
      const frontBtn = page
        .locator('.be-leader-flip-front button[aria-expanded]')
        .first();

      await openViaKeyboard(page, frontBtn);
      await expect(frontBtn).toHaveAttribute('aria-expanded', 'true');

      // Focus the Back button and activate with Space.
      const backBtn = page
        .locator('.be-leader-flip-back button[aria-expanded]')
        .first();
      await backBtn.focus();
      await page.keyboard.press('Space');
      await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');
      await page.waitForTimeout(200);
      await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('rapid open → Back → open → Back never leaves the card stuck', async ({
      page,
    }) => {
      const frontBtn = page
        .locator('.be-leader-flip-front button[aria-expanded]')
        .first();
      const backBtn = page
        .locator('.be-leader-flip-back button[aria-expanded]')
        .first();

      for (let cycle = 0; cycle < 3; cycle++) {
        await openViaKeyboard(page, frontBtn);
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'true');
        await backBtn.click();
        await expect(frontBtn).toHaveAttribute('aria-expanded', 'false');
      }
    });

    test('Back button is a real <button> with a 44px touch target and a name', async ({
      page,
    }) => {
      const frontBtn = page
        .locator('.be-leader-flip-front button[aria-expanded]')
        .first();
      await openViaKeyboard(page, frontBtn);

      const backBtn = page
        .locator('.be-leader-flip-back button[aria-expanded]')
        .first();
      await expect(backBtn).toHaveAttribute('type', 'button');
      const label = await backBtn.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label!.toLowerCase()).toContain('portrait');

      const box = await backBtn.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    });

    test('no horizontal page overflow with a card open', async ({ page }) => {
      const frontBtn = page
        .locator('.be-leader-flip-front button[aria-expanded]')
        .first();
      await openViaKeyboard(page, frontBtn);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
}
