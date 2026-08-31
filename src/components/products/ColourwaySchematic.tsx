import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────
   ColourwaySchematic

   A CSS-only schematic of a dual-layer mat colourway.
   It is explicitly a DIAGRAM — never a product photo — so the
   documented colourway (top layer + wear-indicator layer) can
   be communicated honestly even where the available photography
   shows a different finish.

   Values are passed in from product data; no hardcoded colour
   claims. `aria-hidden` is set on the decorative layers and the
   textual labels carry the information for assistive tech.
   ──────────────────────────────────────────── */

interface ColourwaySchematicProps {
  /** Label for the upper layer, e.g. "Black". */
  topLabel: string;
  /** Label for the lower (wear-indicator) layer, e.g. "Yellow". */
  bottomLabel: string;
  /** Tailwind background class for the top layer. */
  topClass?: string;
  /** Tailwind background class for the bottom layer. */
  bottomClass?: string;
  /** Context line, e.g. the standard the colourway is documented against. */
  note?: string;
  /** Visual density: "compact" fits inside product cards. */
  size?: 'compact' | 'full';
  className?: string;
}

export default function ColourwaySchematic({
  topLabel,
  bottomLabel,
  topClass = 'bg-neutral-950',
  bottomClass = 'bg-yellow-400',
  note,
  size = 'compact',
  className,
}: ColourwaySchematicProps) {
  const isCompact = size === 'compact';

  return (
    <figure
      className={cn(
        'rounded-lg border border-be-grey-250 bg-be-white',
        isCompact ? 'p-3' : 'p-5',
        className,
      )}
    >
      <figcaption
        className={cn(
          'flex items-center gap-1.5 font-semibold uppercase tracking-wide text-be-grey-650',
          isCompact ? 'text-[11px] mb-2' : 'text-xs mb-3',
        )}
      >
        <Layers className="size-3.5 shrink-0" aria-hidden="true" />
        Colourway — schematic
      </figcaption>

      <div className="flex items-stretch gap-2" aria-hidden="true">
        {/* Layer stack */}
        <div className="flex flex-col flex-1 rounded-md overflow-hidden border border-be-grey-250">
          <div
            className={cn(
              topClass,
              'relative',
              isCompact ? 'h-7' : 'h-12',
            )}
            style={{
              backgroundImage:
                'radial-gradient(circle at 6px 6px, rgba(255,255,255,0.16) 1.6px, transparent 1.7px)',
              backgroundSize: '12px 12px',
            }}
          />
          <div
            className={cn(
              bottomClass,
              isCompact ? 'h-3.5' : 'h-6',
              'border-t-2 border-dashed border-white/60',
            )}
          />
        </div>

        {/* Layer labels */}
        <div
          className={cn(
            'flex flex-col justify-between py-0.5 shrink-0',
            isCompact ? 'text-[11px]' : 'text-xs',
          )}
        >
          <span className="font-medium text-be-charcoal-950">
            Top layer — {topLabel}
          </span>
          <span className="font-medium text-be-charcoal-800">
            Wear-indicator layer — {bottomLabel}
          </span>
        </div>
      </div>

      <p
        className={cn(
          'text-be-grey-650',
          isCompact ? 'text-[11px] mt-2' : 'text-xs mt-3',
        )}
      >
        {note ??
          `Documented colourway: ${topLabel} surface with a contrasting ${bottomLabel.toLowerCase()} wear-indicator layer. Schematic illustration — request photographs for the actual finish.`}
      </p>
    </figure>
  );
}
