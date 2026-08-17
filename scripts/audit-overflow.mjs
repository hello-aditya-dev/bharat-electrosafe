// Horizontal overflow audit.
// Visits every public route at every required viewport and reports:
//   - scrollWidth - clientWidth delta
//   - the offending elements (left/right outside viewport)
// Exits non-zero if any route/viewport has overflow > 1px.
import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3001';

const ROUTES = [
  '/',
  '/products',
  '/about-us',
  '/contact-us',
  '/products/electrical-insulating-mats',
  '/products/international-iec-61111',
  '/products/pvc-flooring-solutions',
  '/products/other-products',
  '/products/bharat-membrane',
  '/products/bharat-hydro-seal',
  '/products/auto-glow-reflective-band-insulating-mats',
  '/products/bi-color-insulating-mats',
  '/products/coloured-strip-insulating-mats',
];

const WIDTHS = [320, 360, 390, 430, 768, 820, 1024, 1280, 1366, 1440, 1920];
const HEIGHT = 900;

let failures = 0;
const results = [];
const fs = await import('node:fs');
const OUT = '/tmp/be-audit-results.json';
fs.writeFileSync(OUT, '[]');

const browser = await chromium.launch();
const context = await browser.newContext();

function persist() {
  fs.writeFileSync(OUT, JSON.stringify(results, null, 0));
}

for (const route of ROUTES) {
  for (const w of WIDTHS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: w, height: HEIGHT });
    const url = BASE + route;
    let status = 'ok';
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!resp || !resp.ok()) {
        status = `http-${resp ? resp.status() : 'none'}`;
      }
      // Let fonts/images/reveal animations settle briefly.
      await page.waitForTimeout(400);
      // On the homepage at desktop widths, also open the products mega menu
      // to verify it doesn't cause overflow.
      if (w >= 1024 && route === '/') {
        try {
          const trigger = page.locator('[data-mega-menu-trigger]').first();
          if (await trigger.count()) {
            await trigger.hover({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(400);
          }
        } catch {}
      }
      // On the homepage at mobile widths, open the mobile nav sheet to verify
      // it doesn't cause overflow.
      if (w < 1024 && route === '/') {
        try {
          const toggle = page.locator('button[aria-label="Open navigation menu"]').first();
          if (await toggle.count()) {
            await toggle.click({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(400);
          }
        } catch {}
      }
      const data = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll('*')]
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              cls: (el.className && typeof el.className === 'string')
                ? el.className.slice(0, 80)
                : '',
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
            };
          })
          .filter(
            (x) =>
              x.right > document.documentElement.clientWidth + 1 ||
              x.left < -1
          );
        return { sw, cw, delta: sw - cw, offenders: offenders.slice(0, 8) };
      });
      const ok = data.delta <= 1;
      if (!ok) failures++;
      results.push({ route, w, status, ok, ...data });
      persist();
      process.stdout.write(`[${results.length}/${ROUTES.length * WIDTHS}] ${route} @${w} → delta=${data.delta} ${ok ? 'OK' : 'FAIL'}\n`);
    } catch (e) {
      status = `err:${e.message.split('\n')[0].slice(0, 60)}`;
      failures++;
      results.push({ route, w, status, ok: false, delta: 'n/a' });
      persist();
      process.stdout.write(`[${results.length}/${ROUTES.length * WIDTHS}] ${route} @${w} → ${status}\n`);
    }
    await page.close();
  }
}

await browser.close();

// Print summary table
console.log('\n=== HORIZONTAL OVERFLOW AUDIT ===');
console.log('route'.padEnd(52), 'w'.padStart(5), 'delta'.padStart(7), 'status');
console.log('-'.repeat(72));
for (const r of results) {
  const delta = typeof r.delta === 'number' ? String(r.delta) : r.delta;
  const flag = r.ok ? ' ' : '!';
  console.log(
    flag,
    r.route.padEnd(50),
    String(r.w).padStart(5),
    delta.padStart(7),
    r.status
  );
  if (!r.ok && r.offenders && r.offenders.length) {
    for (const o of r.offenders) {
      console.log('     ↳', `${o.tag}${o.id ? '#' + o.id : ''}.${o.cls.slice(0, 50)}`, `left=${o.left} right=${o.right} w=${o.width}`);
    }
  }
}
console.log('-'.repeat(72));
console.log(`Failures (>1px overflow): ${failures} / ${results.length}`);
process.exit(failures > 0 ? 1 : 0);
