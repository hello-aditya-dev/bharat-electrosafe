import { test, expect } from '@playwright/test';

/**
 * Public-content leakage regression tests for Bharat Electrosafe.
 *
 * Spec section 9: "Add a regression test that crawls all public
 * routes and fails if rendered HTML contains any of these strings:
 * CLIENT_CONTENT_CONFIRMATION, CONTENT_VERIFICATION, docs/,
 * flagged in, retained in, client confirmation, client approval,
 * subject to company confirmation, the original company profile,
 * the original company website presents, published only after,
 * keep broader, retain exact qualifications."
 *
 * These phrases are internal editorial / verification notes that
 * must NEVER appear on the customer-facing website. They may exist
 * inside Markdown files under /docs, but never in rendered website
 * HTML, metadata, JSON-LD structured data, image alt text, or
 * search snippets.
 *
 * Run with: npx playwright test tests/a11y/public-content-leakage.spec.ts
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

/**
 * Internal editorial phrases that must never appear in rendered
 * public HTML. Each entry is tested case-insensitively.
 */
const forbiddenPhrases: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /CLIENT_CONTENT_CONFIRMATION/i, label: 'CLIENT_CONTENT_CONFIRMATION' },
  { pattern: /CONTENT_VERIFICATION/i, label: 'CONTENT_VERIFICATION' },
  { pattern: /docs\//i, label: 'docs/' },
  { pattern: /flagged in/i, label: 'flagged in' },
  { pattern: /retained in/i, label: 'retained in' },
  { pattern: /client confirmation/i, label: 'client confirmation' },
  { pattern: /client approval/i, label: 'client approval' },
  { pattern: /subject to company confirmation/i, label: 'subject to company confirmation' },
  { pattern: /the original company profile/i, label: 'the original company profile' },
  { pattern: /the original company website presents/i, label: 'the original company website presents' },
  { pattern: /published only after/i, label: 'published only after' },
  { pattern: /keep broader/i, label: 'keep broader' },
  { pattern: /retain exact qualifications/i, label: 'retain exact qualifications' },
  // Additional internal-editorial patterns caught during audit:
  { pattern: /subject to confirmation/i, label: 'subject to confirmation' },
  { pattern: /keep only when/i, label: 'keep only when' },
  { pattern: /published only after client approval/i, label: 'published only after client approval' },
  { pattern: /original company profile records/i, label: 'original company profile records' },
  { pattern: /unverified/i, label: 'unverified' },
  { pattern: /internal record/i, label: 'internal record' },
  { pattern: /source-document commentary/i, label: 'source-document commentary' },
  { pattern: /source document commentary/i, label: 'source document commentary' },
];

/* ────────────────────────────────────────────────────────────────
   1. Rendered HTML body — no internal editorial phrases
   ──────────────────────────────────────────────────────────────── */

