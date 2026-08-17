# Threat Model — Bharat Electrosafe Website

**Document version:** 1.0
**Date:** 2026-03-04
**Scope:** Bharat Electrosafe production website — a Next.js 16 static marketing
site deployed on Vercel with a single serverless API route (`/api/contact`) for
enquiry delivery via Resend.

---

## System overview

| Property | Value |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| Site type | Static marketing pages + one serverless API route |
| Hosting | Vercel (HTTPS enforced, CDN) |
| Admin panel | **None** — no authenticated admin surface exists |
| Database | **None** — no database is used; the site is fully static |
| Email delivery | Resend (server-side only; API key stored as Vercel env var) |
| Third-party embeds | YouTube (privacy-enhanced mode via `youtube-nocookie.com`) |
| Source code | Public GitHub repository |

---

## Asset inventory

| # | Asset | Description | Data classification |
|---|---|---|---|
| A1 | Public website content | Marketing pages, product info, company info | Public |
| A2 | Contact form | Enquiry submission endpoint (`/api/contact`) | Processes PII |
| A3 | Visitor personal data | Name, email, phone, company, message | PII — Confidential |
| A4 | Resend integration | Server-side email delivery via Resend API | Secret — API key in Vercel env |
| A5 | Vercel environment variables | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Secret — Confidential |
| A6 | DNS and domain | `bharatelectrosafe.com` DNS records, domain registration | Critical infrastructure |
| A7 | Client-side assets | JavaScript bundles, CSS, images in `/public` | Public |
| A8 | Third-party YouTube embed | Iframes loaded from `youtube-nocookie.com` | Third-party — Low trust |
| A9 | Supply-chain dependencies | npm packages consumed by the build | Varies |
| A10 | Public repository exposure | Source code, configuration, and history visible on GitHub | Public — may leak secrets |
| A11 | Social-preview assets | Open Graph and Twitter card images in `/public/og/` | Public |
| A12 | Admin/authentication status | **No admin panel or authentication exists** | N/A — not applicable |
| A13 | Data storage status | **No database** — the site is fully static with no persisted data | N/A — not applicable |

---

## Threat records

### T1 — Cross-site scripting (XSS) via website content

| Field | Detail |
|---|---|
| **Asset** | A1 — Public website content |
| **Threat actor** | Attacker with ability to inject content (compromised CDN, DNS hijack, or supply-chain compromise) |
| **Attack path** | Inject malicious JavaScript into page content → execute in visitor browser |
| **Impact** | Credential theft, session hijack, defacement, malware distribution |
| **Existing control** | CSP with `script-src 'self' 'unsafe-inline'`; no `unsafe-eval`; no `dangerouslySetInnerHTML` with user-controlled HTML; JSON-LD escaped with `\u003c`; `object-src 'none'`; `X-Content-Type-Options: nosniff` |
| **Remaining risk** | P3 — `unsafe-inline` in CSP allows inline scripts if an injection vector exists; a nonce-based CSP would eliminate this |
| **Required mitigation** | Adopt nonce-based CSP when Next.js middleware support makes it feasible without excessive architectural complexity |

---

### T2 — Contact form abuse / spam

| Field | Detail |
|---|---|
| **Asset** | A2 — Contact form |
| **Threat actor** | Automated bot, spam operator |
| **Attack path** | Submit high-volume or abusive enquiries → flood inbox, waste resources, drown legitimate enquiries |
| **Impact** | Operational disruption, missed legitimate enquiries, wasted Resend quota |
| **Existing control** | Honeypot field (`website`), timing check (3 s minimum, 1 h maximum), in-memory rate limiting (5 requests / 10 min / IP), origin validation, content-type enforcement, 32 KB body-size limit, `Cache-Control: no-store` |
| **Remaining risk** | P3 — In-memory rate limiting resets on serverless cold start; a determined attacker can bypass timing checks with headless browsers |
| **Required mitigation** | Configure Vercel Firewall rate-limit rule for `/api/contact`; implement Upstash Redis for durable rate limiting; consider CAPTCHA for persistent abuse |

---

### T3 — Visitor PII exposure

| Field | Detail |
|---|---|
| **Asset** | A3 — Visitor personal data |
| **Threat actor** | Attacker with network access, malicious insider, or compromised Resend account |
| **Attack path** | Intercept form submission in transit; access Resend inbox; extract PII from logs |
| **Impact** | Privacy violation, regulatory exposure (IT Act), reputational damage |
| **Existing control** | HTTPS enforced by Vercel; Resend API server-side only (not in browser `connect-src`); redacted logging (no PII in console output); only pathname extracted from referer; no user-agent in email; `Cache-Control: no-store` on API responses |
| **Remaining risk** | Informational — PII is transmitted to Resend and stored in the recipient inbox; no data-at-rest encryption is controlled by the website |
| **Required mitigation** | Ensure the recipient inbox uses a provider with encryption at rest; verify SPF/DKIM/DMARC for the sending domain; rotate `RESEND_API_KEY` if it was ever in a public commit |

