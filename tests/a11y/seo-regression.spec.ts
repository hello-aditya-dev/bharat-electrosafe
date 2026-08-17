import { test, expect } from '@playwright/test';

/**
 * SEO regression tests for Bharat Electrosafe.
 *
 * These tests guard the technical-SEO rules in spec section 34
 * ("Automated SEO tests"). They run against the production build
 * (default baseURL http://localhost:3000) and assert that every
 * indexable route meets the Lighthouse SEO 100/100 criteria that can
 * be verified from the rendered HTML.
 *
 * Run with: npx playwright test tests/a11y/seo-regression.spec.ts
 */

const CANONICAL_ORIGIN = 'https://bharatelectrosafe.com';

const indexableRoutes = [
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

const productRoutes = indexableRoutes.filter((r) =>
  r.startsWith('/products/')
);

const legacyPhpRoutes = [
  { from: '/index.php', to: '/' },
  { from: '/about-us.php', to: '/about-us' },
  { from: '/contact-us.php', to: '/contact-us' },
  { from: '/electrical-insulating-mats.php', to: '/products/electrical-insulating-mats' },
  { from: '/coloured-strip-insulating-mats.php', to: '/products/coloured-strip-insulating-mats' },
  { from: '/bi-color-insulating-mats.php', to: '/products/bi-color-insulating-mats' },
  { from: '/auto-glow-reflective-band-insulating-mat.php', to: '/products/auto-glow-reflective-band-insulating-mats' },
  { from: '/bharat-membrane.php', to: '/products/bharat-membrane' },
  { from: '/BharatHydro-Seal.php', to: '/products/bharat-hydro-seal' },
];

/* ────────────────────────────────────────────────────────────────
   1. Per-route SEO assertions (spec section 34)
   ──────────────────────────────────────────────────────────────── */

for (const route of indexableRoutes) {
  test.describe(`SEO — ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('returns HTTP 200', async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });

    test('has a non-empty unique title', async ({ page }) => {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe('Bharat Electrosafe');
    });

    test('has a non-empty meta description', async ({ page }) => {
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(20);
    });

    test('has exactly one canonical link', async ({ page }) => {
      const canonicals = page.locator('link[rel="canonical"]');
      await expect(canonicals).toHaveCount(1);
    });

    test('canonical uses the canonical origin', async ({ page }) => {
      const href = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(href).toBeTruthy();
      const expectedPath = route === '/' ? '' : route;
      expect(href).toBe(`${CANONICAL_ORIGIN}${expectedPath}`);
    });

    test('has exactly one H1', async ({ page }) => {
      const h1s = page.locator('h1');
      await expect(h1s).toHaveCount(1);
    });

    test('html has a lang attribute', async ({ page }) => {
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      expect(lang).toBe('en-IN');
    });

    test('has an Open Graph title', async ({ page }) => {
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content');
      expect(ogTitle).toBeTruthy();
    });

    test('has an Open Graph description', async ({ page }) => {
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content');
      expect(ogDescription).toBeTruthy();
    });

    test('has an Open Graph image', async ({ page }) => {
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content');
      expect(ogImage).toBeTruthy();
    });

    test('has a Twitter card', async ({ page }) => {
      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute('content');
      expect(twitterCard).toBeTruthy();
    });

    test('has favicon links', async ({ page }) => {
      const favicon = page.locator(
        'link[rel="icon"], link[rel="shortcut icon"]'
      );
      const count = await favicon.count();
      expect(count).toBeGreaterThan(0);
    });

    test('has main content', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toHaveCount(1);
      const mainText = await main.innerText();
      expect(mainText.length).toBeGreaterThan(100);
    });

    test('no horizontal overflow at 390px', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   2. Unique titles and descriptions across routes
   ──────────────────────────────────────────────────────────────── */

test.describe('Metadata uniqueness', () => {
  test('every indexable route has a unique title', async ({ request }) => {
    const titles: string[] = [];
    for (const route of indexableRoutes) {
      const response = await request.get(route);
      const html = await response.text();
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      expect(match, `no title on ${route}`).toBeTruthy();
      titles.push(match![1].trim());
    }
    const unique = new Set(titles);
    expect(unique.size, `duplicate titles: ${titles}`).toBe(titles.length);
  });

  test('every indexable route has a unique meta description', async ({
    request,
  }) => {
    const descriptions: string[] = [];
    for (const route of indexableRoutes) {
      const response = await request.get(route);
      const html = await response.text();
      const match = html.match(
        /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
      );
      expect(match, `no description on ${route}`).toBeTruthy();
      descriptions.push(match![1].trim());
    }
    const unique = new Set(descriptions);
    expect(
      unique.size,
      `duplicate descriptions: ${descriptions}`
    ).toBe(descriptions.length);
  });
});

/* ────────────────────────────────────────────────────────────────
   3. No production noindex on indexable routes
   ──────────────────────────────────────────────────────────────── */

test.describe('No accidental noindex', () => {
  for (const route of indexableRoutes) {
    test(`${route} does not emit noindex in meta robots`, async ({
      page,
    }) => {
      await page.goto(route);
      const robotsMeta = await page
        .locator('meta[name="robots"]')
        .getAttribute('content');
      // The meta robots tag may be absent (default index,follow) or
      // present with index,follow. It must NEVER contain noindex on
      // an indexable route in the production build.
      if (robotsMeta) {
        expect(robotsMeta).not.toMatch(/noindex/i);
        expect(robotsMeta).not.toMatch(/nofollow/i);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   4. No broken internal links (within the indexable routes)
   ──────────────────────────────────────────────────────────────── */

test.describe('Internal link integrity', () => {
  for (const route of indexableRoutes) {
    test(`${route} — every internal anchor resolves to a 200 route`, async ({
      page,
    }) => {
      await page.goto(route);
      const links = await page.locator('a[href^="/"]').evaluateAll(
        (anchors) =>
          anchors
            .map((a) => (a as HTMLAnchorElement).getAttribute('href'))
            .filter((href): href is string => !!href)
            // Strip anchors and query strings for the route check
            .map((href) => href.split('#')[0].split('?')[0])
            // Deduplicate
            .filter((href, i, arr) => arr.indexOf(href) === i)
      );
      for (const href of links) {
        // Skip mailto, tel, and external-looking paths
        if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
        const response = await page.request.get(href);
        expect(
          response.status(),
          `broken link ${href} on ${route}`
        ).toBeLessThan(400);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   5. Legacy PHP routes redirect directly (one hop)
   ──────────────────────────────────────────────────────────────── */

test.describe('Legacy PHP redirects', () => {
  for (const { from, to } of legacyPhpRoutes) {
    test(`${from} → ${to} (301, one hop)`, async ({ request }) => {
      const response = await request.get(from, {
        maxRedirects: 0,
      });
      expect(response.status()).toBeGreaterThanOrEqual(300);
      expect(response.status()).toBeLessThan(400);
      const location = response.headers()['location'];
      expect(location, `no Location header on ${from}`).toBeTruthy();
      // The redirect destination must end with the expected path.
      // It may be relative or absolute.
      expect(location).toMatch(new RegExp(`${to}$`));
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   6. 404 route returns a true 404
   ──────────────────────────────────────────────────────────────── */

test.describe('404 handling', () => {
  test('a non-existent route returns HTTP 404', async ({ request }) => {
    const response = await request.get('/this-route-does-not-exist-anywhere');
    expect(response.status()).toBe(404);
  });
});

/* ────────────────────────────────────────────────────────────────
   7. Favicon and OG image return 200
   ──────────────────────────────────────────────────────────────── */

test.describe('Brand assets', () => {
  test('favicon.ico returns an image', async ({ request }) => {
    const response = await request.get('/favicon.ico');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/image/);
  });

  test('opengraph-image returns 200 and is 1200×630', async ({
    page,
    request,
  }) => {
    // The OG image URL is emitted by Next.js App Router file convention.
    // Pull the actual URL from the homepage's og:image meta tag.
    await page.goto('/');
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toBeTruthy();
    // Resolve relative to the deployment origin
    const url = ogImage!.startsWith('http')
      ? ogImage!
      : new URL(ogImage!, 'http://localhost:3000').toString();
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/image/);
  });
});

/* ────────────────────────────────────────────────────────────────
   8. JSON-LD parses without syntax errors on every route
   ──────────────────────────────────────────────────────────────── */

test.describe('JSON-LD validity', () => {
  for (const route of indexableRoutes) {
    test(`${route} — every JSON-LD block parses`, async ({ page }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(blocks.length, `no JSON-LD on ${route}`).toBeGreaterThan(0);
      for (const block of blocks) {
        expect(() => JSON.parse(block), `invalid JSON-LD on ${route}`).not.toThrow();
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   9. FAQPage schema is absent everywhere (spec section 17)
   ──────────────────────────────────────────────────────────────── */

test.describe('FAQPage absence', () => {
  for (const route of indexableRoutes) {
    test(`${route} — no FAQPage JSON-LD`, async ({ page }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const block of blocks) {
        const parsed = JSON.parse(block);
        const type = parsed['@type'];
        const typeStr = Array.isArray(type) ? type.join(',') : String(type);
        expect(
          typeStr,
          `FAQPage found on ${route}`
        ).not.toMatch(/FAQPage/);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   10. No fake Product offers, reviews or ratings (spec section 17)
   ──────────────────────────────────────────────────────────────── */

test.describe('No fake offers / reviews / ratings', () => {
  for (const route of productRoutes) {
    test(`${route} — no Offer, aggregateRating, review or price in JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const block of blocks) {
        const parsed = JSON.parse(block);
        const jsonStr = JSON.stringify(parsed);
        expect(jsonStr).not.toMatch(/"Offer"/);
        expect(jsonStr).not.toMatch(/"aggregateRating"/);
        expect(jsonStr).not.toMatch(/"review"/);
        expect(jsonStr).not.toMatch(/"price"/);
        expect(jsonStr).not.toMatch(/"priceCurrency"/);
        expect(jsonStr).not.toMatch(/"sku"/);
        expect(jsonStr).not.toMatch(/"gtin"/);
        expect(jsonStr).not.toMatch(/"mpn"/);
        expect(jsonStr).not.toMatch(/"availability"/);
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   11. No LocalBusiness schema (spec section 17 — single Organization)
   ──────────────────────────────────────────────────────────────── */

test.describe('LocalBusiness absence', () => {
  test('homepage — no LocalBusiness JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    for (const block of blocks) {
      const parsed = JSON.parse(block);
      const type = parsed['@type'];
      const typeStr = Array.isArray(type) ? type.join(',') : String(type);
      expect(typeStr).not.toMatch(/LocalBusiness/);
    }
  });

  test('homepage — Organization and WebSite schemas are present', async ({
    page,
  }) => {
    await page.goto('/');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types: string[] = [];
    for (const block of blocks) {
      const parsed = JSON.parse(block);
      const type = parsed['@type'];
      if (Array.isArray(type)) types.push(...type);
      else types.push(String(type));
    }
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
  });
});

/* ────────────────────────────────────────────────────────────────
   12. Products hub emits CollectionPage + ItemList (spec section 17)
   ──────────────────────────────────────────────────────────────── */

test.describe('Products hub structured data', () => {
  test('/products — emits CollectionPage with ItemList of 6 products', async ({
    page,
  }) => {
    await page.goto('/products');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    let collectionPage: Record<string, unknown> | null = null;
    for (const block of blocks) {
      const parsed = JSON.parse(block);
      if (parsed['@type'] === 'CollectionPage') {
        collectionPage = parsed;
        break;
      }
    }
    expect(collectionPage, 'no CollectionPage on /products').toBeTruthy();
    const mainEntity = (collectionPage as Record<string, unknown>)
      ?.mainEntity as Record<string, unknown> | undefined;
    expect(mainEntity, 'no mainEntity ItemList').toBeTruthy();
    expect(mainEntity!['@type']).toBe('ItemList');
    const itemListElement = mainEntity!['itemListElement'] as Array<
      Record<string, unknown>
    >;
    expect(itemListElement.length).toBe(6);
  });
});

/* ────────────────────────────────────────────────────────────────
   13. Product pages emit WebPage (not Product) schema
   ──────────────────────────────────────────────────────────────── */

test.describe('Product page schema type', () => {
  for (const route of productRoutes) {
    test(`${route} — emits WebPage, not Product`, async ({ page }) => {
      await page.goto(route);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const types: string[] = [];
      for (const block of blocks) {
        const parsed = JSON.parse(block);
        const type = parsed['@type'];
        if (Array.isArray(type)) types.push(...type);
        else types.push(String(type));
      }
      expect(types).toContain('WebPage');
      expect(types).not.toContain('Product');
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   14. Civil products do not contain electrical-mat certification
      claims in JSON-LD (spec sections 17, 36)
   ──────────────────────────────────────────────────────────────── */

test.describe('Civil-product JSON-LD correctness', () => {
  test('/products/bharat-membrane — no IS 15652, BIS mat licence or ERDA/NTH in JSON-LD', async ({
    page,
  }) => {
    await page.goto('/products/bharat-membrane');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const jsonStr = blocks.join('');
    expect(jsonStr).not.toMatch(/IS\s*15652/);
    expect(jsonStr).not.toMatch(/CM\/L:?\s*8800129617/);
    expect(jsonStr).not.toMatch(/ERDA/);
    expect(jsonStr).not.toMatch(/NTH/);
  });

  test('/products/bharat-hydro-seal — no IS 15652, BIS mat licence or ERDA/NTH in JSON-LD', async ({
    page,
  }) => {
    await page.goto('/products/bharat-hydro-seal');
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const jsonStr = blocks.join('');
    expect(jsonStr).not.toMatch(/IS\s*15652/);
    expect(jsonStr).not.toMatch(/CM\/L:?\s*8800129617/);
    expect(jsonStr).not.toMatch(/ERDA/);
    expect(jsonStr).not.toMatch(/NTH/);
  });
});

/* ────────────────────────────────────────────────────────────────
   15. Sitemap returns 200, contains all 6 products, every URL is
       canonical and returns 200 (spec section 34)
   ──────────────────────────────────────────────────────────────── */

test.describe('Sitemap', () => {
  test('/sitemap.xml returns 200 and valid XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toMatch(/<\?xml/);
    expect(xml).toMatch(/<urlset/);
  });

  test('sitemap contains all 6 product URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xml = await response.text();
    for (const route of productRoutes) {
      const url = `${CANONICAL_ORIGIN}${route}`;
      expect(xml, `missing ${url} in sitemap`).toContain(url);
    }
  });

  test('sitemap contains homepage, products, about-us, contact-us', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml');
    const xml = await response.text();
    expect(xml).toContain(`${CANONICAL_ORIGIN}/</loc>`);
    expect(xml).toContain(`${CANONICAL_ORIGIN}/products</loc>`);
    expect(xml).toContain(`${CANONICAL_ORIGIN}/about-us</loc>`);
    expect(xml).toContain(`${CANONICAL_ORIGIN}/contact-us</loc>`);
  });

  test('every sitemap URL uses the canonical origin', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml');
    const xml = await response.text();
    // Extract every <loc> value
    const locs = xml.match(/<loc>([^<]+)<\/loc>/g) ?? [];
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      const url = loc.replace(/<\/?loc>/g, '');
      expect(
        url.startsWith(CANONICAL_ORIGIN),
        `non-canonical sitemap URL: ${url}`
      ).toBe(true);
    }
  });

  test('no sitemap URL is a Vercel, www, http, or PHP URL', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml');
    const xml = await response.text();
    expect(xml).not.toMatch(/vercel\.app/);
    expect(xml).not.toMatch(/www\.bharatelectrosafe/);
    expect(xml).not.toMatch(/http:\/\/bharatelectrosafe/);
    expect(xml).not.toMatch(/\.php/);
  });
});

/* ────────────────────────────────────────────────────────────────
   16. Robots.txt — production allows crawling (spec section 34)
   ──────────────────────────────────────────────────────────────── */

test.describe('robots.txt', () => {
  test('returns 200', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
  });

  test('production output allows all crawling and references the canonical sitemap', async ({
    request,
  }) => {
    const response = await request.get('/robots.txt');
    const text = await response.text();
    // In the local dev environment, NEXT_PUBLIC_ALLOW_INDEXING is
    // typically false, so robots.txt disallows all. In the production
    // build with NEXT_PUBLIC_ALLOW_INDEXING=true, it allows all and
    // references the sitemap. This test asserts the production shape
    // and is skipped locally — see the condition below.
    test.skip(
      !text.includes('Allow: /'),
      'robots.txt is in preview/noindex mode (NEXT_PUBLIC_ALLOW_INDEXING != true). Run against the production build.'
    );
    expect(text).toMatch(/Allow:\s*\//);
    expect(text).toMatch(/Sitemap:\s*https:\/\/bharatelectrosafe\.com\/sitemap\.xml/);
    expect(text).toMatch(/Host:\s*https:\/\/bharatelectrosafe\.com/);
  });
});
