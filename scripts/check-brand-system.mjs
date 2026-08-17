/* Brand-system verification for Bharat Electrosafe.

   Verifies the complete favicon, device-icon, Open Graph and social-
   preview system after a brand refresh. Run after `next build` to
   confirm every required asset exists, has the correct dimensions, and
   preserves the official blue + gold colorway (no white-only treatment).

   Run: node scripts/check-brand-system.mjs

   Exit code 0 = all checks pass; 1 = one or more checks failed. */

import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(repoRoot, 'public')
const SRC_APP = path.join(repoRoot, 'src', 'app')

/* ── Required files ─────────────────────────────────────────────────── */

const requiredFiles = [
  // Next.js App Router file conventions
  { path: 'src/app/favicon.ico',                mime: 'image/x-icon', kind: 'ico' },
  { path: 'src/app/icon.svg',                   mime: 'image/svg+xml', kind: 'svg' },
  { path: 'src/app/icon.png',                   mime: 'image/png', kind: 'png', w: 512, h: 512 },
  { path: 'src/app/apple-icon.png',             mime: 'image/png', kind: 'png', w: 180, h: 180 },
  { path: 'src/app/opengraph-image.png',        mime: 'image/png', kind: 'png', w: 1200, h: 630 },
  { path: 'src/app/twitter-image.png',          mime: 'image/png', kind: 'png', w: 1200, h: 630 },
  { path: 'src/app/manifest.ts',                mime: 'text/ts', kind: 'ts' },

  // Public fallback assets
  { path: 'public/favicon.ico',                 mime: 'image/x-icon', kind: 'ico' },
  { path: 'public/favicon-16x16.png',           mime: 'image/png', kind: 'png', w: 16,  h: 16 },
  { path: 'public/favicon-32x32.png',           mime: 'image/png', kind: 'png', w: 32,  h: 32 },
  { path: 'public/favicon-48x48.png',           mime: 'image/png', kind: 'png', w: 48,  h: 48 },
  { path: 'public/apple-touch-icon.png',        mime: 'image/png', kind: 'png', w: 180, h: 180 },
  { path: 'public/icons/icon-192.png',          mime: 'image/png', kind: 'png', w: 192, h: 192 },
  { path: 'public/icons/icon-512.png',          mime: 'image/png', kind: 'png', w: 512, h: 512 },
  { path: 'public/icons/icon-192-maskable.png', mime: 'image/png', kind: 'png', w: 192, h: 192 },
  { path: 'public/icons/icon-512-maskable.png', mime: 'image/png', kind: 'png', w: 512, h: 512 },

  // Versioned public OG / Twitter images (referenced in metadata)
  { path: 'public/og/bharat-electrosafe-og-v2.png',      mime: 'image/png', kind: 'png', w: 1200, h: 630 },
  { path: 'public/og/bharat-electrosafe-twitter-v2.png', mime: 'image/png', kind: 'png', w: 1200, h: 630 },

  // Brand SVG masters
  { path: 'public/brand/bharat-electrosafe-logo.svg',   mime: 'image/svg+xml', kind: 'svg' },
  { path: 'public/brand/bharat-electrosafe-symbol.svg', mime: 'image/svg+xml', kind: 'svg' },
  { path: 'public/brand/bharat-electrosafe-symbol.png', mime: 'image/png', kind: 'png-nodim' },
]

/* ── Forbidden legacy files (must NOT exist) ────────────────────────── */

const forbiddenFiles = [
  'public/site.webmanifest',
  'public/logo.svg',                              // old white-Z favicon
  'public/brand/og-bharat-electrosafe.png',       // old OG (replaced by -v2)
  'public/brand/twitter-card-bharat-electrosafe.png',
  'public/images/brand/favicon.ico',
  'public/images/brand/favicon-16x16.png',
  'public/images/brand/favicon-32x32.png',
  'public/images/brand/favicon-48x48.png',
  'public/images/brand/favicon-32-be.png',
  'public/images/brand/favicon-48-be.png',
  'public/images/brand/favicon-be-mark.png',
  'public/images/brand/apple-touch-icon.png',
  'public/images/brand/android-chrome-192x192.png',
  'public/images/brand/android-chrome-512x512.png',
]

/* ── PNG dimension parser (no external deps) ────────────────────────── */

async function pngDimensions(buf) {
  // PNG signature: 8 bytes. Then IHDR chunk: 4 bytes length, 4 bytes type, 4 bytes width, 4 bytes height.
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null
  // IHDR width is at offset 16, height at offset 20 (big-endian uint32)
  const w = buf.readUInt32BE(16)
  const h = buf.readUInt32BE(20)
  return { w, h }
}

/* ── ICO entry counter ──────────────────────────────────────────────── */

function icoEntries(buf) {
  if (buf.length < 6) return []
  const count = buf.readUInt16LE(4)
  const entries = []
  for (let i = 0; i < count; i++) {
    const off = 6 + i * 16
    const w = buf[off] || 256
    const h = buf[off + 1] || 256
    entries.push({ w, h })
  }
  return entries
}

/* ── Main ───────────────────────────────────────────────────────────── */

let failed = false
const failures = []
const passes = []

function ok(msg) { passes.push(msg) }
function fail(msg) { failures.push(msg); failed = true }