---

### T4 — Resend API key compromise

| Field | Detail |
|---|---|
| **Asset** | A4 — Resend integration; A5 — Vercel environment variables |
| **Threat actor** | Attacker who gains access to Vercel project settings, or finds a leaked key in git history |
| **Attack path** | Extract `RESEND_API_KEY` from Vercel env or git history → send arbitrary emails from the verified domain |
| **Impact** | Phishing, spam, domain reputation damage, email delivery abuse |
| **Existing control** | Key stored as Vercel environment variable (not in code); `.env` removed from git tracking; `.env.example` contains no real values; Resend dashboard shows API key usage |
| **Remaining risk** | P3 — If the key was ever committed to a public branch, it remains in git history even after deletion |
| **Required mitigation** | Rotate `RESEND_API_KEY` if it was ever in a public commit; audit git history for accidental secret commits; enable Vercel's secret-scanning integration |

---

### T5 — DNS hijack / domain takeover

| Field | Detail |
|---|---|
| **Asset** | A6 — DNS and domain |
| **Threat actor** | Attacker with registrar access, DNS cache-poisoning capability, or social-engineering registrar |
| **Attack path** | Modify DNS records → redirect traffic to attacker-controlled server |
| **Impact** | Complete site compromise, phishing, SSL certificate mis-issuance, user data theft |
| **Existing control** | DNSSEC (if enabled by registrar); Vercel-managed SSL; HSTS with `includeSubDomains` |
| **Remaining risk** | P2 — DNS security is outside the application's direct control; HSTS preload is not yet enabled |
| **Required mitigation** | Enable DNSSEC at registrar; verify registrar account has MFA; consider HSTS preload submission after verifying all subdomains support HTTPS; enable Vercel's domain-protection features |

---

### T6 — Client-side asset tampering

| Field | Detail |
|---|---|
| **Asset** | A7 — Client-side assets |
| **Threat actor** | Attacker with CDN compromise, or MITM on HTTP connections |
| **Attack path** | Modify JavaScript bundles or images in transit → execute malicious code in visitor browser |
| **Impact** | XSS, credential theft, defacement |
| **Existing control** | Vercel CDN enforces HTTPS; CSP `script-src 'self'` limits script sources; `integrity` hashes on Vercel's CDN assets; `upgrade-insecure-requests` in production CSP |
| **Remaining risk** | Informational — SRI is not applied to all sub-resources; Vercel's CDN handles integrity for its own assets |
| **Required mitigation** | No immediate action required; monitor for CDN-level integrity features from Vercel |

---

### T7 — Third-party YouTube iframe risks

| Field | Detail |
|---|---|
| **Asset** | A8 — Third-party YouTube embed |
| **Threat actor** | YouTube/Google (data collection), or attacker exploiting YouTube iframe vulnerabilities |
| **Attack path** | YouTube iframe loads third-party trackers; YouTube iframe has a vulnerability that is exploited |
| **Impact** | Visitor tracking without consent, potential XSS via iframe |
| **Existing control** | `youtube-nocookie.com` used (privacy-enhanced mode); CSP `frame-src` restricts to `https://www.youtube-nocookie.com` only; `Permissions-Policy` disables camera, microphone, geolocation |
| **Remaining risk** | P3 — YouTube still loads from Google's domain and may set cookies or track visitors; iframe sandboxing is limited by YouTube's requirements |
| **Required mitigation** | Consider implementing a facade/lazy-load pattern (click-to-load) so YouTube scripts are not loaded until the visitor explicitly interacts; this is already partially implemented via `YouTubeFacade.tsx` |

---

### T8 — Supply-chain dependency compromise

| Field | Detail |
|---|---|
| **Asset** | A9 — Supply-chain dependencies |
| **Threat actor** | Malicious package maintainer, compromised npm account, typosquatting attacker |
| **Attack path** | Install a compromised dependency → malicious code executes during build or at runtime |
| **Impact** | Supply-chain attack, data exfiltration, backdoor |
| **Existing control** | Dependencies reduced from 65 to 18 production packages; `bun audit` for known vulnerabilities; `package-lock` / `bun.lock` pins exact versions; no `unsafe-eval` or `eval` in codebase |
| **Remaining risk** | P3 — Zero-day compromises in dependencies are not detectable by audit tools; lockfile-only protection does not prevent account-takeover attacks on package maintainers |
| **Required mitigation** | Enable GitHub Dependabot or Renovate for automated dependency updates; review lockfile diffs in PRs; consider npm provenance verification; run `bun audit` in CI |

---

### T9 — Public repository secret leakage

