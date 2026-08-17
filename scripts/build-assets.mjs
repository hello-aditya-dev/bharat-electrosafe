/* ────────────────────────────────────────────────────────────────
   Public asset derivative builder.

   Reads the private client asset archive, writes sanitised, web-ready
   derivatives into /public. The archive itself is gitignored and never
   committed — only the derivatives this script produces are.

   Sanitisation: sharp does not copy input metadata into its output
   unless `.withMetadata()` is called. It is never called here, so every
   derivative is written without EXIF, GPS, device serials or embedded
   thumbnails. Orientation is normalised via `.rotate()` with no
   argument, which applies the EXIF orientation flag and then discards it.

   Usage:
     node scripts/build-assets.mjs [--source "<path to archive>"] [--dry]

   Default source is ../../bharatsafe relative to the repo, matching the
   layout documented in docs/CLIENT_HANDOVER.md.
   ──────────────────────────────────────────────────────────────── */

import { mkdir, writeFile, readFile } from 'node:fs/promises'
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

const SITE = path.join(SOURCE, 'V4_bharatelectrosafe.com', 'public_html', 'images')
const USE = path.join(SOURCE, 'Files to use')
const ORG = path.join(SOURCE, 'Org Logo files')

/* HEIC sources must be decoded to PNG first by scripts/decode-heic.py —
   sharp's HEIF input needs an HEVC decoder that this build lacks. Point
   --heic at that output directory. */
const heicFlag = args.indexOf('--heic')
const HEIC =
  heicFlag !== -1 && args[heicFlag + 1] ? path.resolve(args[heicFlag + 1]) : path.join(SOURCE, '_decoded')

/* V1.1.zip holds 66 photographs that are not in the flat archive folder,
   including the only BharatHydro Seal product shots. Extract its root-level
   JPEGs and point --v11 at them. */
const v11Flag = args.indexOf('--v11')
const V11 =
  v11Flag !== -1 && args[v11Flag + 1] ? path.resolve(args[v11Flag + 1]) : path.join(SOURCE, '_v11')

const OUT = path.join(repoRoot, 'public')

/* Quality is deliberately high. These images carry technical detail —
   embossing patterns, certificate text, class markings — that aggressive
   compression destroys. */
const QUALITY = 86

/**
 * @typedef {object} Asset
 * @property {string} from   Absolute source path
 * @property {string} to     Output path relative to /public
 * @property {number} [width] Max width; omitted keeps native size
 * @property {string} subject Plain description for the public manifest
 */

