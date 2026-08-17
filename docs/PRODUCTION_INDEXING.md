# Production Indexing — Bharat Electrosafe

This document explains how search-engine indexing is controlled, and the
exact steps required to enable indexing on the official production domain.

---

## How the indexing guard works

Indexing is enabled **only** when all three of these conditions are true:

1. `NEXT_PUBLIC_ALLOW_INDEXING === 'true'` — explicit opt-in
2. The resolved `NEXT_PUBLIC_SITE_URL` is exactly `https://bharatelectrosafe.com`
3. `VERCEL_ENV` is `'production'` (or unset, for non-Vercel hosting)

If any one condition fails, every page emits `noindex, nofollow` metadata
and `robots.txt` disallows all crawling. This triple-gate prevents a
preview deployment from ever becoming indexable, even if
`NEXT_PUBLIC_ALLOW_INDEXING=true` is accidentally inherited.

The guard lives in `src/lib/site-url.ts` and is consumed by:

- `src/app/robots.ts` — robots.txt
- `src/app/sitemap.ts` — sitemap.xml (always generated, but only linked from robots.txt when indexing is enabled)
- Every page's `metadata.robots` field
- `src/app/layout.tsx` — root `metadata.robots`

---

## Steps to enable indexing on production

### 1. Connect the official domain

1. Go to the Vercel project settings → **Domains**.
2. Add `bharatelectrosafe.com` (and `www.bharatelectrosafe.com` if desired).
3. Update the domain's DNS records to point at Vercel (CNAME or A record, as shown in the Vercel dashboard).
4. Wait for DNS to propagate and for Vercel to show the domain as "Valid Configuration".

### 2. Confirm the official domain serves the new application

Visit `https://bharatelectrosafe.com` and confirm:

- The homepage loads (not the old PHP site or a redirect to a Vercel preview URL).
- The browser shows the lock icon (valid TLS certificate).
- The footer and header match the new Next.js design.

### 3. Set Production-only environment variables

In the Vercel project settings → **Environment Variables**, add the
following **for the Production environment only** (do NOT add them for
Preview or Development):

| Key | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://bharatelectrosafe.com` | Production |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` | Production |

Leave the Preview and Development environments without these variables,
or explicitly set `NEXT_PUBLIC_ALLOW_INDEXING=false` for them.

### 4. Redeploy production

Trigger a new production deployment so the environment variables take
effect. In Vercel: **Deployments** → most recent production deployment →
**Redeploy**.

### 5. Verify indexing is enabled

After the deployment completes, run these checks against
`https://bharatelectrosafe.com` (not the Vercel preview URL):

#### HTML robots meta tag

```bash
curl -s https://bharatelectrosafe.com | grep -i 'name="robots"'
```

Expected: `<meta name="robots" content="index, follow" />` (or absent,
which also means indexable). Must NOT contain `noindex`.

#### X-Robots-Tag header

```bash
curl -sI https://bharatelectrosafe.com | grep -i 'x-robots-tag'
```

Expected: no `X-Robots-Tag: noindex` header.

#### robots.txt

```bash
curl -s https://bharatelectrosafe.com/robots.txt
```

Expected:
```
User-Agent: *
Allow: /

Sitemap: https://bharatelectrosafe.com/sitemap.xml
Host: https://bharatelectrosafe.com
```

Must NOT contain `Disallow: /`.

#### sitemap.xml

```bash
curl -s https://bharatelectrosafe.com/sitemap.xml | head -20
```

Expected: valid XML with `<loc>` entries using `https://bharatelectrosafe.com`
as the base URL, including all product pages, /about-us, /contact-us and /products.

#### Canonical URLs

```bash
curl -s https://bharatelectrosafe.com/products/electrical-insulating-mats | grep -i 'rel="canonical"'
```

Expected: `<link rel="canonical" href="https://bharatelectrosafe.com/products/electrical-insulating-mats" />`

---

## Verifying preview deployments remain noindex

Run the same checks against a Vercel preview URL (e.g.
`https://bharat-electrosafe-<hash>-witejackel-eng.vercel.app`):

```bash
curl -s https://bharat-electrosafe-<hash>-witejackel-eng.vercel.app | grep -i 'name="robots"'
```

Expected: `<meta name="robots" content="noindex, nofollow" />`

```bash
curl -s https://bharat-electrosafe-<hash>-witejackel-eng.vercel.app/robots.txt
```

Expected:
```
User-Agent: *
Disallow: /
```

Must NOT include a Sitemap directive.

---

## Current status

- **Official domain (`bharatelectrosafe.com`)**: Not yet verified as serving
  this Next.js application. The old PHP site may still be live. Do NOT
  enable indexing until the official domain is confirmed.
- **Vercel preview (`bharat-electrosafe.vercel.app`)**: noindex. Correct.
- `NEXT_PUBLIC_ALLOW_INDEXING` defaults to `false` — indexing is off.

**Do not enable indexing until the official domain serves this application
and all the verification checks above pass.**