| Field | Detail |
|---|---|
| **Asset** | A10 — Public repository exposure |
| **Threat actor** | Anyone scanning public GitHub repositories for secrets |
| **Attack path** | Scan git history for accidentally committed API keys, tokens, or credentials |
| **Impact** | API key compromise, unauthorised access to third-party services |
| **Existing control** | `.env` removed from git tracking; `.env.example` contains no real values; `.gitignore` excludes `.env*` files; `RESEND_API_KEY` never committed (only placeholder in `.env.example`) |
| **Remaining risk** | P3 — A local SQLite `DATABASE_URL` was previously in `.env` (now untracked); secrets may exist in pre-`.gitignore` commit history |
| **Required mitigation** | Audit git history with `git log --all --full-history -- '*.env*'`; rotate any secret that was ever committed; enable GitHub secret scanning; add `RESEND_API_KEY` to GitHub's secret-scanning allowlist for monitoring |

---

### T10 — Social-preview asset manipulation

| Field | Detail |
|---|---|
| **Asset** | A11 — Social-preview assets |
| **Threat actor** | Attacker with write access to the repository or Vercel deployment |
| **Attack path** | Replace OG/Twitter images in `/public/og/` with misleading or malicious content |
| **Impact** | Reputational damage, misinformation, phishing via social media previews |
| **Existing control** | Repository write access restricted to maintainers; Vercel deployments require PR review; images are static files served from the same origin |
| **Remaining risk** | Informational — Requires write access to the repository or deployment pipeline |
| **Required mitigation** | No additional action required; maintain branch-protection rules and PR review requirements |

---

### T11 — No admin panel (status record)

| Field | Detail |
|---|---|
| **Asset** | A12 — Admin/authentication status |
| **Threat actor** | N/A |
| **Attack path** | N/A — no admin panel exists |
| **Impact** | N/A — eliminates an entire class of authentication-bypass and privilege-escalation threats |
| **Existing control** | No admin panel, no authentication surface, no session management |
| **Remaining risk** | None — this is a risk _reduction_ |
| **Required mitigation** | None — if an admin panel is added in the future, a separate threat-model update is required |

---

### T12 — No database (status record)

| Field | Detail |
|---|---|
| **Asset** | A13 — Data storage status |
| **Threat actor** | N/A |
| **Attack path** | N/A — no database exists |
| **Impact** | N/A — eliminates SQL injection, data exfiltration, and unauthorised data access threats |
| **Existing control** | No database, no ORM, no persistent storage on the server |
| **Remaining risk** | None — this is a risk _reduction_ |
| **Required mitigation** | None — if a database is added in the future, a separate threat-model update is required |

---

## Threat summary matrix

| ID | Asset | Threat | Severity | Status |
|---|---|---|---|---|
| T1 | Public website content | XSS via content injection | P3 | Accepted — `unsafe-inline` is a known residual risk for Next.js static sites |
| T2 | Contact form | Abuse / spam | P3 | Mitigated — additional hardening recommended (Vercel Firewall, Upstash Redis) |
| T3 | Visitor PII | PII exposure | Informational | Mitigated — HTTPS, redacted logging, no client-side API key |
| T4 | Resend / Vercel env vars | API key compromise | P3 | Mitigated — rotate if leaked; audit git history |
| T5 | DNS and domain | DNS hijack / takeover | P2 | Partially mitigated — DNSSEC and HSTS preload recommended |
| T6 | Client-side assets | Asset tampering | Informational | Mitigated — HTTPS, CSP, Vercel CDN integrity |
| T7 | YouTube embed | Third-party tracking / iframe risk | P3 | Mitigated — `youtube-nocookie.com`, facade pattern |
| T8 | Supply-chain deps | Dependency compromise | P3 | Partially mitigated — reduced deps, audit tooling; Dependabot recommended |
| T9 | Public repository | Secret leakage | P3 | Mitigated — `.env` untracked; git history audit recommended |
| T10 | Social-preview assets | Asset manipulation | Informational | Mitigated — branch protection, PR review |
| T11 | Admin panel | N/A — does not exist | N/A | Risk eliminated |
| T12 | Database | N/A — does not exist | N/A | Risk eliminated |

---

## Severity definitions

| Level | Label | Description |
|---|---|---|
| P0 | Critical | Immediate, system-wide compromise; data breach or full takeover |
| P1 | High | Significant impact with clear exploitation path; urgent fix required |
| P2 | Medium | Moderate impact; requires specific conditions or partial control |
| P3 | Low | Limited impact; requires unlikely conditions or has strong existing controls |
| Informational | Informational | No direct threat; awareness item for future consideration |

---

## Next steps

1. **Enable Vercel Firewall** rate-limit rule for `/api/contact`.
2. **Implement Upstash Redis** for durable, serverless-compatible rate limiting.
3. **Verify SPF/DKIM/DMARC** for the sending domain configured in Resend.
4. **Rotate `RESEND_API_KEY`** if it was ever present in a public git commit.
5. **Enable GitHub secret scanning** and Dependabot for the repository.
6. **Audit git history** for accidentally committed secrets.
7. **Consider HSTS preload** after verifying all subdomains support HTTPS.
8. **Review this threat model** whenever a new feature, integration, or
   infrastructure change is introduced.
