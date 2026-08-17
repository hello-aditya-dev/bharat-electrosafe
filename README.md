# Bharat Electrosafe Website

Corporate website for **Bharat Electrosafe** — manufacturer of electrical insulating mats, visible-safety mat variants, PVC geo-membranes, and water-stop profiles for industrial, civil, and environmental safety applications.

---

## 1. Project Overview

This repository contains the source code for the Bharat Electrosafe corporate website. It is a content-first marketing site built with Next.js and deployed on Vercel. The site presents the company's six product families, company information, and a contact-enquiry form with server-side email delivery.

Key characteristics:

- **Static-first** — all public pages are rendered at build time; the only dynamic route is the contact-form API.
- **Quotation-led** — no public pricing, cart, or e-commerce; product pages drive enquiries.
- **SEO-hardened** — triple-gated indexing, canonical URLs, structured data, sitemap, and robots.txt all coordinated through a central URL module.
- **Security-first** — CSP without `unsafe-eval`, strict origin validation, Zod schema enforcement, honeypot and timing anti-spam, rate limiting, and HTML-escaped user content.

---

## 2. Live and Production Domains

| Environment | URL | Behaviour |
|---|---|---|
| Production domain | [https://bharatelectrosafe.com](https://bharatelectrosafe.com) | Canonical — serves the site normally |
| Vercel alias | [https://bharat-electrosafe.vercel.app/](https://bharat-electrosafe.vercel.app/) | 308 redirect to canonical domain |
| www subdomain | [https://www.bharatelectrosafe.com](https://www.bharatelectrosafe.com) | 308 redirect to canonical domain |
| Preview deployments | `*.vercel.app` | NOT redirected — usable for QA |

The canonical origin is hardcoded as `https://bharatelectrosafe.com` in `src/lib/site-url.ts`. All canonical URLs, sitemap entries, robots host, structured-data `@id` fields, and Open Graph URLs resolve against this origin — never against a `*.vercel.app` preview URL. Middleware (`src/middleware.ts`) enforces host-level redirects for the Vercel alias and www subdomain.

---

## 3. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.x |
| Language | TypeScript | 5.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Package manager | Bun | 1.3.14 |
| Animation | Framer Motion | 12.x |
| Form validation | React Hook Form + Zod | 7.x / 4.x |
| UI primitives | Radix UI | — |
| Email delivery | Resend | 6.x |
| Image processing | Sharp | 0.34.x |
| E2E testing | Playwright | 1.62.x |
| Accessibility | axe-core (Playwright) | 4.12.x |

---

## 4. Application Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/products` | Product hub (all six families) |
| `/products/electrical-insulating-mats` | Electrical Insulating Mats |
| `/products/coloured-strip-insulating-mats` | Coloured Strip Insulating Mats |
| `/products/bi-color-insulating-mats` | Bi-Color Insulating Mats |
| `/products/auto-glow-reflective-band-insulating-mats` | Auto-Glow Reflective Band Insulating Mats |
| `/products/bharat-membrane` | BharatMembrane |
| `/products/bharat-hydro-seal` | Bharat Hydro Seal |
| `/about-us` | Company information |
| `/contact-us` | Contact details and enquiry form |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/robots.txt` | Search-engine directives (dynamic) |
| `/sitemap.xml` | XML sitemap (dynamic) |
| `/manifest.webmanifest` | PWA manifest |

Legacy PHP routes (e.g. `/electrical-insulating-mats.php`) are permanently redirected to their new counterparts via `next.config.ts`.

---

## 5. Repository Structure

```
bharat-electrosafe/
├── public/
│   ├── brand/                   # Logo assets (SVG, PNG, WebP)
│   ├── icons/                   # PWA icons (192/512, maskable)
│   ├── og/                      # Social-preview images
│   ├── images/                  # Brand logos, document icons
│   ├── media/
│   │   ├── hero/                # Homepage hero images
│   │   ├── home/                # Homepage section images
│   │   ├── base/                # General product/award images
│   │   ├── awards/              # Award photographs
│   │   ├── certifications/      # Certification badge images
│   │   ├── certificates/        # Legacy certificate images
│   │   ├── clients/             # Client logo images
│   │   ├── contact/             # Office map preview SVG
│   │   ├── leadership/          # Leadership team photos
│   │   ├── manufacturing/       # Production-line images
│   │   ├── videos/              # YouTube thumbnail images
│   │   └── products/            # Per-product hero, gallery, card images
│   ├── documents/
│   │   └── certifications/      # Downloadable PDFs (ISO, BIS, CE, etc.)
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── apple-touch-icon.png
│   ├── robots.txt               # Static fallback
│   └── llms.txt                 # LLM-consumable site description
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout (metadata, fonts, structured data)
│   │   ├── page.tsx             # Homepage
│   │   ├── HomeClient.tsx       # Homepage client components
│   │   ├── globals.css          # Global styles + Tailwind
│   │   ├── not-found.tsx        # 404 page
│   │   ├── error.tsx            # Error boundary
│   │   ├── global-error.tsx     # Global error boundary
│   │   ├── manifest.ts          # Web App Manifest
│   │   ├── robots.ts            # Dynamic robots.txt
│   │   ├── sitemap.ts           # Dynamic sitemap
│   │   ├── icon.svg             # SVG favicon
│   │   ├── icon.png             # PNG favicon
│   │   ├── apple-icon.png       # Apple touch icon
│   │   ├── opengraph-image.png  # OG image
│   │   ├── twitter-image.png    # Twitter card image
│   │   ├── about-us/
│   │   ├── contact-us/
│   │   ├── products/
│   │   │   ├── page.tsx         # Product hub
│   │   │   ├── ProductsClient.tsx
│   │   │   ├── error.tsx
│   │   │   ├── electrical-insulating-mats/
│   │   │   ├── coloured-strip-insulating-mats/
│   │   │   ├── bi-color-insulating-mats/
│   │   │   ├── auto-glow-reflective-band-insulating-mats/
│   │   │   ├── bharat-membrane/
│   │   │   └── bharat-hydro-seal/
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts     # Contact form API
│   ├── components/
│   │   ├── layout/              # Header, Footer
│   │   ├── home/                # Homepage sections
│   │   ├── about/               # About Us sections
│   │   ├── contact/             # Contact form sections
│   │   ├── products/            # Product page components
│   │   ├── media/               # YouTube facade
│   │   ├── ui/                  # Shared UI primitives
│   │   └── structured-data.tsx  # JSON-LD output
│   ├── data/
│   │   ├── products.ts          # Product registry (6 families)
│   │   ├── company.ts           # Company data (single source of truth)
│   │   ├── trust.ts             # Trust indicators
│   │   ├── team.ts              # Leadership data
│   │   ├── faqs.ts              # FAQ content
│   │   └── asset-slots.ts       # Asset slot definitions
│   ├── hooks/
│   │   └── use-mobile.ts        # Mobile detection hook
│   └── lib/
│       ├── site-url.ts          # Central URL construction + indexing gate
│       ├── origin.ts            # Origin validation for contact form
│       ├── structured-data.ts   # JSON-LD schema builders
│       ├── product-metadata.ts  # Per-product metadata generation
│       ├── social-image.ts      # OG/Twitter image URLs
│       ├── document-meta.ts     # Document metadata helpers
│       └── utils.ts             # General utilities
├── scripts/                     # Build/asset scripts
├── tests/                       # Test suites
│   ├── a11y/                    # Accessibility + content compliance
│   └── security/                # Security tests
├── docs/                        # Project documentation
├── next.config.ts
├── vercel.json
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
├── bun.lock
└── .env.example
```

---

## 6. Content Architecture

All content is stored in TypeScript data modules under `src/data/` — not in a CMS or database. This approach ensures:

- **Type safety** — the compiler catches missing or mistyped fields.
- **Build-time rendering** — all public pages are statically generated at build time.
- **Single source of truth** — company contact details, product specifications, and trust indicators are defined once and imported everywhere.

| Module | Purpose |
|---|---|
| `company.ts` | Company name, legal name, contact details, address, certifications, stats, social links |
| `products.ts` | Product registry — all six families with specifications, images, applications, documents, FAQs |
| `trust.ts` | Trust indicators, client logos, award data |
| `team.ts` | Leadership profiles |
| `faqs.ts` | FAQ content per product and general |
| `asset-slots.ts` | Named asset slot definitions for media |

The product data module is the most complex — it defines the complete data model for each product family including specifications, material properties, dimensions, applications, documents, gallery images, and FAQ entries. Every technical figure is transcribed from the client's own published product pages.

---

## 7. Product Families

| # | Product | Route | Standard |
|---|---|---|---|
| 1 | Electrical Insulating Mats | `/products/electrical-insulating-mats` | IS 15652:2006 / IEC 61111 |
| 2 | Coloured Strip Insulating Mats | `/products/coloured-strip-insulating-mats` | IS 15652:2006 |
| 3 | Bi-Color Insulating Mats | `/products/bi-color-insulating-mats` | IS 15652:2006 |
| 4 | Auto-Glow Reflective Band Insulating Mats | `/products/auto-glow-reflective-band-insulating-mats` | IS 15652:2006 |
| 5 | BharatMembrane | `/products/bharat-membrane` | IS 15909:2020 |
| 6 | Bharat Hydro Seal | `/products/bharat-hydro-seal` | — |

The four insulating-mat families share one published specification table (IS 15652:2006, codes BES1001–BES1003). That table is defined once and reused rather than duplicated per product.

Each product page includes: hero, overview, specifications, material/dimensions, applications, documents, FAQ, related products, and a CTA. Product comparison is available via a compare toggle and modal.

---

## 8. Local Development

### Prerequisites

- [Bun](https://bun.sh/) 1.3.14 installed globally
- Node.js 18+ (for Playwright)

### Setup

```bash
# Clone the repository
git clone https://github.com/witejackel-eng/bharat-electrosafe.git
cd bharat-electrosafe

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Section 10)

# Start the development server
bun run dev
```

The dev server runs on `http://localhost:3000`.

---

## 9. Package Manager and Required Versions

| Tool | Required Version | Notes |
|---|---|---|
| Bun | 1.3.14 | Enforced via `packageManager` field in `package.json` |
| Node.js | 18+ | Required for Playwright E2E tests |

**Do not use `npm` or `yarn`** — the lockfile is `bun.lock`, and the `packageManager` field specifies Bun. Using a different package manager will produce inconsistent dependency resolution.

Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

---

## 10. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. Production values belong in the Vercel dashboard — never in the repository.

### Public (non-sensitive)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical domain of the website. Must be `https://bharatelectrosafe.com` in production. Used for deployment origin resolution. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token. Only output when a real value exists. Do not commit a real token — add it via the Vercel dashboard. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key for the contact-form invisible bot-protection widget. Required only if `TURNSTILE_SECRET_KEY` is also set. |

### Server (secrets — never use `NEXT_PUBLIC_` prefix)

| Variable | Required | Description |
|---|---|---|
| `ALLOW_INDEXING` | Yes | Set `true` only in the Vercel Production environment after the domain is verified. Server-only (not exposed to browser). Falls back to `NEXT_PUBLIC_ALLOW_INDEXING` if unset (backwards compatibility). |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Deprecated | Legacy indexing flag. Prefer `ALLOW_INDEXING` (server-only). Ignored when `ALLOW_INDEXING` is set. |
| `RESEND_API_KEY` | Yes | API key for Resend email delivery. Format: `re_xxxxxxxxxxxx`. |
| `CONTACT_FROM_EMAIL` | Yes | Sender email address for contact-form enquiries. Must be a domain verified with Resend. |
| `CONTACT_TO_EMAIL` | No | Recipient email address. Defaults to the company email if not set. |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis REST API URL for distributed rate limiting across serverless instances. Without this, rate limiting falls back to per-instance in-memory tracking. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis REST API token. Must be set if `UPSTASH_REDIS_REST_URL` is set. |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret key for server-side token verification. If not set, Turnstile verification is skipped gracefully (other protections remain active). |

---

## 11. Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `bun run dev` | Start development server on port 3000 |
| `build` | `bun run build` | Production build (`next build --webpack`) |
| `start` | `bun run start` | Start production server |
| `lint` | `bun run lint` | Run ESLint |
| `typecheck` | `bun run typecheck` | Run TypeScript type checking |
| `test` | `bun run test` | Run unit tests with Bun test runner |
| `test:e2e` | `bun run test:e2e` | Run Playwright E2E tests |
| `test:a11y` | `bun run test:a11y` | Run Playwright accessibility tests |
| `test:security` | `bun run test:security` | Run security tests |
| `check` | `bun run check` | Run typecheck + lint + test |
| `audit:deps` | `bun run audit:deps` | Audit dependencies for known vulnerabilities |
| `build:product-gallery` | `bun run build:product-gallery` | Build product gallery assets |

---

## 12. Contact-Form Architecture

The contact form is a full-stack feature with strict security controls:

### Client Side

- **React Hook Form** manages form state, validation, and submission.
- **Zod** schema validates fields client-side before submission (name, email, phone, enquiry type, message, plus optional product-specific fields).
- A hidden **honeypot** field (`website`) must remain empty — bots that fill it are silently rejected.
- A **timing field** (`_formOpenAt`) records when the form was opened; submissions faster than 3 seconds are silently rejected.
- **Cloudflare Turnstile** widget (when configured) provides invisible bot protection without visual CAPTCHA puzzles.

### Server Side (`src/app/api/contact/route.ts`)

1. **Content-type enforcement** — only `application/json` accepted.
2. **Request body size limit** — 32 KB maximum.
3. **Exact origin validation** — the `Origin` or `Referer` header must match the allow-list (built from `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, canonical domain, www domain, and `localhost` in development). Substring/`startsWith` matching is never used.
4. **Distributed rate limiting** — Upstash Redis when configured (5 req/IP/10 min across all serverless instances), with conservative in-memory fallback per instance when Redis is unavailable.
5. **Zod strict schema** — `z.strictObject()` rejects unknown fields; all strings are trimmed and validated.
6. **Honeypot check** — the hidden `website` field must be empty. Filled honeypots receive a 200 response with a generic success message to avoid confirming the field's existence.
7. **Timing check** — form must be open for at least 3 seconds and no more than 1 hour.
8. **Cloudflare Turnstile verification** — server-side token validation against Cloudflare's Siteverify API. Gracefully skipped when `TURNSTILE_SECRET_KEY` is not configured.
9. **HTML escaping** — all user content is HTML-escaped before insertion into the email body.
10. **Resend delivery** — emails are sent server-side via the Resend API. The sender address (`CONTACT_FROM_EMAIL`) must be a Resend-verified domain.
11. **Redacted logging** — logs contain no PII (only name length, enquiry type, and boolean flags).
12. **Cache-Control: no-store + X-Robots-Tag: noindex** — API responses are never cached and never indexed.
13. **Honest delivery messages** — if email delivery fails, the response includes direct-contact fallback details (phone, WhatsApp, email, address).

---

## 13. Security Controls

### HTTP Security Headers

Applied to all routes via `next.config.ts`:

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; manifest-src 'self'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (production only) |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

API routes additionally receive:

| Header | Value |
|---|---|
| `Cache-Control` | `no-store` |
| `X-Robots-Tag` | `noindex, nofollow` |

Notable: `unsafe-eval` is never included in the CSP. The `unsafe-inline` limitation for scripts is a known moderate residual risk for this static marketing site; a nonce-based CSP would add architectural complexity beyond what is justified.

### Canonical Domain Enforcement (Middleware)

`src/middleware.ts` enforces that only `https://bharatelectrosafe.com` serves indexable content:

- `www.bharatelectrosafe.com` → 308 redirect to `https://bharatelectrosafe.com`
- `bharat-electrosafe.vercel.app` → 308 redirect to `https://bharatelectrosafe.com`
- Vercel preview deployments (`*-git-*.vercel.app`) are NOT redirected (usable for QA)
- Localhost is never redirected

### Application-Level Controls

- **Exact origin validation** on contact form — no substring matching. Canonical and www domains always allowed.
- **Zod strict schema** — rejects unknown fields and validates all inputs.
- **HTML escaping** of all user content in email bodies.
- **Honeypot + timing anti-spam** — hidden field and minimum form-open duration.
- **Distributed rate limiting** — Upstash Redis (5 req/IP/10 min) with in-memory fallback when Redis is unavailable.
- **Cloudflare Turnstile** — invisible bot protection with server-side token verification. Gracefully disabled when not configured.
- **Cache-Control: no-store + X-Robots-Tag: noindex** on all API responses.
- **Redacted logging** — no PII in server logs.
- **`.env` exclusion from git** — `.gitignore` prevents environment files from being committed.
- **Subject-header injection prevention** — CR/LF characters stripped from enquiry-type values.
- **Powered-By header removed** — `poweredByHeader: false` in Next.js config.
- **Safe JSON-LD serialisation** — `<` characters escaped as `\u003c` to prevent XSS via `dangerouslySetInnerHTML`.
- **External link safety** — `target="_blank"` links always include `rel="noopener noreferrer"`.

---

## 14. SEO and Indexing Behaviour

### Triple-Gated Indexing

Search-engine indexing is enabled **only** when all three conditions are true:

1. `ALLOW_INDEXING === 'true'` (server-only env var, not exposed to browser). Falls back to `NEXT_PUBLIC_ALLOW_INDEXING` for backwards compatibility.
2. The canonical origin is exactly `https://bharatelectrosafe.com` — always true (hardcoded in `src/lib/site-url.ts`).
3. `VERCEL_ENV === 'production'` or `VERCEL_ENV` is unset — not a Vercel preview deployment.

This prevents any single misconfiguration from exposing a non-production deployment to search engines.

### Canonical Domain Enforcement

- **Middleware** (`src/middleware.ts`) redirects `www.bharatelectrosafe.com` and `bharat-electrosafe.vercel.app` to `https://bharatelectrosafe.com` with 308 status.
- **Next.js redirects** supplement middleware for `www` → non-www at the routing level.
- Preview deployments are never redirected, preserving their QA usability.

### SEO Features

- **Canonical URLs** — every page declares a self-referencing canonical `<link>` via `buildCanonicalUrl()`. No page inherits the homepage canonical.
- **Dynamic sitemap** — `src/app/sitemap.ts` generates an XML sitemap with all routes when indexing is enabled. Returns empty when indexing is disabled (no misleading staging sitemap).
- **Dynamic robots.txt** — `src/app/robots.ts` allows or disallows crawling based on the indexing gate. API and `_next` paths are always disallowed. The sitemap URL is only exposed when indexing is enabled.
- **Structured data** — Organization + WebSite schemas on the homepage; CollectionPage + ItemList on the products hub; WebPage + BreadcrumbList on product pages. No fake prices, ratings, reviews, SKUs, or unverified claims are ever emitted. One BreadcrumbList per page (server-side only; the visual Breadcrumb component does not emit duplicate schema).
- **Social metadata** — OG and Twitter images use absolute canonical URLs (`https://bharatelectrosafe.com/og/...`) so staging/preview hosts never leak into social metadata.
- **Preview noindex** — all preview and staging deployments emit `noindex, nofollow` by default.
- **Google Search Console** — verification meta tag is only output when `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is set.
- **Sitemap lastModified omitted** — no misleading stale or dynamic dates; truthful signals only.

---

## 15. Favicon and Social-Preview System

### Favicon Files

| File | Size | Purpose |
|---|---|---|
| `public/favicon.ico` | Multi-size | Legacy browser favicon |
| `public/favicon-16x16.png` | 16×16 | PNG favicon |
| `public/favicon-32x32.png` | 32×32 | PNG favicon |
| `public/favicon-48x48.png` | 48×48 | PNG favicon |
| `src/app/icon.svg` | SVG | SVG favicon (auto-detected by Next.js) |
| `src/app/icon.png` | — | PNG favicon (auto-detected by Next.js) |
| `src/app/apple-icon.png` | — | Apple touch icon (auto-detected by Next.js) |

### PWA Icons

| File | Size | Purpose |
|---|---|---|
| `public/icons/icon-192.png` | 192×192 | Standard PWA icon |
| `public/icons/icon-512.png` | 512×512 | Standard PWA icon |
| `public/icons/icon-192-maskable.png` | 192×192 | Maskable PWA icon |
| `public/icons/icon-512-maskable.png` | 512×512 | Maskable PWA icon |

### Social-Preview Images

| File | Purpose |
|---|---|
| `src/app/opengraph-image.png` | Open Graph image (auto-detected by Next.js) |
| `src/app/twitter-image.png` | Twitter card image (auto-detected by Next.js) |
| `public/og/bharat-electrosafe-og-v2.png` | Static OG image fallback |
| `public/og/bharat-electrosafe-twitter-v2.png` | Static Twitter image fallback |

Next.js App Router file conventions automatically emit the correct `<link>` and `<meta>` tags — no manual `icons` or `openGraph.images` config is needed in `layout.tsx`.

The manifest (`src/app/manifest.ts`) uses the brand colours: `background_color: #FCFBF7` (warm-white) and `theme_color: #002659` (deep brand navy).

---

## 16. Testing and Quality Checks

### Test Suites

| Suite | Runner | Command | Purpose |
|---|---|---|---|
| Unit tests | Bun test | `bun run test` | Business logic, data validation |
| E2E tests | Playwright | `bun run test:e2e` | End-to-end page flows |
| Accessibility | Playwright + axe-core | `bun run test:a11y` | WCAG compliance, content compliance, SEO regression |
| Security | Bun test | `bun run test:security` | Contact form security, origin validation |

### Quality Gates

Run the full quality check before deploying:

```bash
bun run check
```

This runs `typecheck` + `lint` + `test` in sequence.

### Dependency Audit

```bash
bun run audit:deps
```

---

## 17. Production Build

```bash
bun run build
```

This runs `next build --webpack`. The `--webpack` flag is used because Turbopack has stability issues in CI environments. The build produces a standalone output (configured via `output: 'standalone'` in `next.config.ts`), which is the optimal output mode for Vercel deployment.

The standalone output includes only the necessary files for production, reducing deployment size and cold-start time.

---

## 18. Vercel Deployment

The site is deployed on Vercel with the following configuration:

- **Branch**: `main` — pushes to `main` trigger automatic deployments.
- **Build command**: `next build --webpack` (set in `package.json` scripts).
- **Output mode**: Standalone.
- **Framework preset**: Next.js (auto-detected).

---

## 19. Domain Configuration

| Setting | Value |
|---|---|
| Production domain | `bharatelectrosafe.com` |
| HTTPS | Enforced (Vercel automatic SSL + HSTS header) |
| WWW redirect | `www.bharatelectrosafe.com` → `bharatelectrosafe.com` (308 via middleware + Next.js redirect) |
| Vercel alias redirect | `bharat-electrosafe.vercel.app` → `bharatelectrosafe.com` (308 via middleware) |
| Preview deployments | NOT redirected — usable for QA |

The canonical origin is hardcoded as `https://bharatelectrosafe.com` in `src/lib/site-url.ts`. The `deploymentOrigin` is resolved dynamically from environment variables so that preview deployments use their actual URL for `metadataBase` (OG image resolution) while keeping canonical URLs pointing at the production domain.

### Safe Production Launch Sequence

1. Deploy latest code with `ALLOW_INDEXING=false` (or unset).
2. Attach `bharatelectrosafe.com` to the Vercel project.
3. Verify `https://bharatelectrosafe.com` works correctly.
4. Verify `https://bharat-electrosafe.vercel.app` redirects to the canonical domain.
5. Verify `https://www.bharatelectrosafe.com` redirects to the canonical domain.
6. Test `robots.txt`, `sitemap.xml`, canonical tags, structured data, contact form, and security headers.
7. Set `ALLOW_INDEXING=true` in the Vercel **Production** environment only.
8. Redeploy.
9. Verify production again — pages should be indexable only on `bharatelectrosafe.com`.

---

## 20. Client Content Verification

All content is verified against the client's own published product pages and materials:

- **Product specifications** — transcribed from the client's existing website. No figure is invented or strengthened beyond the source.
- **Company details** — phone numbers, email, address, and certifications are sourced from the client's published contact information.
- **Office hours** — present in the data but flagged as `verified: false`. The OfficeHours component will not render until the client confirms the schedule in writing.
- **Social links** — the LinkedIn field is intentionally empty because the generic LinkedIn homepage is not Bharat Electrosafe's genuine company page. It will be populated when a real profile URL is confirmed.
- **No unverified claims** — no fake prices, ratings, reviews, SKUs, GTINs, MPNs, stock status, or shipping data are emitted in structured data or displayed on the site.

---

## 21. Asset and Document Policy

### Images

- **WebP is preferred** for all product and marketing images (smaller file size, wide browser support).
- **PNG fallbacks** are provided for product thumbnails and brand assets.
- **SVG** is used for the favicon, logo symbol, and the office map preview.
- Product images are organised under `public/media/products/{slug}/` with subdirectories for `gallery/`.

### Documents

- Downloadable PDFs (ISO certificates, BIS licence, CE marking, ERDA test reports, etc.) are stored under `public/documents/certifications/`.
- Document availability is tracked in the product data with an `available` boolean and a `kind` discriminator (`test-report`, `certificate`, `licence`, `datasheet`, `standards-information`).
- Only documents with genuine content are linked; placeholder or unavailable documents are shown as "available on request."

### Build Scripts

Asset-building scripts are in `scripts/`:

- `build-brand-assets.mjs` — brand logo processing
- `build-brand-icons.py` — favicon and icon generation
- `build-social-images.py` — OG/Twitter image generation
- `build-product-gallery.mjs` — product gallery optimisation
- `build-assets.mjs` — general asset pipeline
- `check-assets.mjs` — asset integrity verification
- `check-brand-system.mjs` — brand system consistency check
- `header-qa.mjs` — header image quality check
- `optimize-hero-texture.mjs` — hero image optimisation
- `generate-contact-map-preview.py` — office map SVG generation
- `decode-heic.py` — HEIC image conversion utility

---

## 22. Maintenance Guidance

### Adding a New Product

1. Add the product definition to `src/data/products.ts` following the existing `ProductData` interface.
2. Add product images under `public/media/products/{new-slug}/`.
3. Create the route directory at `src/app/products/{new-slug}/` with a `page.tsx` and client component.
4. Update the sitemap in `src/app/sitemap.ts`.
5. Update the product hub page if needed.
6. Run `bun run check` to verify.

### Updating Content

- **Company details** — edit `src/data/company.ts`.
- **Product specifications** — edit `src/data/products.ts`. Never strengthen a figure beyond the client's published source.
- **FAQ content** — edit `src/data/faqs.ts`.
- **Leadership** — edit `src/data/team.ts`.
- **Trust indicators** — edit `src/data/trust.ts`.

### Updating Dependencies

```bash
bun update                    # Update all dependencies
bun run audit:deps            # Check for known vulnerabilities
bun run check                 # Verify nothing is broken
```

### Environment Variable Changes

1. Add the new variable to `.env.example` with documentation.
2. Add it to the Vercel dashboard for all relevant environments.
3. Update this README if the variable is user-facing.

---

## 23. Troubleshooting

### Build fails with Turbopack errors

The project uses `next build --webpack` (not the default Turbopack). If you see Turbopack-related errors, ensure the build command in your environment matches `next build --webpack`.

### Contact form returns 403

The origin validation requires the `Origin` or `Referer` header to match the allow-list. In local development, `http://localhost:3000` is automatically allowed. If testing from a different origin, ensure `NEXT_PUBLIC_SITE_URL` is set correctly.

### Contact form returns 503

The Resend API key (`RESEND_API_KEY`) or sender email (`CONTACT_FROM_EMAIL`) is not configured. Set these in `.env.local` for development or in the Vercel dashboard for production.

### Preview deployments are not indexed

This is intentional. The triple-gate indexing system prevents preview deployments from being indexed even if `NEXT_PUBLIC_ALLOW_INDEXING=true` is accidentally inherited from the Production environment.

### Images not loading

Ensure images are in the correct directory under `public/media/` and referenced with the correct path in the product data. Run `bun run check-assets` or `node scripts/check-assets.mjs` to verify asset integrity.

### Font not loading

The site uses Manrope (variable weight) loaded via `next/font/google`. Ensure the network allows requests to Google Fonts. The font is loaded with `display: swap` for optimal performance.

---

## 24. Client Handoff

### Access Credentials

- **Vercel dashboard** — the client should be invited as a team member with access to the Bharat Electrosafe project.
- **GitHub repository** — the client should be added as a collaborator on the `witejackel-eng/bharat-electrosafe` repository.
- **Resend dashboard** — the client should have access to the Resend account for email delivery monitoring.
- **Domain registrar** — the client controls the `bharatelectrosafe.com` domain DNS settings.

### Ongoing Responsibilities

| Task | Responsible |
|---|---|
| Content updates (product specs, company details) | Client or developer |
| Environment variable changes (Vercel dashboard) | Client or developer |
| Dependency updates and security patches | Developer |
| Domain DNS management | Client |
| Resend email delivery monitoring | Client |
| Google Search Console verification | Client or developer |

### Content Verification Checklist

Before going live, verify with the client:

- [ ] All product specifications match published sources
- [ ] Company contact details are current
- [ ] Office hours are confirmed (change `verified: false` to `verified: true` in `company.ts`)
- [ ] Social media profile URLs are correct
- [ ] All product images are approved
- [ ] Document PDFs are current and downloadable
- [ ] Legal pages (privacy policy, terms) are reviewed and approved
- [ ] Google Search Console is verified

---

## 25. Proprietary Notice

This repository and its contents are the proprietary property of Bharat Electrosafe. All rights reserved. No part of this codebase may be reproduced, distributed, or transmitted in any form without the prior written permission of Bharat Electrosafe. Unauthorised use, modification, or distribution is strictly prohibited.
