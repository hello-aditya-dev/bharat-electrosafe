'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface HorizontalCarouselProps {
  /** Accessible label for the carousel region */
  label: string;
  /** Auto-advance interval in ms (0 = disabled). Defaults to 0. */
  autoAdvanceMs?: number;
  /** Additional class for the carousel root container */
  className?: string;
  /** Children — each child is treated as a carousel item */
  children: React.ReactNode;
  /** Show arrow controls (default true) */
  showArrows?: boolean;
  /**
   * Optional gap class for the scrollable track (e.g. "gap-2 sm:gap-3").
   * Defaults to "gap-4". Only affects THIS carousel instance — existing
   * consumers that omit the prop retain the original spacing.
   */
  gapClassName?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** After manual interaction, wait this long before resuming auto-advance */
const RESUME_DELAY_MS = 5000;
/** Minimum auto-advance interval (ms) — prevents accidental rapid cycling */
const MIN_AUTO_ADVANCE_MS = 2000;
/** Default auto-advance value — disabled */
const DEFAULT_AUTO_ADVANCE_MS = 0;
/** Scroll distance for programmatic arrow clicks (px) */
const SCROLL_STEP_PX = 300;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HorizontalCarousel({
  label,
  autoAdvanceMs = DEFAULT_AUTO_ADVANCE_MS,
  className,
  children,
  showArrows = true,
  gapClassName,
}: HorizontalCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  /* ---- Auto-advance refs ---- */
  const autoAdvanceEnabled = autoAdvanceMs >= MIN_AUTO_ADVANCE_MS;
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = React.useRef(false);

  /* ---- Reduced motion ---- */
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Use microtask to avoid synchronous setState in effect
    queueMicrotask(() => setPrefersReducedMotion(mq.matches));
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const shouldAutoAdvance = autoAdvanceEnabled && !prefersReducedMotion;

  /* ---------------------------------------------------------------- */
  /*  Scroll-boundary detection                                       */
  /* ---------------------------------------------------------------- */

  const updateScrollButtons = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Auto-advance helpers                                            */
  /* ---------------------------------------------------------------- */

  const clearAutoAdvance = React.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoAdvance = React.useCallback(() => {
    clearAutoAdvance();
    if (!shouldAutoAdvance || isPausedRef.current) return;
    const interval = Math.max(autoAdvanceMs, MIN_AUTO_ADVANCE_MS);
    // Small random jitter (±500ms) so multiple carousels don't cycle in lock-step
    const jitter = Math.round((Math.random() - 0.5) * 1000);
    intervalRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      // Wrap to start at end
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: SCROLL_STEP_PX, behavior: 'smooth' });
      }
    }, interval + jitter);
  }, [shouldAutoAdvance, autoAdvanceMs, clearAutoAdvance]);

  const pauseAutoAdvance = React.useCallback(() => {
    isPausedRef.current = true;
    clearAutoAdvance();
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      startAutoAdvance();
    }, RESUME_DELAY_MS);
  }, [clearAutoAdvance, startAutoAdvance]);

  /* ---------------------------------------------------------------- */
  /*  Effects                                                         */
  /* ---------------------------------------------------------------- */

  // Observe scroll boundaries
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollButtons, children]);

  // Auto-advance lifecycle
  React.useEffect(() => {
    if (shouldAutoAdvance) startAutoAdvance();
    return () => {
      clearAutoAdvance();
      if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    };
  }, [shouldAutoAdvance, startAutoAdvance, clearAutoAdvance]);

  /* ---------------------------------------------------------------- */
  /*  Event handlers                                                  */
  /* ---------------------------------------------------------------- */

  const scrollByStep = React.useCallback(
    (direction: -1 | 1) => {
      scrollRef.current?.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: 'smooth' });
      pauseAutoAdvance();
    },
    [pauseAutoAdvance],
  );

  /** Pause on pointer enter (hover) */
  const handlePointerEnter = React.useCallback(() => {
    isPausedRef.current = true;
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  /** Resume on pointer leave — unless a resume timer is pending */
  const handlePointerLeave = React.useCallback(() => {
    if (resumeTimerRef.current !== null) return;
    isPausedRef.current = false;
    startAutoAdvance();
  }, [startAutoAdvance]);

  /** Pause on focus-within */
  const handleFocusWithin = React.useCallback(() => {
    isPausedRef.current = true;
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  /** Resume on blur-within — unless a resume timer is pending */
  const handleBlurWithin = React.useCallback(() => {
    if (resumeTimerRef.current !== null) return;
    isPausedRef.current = false;
    startAutoAdvance();
  }, [startAutoAdvance]);

  /** Detect drag / swipe for auto-advance pausing */
  const isDraggingRef = React.useRef(false);

  const handlePointerDown = React.useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handlePointerUp = React.useCallback(() => {
    // Small delay so the scroll event from the drag fires first
    setTimeout(() => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        pauseAutoAdvance();
      }
    }, 100);
  }, [pauseAutoAdvance]);

  /** Keyboard: arrow keys scroll the carousel */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollByStep(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollByStep(-1);
      }
    },
    [scrollByStep],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  const items = React.Children.map(children, (child) => (
    <div className="shrink-0 snap-start" style={{ scrollSnapAlign: 'start' }}>
      {child}
    </div>
  ));

  return (
    <div
      className={['relative group/carousel', className].filter(Boolean).join(' ')}
      onFocus={handleFocusWithin}
      onBlur={handleBlurWithin}
    >
      {/* Scrollable viewport */}
      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          'flex overflow-x-auto scrollbar-hidden snap-x snap-mandatory outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 rounded-sm',
          gapClassName ?? 'gap-4',
        )}
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={updateScrollButtons}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {items}
      </div>

      {/* Arrow controls */}
      {showArrows && (
        <>
          {/* Previous */}
          <button
            type="button"
            aria-label={`Previous – ${label}`}
            onClick={() => scrollByStep(-1)}
            className={[
              // Position inside viewport
              'absolute left-2 top-1/2 -translate-y-1/2 z-10',
              // Size — 40×40 with 44px minimum touch target
              'h-10 w-10 min-h-[44px] min-w-[44px] rounded-full',
              // Navy background: semi-transparent → solid on hover
              'bg-be-navy-900/80 text-white',
              'hover:bg-be-navy-900 focus-visible:bg-be-navy-900',
              'focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2',
              'outline-none transition-colors duration-150',
              // Visibility: show on desktop; show on mobile on group hover/focus
              'opacity-0 pointer-events-none',
              'md:opacity-100 md:pointer-events-auto',
              'group-hover/carousel:opacity-100 group-hover/carousel:pointer-events-auto',
              'group-focus-within/carousel:opacity-100 group-focus-within/carousel:pointer-events-auto',
              // Transition for smooth appear/disappear
              'transition-opacity duration-200',
            ].join(' ')}
            style={{
              // Override: hide when can't scroll in this direction
              opacity: canScrollLeft ? undefined : 0,
              pointerEvents: canScrollLeft ? undefined : 'none' as const,
            }}
          >
            <ChevronLeft className="h-5 w-5 mx-auto" aria-hidden="true" />
          </button>

          {/* Next */}
          <button
            type="button"
            aria-label={`Next – ${label}`}
            onClick={() => scrollByStep(1)}
            className={[
              'absolute right-2 top-1/2 -translate-y-1/2 z-10',
              'h-10 w-10 min-h-[44px] min-w-[44px] rounded-full',
              'bg-be-navy-900/80 text-white',
              'hover:bg-be-navy-900 focus-visible:bg-be-navy-900',
              'focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2',
              'outline-none transition-colors duration-150',
              'opacity-0 pointer-events-none',
              'md:opacity-100 md:pointer-events-auto',
              'group-hover/carousel:opacity-100 group-hover/carousel:pointer-events-auto',
              'group-focus-within/carousel:opacity-100 group-focus-within/carousel:pointer-events-auto',
              'transition-opacity duration-200',
            ].join(' ')}
            style={{
              opacity: canScrollRight ? undefined : 0,
              pointerEvents: canScrollRight ? undefined : 'none' as const,
            }}
          >
            <ChevronRight className="h-5 w-5 mx-auto" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

export default HorizontalCarousel;
