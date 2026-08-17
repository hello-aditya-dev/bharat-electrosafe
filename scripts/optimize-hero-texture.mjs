/**
 * Optimize the hero mat-texture asset.
 *
 * The original photo-surface-01.webp is 1600×900, ~381 KB. It is referenced
 * inside the HeroTechnicalVisual SVG via <image href="..." width="410"
 * height="130" preserveAspectRatio="xMidYMid slice" /> — i.e. it is rendered
 * into a ~410×130 SVG-unit region that, even on a 2× retina desktop, only
 * needs roughly 860×280 source pixels to look crisp.
 *
 * This script produces a purpose-built hero texture:
 *   /public/media/hero/mat-texture.webp  (~860×280, target < 60 KB)
 *
 * It also produces a smaller mobile variant for <=640px viewports:
 *   /public/media/hero/mat-texture-mobile.webp (~560×200, target < 30 KB)
 *
 * The crop is a center-weighted extract of the coin-pattern surface. We
 * sharpen slightly so the anti-skid texture reads clearly at small sizes.
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const SRC = 'public/media/products/electrical-insulating-mats/photo-surface-01.webp';
const OUT_DESKTOP = 'public/media/hero/mat-texture.webp';
const OUT_MOBILE = 'public/media/hero/mat-texture-mobile.webp';

async function run() {
  const meta = await sharp(SRC).metadata();
  console.log('Source:', meta.width, 'x', meta.height, meta.format);

  // Desktop: crop a wide letterbox slice through the middle of the mat surface
  // (the coin pattern is the visually important part). 860×280 fits the
  // 410×130 SVG region at 2× retina with a small safety margin.
  const desktopCrop = {
    left: Math.round((meta.width - 1200) / 2),  // center 1200px wide
    top: Math.round((meta.height - 500) / 2),    // center 500px tall
    width: 1200,
    height: 500,
  };
  await sharp(SRC)
    .extract(desktopCrop)
    .resize(760, 250, { fit: 'cover', position: 'center' })
    .sharpen({ sigma: 0.5 })
    .webp({ quality: 68, effort: 6 })
    .toFile(OUT_DESKTOP);
  const deskMeta = await sharp(OUT_DESKTOP).metadata();
  const deskSize = await stat(OUT_DESKTOP);
  console.log('Desktop out:', deskMeta.width, 'x', deskMeta.height, deskMeta.format, 'size:', deskSize.size, 'bytes');

  // Mobile: smaller still — at 360–430px viewport the SVG visual is ~320px
  // wide, so 560×200 covers 2× retina comfortably.
  const mobileCrop = {
    left: Math.round((meta.width - 1000) / 2),
    top: Math.round((meta.height - 420) / 2),
    width: 1000,
    height: 420,
  };
  await sharp(SRC)
    .extract(mobileCrop)
    .resize(560, 200, { fit: 'cover', position: 'center' })
    .sharpen({ sigma: 0.5 })
    .webp({ quality: 72, effort: 6 })
    .toFile(OUT_MOBILE);
  const mobMeta = await sharp(OUT_MOBILE).metadata();
  const mobSize = await stat(OUT_MOBILE);
  console.log('Mobile out:', mobMeta.width, 'x', mobMeta.height, mobMeta.format, 'size:', mobSize.size, 'bytes');

  console.log('\nDone. Original: 381362 bytes → hero textures written.');
}

run().catch((err) => { console.error(err); process.exit(1); });
