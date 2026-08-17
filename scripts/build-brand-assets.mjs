/**
 * Build brand assets from the client-supplied master logo.
 *
 * Source: "BES Logo without BG.png" (transparent master, large whitespace margin).
 * Sharp trims the transparent margin so the header can size the logo by height
 * without the mark floating in dead space, then emits the production files.
 *
 * Run: node scripts/build-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SOURCE = String.raw`C:\Users\Aditya\OneDrive\Desktop\bharatsafe\Files to use\BES Logo without BG.png`;
const OUT_DIR = path.join(process.cwd(), 'public', 'brand');

await mkdir(OUT_DIR, { recursive: true });

// Trim the transparent margin off the master, keeping full colour fidelity.
const trimmed = await sharp(SOURCE)
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

const meta = await sharp(trimmed).metadata();
console.log(`trimmed logo: ${meta.width}x${meta.height}`);

// Primary header/footer logo — PNG keeps the transparent background and the
// gradient wordmark crisp on both white and cream.
await sharp(trimmed)
  .resize({ width: 900, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(OUT_DIR, 'bharat-electrosafe-logo.png'));

// Open Graph card — logo centred on the brand cream, 1200x630.
const ogLogo = await sharp(trimmed)
  .resize({ width: 760, fit: 'inside', withoutEnlargement: true })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 253, g: 250, b: 244, alpha: 1 },
  },
})
  .composite([{ input: ogLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(OUT_DIR, 'og-bharat-electrosafe.png'));

console.log('brand assets written to public/brand/');