for (const route of publicRoutes) {
  test.describe(`Public-content leakage — ${route}`, () => {
    test('rendered body HTML contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      // Wait for the main landmark to render so client-rendered
      // content (leadership grid, FAQ accordions) is in the DOM.
      await page.locator('main').waitFor({ state: 'visible' });
      const bodyHtml = await page.locator('body').innerHTML();
      for (const { pattern, label } of forbiddenPhrases) {
        expect(
          bodyHtml,
          `forbidden internal phrase "${label}" found on ${route}`
        ).not.toMatch(pattern);
      }
    });

    test('visible body text contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      await page.locator('main').waitFor({ state: 'visible' });
      const bodyText = await page.locator('body').innerText();
      for (const { pattern, label } of forbiddenPhrases) {
        expect(
          bodyText,
          `forbidden internal phrase "${label}" found on ${route}`
        ).not.toMatch(pattern);
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   2. Metadata — no internal editorial phrases in title, description,
      OG, Twitter, or JSON-LD
   ──────────────────────────────────────────────────────────────── */

for (const route of publicRoutes) {
  test.describe(`Metadata leakage — ${route}`, () => {
    test('page title contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      const title = await page.title();
      for (const { pattern, label } of forbiddenPhrases) {
        expect(
          title,
          `forbidden internal phrase "${label}" in title on ${route}`
        ).not.toMatch(pattern);
      }
    });

    test('meta description contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      if (description) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            description,
            `forbidden internal phrase "${label}" in meta description on ${route}`
          ).not.toMatch(pattern);
        }
      }
    });

    test('Open Graph metadata contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content');
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content');
      if (ogTitle) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            ogTitle,
            `forbidden internal phrase "${label}" in og:title on ${route}`
          ).not.toMatch(pattern);
        }
      }
      if (ogDescription) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            ogDescription,
            `forbidden internal phrase "${label}" in og:description on ${route}`
          ).not.toMatch(pattern);
        }
      }
    });

    test('Twitter metadata contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      const twitterTitle = await page
        .locator('meta[name="twitter:title"]')
        .getAttribute('content');
      const twitterDescription = await page
        .locator('meta[name="twitter:description"]')
        .getAttribute('content');
      if (twitterTitle) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            twitterTitle,
            `forbidden internal phrase "${label}" in twitter:title on ${route}`
          ).not.toMatch(pattern);
        }
      }
      if (twitterDescription) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            twitterDescription,
            `forbidden internal phrase "${label}" in twitter:description on ${route}`
          ).not.toMatch(pattern);
        }
      }
    });

    test('JSON-LD structured data contains no internal editorial phrases', async ({
      page,
    }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const block of blocks) {
        for (const { pattern, label } of forbiddenPhrases) {
          expect(
            block,
            `forbidden internal phrase "${label}" in JSON-LD on ${route}`
          ).not.toMatch(pattern);
        }
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   3. Leadership-specific leakage test (spec section 1, 3, 4)
      — expand every biography and verify no internal notes appear
      in the expanded content.
   ──────────────────────────────────────────────────────────────── */

test.describe('Leadership biography leakage — /about-us', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-us');
    await page
      .locator('.be-leadership-grid')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
  });

  test('collapsed leadership cards contain no internal editorial phrases', async ({
    page,
  }) => {
    const gridText = await page.locator('.be-leadership-grid').innerText();
    for (const { pattern, label } of forbiddenPhrases) {
      expect(
        gridText,
        `forbidden internal phrase "${label}" in collapsed leadership grid`
      ).not.toMatch(pattern);
    }
  });

  for (let i = 0; i < 3; i++) {
    test(`expanded leadership card ${i + 1} contains no internal editorial phrases`, async ({
      page,
    }) => {
      const buttons = page.locator(
        '.be-leadership-grid button[aria-expanded]'
      );
      const btn = buttons.nth(i);

      // Open this card
      await btn.click();
      await page.waitForTimeout(400);

      // Confirm it is expanded
      await expect(btn).toHaveAttribute('aria-expanded', 'true');

      // Read the full grid inner HTML (now includes expanded bio)
      const gridHtml = await page
        .locator('.be-leadership-grid')
        .innerHTML();
      const gridText = await page
        .locator('.be-leadership-grid')
        .innerText();

      for (const { pattern, label } of forbiddenPhrases) {
        expect(
          gridHtml,
          `forbidden internal phrase "${label}" in expanded leadership card ${i + 1} HTML`
        ).not.toMatch(pattern);
        expect(
          gridText,
          `forbidden internal phrase "${label}" in expanded leadership card ${i + 1} text`
        ).not.toMatch(pattern);
      }

      // Close it again so the next iteration starts clean
      await btn.click();
      await page.waitForTimeout(400);
    });
  }

  test('no Tata Precision commentary appears in any leadership biography', async ({
    page,
  }) => {
    // Expand every card one at a time and check for Tata Precision
    // relationship commentary.
    const buttons = page.locator(
      '.be-leadership-grid button[aria-expanded]'
    );
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      await btn.click();
      await page.waitForTimeout(400);
      const gridText = await page
        .locator('.be-leadership-grid')
        .innerText();
      // Tata Precision commentary of the form "The original company
      // website presents Tata Precision..." or "subject to company
      // confirmation" must not appear.
      expect(gridText).not.toMatch(/Tata Precision/i);
      expect(gridText).not.toMatch(/subject to company confirmation/i);
      expect(gridText).not.toMatch(/marketed through/i);
      await btn.click();
      await page.waitForTimeout(200);
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   4. Image alt-text leakage — no internal editorial phrases in
      leadership portrait alt attributes
   ──────────────────────────────────────────────────────────────── */

test.describe('Leadership image alt-text leakage — /about-us', () => {
  test('leadership portrait alt attributes contain no internal editorial phrases', async ({
    page,
  }) => {
    await page.goto('/about-us');
    await page
      .locator('.be-leadership-grid')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
    const alts = await page
      .locator('.be-leadership-grid img')
      .evaluateAll((imgs) =>
        imgs.map((img) => (img as HTMLImageElement).getAttribute('alt') ?? '')
      );
    expect(alts.length).toBeGreaterThan(0);
    for (const alt of alts) {
      for (const { pattern, label } of forbiddenPhrases) {
        expect(
          alt,
          `forbidden internal phrase "${label}" in leadership img alt: "${alt}"`
        ).not.toMatch(pattern);
      }
    }
  });
});
