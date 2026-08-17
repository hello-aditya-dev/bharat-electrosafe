# Security Policy

## Supported Versions

| Version | Branch | Supported |
| ------- | ------ | --------- |
| Production | `main` | Yes |
| Feature branches | `feat/*` | No — pre-merge, not deployed |

Only the **`main` branch** is supported for security reports. It reflects what
is deployed to production at [bharatelectrosafe.com](https://bharatelectrosafe.com).
Preview deployments, feature branches, and local development environments are
not in scope.

---

## Reporting a Vulnerability

### Private reporting (preferred)

Please use **GitHub Private Vulnerability Reporting** or **GitHub Security
Advisories** to disclose security issues:

1. Go to the repository's **Security** tab.
2. Click **"Report a vulnerability"**.
3. Fill in the advisory form with the details described below.

This ensures that the maintainers are notified privately and can coordinate a
fix before any public disclosure.

### What NOT to do

- **Do not open a public GitHub issue** containing security vulnerabilities,
  secrets, API keys, credentials, or any sensitive information.
- **Do not post screenshots** that include environment variables, tokens, or
  personally identifiable information.
- **Do not disclose the vulnerability** on social media, forums, or any other
  public channel before a fix has been deployed.

---

## What to include in a report

A good vulnerability report helps us respond quickly. Please include:

1. **Description** — a clear summary of the vulnerability and its impact.
2. **Affected component** — the specific file, route, dependency, or
   configuration involved (e.g. `src/app/api/contact/route.ts`,
   `next.config.ts`, a specific npm package).
3. **Reproduction steps** — step-by-step instructions or a proof-of-concept
   that demonstrates the issue.
4. **Attack scenario** — what an attacker could realistically achieve.
5. **Suggested fix** — if you have one, we welcome it.
6. **Your contact details** — so we can follow up for clarification.

---

## Response process

We aim to follow this timeline:

| Phase | Target |
| ----- | ------ |
| Acknowledgement | Within **3 business days** of receipt |
| Triage & severity assessment | Within **5 business days** |
| Status update to reporter | Within **10 business days** |
| Fix or mitigation | Depends on severity — critical issues are prioritised |

We will keep the reporter informed at each stage. If a fix requires
coordination with a third-party dependency, timelines may be longer.

---

## No bug-bounty programme

Bharat Electrosafe does **not** operate a paid bug-bounty programme. We
appreciate responsible disclosure and will credit researchers in security
advisories when requested, but we do not offer financial rewards for
vulnerability reports.

---

## Scope

This policy applies to the **Bharat Electrosafe website** — a Next.js 16
static marketing site deployed on Vercel. The following are **in scope**:

- The production website at `bharatelectrosafe.com`
- The `main` branch of this repository
- The contact-form API (`/api/contact`)
- Server-side integrations (Resend email delivery)
- Content-Security-Policy and security headers
- Dependency security

The following are **out of scope**:

- Denial-of-service attacks against Vercel's infrastructure
- Attacks against third-party services we do not control (YouTube, Resend)
- Social engineering or phishing
- Issues that require physical access to infrastructure
- Theoretical vulnerabilities without a demonstrable attack path

---

Thank you for helping keep Bharat Electrosafe and its visitors safe.
