import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { company } from "@/data/company";
import { siteUrl, deploymentOrigin, allowIndexing } from "@/lib/site-url";
import { siteOgImage, siteTwitterImage } from "@/lib/social-image";
import { HomepageStructuredData } from "@/components/structured-data";
import { RevealObserver } from "@/components/ui/RevealObserver";

// Variable-font configuration — a single Manrope variable font file replaces
// the previous five static weights (400/500/600/700/800). This reduces font
// transfer size and the number of font requests on the critical path while
// preserving every weight the design system uses.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

/**
 * Root metadata — Bharat Electrosafe.
 *
 * Canonical domain: https://bharatelectrosafe.com (hardcoded as
 * `canonicalOrigin` in `src/lib/site-url.ts`). Used for canonical
 * <link>, Open Graph url, Twitter url, sitemap <loc>, robots host
 * and JSON-LD url/@id — all routed through `siteUrl` / `buildUrl`,
 * both of which alias to `canonicalOrigin`.
 *
 * `metadataBase` is the one place we deliberately use `deploymentOrigin`
 * rather than `canonicalOrigin`. Next.js resolves relative OG/Twitter
 * image URLs (e.g. `/opengraph-image.png`) against `metadataBase`, so it
 * must point at the deployment that actually serves the image. On a
 * production deployment `deploymentOrigin === canonicalOrigin`; on a
 * preview deployment they diverge — `metadataBase` follows the preview
 * URL so crawlers fetch a reachable image, while every other URL field
 * keeps pointing at the canonical domain.
 *
 * Brand assets (favicons, apple icon, OG image, Twitter image) are wired
 * via Next.js App Router file conventions — no manual `icons` or
 * `openGraph.images` config is needed. The following files in `src/app/`
 * are auto-detected by Next.js and emitted as `<link>` / `<meta>` tags:
 *   • icon.svg               → <link rel="icon" type="image/svg+xml">
 *   • favicon.ico            → <link rel="icon" sizes="any">
 *   • apple-icon.png         → <link rel="apple-touch-icon">
 *   • opengraph-image.png    → <meta property="og:image">
 *   • twitter-image.png      → <meta name="twitter:image">
 *   • manifest.ts            → <link rel="manifest">
 * The PWA icons inside the manifest are referenced explicitly via
 * `public/icons/icon-{192,512}{,-maskable}.png`.
 *
 * Per-page metadata: child routes override `title` and `description` via
 * their own `generateMetadata` exports. The root canonical covers only
 * the homepage — child routes declare their own self-referencing
 * canonical so no page inherits the homepage canonical.
 *
 * Bharat Hydro Seal remains accurately represented in the description
 * (the product is named explicitly) and continues to have its own route
 * at /products/bharat-hydro-seal with dedicated metadata.
 */
const siteDescription =
  'Manufacturer of electrical insulating mats, visible-safety mat variants, Geo Membrane Lining PVC geo-membranes and Water Stop Seal water stops for industrial applications.';

export const metadata: Metadata = {
  metadataBase: new URL(deploymentOrigin),
  title: {
    default: `${company.name} | Electrical Insulating Mats Manufacturer India`,
    template: `%s | ${company.name}`,
  },
  description: siteDescription,
  applicationName: company.name,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  alternates: {
    canonical: '/',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: company.name,
    title: `${company.name} | Electrical Insulating Mats Manufacturer India`,
    description: siteDescription,
    url: siteUrl,
    images: [siteOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} | Electrical Insulating Mats Manufacturer India`,
    description: siteDescription,
    images: [siteTwitterImage],
  },
  category: 'manufacturing',
};

export const viewport = {
  themeColor: '#002659',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        <HomepageStructuredData />
      </head>
      <body
        className={`${manrope.variable} antialiased bg-be-warm-white text-be-charcoal-950`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
      >
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: '.reveal-up,.stagger-reveal{opacity:1!important;transform:none!important}.stagger-reveal>*{opacity:1!important;transform:none!important}' }} />
        </noscript>
        {children}
        {/* Global progressive-enhancement observer. It must live at the root
            because reveal classes are used outside the homepage as well. */}
        <RevealObserver />
      </body>
    </html>
  );
}
