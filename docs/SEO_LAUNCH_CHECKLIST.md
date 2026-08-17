# SEO Launch Checklist — Bharat Electrosafe

This checklist captures every external launch action required to take
the redesigned Bharat Electrosafe website live on its production
domain `https://bharatelectrosafe.com` with a Lighthouse SEO score of
100/100.

Code-level SEO work is committed to `main`. The remaining items below
require account access that cannot be performed from code.

---

## A. Vercel domain configuration (requires Vercel project access)

- [ ] Add `bharatelectrosafe.com` as the primary production domain.
- [ ] Add `www.bharatelectrosafe.com` and configure it to redirect to the apex domain.
- [ ] Confirm HTTPS is enforced for both apex and www.
- [ ] Confirm valid SSL certificates cover the apex and www domains
      (Vercel provisions these automatically once the domain is added
      and DNS is pointed at Vercel).
- [ ] Confirm the production branch is `main`.
- [ ] Confirm the Vercel alias `bharat-electrosafe.vercel.app` is NOT
      configured as a canonical URL, sitemap URL, or structured-data
      entity URL anywhere in the codebase (it is not — verified by the
      `tests/a11y/seo-regression.spec.ts` test suite).

## B. Environment variables (requires Vercel project access)

Set these in the Vercel **Production** environment (not Preview):

- [ ] `NEXT_PUBLIC_SITE_URL=https://bharatelectrosafe.com`
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — set only after step C1
      produces a real verification token. Leave empty until then.
- [ ] `DATABASE_URL` — already set (contact form persistence).

Preview and Development environments must keep
`NEXT_PUBLIC_ALLOW_INDEXING` unset or `false` so preview deployments
emit `noindex,nofollow`.

## C. Google Search Console (requires GSC account access)

- [ ] **C1.** Verify a **Domain** property for `bharatelectrosafe.com`
      through DNS TXT record. A Domain property automatically covers
      www, non-www, http and https variants.
- [ ] **C2.** Confirm both `www.bharatelectrosafe.com` and
      `bharatelectrosafe.com` are covered by the Domain property.
- [ ] **C3.** Submit the sitemap:
      `https://bharatelectrosafe.com/sitemap.xml`
- [ ] **C4.** Inspect each priority URL and request indexing:
      - `https://bharatelectrosafe.com/`
      - `https://bharatelectrosafe.com/products`
      - `https://bharatelectrosafe.com/products/electrical-insulating-mats`
      - `https://bharatelectrosafe.com/products/coloured-strip-insulating-mats`
      - `https://bharatelectrosafe.com/products/bi-color-insulating-mats`
      - `https://bharatelectrosafe.com/products/auto-glow-reflective-band-insulating-mats`
      - `https://bharatelectrosafe.com/products/bharat-membrane`
      - `https://bharatelectrosafe.com/products/bharat-hydro-seal`
      - `https://bharatelectrosafe.com/about-us`
      - `https://bharatelectrosafe.com/contact-us`
- [ ] **C5.** After final deployment, request indexing again for the
      priority URLs above.
- [ ] **C6.** Monitor for 30 days after launch:
      - Page indexing
      - Core Web Vitals
      - HTTPS
      - Manual actions
      - Security issues
      - Structured-data errors
- [ ] **C7.** Preserve existing Search Console verification records
      where possible.
- [ ] **C8.** Do NOT use Google's Change of Address tool — the root
      domain is not changing; this is a same-domain URL migration.

## D. Bing Webmaster Tools (requires BWT account access)

- [ ] **D1.** Verify domain ownership for `bharatelectrosafe.com`.
- [ ] **D2.** Submit the sitemap:
      `https://bharatelectrosafe.com/sitemap.xml`
- [ ] **D3.** Use "Import from Google Search Console" where available
      to speed up setup.
- [ ] **D4.** Confirm business name, address and telephone consistency
      with the NAP record in `src/data/company.ts`.

## E. Google Business Profile (requires GBP account access)

- [ ] **E1.** Update the Google Business Profile website URL to the
      canonical HTTPS domain: `https://bharatelectrosafe.com`
- [ ] **E2.** Confirm business name (`Bharat Electrosafe`), address
      (`814, 8th Floor, I-thum, Tower A, Plot No. A-40, Sector 62,
      Noida 201309, Uttar Pradesh, India`) and telephone
      (`+91 7617494968`, `+91 9667171444`) match the NAP record in
      `src/data/company.ts` exactly.

## F. Other verified profiles (requires per-profile access)

