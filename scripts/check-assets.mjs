/* Fails the build when a referenced public asset is missing, or when
   user-visible placeholder wording survives into source.

   Run: node scripts/check-assets.mjs */

import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(repoRoot, 'src')
const PUBLIC = path.join(repoRoot, 'public')

/** Words that must never reach a rendered page. */
const PLACEHOLDER_TERMS = [
  'lorem ipsum',
  'coming soon',
  'image coming',
  'placeholder image',
  'replace me',
  'dummy content',
  'final asset',
  'onboarding@resend.dev',
  'example.com',
]

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = (await walk(SRC)).filter((f) => /\.(ts|tsx)$/.test(f))

const missingAssets = []
const placeholders = []
/* Matches "/media/...", "/images/...", "/brand/...", "/documents/..." in
   any quoted string. */
const assetPattern = /["'`](\/(?:media|images|brand|documents|video-posters|downloads)\/[^"'`]+)["'`]/g

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(repoRoot, file)

  for (const match of source.matchAll(assetPattern)) {
    const assetPath = match[1]
    /* Interpolated paths resolve at runtime and cannot be checked here.
       Their targets are covered by the data-driven checks instead. */
    if (assetPath.includes('${')) continue
    if (!existsSync(path.join(PUBLIC, assetPath))) {
      missingAssets.push({ file: relative, assetPath })
    }
  }

  const lower = source.toLowerCase()
  for (const term of PLACEHOLDER_TERMS) {
    if (lower.includes(term)) placeholders.push({ file: relative, term })
  }
}

let failed = false

if (missingAssets.length) {
  failed = true
  console.error(`\n${missingAssets.length} referenced asset(s) do not exist:`)
  for (const m of missingAssets) console.error(`  ${m.assetPath}\n    referenced by ${m.file}`)
} else {
  console.log('All referenced public assets exist.')
}

if (placeholders.length) {
  failed = true
  console.error(`\n${placeholders.length} placeholder term(s) found:`)
  for (const p of placeholders) console.error(`  "${p.term}" in ${p.file}`)
} else {
  console.log('No placeholder wording in source.')
}

process.exit(failed ? 1 : 0)
