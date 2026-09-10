# Performance Baseline — Bharat Electrosafe

Captured using Lighthouse 13.4.1 against https://bharatelectrosafe.com/

## Mobile

- Performance: 88
- Accessibility: 90
- Best Practices: 96
- SEO: 92

- FCP: 1.2s
- LCP: 3.7s
- TBT: 130ms
- CLS: 0
- Speed Index: 3.3s

## Desktop

- Performance: 97
- Accessibility: 90
- Best Practices: 96
- SEO: 92

- FCP: 0.3s
- LCP: 1.2s
- TBT: 60ms
- CLS: 0
- Speed Index: 1.1s

## Key issues identified

- Image optimization savings: ~541 KiB (mobile) / ~459 KiB (desktop)
- Logo source 1276×685 displayed at ~175px
- Client logos 600×400 displayed at ~100-160px
- LCP image not optimally sized
- Render-blocking CSS: ~520ms (mobile) / ~70ms (desktop)
- Unused JavaScript: ~85 KiB
- aria-hidden containing focusable descendants
- Low contrast text (be-grey-400)
- Carousel dot touch targets too small
- Uncrawlable certification links