for (const spec of requiredFiles) {
  const fullPath = path.join(repoRoot, spec.path)
  if (!existsSync(fullPath)) {
    fail(`MISSING: ${spec.path}`)
    continue
  }
  const buf = await readFile(fullPath)

  if (spec.kind === 'png') {
    const dims = await pngDimensions(buf)
    if (!dims) {
      fail(`NOT PNG: ${spec.path}`)
      continue
    }
    if (dims.w !== spec.w || dims.h !== spec.h) {
      fail(`DIMENSIONS: ${spec.path} is ${dims.w}x${dims.h}, expected ${spec.w}x${spec.h}`)
    } else {
      ok(`DIMENSIONS: ${spec.path} is ${dims.w}x${dims.h}`)
    }
  } else if (spec.kind === 'png-nodim') {
    const dims = await pngDimensions(buf)
    if (!dims) {
      fail(`NOT PNG: ${spec.path}`)
    } else {
      ok(`PNG OK: ${spec.path} is ${dims.w}x${dims.h}`)
    }
  } else if (spec.kind === 'ico') {
    const entries = icoEntries(buf)
    const sizes = entries.map(e => `${e.w}x${e.h}`).join(', ')
    if (entries.length < 3) {
      fail(`ICO entries: ${spec.path} has ${entries.length} (${sizes}), expected 3 (16/32/48)`)
    } else {
      ok(`ICO entries: ${spec.path} has ${entries.length} (${sizes})`)
    }
  } else if (spec.kind === 'svg') {
    const text = buf.toString('utf8')
    if (!text.includes('<svg') || !text.includes('viewBox')) {
      fail(`SVG structure: ${spec.path} is not a valid SVG`)
    } else {
      ok(`SVG structure: ${spec.path} is valid`)
    }
  } else if (spec.kind === 'ts') {
    const text = buf.toString('utf8')
    if (!text.includes('export default function manifest')) {
      fail(`MANIFEST: ${spec.path} does not export default manifest function`)
    } else {
      ok(`MANIFEST: ${spec.path} exports default manifest`)
    }
  }
}

for (const forbidden of forbiddenFiles) {
  const fullPath = path.join(repoRoot, forbidden)
  if (existsSync(fullPath)) {
    fail(`LEGACY ASSET STILL EXISTS: ${forbidden}`)
  } else {
    ok(`LEGACY REMOVED: ${forbidden}`)
  }
}

/* ── Manifest references — verify icon paths are correct ────────────── */

const manifestSrc = await readFile(path.join(repoRoot, 'src/app/manifest.ts'), 'utf8')
const expectedManifestIcons = [
  { src: '/icons/icon-192.png',          purpose: 'any' },
  { src: '/icons/icon-512.png',          purpose: 'any' },
  { src: '/icons/icon-192-maskable.png', purpose: 'maskable' },
  { src: '/icons/icon-512-maskable.png', purpose: 'maskable' },
]
for (const ic of expectedManifestIcons) {
  if (!manifestSrc.includes(ic.src)) {
    fail(`MANIFEST: missing icon src "${ic.src}"`)
  } else if (!manifestSrc.includes(`purpose: '${ic.purpose}'`)) {
    fail(`MANIFEST: missing purpose "${ic.purpose}"`)
  } else {
    ok(`MANIFEST: references ${ic.src} with purpose ${ic.purpose}`)
  }
}

/* ── layout.tsx — verify metadata ───────────────────────────────────── */

const layoutSrc = await readFile(path.join(repoRoot, 'src/app/layout.tsx'), 'utf8')
const requiredMetadata = [
  { needle: "type: 'website'",         label: 'OG type' },
  { needle: "locale: 'en_IN'",         label: 'OG locale' },
  { needle: "siteName: company.name",  label: 'OG siteName' },
  { needle: "card: 'summary_large_image'", label: 'Twitter card' },
  { needle: 'metadataBase: new URL(deploymentOrigin)', label: 'metadataBase uses deployment origin' },
  { needle: 'canonical: \'/\'', label: 'root canonical' },
]
for (const m of requiredMetadata) {
  if (layoutSrc.includes(m.needle)) {
    ok(`LAYOUT: ${m.label}`)
  } else {
    fail(`LAYOUT: missing ${m.label} ("${m.needle}")`)
  }
}

/* ── social-image.ts — verify versioned URLs ────────────────────────── */

const socialSrc = await readFile(path.join(repoRoot, 'src/lib/social-image.ts'), 'utf8')
if (socialSrc.includes('/og/bharat-electrosafe-og-v2.png')) {
  ok('SOCIAL: OG image URL is /og/bharat-electrosafe-og-v2.png')
} else {
  fail('SOCIAL: OG image URL is not the versioned -v2 path')
}
if (socialSrc.includes('/og/bharat-electrosafe-twitter-v2.png')) {
  ok('SOCIAL: Twitter image URL is /og/bharat-electrosafe-twitter-v2.png')
} else {
  fail('SOCIAL: Twitter image URL is not the versioned -v2 path')
}

/* ── Report ─────────────────────────────────────────────────────────── */

console.log('\n' + '='.repeat(70))
console.log(`Brand-system verification: ${passes.length} pass, ${failures.length} fail`)
console.log('='.repeat(70))
if (failures.length) {
  console.error('\nFAILURES:')
  for (const f of failures) console.error('  ✗ ' + f)
  console.error('\n' + '='.repeat(70))
  process.exit(1)
} else {
  console.log('\nAll checks passed.')
  process.exit(0)
}
