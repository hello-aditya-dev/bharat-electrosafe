// Redeploy: 2026-08-16-restructure
// Converted from next.config.ts to next.config.mjs for Hostinger deployment
// compatibility (avoids the GLIBC_2.29 / SWC transpilation issue that
// occurs when Hostinger's Node.js tries to JIT-compile the TypeScript
// config file).

const isProduction = process.env.NODE_ENV === 'production';
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://bharatelectrosafe.com';

/**
 * GitHub Pages static-export mode.
 *
 * Enabled ONLY when DEPLOY_TARGET=pages is set at build time (used by the
 * GitHub Actions workflow that deploys to GitHub Pages). When this flag is
 * absent (the Hostinger production build, local dev, the existing CI),
 * every option below resolves to its current value and the config is
 * byte-for-byte identical to the pre-Pages configuration — so the
 * existing Hostinger Node.js deployment is completely unaffected.
 *
 * What static export changes vs. the server build:
 *   - output: 'export'        → emits static HTML/CSS/JS to ./out
 *   - basePath: '/bharat-electrosafe' → GitHub project Pages serve path
 *   - trailingSlash: true     → folder-style URLs for static hosting
 *   - images.unoptimized      → Pages cannot run the Next.js image optimizer
 *   - headers() / redirects() → return [] (not supported by static export)
 *
 * Known limitations of the Pages preview:
 *   - The /api/contact route is a server API (SMTP) and is excluded from
 *     static export, so the contact form cannot submit on Pages.
 *   - Security headers and PHP→new-route redirects do not run on Pages.
 *   These limitations only affect the Pages preview; production on Hostinger
 *   remains fully functional.
 */
const isPagesExport = process.env.DEPLOY_TARGET === 'pages';

/**
 * Content-Security-Policy.
 *
 * Uses `script-src 'self' 'unsafe-inline'` so Next.js inline bootstrap
 * scripts are not blocked. `unsafe-eval` is never added.
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['http://127.0.0.1', 'http://localhost'],
  /* Always use '.next' as the build output directory. The previous
     conditional (isProduction ? '.next' : '.next-dev') was removed to
     eliminate any ambiguity on hosting platforms where NODE_ENV might
     not be set as expected during the build/start cycle. Dev and prod
     can still run side by side by using a different port or terminal. */
  distDir: '.next',
  /* GitHub Pages static-export overrides (no-op when DEPLOY_TARGET != 'pages'). */
  ...(isPagesExport
    ? {
        output: 'export',
        basePath: '/bharat-electrosafe',
        trailingSlash: true,
      }
    : {}),
  images: {
    /* Pages cannot run the Next.js image optimizer — serve images as-is. */
    unoptimized: isPagesExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async headers() {
    /* headers() is not supported by `output: 'export'`. */
    if (isPagesExport) return [];
    return [
      // Security headers for all page routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Next.js static chunks and CSS — ensure correct MIME type handling
      // and immutable caching. Chrome strictly refuses to apply stylesheets
      // or execute scripts served with an incorrect MIME type (e.g.
      // text/html from a 404 fallback page). Brave may be more lenient,
      // which is why Chrome can appear broken on hosting platforms that
      // don't proxy /_next/static/* correctly. These headers ensure the
      // Node.js server always serves them with the right Content-Type.
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Static public assets — previously configured only in vercel.json
      // (Vercel-only). Moved here so Hostinger and other non-Vercel hosts
      // also apply correct cache headers.
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/og/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
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
    /* redirects() is not supported by `output: 'export'`. */
    if (isPagesExport) return [];
    // Permanent PHP → new-route redirects
    const phpRedirects = [
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

    // www → non-www redirect
    const wwwRedirect = {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'www.bharatelectrosafe.com',
        },
      ],
      destination: 'https://bharatelectrosafe.com/:path*',
      permanent: true,
    };

    // International Auto Glow was retired from the Global/IEC offering.
    const internationalAutoGlowRedirects = [
      { source: '/products/electrical-insulating-mats/auto-glow-hv', destination: '/products/electrical-insulating-mats/international-iec-61111', permanent: true },
    ];

    return [
      ...phpRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: true,
      })),
      ...internationalAutoGlowRedirects,
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
