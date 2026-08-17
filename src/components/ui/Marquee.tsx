'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const SPEED_DURATION_MS: Record<NonNullable<MarqueeProps['speed']>, number> = {
  slow: 60_000,
  normal: 40_000,
  fast: 25_000,
};

export function Marquee({ items, className, speed = 'normal' }: MarqueeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (reducedMotion) {
    // Static grid fallback for reduced-motion users.
    return (
      <div
        className={cn(
          'w-full overflow-hidden py-3 bg-be-yellow-50/50 border-y border-be-grey-250',
          className
        )}
        aria-label="Certifications and standards"
      >
        <div className="container-site page-horizontal-padding">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 list-none p-0">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-metadata uppercase tracking-wider text-be-grey-650"
              >
                <span
                  aria-hidden="true"
                  className="size-1 rounded-full bg-be-yellow-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Duplicate items for seamless looping animation.
  const duplicated = [...items, ...items];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden py-3 bg-be-yellow-50/50 border-y border-be-grey-250',
        className
      )}
      aria-label="Certifications and standards"
    >
      <div
        className="logo-rail-track"
        style={{ animationDuration: `${SPEED_DURATION_MS[speed]}ms` }}
      >
        {duplicated.map((item, idx) => (
          <span
            key={`marquee-${idx}`}
            className="flex shrink-0 items-center gap-4 pr-4"
          >
            <span className="text-metadata uppercase tracking-wider text-be-grey-650 whitespace-nowrap">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-be-yellow-500"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
