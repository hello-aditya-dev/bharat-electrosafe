'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  InfiniteLogoRail                                                   */
/* ------------------------------------------------------------------ */
/**
 * InfiniteLogoRail — a seamless, continuously moving horizontal logo
 * rail used in the Certifications & Memberships and Industry References
 * sections of the homepage.
 *
 * Interaction model (mirrors the calm brand-strip behaviour of the
 * IBSINFRA reference, without copying its visual design):
 *
 *   • The track drifts right → left at a constant linear speed.
 *   • The loop is genuinely seamless: the original item group is
 *     rendered once semantically (Group A) and then duplicated
 *     visually (Group B). The whole strip is translated by exactly
 *     the width of one original group, so when the keyframe wraps
 *     from -50% back to 0% the visual position is identical. No
 *     scrollLeft snapping, no timer teleport, no visible reset.
 *   • Hover (pointer) pauses the animation; leaving resumes from the
 *     current position (CSS `animation-play-state: paused` keeps the
 *     computed transform, so there is no restart).
 *   • Keyboard focus inside the rail also pauses — keyboard users
 *     never chase a moving target.
 *   • `prefers-reduced-motion: reduce` disables the animation
 *     entirely and falls back to a plain horizontally scrollable rail
 *     containing a single semantic copy of the items.
 *
 * SEAMLESS-LOOP GEOMETRY (important):
 *   The track is a single flex row holding Group A's items followed
 *   immediately by Group B's items. There is NO flex `gap` on the
 *   track and NO extra gap between the two groups. Instead, every
 *   item cell carries its own trailing spacing via the
 *   `itemSpacingClassName` prop (e.g. `"pr-8 sm:pr-10"`). Because
 *   every cell — including the last cell of Group A — carries the
 *   same trailing spacing, the gap between Group A's last item and
 *   Group B's first item is identical to every other inter-item gap.
 *   The total track width is therefore exactly 2 × GroupA_width, and
 *   translating by -50% moves the strip by exactly one group width —
 *   mathematically seamless.
 *
 * Accessibility of the duplicated group:
 *   • Group A is real semantic HTML (`<ul><li>…</li></ul>`) with real
 *     `<a>` links and normal tab order.
 *   • Group B is wrapped in `aria-hidden="true"` and every interactive
 *     element inside it is rendered with `tabIndex={-1}` and its
 *     `href` stripped, so it is removed from the tab order AND from
 *     the accessibility tree. Screen readers announce each
 *     certificate/reference exactly once; keyboard users never tab
 *     through the same list twice.
 *
 * Performance:
 *   • The motion is a single CSS `transform` keyframe animation
 *     (`logo-rail-scroll`, defined in globals.css) — no
 *     requestAnimationFrame loop, no scrollLeft polling, no
 *     layout-thrashing property (left/margin-left/width).
 *
 * Layout stability:
 *   • Each item cell reserves its width via the caller-supplied item
 *     markup (fixed responsive widths), so the rail height and item
 *     footprints are stable before images load — no CLS.
 */
/* ------------------------------------------------------------------ */

