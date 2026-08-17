// Redeploy: 2026-08-16-restructure
import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://bharatelectrosafe.com';

/**
 * Content-Security-Policy.
 *
 * Uses `script-src 'self' 'unsafe-inline'` so Next.js inline bootstrap
 * scripts are not blocked. `unsafe-eval` is never added. Resend is
 * server-side only and is not listed in browser connect-src.
 *
 * The `unsafe-inline` limitation is a known moderate residual risk for
 * this static marketing site. A nonce-based CSP would require dynamic
 * rendering or middleware that adds architectural complexity beyond
 * what is justified for this content-first site. The risk is mitigated
 * by:
 *   - No user-generated content is rendered as HTML
 *   - JSON-LD uses safe serialisation (< → \u003c)
 *   - SRI is not practical for Next.js inline chunks
 *   - The site has no authentication / sensitive client-side state
 *
 * If a nonce-based approach becomes practical in a future Next.js
 * version, upgrade to nonce-based script-src.
 */
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "media-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "manifest-src 'self'",
  isProduction ? 'upgrade-insecure-requests' : '',
].filter(Boolean);

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader.join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  /* HSTS: using a safe rollout value with includeSubDomains.
     The preload list requires the client to control all subdomains and
     support HTTPS on every one. If that is verified, preload can be
     added later. */
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains',
        },
      ]
    : []),
  /* Cross-Origin isolation headers — safe for this site which has no
     cross-origin dependencies (no OAuth popups, no cross-origin workers,
     no SharedArrayBuffer usage). These headers provide defence-in-depth
     against cross-origin attacks. */
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['http://127.0.0.1', 'http://localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async headers() {
    return [
      // Security headers for all page routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // API routes: no-store, noindex
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  async redirects() {
    // Permanent PHP → new-route redirects
    const phpRedirects: Array<{ source: string; destination: string }> = [
      { source: '/index.php', destination: '/' },
      { source: '/about-us.php', destination: '/about-us' },
      { source: '/contact-us.php', destination: '/contact-us' },
      { source: '/electrical-insulating-mats.php', destination: '/products/electrical-insulating-mats' },
      { source: '/coloured-strip-insulating-mats.php', destination: '/products/electrical-insulating-mats/coloured-strip-insulating-mats' },
      { source: '/bi-color-insulating-mats.php', destination: '/products/electrical-insulating-mats/bi-color-insulating-mats' },
      { source: '/auto-glow-reflective-band-insulating-mat.php', destination: '/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats' },
      { source: '/bharat-membrane.php', destination: '/products/geo-membrane-lining' },
      { source: '/BharatHydro-Seal.php', destination: '/products/water-stop-seal' },
    ];

    // Old HV domestic route → new canonical route
    const domesticRedirect = {
      source: '/products/electrical-insulating-mats/domestic',
      destination: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats',
      permanent: true,
    };

    // Legacy top-level product routes → canonical nested routes
    const legacyProductRedirects = [
      { source: '/products/auto-glow-reflective-band-insulating-mats', destination: '/products/electrical-insulating-mats/auto-glow-reflective-band-insulating-mats' },
      { source: '/products/bi-color-insulating-mats', destination: '/products/electrical-insulating-mats/bi-color-insulating-mats' },
      { source: '/products/coloured-strip-insulating-mats', destination: '/products/electrical-insulating-mats/coloured-strip-insulating-mats' },
      { source: '/products/international-iec-61111', destination: '/products/electrical-insulating-mats/international-iec-61111' },
    ];

    // Legacy waterproofing product routes → new canonical routes
    const waterproofingRedirects = [
      { source: '/products/bharat-membrane', destination: '/products/geo-membrane-lining' },
      { source: '/products/bharat-hydro-seal', destination: '/products/water-stop-seal' },
    ];

    // www → non-www redirect (supplements middleware, works at Vercel edge)
    const wwwRedirect = {
      source: '/:path*',
      has: [
        {
          type: 'host' as const,
          value: 'www.bharatelectrosafe.com',
        },
      ],
      destination: 'https://bharatelectrosafe.com/:path*',
      permanent: true,
    };

    return [
      ...phpRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: true,
      })),
      domesticRedirect,
      ...legacyProductRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: true,
      })),
      ...waterproofingRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: true,
      })),
      wwwRedirect,
    ];
  },
};

export default nextConfig;
export { siteUrl };
