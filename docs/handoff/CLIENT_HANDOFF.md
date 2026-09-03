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
| Hosting | Hostinger Business (Node.js Web App) |
| Email delivery | SMTP via Nodemailer (Hostinger) (server-side only) |
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
| `/api/contact` | POST | Contact form submission (SMTP email delivery) |

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

All production values must be set in the **Hostinger Node.js environment variables panel**. Never commit real secrets to the repository.

| Variable | Scope | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Yes | Canonical production URL: `https://bharatelectrosafe.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Public | Yes | `true` in production only; `false` for preview/dev |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Public | No | Google Search Console verification token (leave empty until verified) |
| `SMTP_HOST` | Server | Yes | SMTP server hostname (e.g. `smtp.hostinger.com`) |
| `SMTP_PORT` | Server | Yes | SMTP port (`587` for STARTTLS, `465` for SSL) |
| `SMTP_USER` | Server | Yes | Authenticated SMTP business email account |
| `SMTP_PASSWORD` | Server | Yes | SMTP account password (set in Hostinger env vars, never in code) |
| `SMTP_SECURE` | Server | Yes | `true` for port 465 (SSL), `false` for port 587 (STARTTLS) |
| `MAIL_FROM` | Server | Yes | Sender address (should match `SMTP_USER` for deliverability) |
| `MAIL_TO` | Server | Yes | Recipient address for enquiry emails |
| `MAIL_CC` | Server | No | Optional CC recipient |

---

## 4. Domain Checklist

| Item | Status | Notes |
|---|---|---|
| HTTPS enforced | Yes | Hostinger automatically enforces HTTPS |
| www redirect | To confirm | Configure `www.bharatelectrosafe.com` → `bharatelectrosafe.com` redirect in Hostinger or DNS |
| DNS A/CNAME records | To confirm | Point domain to Hostinger per their DNS documentation |
| SSL certificate | Auto | Hostinger provisions and auto-renews SSL certificates |

---

## 5. Email-Delivery Checklist

| Item | Status | Notes |
|---|---|---|
| SMTP configured | Yes | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_SECURE` set in Hostinger env vars |
| MAIL_FROM set | Yes | Sender address matches `SMTP_USER` for deliverability |
| MAIL_TO set | Yes | Recipient inbox for enquiry emails |
| SPF record | To confirm | Ensure the domain's SPF record authorises the Hostinger SMTP server |
| DKIM record | To confirm | Enable DKIM signing in the Hostinger email panel if available |
| DMARC record | To confirm | Publish a DMARC policy (`v=DMARC1; p=none;` minimum) |

---

## 6. Google Search Console Checklist

| Item | Status | Notes |
|---|---|---|
| Property added | To confirm | Add `bharatelectrosafe.com` as a property in Search Console |
| Verification method | To confirm | Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Hostinger env vars once token is obtained |
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
| No secrets in repo | Yes | Verified by secrets scan; all secrets in Hostinger env vars only |
| `poweredByHeader` | Disabled | `poweredByHeader: false` in Next.js config |

---

## 8. Backup and Rollback Instructions

### Hostinger Deployments (historical — internal reference)

The application is deployed on Hostinger Business Node.js Web App. For deployment history, use Hostinger deployment logs.

Historical note: The application was previously deployed on Vercel. Previous Vercel deployments are retained and can be promoted if needed:

1. Go to **Vercel Dashboard → bharat-electrosafe → Deployments** (historical access only).
2. Find the last known-good deployment.
3. Click the **⋯** menu → **Promote to Production**.

This is an instant rollback with zero downtime.

### Git Revert

To revert a specific commit from the command line:

```bash
git revert <commit-sha>
git push origin main
```

Hostinger will need a manual rebuild after uploading updated files.

---

## 9. Routine Maintenance

| Task | Frequency | Notes |
|---|---|---|
| Dependency updates | Monthly | Run `bun update`, then `bun audit`. Check for breaking changes. |
| Certificate renewal | Automatic | Hostinger auto-renews SSL certificates |
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
| 1 | **Hostinger rate-limit rule** | Hostinger hPanel | Medium — consider Hostinger-level rate limiting as a defence-in-depth layer beyond the in-app rate limiter |
| 2 | **Upstash Redis for rate limiting** | Upstash + code change | Medium — replace in-memory rate limiting with Upstash Redis for serverless durability |
| 3 | **SPF / DKIM / DMARC DNS records** | DNS provider | High — required for email deliverability; configure in Hostinger email panel and DNS |
| 4 | **Google Search Console verification** | Search Console + Hostinger env var | High — add property, obtain verification token, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Hostinger |
| 5 | **www redirect** | Hostinger or DNS | Medium — configure `www.bharatelectrosafe.com` → `bharatelectrosafe.com` redirect |
| 6 | **HSTS preload** | hstspreload.org | Low — add `includeSubDomains` preload after confirming all subdomains support HTTPS |

---

## 14. Emergency Rollback Procedure

If the production site is broken or displaying incorrect content:

### Option A: Re-upload Previous ZIP (historical — Vercel instant rollback no longer primary)

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
3. Hostinger will need a manual rebuild after uploading updated files.
4. Verify the site is restored.

### Verification Checklist After Rollback

- [ ] Homepage loads correctly
- [ ] Product pages render
- [ ] Contact form submits successfully
- [ ] No console errors in browser DevTools
- [ ] SSL certificate is valid

---

*This document was prepared as part of the Bharat Electrosafe v1.0.0 release handoff.*