/** @type {Asset[]} */
const assets = [
  /* ── Brand ── */
  { from: path.join(USE, 'BES Logo without BG.png'), to: 'brand/bharat-electrosafe-logo.webp', width: 512, subject: 'Bharat Electrosafe primary logo, transparent' },
  { from: path.join(USE, 'BharatMembrane without BG.png'), to: 'brand/bharat-membrane-logo.webp', width: 512, subject: 'BharatMembrane sub-brand logo, transparent' },
  { from: path.join(USE, 'INSULATICAA logo without BG.png'), to: 'brand/insulaticaa-logo.webp', width: 512, subject: 'INSULATICAA sub-brand logo, transparent' },
  /* marketed-by-tata entry removed — Tata branding no longer used */

  /* ── Home ── */
  { from: path.join(SITE, 'slider', 'slider-bg5.png'), to: 'media/home/hero.webp', width: 1920, subject: 'Insulating mat hero composition' },
  { from: path.join(SITE, 'word-class-setup.jpg'), to: 'media/manufacturing/production-line.webp', width: 1440, subject: 'Manufacturing setup and production line' },
  { from: path.join(SITE, 'who-we-are.png'), to: 'media/home/who-we-are.webp', width: 1024, subject: 'Company overview visual' },
  { from: path.join(SITE, 'why-choose-us.png'), to: 'media/home/why-choose-us.webp', width: 1024, subject: 'Capability overview visual' },
  { from: path.join(SITE, 'about-us.png'), to: 'media/home/about-overview.webp', width: 1440, subject: 'About page overview visual' },
  { from: path.join(SITE, 'core-values.png'), to: 'media/home/core-values.webp', width: 1024, subject: 'Core values visual' },

  /* ── Electrical insulating mats ── */
  ...range(1, 9).map((n) => ({
    from: path.join(SITE, 'electrical-insulating-mats', `product-0${n}.png`),
    to: `media/products/electrical-insulating-mats/gallery-0${n}.webp`,
    width: 1024,
    subject: `Electrical insulating mat, view ${n}`,
  })),

  /* ── Coloured strip ── */
  ...range(1, 5).map((n) => ({
    from: path.join(SITE, 'coloured-strip-insulating', `product-0${n}.png`),
    to: `media/products/coloured-strip-insulating-mats/gallery-0${n}.webp`,
    width: 1024,
    subject: `Coloured strip insulating mat, view ${n}`,
  })),
  { from: path.join(SITE, 'coloured-strip-insulating', 'product-demo.png'), to: 'media/products/coloured-strip-insulating-mats/hero.webp', width: 1440, subject: 'Coloured strip insulating mat in use' },

  /* ── Bi-color ── */
  ...range(1, 3).map((n) => ({
    from: path.join(SITE, 'bi-color-insulating-mats', `product-0${n}.png`),
    to: `media/products/bi-color-insulating-mats/gallery-0${n}.webp`,
    width: 1024,
    subject: `Bi-colour insulating mat, view ${n}`,
  })),
  { from: path.join(SITE, 'bi-color-insulating-mats', 'product-demo-bi-color.png'), to: 'media/products/bi-color-insulating-mats/hero.webp', width: 1440, subject: 'Bi-colour insulating mat dual-tone surface' },

  /* ── Auto-glow / reflective band ── */
  ...range(1, 5).map((n) => ({
    from: path.join(SITE, 'reflective-band-insulating', `product-0${n}.png`),
    to: `media/products/auto-glow-reflective-band/gallery-0${n}.webp`,
    width: 1024,
    subject: `Auto-glow / reflective band insulating mat, view ${n}`,
  })),
  { from: path.join(SITE, 'reflective-band-insulating', 'product-demo-glowing-dark.png'), to: 'media/products/auto-glow-reflective-band/low-light.webp', width: 1440, subject: 'Auto-glow band appearance in low light, as published by the client' },

  /* ── BharatMembrane ── */
  ...range(1, 6).map((n) => ({
    from: path.join(SITE, 'membrane', `product-0${n}.png`),
    to: `media/products/bharat-membrane/gallery-0${n}.webp`,
    width: 1024,
    subject: `BharatMembrane PVC geo-membrane, view ${n}`,
  })),
  { from: path.join(SITE, 'membrane', 'product-demo.png'), to: 'media/products/bharat-membrane/hero.webp', width: 1440, subject: 'BharatMembrane PVC geo-membrane roll' },

  /* ── Leadership ──
     Filename-to-person mapping is taken from the alt attributes in the
     client's own leadership-team-2.php, not inferred from initials. */
  { from: path.join(SITE, 'leadership', 'VG-1.png'), to: 'media/leadership/vishnu-gupta.webp', width: 640, subject: 'Vishnu Gupta, Co-Founder & Director' },
  { from: path.join(SITE, 'leadership', 'KK-1.png'), to: 'media/leadership/krishan-kumar.webp', width: 640, subject: 'Krishan Kumar, Co-Founder & Director' },
  { from: path.join(SITE, 'leadership', 'PG-1.png'), to: 'media/leadership/priyanka-garg.webp', width: 640, subject: 'Priyanka Garg, Entrepreneur, Co-Founder & Director' },

  /* ── Awards ── */
  { from: path.join(SITE, 'award-01.png'), to: 'media/awards/award-01.webp', width: 1024, subject: 'Award photograph, as published by the client' },
  { from: path.join(SITE, 'award-02.png'), to: 'media/awards/award-02.webp', width: 1024, subject: 'Award photograph, as published by the client' },

  /* ── Client logos ── */
  ...['bhel', 'indian-oil', 'jk-tyre', 'ntpc', 'ongc', 'power-grid', 'ptcul', 'sail'].map((name) => ({
    from: path.join(SITE, 'clients', `${name}.webp`),
    to: `media/clients/${name}.webp`,
    width: 240,
    subject: `${name} logo`,
  })),

  /* ── Certification badges ── */
  ...['acl', 'airia', 'bis', 'ce', 'erda', 'isi', 'iso', 'iso-1400', 'iso-4500', 'msme', 'nth', 'startupindia'].map((name) => ({
    from: path.join(SITE, 'certificates', `${name}.webp`),
    to: `media/certifications/${name}.webp`,
    width: 200,
    subject: `${name} certification badge`,
  })),
  { from: path.join(ORG, 'NABL_Official_LOGO.png'), to: 'media/certifications/nabl.webp', width: 200, subject: 'NABL accreditation mark' },

  /* ── Real product photography, decoded from the HEIC originals ──
     These are 12MP camera photographs of actual product, as opposed to
     the rendered/illustrated imagery on the legacy site. They are the
     preferred source for anything presented as a real product view. */
  ...range(1, 9).map((n) => ({
    from: path.join(HEIC, `Coined Insulating mat${n}.png`),
    to: `media/products/electrical-insulating-mats/photo-coin-0${n}.webp`,
    width: 1600,
    subject: `Coin-pattern anti-skid insulating mat, photograph ${n}`,
  })),
  ...range(1, 4).map((n) => ({
    from: path.join(HEIC, `Hash Mat${n}.png`),
    to: `media/products/electrical-insulating-mats/photo-hexa-0${n}.webp`,
    width: 1600,
    subject: `Hexa-pattern anti-skid insulating mat, photograph ${n}`,
  })),
  { from: path.join(HEIC, 'Dotted Insulating mat1.png'), to: 'media/products/electrical-insulating-mats/photo-dot-01.webp', width: 1600, subject: 'Dot-pattern anti-skid insulating mat, photograph' },
  ...range(1, 3).map((n) => ({
    from: path.join(HEIC, `Dotted Mat with Guided Strip${n}.png`),
    to: `media/products/coloured-strip-insulating-mats/photo-strip-0${n}.webp`,
    width: 1600,
    subject: `Insulating mat with guided colour strip, photograph ${n}`,
  })),
  { from: path.join(HEIC, 'Dotted guided strip mat1.png'), to: 'media/products/coloured-strip-insulating-mats/photo-strip-04.webp', width: 1600, subject: 'Insulating mat with guided colour strip, photograph 4' },
  ...range(13, 16).map((n) => ({
    from: path.join(HEIC, `AutoGlow${n}.png`),
    to: `media/products/auto-glow-reflective-band/photo-0${n - 12}.webp`,
    width: 1600,
    subject: `Auto-glow / reflective band insulating mat, photograph ${n - 12}`,
  })),

  /* ── Photographs unique to V1.1.zip ── */
  { from: path.join(V11, 'Water Stop Seal8.jpeg'), to: 'media/products/bharat-hydro-seal/hero.webp', width: 1440, subject: 'BharatHydro Seal ribbed water stop profile' },
  { from: path.join(V11, 'Water Stop Seal9.jpeg'), to: 'media/products/bharat-hydro-seal/gallery-01.webp', width: 1440, subject: 'BharatHydro Seal water stop profile, second view' },
  { from: path.join(V11, 'Normal Mat.jpeg'), to: 'media/products/electrical-insulating-mats/photo-plain-01.webp', width: 1440, subject: 'Plain electrical insulating mat sheet' },
  { from: path.join(V11, 'Coloured Strip1.jpeg'), to: 'media/products/coloured-strip-insulating-mats/photo-strip-05.webp', width: 1440, subject: 'Coloured strip insulating mat' },
  { from: path.join(V11, 'Coined Insulating mat10.JPG'), to: 'media/products/electrical-insulating-mats/photo-coin-10.webp', width: 1600, subject: 'Coin-pattern insulating mat, photograph 10' },
  { from: path.join(V11, 'IEC 61111.jpeg'), to: 'media/products/electrical-insulating-mats/photo-iec-01.webp', width: 1440, subject: 'Insulating mat marked to IEC 61111' },
  { from: path.join(V11, 'IEC 61111 Class 2.jpeg'), to: 'media/products/electrical-insulating-mats/photo-iec-02.webp', width: 1440, subject: 'IEC 61111 Class 2 insulating mat marking' },
  { from: path.join(V11, 'IEC 61111 Class 0-2 (2MM).jpeg'), to: 'media/products/electrical-insulating-mats/photo-iec-03.webp', width: 1440, subject: 'IEC 61111 Class 0-2, 2 mm insulating mat marking' },
  ...range(17, 18).map((n) => ({
    from: path.join(V11, `AutoGlow${n}.JPG`),
    to: `media/products/auto-glow-reflective-band/photo-0${n - 12}.webp`,
    width: 1600,
    subject: `Auto-glow / reflective band insulating mat, photograph ${n - 12}`,
  })),
  /* Black knurled/diamond-surface mat sheets, photographed on a plain
     background — used as surface-pattern detail views. */
  ...[6030, 6036, 6022, 6029].map((id, i) => ({
    from: path.join(V11, `IMG_${id}.JPG`),
    to: `media/products/electrical-insulating-mats/photo-surface-0${i + 1}.webp`,
    width: 1600,
    subject: `Insulating mat surface pattern, view ${i + 1}`,
  })),
  ...range(1, 5).map((n) => ({
    from: path.join(V11, `Awards ${n}.jpeg`),
    to: `media/awards/photo-0${n}.webp`,
    width: 1200,
    subject: `Award and recognition photograph ${n}`,
  })),
]

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

