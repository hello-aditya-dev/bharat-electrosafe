'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollProgress — a thin yellow reading-progress bar fixed at the very
 * bottom edge of the sticky navy header. It grows from 0% → 100% as the
 * user scrolls through the page, giving a premium editorial feel and a
 * subtle sense of position in long content.
 *
 * Implementation notes:
 *   • Uses requestAnimationFrame-throttled scroll listener so it stays
 *     smooth even on pages with many scroll handlers.
 *   • Reduced-motion: the bar still reflects progress (it is a state
 *     indicator, not a decorative animation) but the width transition is
 *     disabled via a CSS media query (see globals.css), so it jumps to
 *     the correct value instead of animating.
 *   • Rendered absolutely inside the header so it sits on the header's
 *     bottom border. Pointer-events none so it never intercepts clicks.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="be-scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/5"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-be-brand-yellow via-be-yellow-400 to-be-brand-yellow"
        style={{
          width: `${progress}%`,
          transition: 'width 0.08s linear',
          boxShadow: '0 0 6px rgba(244, 195, 19, 0.55)',
        }}
      />
    </div>
  );
}
