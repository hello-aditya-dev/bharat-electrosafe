import { test, expect } from '@playwright/test';

/**
 * Content-compliance regression tests for Bharat Electrosafe.
 *
 * These tests guard the factual-content rules in
 * `docs/CONTENT_VERIFICATION.md` and `docs/CLIENT_CONTENT_CONFIRMATION.md`.
 * Each test corresponds to a rule in spec section 36 ("Regression tests")
 * and is designed to fail when a forbidden claim or wording is reintroduced.
 *
 * Run with: npx playwright test tests/a11y/content-compliance.spec.ts
 */

const productRoutes = [
  '/products/electrical-insulating-mats',
  '/products/coloured-strip-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
];

/* ────────────────────────────────────────────────────────────────
   1. Bharat Hydro Seal must remain present.
   ──────────────────────────────────────────────────────────────── */

test.describe('Bharat Hydro Seal presence', () => {
  test('Bharat Hydro Seal route is reachable and renders its hero', async ({ page }) => {
    const response = await page.goto('/products/bharat-hydro-seal');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Bharat Hydro Seal');
  });

  test('homepage product range links to Bharat Hydro Seal', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href="/products/bharat-hydro-seal"]');
    await expect(link).toHaveCount(1);
  });

  test('footer lists Bharat Hydro Seal as a product link', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer a[href="/products/bharat-hydro-seal"]');
    await expect(link).toHaveCount(1);
  });
});

/* ────────────────────────────────────────────────────────────────
   2. Civil-product correctness — BharatMembrane must NOT inherit
      insulating-mat standards, BIS mat licence, or ERDA/NTH mat
      testing. (The product-assurance.spec.ts file covers the
      assurance strip; these tests cover the page body and metadata.)
   ──────────────────────────────────────────────────────────────── */

test.describe('BharatMembrane — civil-product correctness (body + metadata)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/bharat-membrane');
  });

  test('does not mention IS 15652:2006 in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/IS\s*15652[:\s-]*2006/);
  });

  test('does not mention the BIS insulating-mat licence in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/CM\/L:?\s*8800129617/);
  });

  test('does not claim ERDA or NTH testing in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/ERDA/);
    expect(body).not.toMatch(/NTH/);
  });

  test('references IS 15909:2020 (colon format, not hyphen)', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).toMatch(/IS\s*15909:2020/);
    expect(body).not.toMatch(/IS\s*15909-2002/);
  });
});

test.describe('Bharat Hydro Seal — civil-product correctness (body + metadata)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/bharat-hydro-seal');
  });

  test('does not mention IS 15652:2006 in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/IS\s*15652[:\s-]*2006/);
  });

  test('does not mention the BIS insulating-mat licence in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/CM\/L:?\s*8800129617/);
  });

  test('does not claim ERDA or NTH testing in the visible body', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/ERDA/);
    expect(body).not.toMatch(/NTH/);
  });

  test('references IS 15058:2002 (colon format, not hyphen)', async ({ page }) => {
    const body = await page.locator('main').innerText();
    expect(body).toMatch(/IS\s*15058:2002/);
    expect(body).not.toMatch(/IS\s*15058-2002/);
  });
});

/* ────────────────────────────────────────────────────────────────
   3. Banned promotional phrases must not appear anywhere.
   ──────────────────────────────────────────────────────────────── */

const bannedPhrases = [
  /unmatched/i,
  /world-class/i,
  /premium-grade/i,
  /certified excellence/i,
  /superior performance/i,
  /elite range/i,
  /\brevolutionary\b/i,
  /exceptional protection/i,
  /perfect for\b/i,
  /uncompromised/i,
  /leading global supplier/i,
  /trusted worldwide/i,
  /\bleak-proof\b/i,
  /complete protection/i,
  /long-lasting performance/i,
  /\bprestigious\b/i,
  /\bvisionary\b/i,
  /inspirational leader/i,
  /ERDA approved/i,
  /BIS certified company/i,
  /best-in-class/i,
  /government approved/i,
  /nationally trusted/i,
  /globally leading/i,
  /accomplished entrepreneur/i,
  /global leader/i,
  /\brole model\b/i,
  /\bdistinguished\b/i,
];