async function run() {
  if (!existsSync(SOURCE)) {
    console.error(`Asset archive not found: ${SOURCE}`)
    console.error('Pass --source "<path>" to point at the client archive.')
    process.exit(1)
  }

  const written = []
  const missing = []
  const failed = []

  for (const asset of assets) {
    if (!existsSync(asset.from)) {
      missing.push(asset)
      continue
    }

    const destination = path.join(OUT, asset.to)
    await mkdir(path.dirname(destination), { recursive: true })

    try {
      /* `.rotate()` with no argument bakes in EXIF orientation, then the
         encoder drops all metadata because withMetadata() is never called. */
      const pipeline = sharp(asset.from).rotate()
      if (asset.width) {
        pipeline.resize({ width: asset.width, withoutEnlargement: true })
      }

      const { width, height } = dryRun
        ? { width: 0, height: 0 }
        : await pipeline.webp({ quality: QUALITY }).toFile(destination)

      written.push({ ...asset, width, height })
      console.log(`${dryRun ? 'would write' : 'wrote'}  ${asset.to}  ${width}x${height}`)
    } catch (error) {
      /* One unreadable source must not abandon the rest of the build.
         HEIC/HEIF in particular needs an HEVC decoder that is not present
         in every sharp build — those are reported, not fatal. */
      failed.push({ ...asset, error: String(error.message ?? error).split('\n')[0] })
      console.warn(`  FAILED ${asset.to}: ${String(error.message ?? error).split('\n')[0]}`)
    }
  }

  console.log(
    `\n${written.length} derivatives, ${missing.length} sources missing, ${failed.length} failed`
  )
  for (const m of missing) console.warn(`  missing: ${path.relative(SOURCE, m.from)}`)
  for (const f of failed) console.warn(`  failed:  ${path.relative(SOURCE, f.from)}`)

  if (!dryRun) {
    await writeFile(
      path.join(repoRoot, '.client-work', 'asset-build-report.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), written, missing }, null, 2)
    ).catch(async () => {
      await mkdir(path.join(repoRoot, '.client-work'), { recursive: true })
      await writeFile(
        path.join(repoRoot, '.client-work', 'asset-build-report.json'),
        JSON.stringify({ generatedAt: new Date().toISOString(), written, missing }, null, 2)
      )
    })
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