export interface InfiniteLogoRailProps {
  /** Accessible label for the rail region (e.g. "Certifications and memberships"). */
  ariaLabel: string;
  /**
   * Duration in seconds for one complete original-group traversal
   * (i.e. the time it takes to translate the strip by the width of
   * Group A). Linear timing; the strip then wraps seamlessly.
   */
  duration: number;
  /** Pause the animation while the pointer hovers the rail. Default true. */
  pauseOnHover?: boolean;
  /** Pause the animation while any interactive element inside has focus. Default true. */
  pauseOnFocus?: boolean;
  /**
   * Additional className for the outer viewport (the overflow-clipped
   * container). Use this for vertical padding or edge fades.
   */
  className?: string;
  /**
   * className applied to the moving track (the flex row that holds
   * both Group A and Group B). Almost never needs overriding.
   */
  trackClassName?: string;
  /**
   * Trailing spacing applied to EVERY item cell (both groups). Pass a
   * Tailwind padding-right utility string such as `"pr-8 sm:pr-10 md:pr-12"`.
   * This — rather than a flex `gap` — is what makes the loop
   * mathematically seamless (see the geometry note above). Keep this
   * SMALL per the design direction: the rails are intentionally dense.
   * Defaults to `"pr-8"` (32px).
   */
  itemSpacingClassName?: string;
  /** The rail items. Each child should be a single cell (e.g. a `<li>`-like block). */
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function InfiniteLogoRail({
  ariaLabel,
  duration,
  pauseOnHover = true,
  pauseOnFocus = true,
  className,
  trackClassName,
  itemSpacingClassName = 'pr-8',
  children,
}: InfiniteLogoRailProps) {
  /* ---------------- reduced motion ---------------- */
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(mq.matches);
    queueMicrotask(sync);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* ---------------- pause state ---------------- */
  /** Paused when EITHER the pointer is over the rail OR an interactive
   *  child has focus. Both conditions are tracked independently so
   *  that e.g. focusing a link and then moving the pointer away keeps
   *  the rail paused until focus leaves. */
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const [focusPaused, setFocusPaused] = React.useState(false);

  const isPaused = hoverPaused || focusPaused;

  /* ---------------- reduced-motion fallback ---------------- */
  if (prefersReducedMotion) {
    return (
      <ReducedMotionRail
        ariaLabel={ariaLabel}
        className={className}
        itemSpacingClassName={itemSpacingClassName}
      >
        {children}
      </ReducedMotionRail>
    );
  }

  /* ---------------- animated rail ---------------- */
  return (
    <div
      className={cn(
        // NOTE: no edge mask. A previous 48px mask-image fade made
        // logos at the viewport edges look partially transparent, which
        // read as "still loading". The rail moves continuously, so any
        // fade that overlaps logo glyphs is visible. Removing the mask
        // keeps every logo fully opaque right up to the hard clip edge.
        'relative w-full overflow-hidden',
        className,
      )}
      onPointerEnter={pauseOnHover ? () => setHoverPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setHoverPaused(false) : undefined}
      onFocusCapture={pauseOnFocus ? () => setFocusPaused(true) : undefined}
      onBlurCapture={pauseOnFocus ? handleBlurred : undefined}
    >
      {/*
        The track is a single flex row. It contains TWO <ul> groups
        (Group A semantic, Group B aria-hidden clone) laid end-to-end
        with NO gap between them. Each <li> cell carries its own
        trailing spacing via itemSpacingClassName, so the gap between
        the last item of Group A and the first item of Group B is
        identical to every other inter-item gap. The total track width
        is therefore exactly 2 × GroupA_width, and the logo-rail-scroll
        keyframe (translateX 0 → -50%) moves the strip by exactly one
        group width — mathematically seamless.
      */}
      <div
        aria-label={ariaLabel}
        role="region"
        className={cn('infinite-logo-rail-track w-max', trackClassName)}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Group A — real semantic items, normal tab order. */}
        <ul className="flex list-none m-0 p-0" aria-label={ariaLabel}>
          {renderItems(children, { clone: false, itemSpacingClassName })}
        </ul>

        {/* Group B — visual clone only. aria-hidden removes it from
            the accessibility tree; deepDisableInteractive removes
            every cloned link/button from the keyboard tab order and
            strips href so clones cannot be activated. */}
        <ul className="flex list-none m-0 p-0" aria-hidden="true">
          {renderItems(children, { clone: true, itemSpacingClassName })}
        </ul>
      </div>
    </div>
  );

  /* ---------------- helpers ---------------- */

  /**
   * When focus leaves the rail entirely, resume. We inspect
   * relatedTarget because onBlurCapture fires for every focus move
   * between elements inside the rail — we only want to resume when
   * focus truly leaves the rail container.
   */
  function handleBlurred(e: React.FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) {
      // Focus moved to another element inside the rail — stay paused.
      return;
    }
    setFocusPaused(false);
  }
}

