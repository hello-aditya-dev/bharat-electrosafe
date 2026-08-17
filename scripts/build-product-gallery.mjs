/* ────────────────────────────────────────────────────────────────
   Curated product-gallery builder.

   Companion to build-assets.mjs. Where that script mirrors the whole
   client archive into /public, this one writes only the images the
   image audit actually selected for a placement, under a predictable
   per-product layout:

     public/media/products/<slug>/card.webp
     public/media/products/<slug>/gallery/NN-<name>.webp

   The first gallery slide doubles as the product-page hero, so no
   product ships the same bytes twice.

   Every entry below traces to a genuine client-owned source. Nothing is
   generated, upscaled or composited. Selections and rejections are
   recorded in docs/PRODUCT-IMAGE-AUDIT.md.

   Sanitisation matches build-assets.mjs: sharp copies no input metadata
   unless withMetadata() is called, and it is never called here, so no
   EXIF, GPS or device serial reaches /public. `.rotate()` with no
   argument bakes in EXIF orientation and then discards the flag.

   Usage:
     node scripts/build-product-gallery.mjs [--source "<archive>"] [--dry]
   ──────────────────────────────────────────────────────────────── */

import { mkdir, writeFile, copyFile, stat, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry')
const sourceFlag = args.indexOf('--source')
const SOURCE =
  sourceFlag !== -1 && args[sourceFlag + 1]
    ? path.resolve(args[sourceFlag + 1])
    : path.resolve(repoRoot, '..', '..', 'bharatsafe')

const PUBLIC = path.join(repoRoot, 'public')

/* Photographs live either loose in the archive root or in the folder the
   operator extracted V1.1.zip into. Look in both rather than forcing one
   layout on whoever re-runs this. */
const CANDIDATE_DIRS = [SOURCE, path.join(SOURCE, '_v11'), path.join(SOURCE, 'Files to use')]

/** Resolve a client-archive filename against the candidate directories. */
function archive(name) {
  for (const dir of CANDIDATE_DIRS) {
    const p = path.join(dir, name)
    if (existsSync(p)) return { kind: 'archive', path: p, label: name }
  }
  return { kind: 'archive', path: path.join(SOURCE, name), label: name, missing: true }
}

/** Reference an image already sanitised into /public by an earlier build. */
function pub(rel) {
  return { kind: 'public', path: path.join(PUBLIC, rel), label: rel }
}

/* Product images carry technical detail — embossed coin and hexa
   patterns, moulded class markings, weld seams. Quality stays high
   because those are exactly what aggressive compression destroys. */
const QUALITY = 88

/**
 * @typedef {object} Slide
 * @property {string} name  Output basename, without index or extension
 * @property {object} from  archive() or pub() descriptor
 * @property {number} width Max width; never enlarges past the source
 */

/** @type {Array<{slug: string, card: {from: object, width: number}, gallery: Slide[]}>} */
const products = [
  {
    slug: 'electrical-insulating-mats',
    card: { from: archive('Coined Insulating mat10.JPG'), width: 900 },
    /* IMG_6023.JPG is byte-identical to IMG_6049.JPG in the client archive —
       the same photograph filed twice. Only one is used. */
    gallery: [
      { name: 'blue-coin-mat', from: archive('IMG_6049.JPG'), width: 1600 },
      { name: 'coin-surface-detail', from: archive('IMG_6048.JPG'), width: 1600 },
      { name: 'black-hexa-mat', from: archive('IMG_6030.JPG'), width: 1600, quality: 80 },
      {
        name: 'hexa-surface-detail',
        from: pub('media/products/electrical-insulating-mats/photo-hexa-02.webp'),
        width: 1600,
        quality: 80,
      },
      { name: 'iec-61111-marking', from: archive('IEC 61111 Class 2.jpeg'), width: 1440 },
      { name: 'colour-and-pattern-range', from: archive('Normal Mat.jpeg'), width: 1440 },
    ],
  },
  {
    slug: 'coloured-strip-insulating-mats',
    card: { from: archive('IMG_6026.JPG'), width: 900 },
    gallery: [
      { name: 'yellow-strip-hexa-mat', from: archive('IMG_6029.JPG'), width: 1600 },
      { name: 'yellow-strip-dot-mat', from: archive('IMG_6026.JPG'), width: 1600 },
      {
        name: 'yellow-strip-angled',
        from: pub('media/products/coloured-strip-insulating-mats/photo-strip-03.webp'),
        width: 1600,
      },
      { name: 'edge-strip-production', from: archive('Coloured Strip1.jpeg'), width: 1440, quality: 82 },
      {
        name: 'switchroom-boundary',
        from: pub('media/products/coloured-strip-insulating-mats/product-demo.webp'),
        width: 1440,
      },
    ],
  },
  {
    /* No genuine photography exists for this family. The client's own
       published illustrations are kept because they are the only truthful
       depiction of the two-layer construction available; the gap is logged
       in docs/PRODUCT-PHOTOGRAPHY-GAPS.md as the highest priority shot. */
    slug: 'bi-color-insulating-mats',
    card: { from: pub('media/products/bi-color-insulating-mats/product-03.webp'), width: 900 },
    gallery: [
      {
        name: 'dual-layer-roll',
        from: pub('media/products/bi-color-insulating-mats/product-01.webp'),
        width: 1024,
      },
      {
        name: 'layer-edge-detail',
        from: pub('media/products/bi-color-insulating-mats/product-02.webp'),
        width: 1024,
      },
      {
        name: 'contrasting-layers',
        from: pub('media/products/bi-color-insulating-mats/product-03.webp'),
        width: 1024,
      },
      {
        name: 'layer-cross-section',
        from: pub('media/products/bi-color-insulating-mats/product-demo-bi-color.webp'),
        width: 1024,
      },
    ],
  },
  {
    slug: 'auto-glow-reflective-band-insulating-mats',
    card: { from: pub('media/products/auto-glow-reflective-band/photo-03.webp'), width: 900 },
    gallery: [
      {
        name: 'reflective-bands-daylight',
        from: pub('media/products/auto-glow-reflective-band/photo-01.webp'),
        width: 1600,
      },
      {
        name: 'reflective-bands-low-light',
        from: pub('media/products/auto-glow-reflective-band/photo-02.webp'),
        width: 1600,
      },
      { name: 'band-surface-detail', from: archive('AutoGlow17.JPG'), width: 1600 },
      { name: 'is-15652-class-c-marking', from: archive('AutoGlow19.png'), width: 1600 },
      { name: 'auto-glow-product-label', from: archive('AutoGlow3.jpeg'), width: 1280, quality: 82 },
      { name: 'supplied-in-rolls', from: archive('AutoGlow12.jpeg'), width: 1280 },
    ],
  },
  {
    /* Every membrane photograph the client published is 500 px square —
       the tunnel hero is the only larger asset. Logged as a gap. */
    slug: 'bharat-membrane',
    card: { from: pub('media/products/bharat-membrane/product-01.webp'), width: 900 },
    gallery: [
      { name: 'tunnel-membrane-lining', from: pub('media/products/bharat-membrane/hero.webp'), width: 1600 },
      { name: 'yellow-membrane-tunnel', from: pub('media/products/bharat-membrane/product-01.webp'), width: 1024 },
      { name: 'membrane-seam-welding', from: pub('media/products/bharat-membrane/product-02.webp'), width: 1024 },
      { name: 'hot-air-weld-detail', from: pub('media/products/bharat-membrane/product-03.webp'), width: 1024 },
      { name: 'tunnel-portal-lining', from: pub('media/products/bharat-membrane/product-04.webp'), width: 1024 },
      { name: 'containment-basin-lining', from: pub('media/products/bharat-membrane/product-05.webp'), width: 1024 },
    ],
  },
  {
    slug: 'bharat-hydro-seal',
    card: { from: archive('Water Stop Seal1.png'), width: 900 },
    gallery: [
      { name: 'ribbed-water-stop-profile', from: archive('Water Stop Seal6.png'), width: 1600 },
      { name: 'centre-bulb-profile', from: archive('IMG_6038.JPG'), width: 1600 },
      { name: 'flat-flange-profile', from: archive('IMG_6040.JPG'), width: 1600 },
      { name: 'translucent-pvc-profile', from: archive('Water Stop Seal2.png'), width: 1600 },
      { name: 'rib-detail', from: archive('Water Stop Seal8.jpeg'), width: 1200, quality: 82 },
    ],
  },
]

const pad = (n) => String(n).padStart(2, '0')

/* Above this, a WebP is re-encoded rather than copied. Slides heavier than
   this are all-over fine texture that the original encode left oversized. */
const COPY_BUDGET_BYTES = 300 * 1024

async function emit(from, destRel, width, quality = QUALITY) {
  const destination = path.join(PUBLIC, destRel)
  await mkdir(path.dirname(destination), { recursive: true })

  const meta = await sharp(from.path).metadata()
  const sourceBytes = (await stat(from.path)).size

  /* An already-sanitised WebP that is no wider than the target and not
     oversized is copied byte-for-byte. Re-encoding lossy WebP into lossy
     WebP would soften the surface texture for no size win. */
  const canCopy =
    meta.format === 'webp' && meta.width <= width && sourceBytes <= COPY_BUDGET_BYTES

  if (dryRun) {
    return { to: destRel, from: from.label, sourceBytes, bytes: 0, width: Math.min(meta.width, width), height: 0, copied: canCopy }
  }

  if (canCopy) {
    await copyFile(from.path, destination)
  } else {
    await sharp(from.path)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      /* effort 6 buys a few percent over the default at build time only. */
      .webp({ quality, effort: 6 })
      .toFile(destination)
  }

  const out = await sharp(destination).metadata()
  const bytes = (await stat(destination)).size
  return { to: destRel, from: from.label, sourceBytes, bytes, width: out.width, height: out.height, copied: canCopy }
}

async function run() {
  const written = []
  const missing = []

  for (const product of products) {
    const base = `media/products/${product.slug}`

    /* Clear this script's own previous output so a renamed or dropped slide
       cannot linger and be picked up by a stale data reference. Only the
       gallery directory this script writes is removed. */
    if (!dryRun) {
      await rm(path.join(PUBLIC, base, 'gallery'), { recursive: true, force: true })
    }

    for (const job of [
      {
        from: product.card.from,
        to: `${base}/card.webp`,
        width: product.card.width,
        quality: product.card.quality,
      },
      ...product.gallery.map((s, i) => ({
        from: s.from,
        to: `${base}/gallery/${pad(i + 1)}-${s.name}.webp`,
        width: s.width,
        quality: s.quality,
      })),
    ]) {
      if (!existsSync(job.from.path)) {
        missing.push({ to: job.to, from: job.from.label })
        console.warn(`  MISSING source for ${job.to}: ${job.from.label}`)
        continue
      }
      const result = await emit(job.from, job.to, job.width, job.quality)
      written.push(result)
      const kb = (n) => `${(n / 1024).toFixed(0)}KB`
      console.log(
        `${dryRun ? 'would write' : 'wrote'}  ${result.to}  ${result.width}x${result.height}  ` +
          `${kb(result.sourceBytes)} -> ${kb(result.bytes)}${result.copied ? '  (copied)' : ''}`
      )
    }
  }

  const totalSource = written.reduce((a, r) => a + r.sourceBytes, 0)
  const totalOut = written.reduce((a, r) => a + r.bytes, 0)
  console.log(
    `\n${written.length} images, ${missing.length} missing sources\n` +
      `source total ${(totalSource / 1024 / 1024).toFixed(1)}MB -> output total ${(totalOut / 1024).toFixed(0)}KB`
  )

  if (!dryRun) {
    await mkdir(path.join(repoRoot, '.client-work'), { recursive: true })
    await writeFile(
      path.join(repoRoot, '.client-work', 'product-gallery-report.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), written, missing }, null, 2)
    )
  }

  if (missing.length) process.exitCode = 1
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
