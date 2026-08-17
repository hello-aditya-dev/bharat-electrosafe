# Client Handoff Document — Bharat Electrosafe

**Date:** March 2026
**Release version:** 1.0.0
**Production URL:** [https://bharatelectrosafe.com](https://bharatelectrosafe.com)

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'standalone'`) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI | React 19 |
| Package manager | Bun |
| Hosting | Vercel (HTTPS enforced, edge CDN) |
| Email delivery | Resend (server-side only) |
| Video embeds | YouTube (privacy-enhanced, `youtube-nocookie.com`) |

---

## 2. Route Summary

### Static Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/products` | Product listing / overview |
| `/about-us` | About the company |
| `/contact-us` | Contact form and office details |

### Product Pages

| Route | Description |
|---|---|
| `/products/electrical-insulating-mats` | Electrical Insulating Mats |
| `/products/coloured-strip-insulating-mats` | Coloured Strip Insulating Mats |
| `/products/bi-color-insulating-mats` | Bi-Color Insulating Mats |
| `/products/auto-glow-reflective-band-insulating-mats` | Auto-Glow Reflective Band Insulating Mats |
| `/products/bharat-membrane` | Bharat Membrane |
| `/products/bharat-hydro-seal` | Bharat Hydro-Seal |

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/contact` | POST | Contact form submission (Resend email delivery) |

### Legacy Redirects

The following PHP routes from the previous site permanently redirect (301) to their new equivalents:

| Old Route | New Route |
|---|---|
| `/index.php` | `/` |
| `/about-us.php` | `/about-us` |
| `/contact-us.php` | `/contact-us` |
| `/electrical-insulating-mats.php` | `/products/electrical-insulating-mats` |
| `/coloured-strip-insulating-mats.php` | `/products/coloured-strip-insulating-mats` |
| `/bi-color-insulating-mats.php` | `/products/bi-color-insulating-mats` |
| `/auto-glow-reflective-band-insulating-mat.php` | `/products/auto-glow-reflective-band-insulating-mats` |
| `/bharat-membrane.php` | `/products/bharat-membrane` |
| `/BharatHydro-Seal.php` | `/products/bharat-hydro-seal` |

### Generated Files

| Route | Description |
|---|---|
| `/sitemap.xml` | Auto-generated sitemap (all pages + products) |
| `/robots.txt` | Static robots.txt (indexing gated by env vars) |

---

## 3. Environment-Variable Checklist

All production values must be set in the **Vercel dashboard** (Settings → Environment Variables). Never commit real secrets to the repository.

| Variable | Scope | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Yes | Canonical production URL: `https://bharatelectrosafe.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Public | Yes | `true` in production only; `false` for preview/dev |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Public | No | Google Search Console verification token (leave empty until verified) |
| `RESEND_API_KEY` | Server | Yes | Resend API key (`re_xxxxxxxxxxxx`) |
| `CONTACT_FROM_EMAIL` | Server | Yes | Verified sender address for contact-form emails (e.g. `enquiries@bharatelectrosafe.com`) |
| `CONTACT_TO_EMAIL` | Server | No | Recipient address (defaults to company email if unset) |

---

## 4. Domain Checklist

| Item | Status | Notes |
|---|---|---|
| HTTPS enforced | Yes | Vercel automatically enforces HTTPS |
| www redirect | To confirm | Configure `www.bharatelectrosafe.com` → `bharatelectrosafe.com` redirect in Vercel or DNS |
| DNS A/CNAME records | To confirm | Point domain to Vercel per their DNS documentation |
| SSL certificate | Auto | Vercel provisions and auto-renews SSL certificates |

---

## 5. Email-Delivery Checklist

| Item | Status | Notes |
|---|---|---|
| Resend configured | Yes | `RESEND_API_KEY` set in Vercel |
| Sender domain verified | To confirm | Verify the sending domain in the Resend dashboard |
| SPF record | To confirm | Add SPF DNS record authorising Resend to send on behalf of the domain |
| DKIM record | To confirm | Add DKIM DNS record provided by Resend |
| DMARC record | To confirm | Publish a DMARC policy (`v=DMARC1; p=none;` minimum) |

---

## 6. Google Search Console Checklist

| Item | Status | Notes |
|---|---|---|
| Property added | To confirm | Add `bharatelectrosafe.com` as a property in Search Console |
| Verification method | To confirm | Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel once token is obtained |
| Sitemap submitted | To confirm | Submit `https://bharatelectrosafe.com/sitemap.xml` |
| Indexing enabled | Yes | `NEXT_PUBLIC_ALLOW_INDEXING=true` + `NEXT_PUBLIC_SITE_URL` matches production domain + `VERCEL_ENV=production` |

---

## 7. Security Summary

| Control | Status | Details |
|---|---|---|
| Known critical/high vulnerabilities | None | `bun audit` reports 0 critical, 0 high, 0 medium, 0 low |
| Content-Security-Policy (CSP) | Yes | Configured in `next.config.ts`; blocks object-src, frame-ancestors, restricts frame-src to YouTube |
| HSTS | Yes | `max-age=63072000; includeSubDomains` (production only; no preload yet) |
| X-Frame-Options | Yes | `DENY` |
| X-Content-Type-Options | Yes | `nosniff` |
| Referrer-Policy | Yes | `strict-origin-when-cross-origin` |
| Permissions-Policy | Yes | camera, microphone, geolocation, browsing-topics, interest-cohort all denied |
| Origin validation | Yes | Contact form validates `Origin`/`Referer` headers against exact allow-list (no substring matching) |
| Rate limiting | Yes | In-memory: 5 requests per IP per 10-minute window |
| Anti-spam | Yes | Honeypot field + timing check (3 s minimum, 1 h maximum) |
| Input validation | Yes | Zod strict schema with `.strict()`; HTML escaping in email body |
| No secrets in repo | Yes | Verified by secrets scan; all secrets in Vercel dashboard only |
| `poweredByHeader` | Disabled | `poweredByHeader: false` in Next.js config |

---

## 8. Backup and Rollback Instructions

### Vercel Deployments

Every push to `main` triggers a Vercel deployment. Previous deployments are retained and can be promoted instantly:

1. Go to **Vercel Dashboard → bharat-electrosafe → Deployments**.
2. Find the last known-good deployment.
3. Click the **⋯** menu → **Promote to Production**.

This is an instant rollback with zero downtime.

### Git Revert

To revert a specific commit from the command line:

```bash
git revert <commit-sha>
git push origin main
```

Vercel will automatically build and deploy the reverted state.

---

## 9. Routine Maintenance

| Task | Frequency | Notes |
|---|---|---|
| Dependency updates | Monthly | Run `bun update`, then `bun audit`. Check for breaking changes. |
| Certificate renewal | Automatic | Vercel auto-renews SSL certificates |
| Content updates | As needed | Edit data files (see Section 10) and push to `main` |
| Lighthouse audit | Quarterly | Run Lighthouse against production to catch regressions |
| Security audit | Quarterly | Run `bun audit`, review CSP headers, check for new vulnerabilities |

---

## 10. Content-Editing Locations

All site content is stored in TypeScript data files. To update content, edit the relevant file and push to `main`.

| File | Content |
|---|---|
| `src/data/company.ts` | Company name, address, phone, email, WhatsApp, social links |
| `src/data/products.ts` | All 6 product families: names, descriptions, specifications, applications, gallery, documents |
| `src/data/team.ts` | Leadership profiles: names, titles, bios, photos |
| `src/data/faqs.ts` | FAQ entries displayed on homepage and product pages |
| `src/data/trust.ts` | Trust signals: certifications, client logos, awards |
| `src/data/asset-slots.ts` | Asset slot definitions for product media |

---

## 11. Logo and Asset Locations

| Directory | Contents |
|---|---|
| `public/brand/` | Company logos, brand assets (SVG, PNG, WebP) |
| `public/media/` | Product photos, hero images, certificates, leadership photos, client logos, awards, manufacturing photos |
| `public/og/` | Open Graph and Twitter Card social sharing images |
| `public/documents/certifications/` | Downloadable PDF certificates (ISO, CE, ERDA, Startup India) |
| `public/icons/` | PWA icons (192 px, 512 px, maskable variants) |

---

## 12. Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| CSP `unsafe-inline` for scripts and styles | Moderate residual risk — allows inline `<script>` and `<style>` injection | Next.js requires `unsafe-inline` for bootstrap scripts. A nonce-based CSP would require dynamic rendering or middleware, adding architectural complexity. Risk is low for a static marketing site with no user-generated content. |
| In-memory rate limiting | Not durable across serverless cold starts — a sophisticated attacker could bypass by timing cold starts | Replace with **Upstash Redis** for serverless-durable rate limiting. Current in-memory implementation is adequate for normal traffic. |
| No admin panel | Content changes require editing TypeScript files and pushing to `main` | This is by design — the site is a static marketing site with no database or admin surface. |

---

## 13. External Actions Required

The following items require action outside of the codebase:

| # | Action | Where | Priority |
|---|---|---|---|
| 1 | **Vercel Firewall rate-limit rule** | Vercel Dashboard → Firewall | High — add a Vercel-level rate-limit rule as a defence-in-depth layer beyond the in-app rate limiter |
| 2 | **Upstash Redis for rate limiting** | Upstash + code change | Medium — replace in-memory rate limiting with Upstash Redis for serverless durability |
| 3 | **SPF / DKIM / DMARC DNS records** | DNS provider | High — required for email deliverability; configure in Resend dashboard and DNS |
| 4 | **Google Search Console verification** | Search Console + Vercel env var | High — add property, obtain verification token, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel |
| 5 | **www redirect** | Vercel or DNS | Medium — configure `www.bharatelectrosafe.com` → `bharatelectrosafe.com` redirect |
| 6 | **HSTS preload** | hstspreload.org | Low — add `includeSubDomains` preload after confirming all subdomains support HTTPS |

---

## 14. Emergency Rollback Procedure

If the production site is broken or displaying incorrect content:

### Option A: Vercel Instant Rollback (fastest, ~30 seconds)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **bharat-electrosafe** → **Deployments**.
2. Locate the last known-good deployment (green checkmark, before the issue).
3. Click **⋯** → **Promote to Production**.
4. Verify the site is restored at `https://bharatelectrosafe.com`.

### Option B: Git Revert (~2-5 minutes)

1. Identify the problematic commit:
   ```bash
   git log --oneline -10
   ```
2. Revert the commit:
   ```bash
   git revert <commit-sha>
   git push origin main
   ```
3. Vercel will automatically build and deploy the reverted state.
4. Verify the site is restored.

### Verification Checklist After Rollback

- [ ] Homepage loads correctly
- [ ] Product pages render
- [ ] Contact form submits successfully
- [ ] No console errors in browser DevTools
- [ ] SSL certificate is valid

---

*This document was prepared as part of the Bharat Electrosafe v1.0.0 release handoff.*
