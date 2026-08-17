import type { MetadataRoute } from 'next';

/**
 * Bharat Electrosafe — Web App Manifest.
 *
 * Defines how the site appears when installed on a mobile home screen
 * (Add to Home Screen / PWA install). Deliberately minimal — no
 * service worker, no offline support, no PWA-only UI — the site is a
 * content-first marketing site, not an installable application. The
 * manifest exists only so the home-screen icon and theme colour are
 * correct.
 *
 * Brand colours:
 *   • background_color: warm-white (#FCFBF7, be-warm-white) — matches
 *     the site body background, so the launch transition is seamless.
 *   • theme_color: deep brand navy (#00275B, be-navy-800) — matches
 *     the header and the favicon background.
 *
 * Icons: standard + maskable variants at 192px and 512px so Android
 * adapts correctly to circular, squircle and square device masks.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bharat Electrosafe',
    short_name: 'Bharat Electrosafe',
    description:
      'Manufacturer of electrical insulating mats, visible-safety mats, Geo Membrane Lining and Water Stop Seal products for industrial electrical and infrastructure applications.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCFBF7',
    theme_color: '#002659',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
