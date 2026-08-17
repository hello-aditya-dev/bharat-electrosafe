'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * AnimatedStatValue — client-side count-up animation for statistic values.
 *
 * Parses the numeric prefix of a stat value (e.g. "11+", "1,000+", "6")
 * and animates from 0 to the target number when scrolled into view.
 *
 * Progressive enhancement:
 * - SSR renders the static value immediately (no layout shift).
 * - Animation only triggers when IntersectionObserver fires.
 * - If JS fails or observer never fires, the static value remains.
 * - Reduced-motion users see the final value instantly (no animation).
 *
 * Non-numeric suffixes (like "+", ",", "k", "%") are preserved.
 */

interface AnimatedStatValueProps {
  /** The display value, e.g. "11+", "1,000+", "6", "3". */
  value: string;
  /** Optional className for the rendered span. */
  className?: string;
  /** Animation duration in ms (default 1500). */
  duration?: number;
}

/** Parse "11+" → { num: 11, suffix: "+" }; "1,000+" → { num: 1000, suffix: "+" }. */
function parseValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return { num: NaN, prefix: '', suffix: '' };
  const [, prefix, numStr, suffix] = match;
  const num = parseInt(numStr.replace(/,/g, ''), 10);
  return { num, prefix, suffix };
}

/** Format a number back with commas if the original had them. */
function formatNumber(num: number, useCommas: boolean): string {
  if (!useCommas) return String(Math.round(num));
  return Math.round(num).toLocaleString('en-IN');
}

/**
 * External store for reduced-motion preference using matchMedia.
 * useSyncExternalStore requires a stable subscribe function that
 * registers a listener and returns an unsubscribe function.
 */
function subscribeReducedMotion(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function AnimatedStatValue({
  value,
  className,
  duration = 1500,
}: AnimatedStatValueProps) {
  const { num, prefix, suffix } = parseValue(value);
  const hasCommas = value.includes(',');
  const spanRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const animatedRef = useRef(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (Number.isNaN(num)) return;
    if (prefersReducedMotion) return;

    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const startTime = performance.now();

            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const current = num * eased;
              setDisplayValue(`${prefix}${formatNumber(current, hasCommas)}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setDisplayValue(value);
              }
            };

            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, prefix, suffix, value, hasCommas, duration, prefersReducedMotion]);

  return (
    <span ref={spanRef} className={className} aria-label={value}>
      {displayValue}
    </span>
  );
}