- [ ] **F1.** Update LinkedIn company page website URL to
      `https://bharatelectrosafe.com` (when a genuine LinkedIn company
      page URL is confirmed, also add it to `company.social.linkedin`
      in `src/data/company.ts` so it appears in the Organization
      schema's `sameAs`).
- [ ] **F2.** Update any other verified social profiles to point at
      the canonical domain.

## G. DNS (requires DNS provider access)

- [ ] **G1.** Point the apex `bharatelectrosafe.com` A record (or
      `@` A record) at Vercel's ingress.
- [ ] **G2.** Point `www.bharatelectrosafe.com` (or `www` CNAME) at
      Vercel's ingress.
- [ ] **G3.** Add the Google Search Console Domain-property DNS TXT
      record from step C1.
- [ ] **G4.** Add the Bing Webmaster Tools DNS verification record
      from step D1.
- [ ] **G5.** Preserve existing SPF / DKIM / DMARC / MX records —
      email delivery for `info@bharatelectrosafe.com` must not be
      interrupted.

## H. Pre-launch smoke test (after DNS + Vercel are live)

Run these checks against the live production domain
`https://bharatelectrosafe.com`:

- [ ] **H1.** `https://bharatelectrosafe.com/robots.txt` returns 200
      and contains `Allow: /` plus the canonical sitemap reference.
- [ ] **H2.** `https://bharatelectrosafe.com/sitemap.xml` returns 200,
      valid XML, and lists all 10 canonical routes.
- [ ] **H3.** Every sitemap URL returns 200 and is self-canonical.
- [ ] **H4.** `https://www.bharatelectrosafe.com/` 301-redirects to
      `https://bharatelectrosafe.com/`.
- [ ] **H5.** `http://bharatelectrosafe.com/` 301-redirects to
      `https://bharatelectrosafe.com/`.
- [ ] **H6.** Every legacy PHP URL in `docs/SEO_REDIRECT_MAP.csv`
      301-redirects in one hop to its clean destination.
- [ ] **H7.** A non-existent URL (e.g. `/this-page-does-not-exist`)
      returns a true 404 status.
- [ ] **H8.** Lighthouse SEO score = 100 on `/`, `/products`,
      `/products/electrical-insulating-mats`, `/products/bharat-membrane`,
      `/products/bharat-hydro-seal`, `/about-us`, `/contact-us`.
- [ ] **H9.** No `noindex`, `nofollow`, `noarchive` or `nosnippet`
      directives on any production route.
- [ ] **H10.** `og:image`, `twitter:image`, favicon, apple-touch-icon,
       and manifest icons all return 200.
- [ ] **H11.** JSON-LD on every route parses without syntax errors
       (use the Rich Results Test or Schema.org validator).
- [ ] **H12.** No `FAQPage` JSON-LD anywhere (spec section 17).
- [ ] **H13.** No `Product` schema with fabricated `Offer`, `price`,
       `aggregateRating`, `review`, `SKU`, `GTIN` or `MPN`.
- [ ] **H14.** No `LocalBusiness` schema (only `Organization`).

## I. Post-launch monitoring (30 days)

### Day 0
- [ ] Verify domain redirects, SSL, robots, sitemap, canonicals,
      200/301/404 statuses, favicon and OG assets.
- [ ] Submit sitemap in GSC and BWT.
- [ ] Inspect priority URLs in GSC.

### Days 1–7
- [ ] Review indexing progress.
- [ ] Review crawl errors.
- [ ] Review legacy PHP redirect hits in GSC and server logs.
- [ ] Check for 5xx server errors.
- [ ] Check Core Web Vitals report.
- [ ] Check mobile usability report.
- [ ] Check contact-form conversions.

### Days 8–30
- [ ] Review impressions and clicks.
- [ ] Identify unexpected excluded pages.
- [ ] Check for duplicate canonical issues.
- [ ] Check structured-data reports for errors.
- [ ] Check broken backlinks pointing at old PHP URLs — add redirects
      for any legitimate missed legacy routes.
- [ ] Improve pages based on real search queries without keyword
      stuffing.

**Do not remove legacy PHP redirects after 30 days.** Keep them
indefinitely — backlinks and bookmarks continue to hit them for years.

---

## Items that cannot be completed from code

The following require external account access and are tracked here so
they are not forgotten. The codebase is launch-ready without them, but
Lighthouse SEO 100/100 on the live custom domain requires steps A, B,
C1, C3, C4 and H1–H8 to be completed.

- Vercel domain configuration (step A) — requires Vercel project owner
  access.
- Environment variables (step B) — requires Vercel project owner
  access.
- Google Search Console verification and sitemap submission (steps C1,
  C3, C4) — requires GSC account access.
- Bing Webmaster Tools verification (step D) — requires BWT account
  access.
- Google Business Profile update (step E) — requires GBP account
  access.
- DNS records (step G) — requires DNS provider access.

Do not claim Search Console, Bing or GBP submission was completed
without account access.