/* ------------------------------------------------------------------ */
/*  Item rendering                                                     */
/* ------------------------------------------------------------------ */

/**
 * Render the rail items as `<li>` cells. The `clone` flag controls
 * whether interactive elements are stripped from the tab order.
 * Cloned items also receive a stable, suffixed React key so React
 * does not complain about duplicate keys across the two groups.
 *
 * We intentionally do NOT spread `[...items, ...items]` at the data
 * layer — the canonical input is one list, and the clone is clearly
 * separated here at the render layer (see task spec §26).
 */
function renderItems(
  children: React.ReactNode,
  opts: { clone: boolean; itemSpacingClassName: string },
): React.ReactNode {
  const items = React.Children.toArray(children);
  return items.map((child, index) => {
    if (!React.isValidElement(child)) return child;
    const key = (child.key ?? index) as string | number;
    const itemKey = opts.clone ? `${key}__clone` : key;
    const cellClassName = cn('shrink-0', opts.itemSpacingClassName);
    if (opts.clone) {
      return (
        <li key={itemKey} aria-hidden="true" className={cellClassName}>
          {deepDisableInteractive(child)}
        </li>
      );
    }
    return (
      <li key={itemKey} className={cellClassName}>
        {child}
      </li>
    );
  });
}

/**
 * Recursively walk a cloned element tree and neutralise every
 * interactive element so the duplicate group is unreachable by
 * keyboard and unannounced by screen readers.
 *
 * - `<a>` / `<button>` / anything with `tabIndex` → `tabIndex={-1}`,
 *   `aria-hidden="true"`.
 * - `<a>` elements also have `href` stripped so they cannot be
 *   activated even by stray pointer events on the duplicated group.
 * - Other elements are passed through; their children are walked.
 *
 * We do this by cloning each element with the merged props. This is
 * the React-idiomatic way to alter a tree we did not author.
 */
function deepDisableInteractive(node: React.ReactElement): React.ReactElement {
  const props = node.props as Record<string, unknown> & { children?: React.ReactNode };
  const type = node.type;

  const isInteractive =
    type === 'a' ||
    type === 'button' ||
    typeof props.tabIndex === 'number' ||
    typeof props.tabIndex === 'string' ||
    props.role === 'link' ||
    props.role === 'button';

  const newProps: Record<string, unknown> = {
    ...props,
    tabIndex: -1,
    'aria-hidden': true,
  };
  // Defensively strip href from cloned anchors so they cannot be
  // activated even by stray pointer events on the duplicated group.
  if (type === 'a') {
    newProps.href = undefined;
  }
  // Recurse into children.
  if (props.children !== undefined && props.children !== null) {
    newProps.children = React.Children.map(props.children, (c) => {
      if (React.isValidElement(c)) {
        return deepDisableInteractive(c);
      }
      return c;
    });
  }
  // Keep the focus-visible ring off the clones too.
  if (isInteractive) {
    newProps.className = cn(
      typeof props.className === 'string' ? props.className : undefined,
      'focus-visible:outline-none focus-visible:ring-0',
    );
  }
  return React.cloneElement(node, newProps);
}

/* ------------------------------------------------------------------ */
/*  Reduced-motion fallback                                            */
/* ------------------------------------------------------------------ */

function ReducedMotionRail({
  ariaLabel,
  className,
  itemSpacingClassName,
  children,
}: {
  ariaLabel: string;
  className?: string;
  itemSpacingClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-x-auto scrollbar-hidden',
        '[scroll-snap-type:x_mandatory]',
        '-webkit-overflow-scrolling:touch',
        className,
      )}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <ul className="flex list-none m-0 p-0" aria-label={ariaLabel}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          const key = (child.key ?? index) as string | number;
          return (
            <li key={key} className={cn('shrink-0 snap-start', itemSpacingClassName)}>
              {child}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default InfiniteLogoRail;