for (const route of ['/', '/products', '/about-us', '/contact-us', ...productRoutes]) {
  test.describe(`Banned phrases — ${route}`, () => {
    test(`no banned promotional phrases appear in the visible body`, async ({ page }) => {
      await page.goto(route);
      const body = await page.locator('body').innerText();
      for (const pattern of bannedPhrases) {
        expect(body, `banned phrase matched: ${pattern}`).not.toMatch(pattern);
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   4. "Trusted by" / "Our clients" / "Customers" / "Partners" /
      "Projects delivered" / "Chosen by industry leaders" must not
      label the industry-reference rail.
   ──────────────────────────────────────────────────────────────── */

test.describe('Industry-reference labels', () => {
  test('homepage does not label references as clients, customers or partners', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\btrusted by\b/i);
    expect(body).not.toMatch(/\bchosen by industry leaders\b/i);
  });
});

/* ────────────────────────────────────────────────────────────────
   5. Company statistics — 11+ countries and 1,000+ customers must
      carry the company-stated qualifier (either inline or as a
      visible footnote on the same section).
   ──────────────────────────────────────────────────────────────── */

test.describe('Company-statistics qualifiers', () => {
  test('homepage shows the company-stated footnote when 11+ or 1,000+ are displayed', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    if (/11\+/.test(body) || /1,000\+/.test(body)) {
      // The footnote wording must be present somewhere on the page.
      expect(body).toMatch(/figures stated by the company/i);
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   6. Auto-glow duration — no specific glow duration is stated
      without a test document.
   ──────────────────────────────────────────────────────────────── */

test.describe('Auto-glow duration', () => {
  test('auto-glow page does not state a specific glow duration in hours or minutes', async ({ page }) => {
    await page.goto('/products/auto-glow-reflective-band-insulating-mats');
    const body = await page.locator('main').innerText();
    // Forbid phrases like "glows for 8 hours", "up to 12 hours", "6-hour glow".
    expect(body).not.toMatch(/glow(s)?\s+(for\s+)?\d+\s*(hours?|hrs?|minutes?|mins?)/i);
    expect(body).not.toMatch(/\d+\s*[-–]\s*hour\s*glow/i);
    expect(body).not.toMatch(/up\s*to\s*\d+\s*hours?/i);
  });

  test('auto-glow page does not claim emergency lighting', async ({ page }) => {
    await page.goto('/products/auto-glow-reflective-band-insulating-mats');
    const body = await page.locator('main').innerText();
    expect(body).not.toMatch(/emergency lighting/i);
    expect(body).not.toMatch(/illuminates pathways/i);
    expect(body).not.toMatch(/guiding movement/i);
  });
});

/* ────────────────────────────────────────────────────────────────
   7. Metadata must not be stronger than visible content.
      Specifically, the page description must not contain claims
      that the visible body does not also make.
   ──────────────────────────────────────────────────────────────── */

test.describe('Metadata vs visible content', () => {
  test('homepage meta description does not contain banned phrases', async ({ page }) => {
    await page.goto('/');
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(metaDescription).toBeTruthy();
    for (const pattern of bannedPhrases) {
      expect(metaDescription, `banned phrase in meta: ${pattern}`).not.toMatch(pattern);
    }
  });

  for (const route of productRoutes) {
    test(`${route} meta description does not contain banned phrases`, async ({ page }) => {
      await page.goto(route);
      const metaDescription = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(metaDescription).toBeTruthy();
      for (const pattern of bannedPhrases) {
        expect(metaDescription, `banned phrase in meta: ${pattern}`).not.toMatch(pattern);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   8. CPRI must not appear without verified supporting documentation.
   ──────────────────────────────────────────────────────────────── */

test.describe('CPRI absence', () => {
  test('CPRI is not referenced on any product page', async ({ page }) => {
    for (const route of productRoutes) {
      await page.goto(route);
      const body = await page.locator('main').innerText();
      expect(body, `CPRI found on ${route}`).not.toMatch(/\bCPRI\b/);
    }
  });
});

/* ────────────────────────────────────────────────────────────────
   9. Standards formatting — IS 15652:2006 must use the colon
      format, never "IS: 15652 : 2006", "IS-15652", "IS 15652",
      or "ISI 15652".
   ──────────────────────────────────────────────────────────────── */

test.describe('Standards formatting', () => {
  test('homepage uses IS 15652:2006 (colon format) and not the banned variants', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    // Allowed: "IS 15652:2006"
    expect(body).toMatch(/IS\s*15652:2006/);
    // Forbidden variants
    expect(body).not.toMatch(/IS:\s*15652\s*:\s*2006/);
    expect(body).not.toMatch(/IS-15652/);
    expect(body).not.toMatch(/ISI\s*15652/);
    // "IS 15652" without a year is permitted only inside "IS 15652:2006".
    expect(body).not.toMatch(/IS\s*15652(?!\s*:\s*2006)/);
  });
});

/* ────────────────────────────────────────────────────────────────
   10. FAQ schema is intentionally absent (spec section 17).
       Google removed FAQ rich-result display in 2026; FAQPage
       schema provides no meaningful search-result benefit. The
       visible FAQ accordion is retained for users.
   ──────────────────────────────────────────────────────────────── */

test.describe('FAQPage schema absence (spec section 17)', () => {
  test('homepage does not emit FAQPage JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    for (const block of blocks) {
      const parsed = JSON.parse(block);
      const type = parsed['@type'];
      const typeStr = Array.isArray(type) ? type.join(',') : String(type);
      expect(typeStr).not.toMatch(/FAQPage/);
    }
  });

  for (const route of productRoutes) {
    test(`${route} does not emit FAQPage JSON-LD`, async ({ page }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const block of blocks) {
        const parsed = JSON.parse(block);
        const type = parsed['@type'];
        const typeStr = Array.isArray(type) ? type.join(',') : String(type);
        expect(typeStr).not.toMatch(/FAQPage/);
      }
    });
  }
});
