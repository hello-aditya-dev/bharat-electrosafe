import { test, expect } from '@playwright/test';

/**
 * Responsive smoke tests for the rebuilt homepage Industry References
 * section (statistics + organisation logos + About Us link).
 *
 * Verifies the section renders without horizontal overflow at every
 * required breakpoint and that the key elements (3 stat cards, 8 logo
 * cells, About Us link) are present and visible.
 *
 * These tests are dev-only — they do not ship in the production bundle.
 */

const breakpoints = [
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

for (const bp of breakpoints) {
  test(`Industry References section @ ${bp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto('/');

    // 1. Three statistic cards are present and visible
    const statCards = page.locator('.be-stat-card');
    await expect(statCards).toHaveCount(3);

    // 2. Stat values are correct
    const statNumbers = page.locator('.be-stat-card__number');
    await expect(statNumbers.nth(0)).toContainText('11+');
    await expect(statNumbers.nth(1)).toContainText('1,000+');
    await expect(statNumbers.nth(2)).toContainText('6');

    // 3. "Company-stated figures." footnote present
    const footnote = page.locator('.be-stat-footnote');
    await expect(footnote).toContainText('*Company-stated figures.');

    // 4. Industry References eyebrow + heading present
    const eyebrow = page.locator('.be-industry-eyebrow');
    await expect(eyebrow).toContainText('INDUSTRY REFERENCES');

    const title = page.locator('.be-industry-title');
    await expect(title).toContainText('Organisations represented across critical industries');

    // 5. Eight organisation logo cells present
    const logoCells = page.locator('.be-logo-grid__cell');
    await expect(logoCells).toHaveCount(8);

    // 6. About Us link has correct label and arrow icon
    const aboutLink = page.locator('.be-about-link');
    await expect(aboutLink).toContainText('View awards and leadership');
    await expect(aboutLink).toHaveAttribute('href', '/about-us');
    // Arrow icon (svg) should be present
    const arrowSvg = aboutLink.locator('svg');
    await expect(arrowSvg).toHaveCount(1);

    // 7. No horizontal scroll on the page body
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth, `horizontal overflow at ${bp.name}`).toBeLessThanOrEqual(clientWidth + 1);

    // 8. Every logo cell is fully inside the viewport (not clipped)
    const cellCount = await logoCells.count();
    for (let i = 0; i < cellCount; i++) {
      const cell = logoCells.nth(i);
      const box = await cell.boundingBox();
      if (!box) continue;
      expect(box.x, `cell ${i} x at ${bp.name}`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `cell ${i} right edge at ${bp.name}`).toBeLessThanOrEqual(bp.width);
    }

    // 9. Every stat card is fully inside the viewport
    const cardCount = await statCards.count();
    for (let i = 0; i < cardCount; i++) {
      const card = statCards.nth(i);
      const box = await card.boundingBox();
      if (!box) continue;
      expect(box.x, `stat card ${i} x at ${bp.name}`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `stat card ${i} right edge at ${bp.name}`).toBeLessThanOrEqual(bp.width);
    }
  });
}

test('Favicon and OG metadata assets are reachable', async ({ page }) => {
  const assetUrls = [
    '/favicon.ico',
    '/icon.svg',
    '/apple-icon.png',
    '/opengraph-image.png',
    '/twitter-image.png',
    '/manifest.webmanifest',
  ];

  for (const url of assetUrls) {
    const response = await page.goto(url);
    expect(response, `${url} should respond`).not.toBeNull();
    expect(response!.status(), `${url} status`).toBe(200);
  }
});

test('Homepage HTML has correct favicon and OG link tags', async ({ page }) => {
  await page.goto('/');

  // favicon link
  const iconLink = page.locator('link[rel="icon"][href*="favicon"]');
  await expect(iconLink).toHaveCount(1);

  // svg icon link
  const svgIcon = page.locator('link[rel="icon"][type="image/svg+xml"]');
  await expect(svgIcon).toHaveCount(1);

  // apple touch icon link
  const appleIcon = page.locator('link[rel="apple-touch-icon"]');
  await expect(appleIcon).toHaveCount(1);

  // manifest link
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveCount(1);

  // og:image meta
  const ogImage = page.locator('meta[property="og:image"]');
  const ogCount = await ogImage.count();
  expect(ogCount).toBeGreaterThanOrEqual(1);

  // og:image:alt
  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveCount(1);

  // twitter:image meta
  const twitterImage = page.locator('meta[name="twitter:image"]');
  const twCount = await twitterImage.count();
  expect(twCount).toBeGreaterThanOrEqual(1);

  // twitter:image:alt
  const twitterImageAlt = page.locator('meta[name="twitter:image:alt"]');
  await expect(twitterImageAlt).toHaveCount(1);

  // Description contains Bharat Hydro Seal
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute(
    'content',
    /Bharat Hydro Seal/,
  );
});
