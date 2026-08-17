import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoItem {
  name: string;
  src?: string;
}

interface LogoGridProps {
  logos: LogoItem[];
  className?: string;
}

/**
 * LogoGrid — static, accessible, equal-height grid of organisation logos.
 *
 * Replaces the previous `LogoRail` marquee on the homepage Industry
 * References section. The marquee moved logos past the user too fast for
 * recognition and clipped the rightmost tile; this grid gives every logo
 * a fixed, generously-padded cell so all organisation marks are visible
 * at once and never cropped.
 *
 * Layout (driven by Tailwind `grid-cols`):
 *   • Mobile (<640px):   2 columns  — comfortable single-row scan
 *   • Tablet (≥640px):   3 columns  — fits 8 logos in 3 rows
 *   • Desktop (≥1024px): 4 columns  — 8 logos in a clean 4 × 2 grid
 *
 * Each cell:
 *   • Equal-height (min-height 100px, max-height 120px) for visual rhythm
 *   • White background, thin neutral border
 *   • Sufficient internal padding so no logo touches the cell edge
 *   • `object-fit: contain` so aspect ratios are preserved (no stretch)
 *   • Subtle hover: border warms to brand yellow, very slight bg lift
 *   • No animation, no scale, no shadow膨胀 — keeps the section calm
 *
 * Accessibility:
 *   • Every logo `<img>` carries accurate `alt` text — never the same
 *     generic "client logo" string.
 *   • Decorative container has no redundant aria-label.
 *   • Logos are identifiable without hover.
 */
export function LogoGrid({ logos, className }: LogoGridProps) {
  return (
    <ul
      role="list"
      className={cn(
        'be-logo-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4',
        className
      )}
    >
      {logos.map((logo) => (
        <li
          key={logo.name}
          className="be-logo-grid__cell group"
        >
          {logo.src ? (
            <span className="be-logo-grid__image-wrap">
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 22vw"
              />
            </span>
          ) : (
            <span className="be-logo-grid__fallback">{logo.name}</span>
          )}
          {/* Visually-hidden organisation name — kept in the a11y tree
              so screen readers announce it even when the logo is decorative. */}
          <span className="sr-only">{logo.name}</span>
        </li>
      ))}
    </ul>
  );
}
