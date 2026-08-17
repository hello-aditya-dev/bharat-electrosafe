'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * StatCounter — Client Component.
 *
 * Wraps a statistic number with a count-up animation that triggers
 * once when the element enters the viewport. The final value is
 * server-rendered in the HTML for SEO/accessibility; the animated
 * visual span is aria-hidden while a sr-only span preserves the
 * real value for screen readers.
 *
 * Props:
 *   - value: display string like "9+", "2,380+"
 *   - className: Tailwind classes for the number span (passed from parent)
 *
 * Animation:
 *   - Duration: ~900ms, ease-out (cubic)
 *   - Triggers once via IntersectionObserver
 *   - Skips animation if prefers-reduced-motion
 *   - Uses tabular-nums to prevent width jitter
 */

interface StatCounterProps {
  value: string;
  className?: string;
}

/** Parse "2,380+" → { numeric: 2380, suffix: "+" } */
function parseValue(raw: string): { numeric: number; suffix: string } {
  // Remove commas, then split trailing non-digit chars
  const noCommas = raw.replace(/,/g, '');
  const match = noCommas.match(/^(\d+)(.*)$/);
  if (!match) return { numeric: 0, suffix: raw };
  return { numeric: parseInt(match[1], 10), suffix: match[2] };
}

/** Format a number with commas: 2380 → "2,380" */
function formatWithCommas(n: number): string {
  return n.toLocaleString('en-US');
}

/** Ease-out cubic: fast start, slow end */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatCounter({ value, className }: StatCounterProps) {
  const { numeric, suffix } = parseValue(value);
  const visualRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const spanEl = visualRef.current;
    if (!spanEl) return;

    // If prefers-reduced-motion, show final value immediately
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      // Use microtask to avoid synchronous setState in effect
      queueMicrotask(() => setDisplayValue(value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const duration = 900; // ms
        const start = performance.now();

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutCubic(progress);
          const current = Math.round(easedProgress * numeric);

          setDisplayValue(formatWithCommas(current) + suffix);

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.1 },
    );

    observer.observe(spanEl);

    return () => observer.disconnect();
  }, [value, numeric, suffix]);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {/* Visual animated number — hidden from screen readers */}
      <span aria-hidden="true" ref={visualRef}>
        {displayValue}
      </span>
      {/* Screen-reader-only: always the final value */}
      <span className="sr-only">{value}</span>
    </span>
  );
}
