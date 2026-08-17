'use client';

import { useEffect, useRef } from 'react';

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '25+', label: 'Years of experience' },
  { value: '5', label: 'Product families' },
  { value: '6', label: 'Industries served' },
];

export default function AboutStats() {
  const staggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!staggerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(staggerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Company statistics"
      className="bg-be-cream section-padding-supporting page-horizontal-padding"
    >
      <div className="container-site">
        <div
          ref={staggerRef}
          className="stagger-reveal grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-3">
              {/* Large number */}
              <span className="text-4xl font-bold text-be-charcoal-950 tabular-nums">
                {stat.value}
              </span>

              {/* Yellow accent line */}
              <div className="h-1 w-12 bg-be-yellow-500 rounded-full" />

              {/* Label */}
              <span className="text-metadata text-be-grey-650 uppercase tracking-wider leading-relaxed">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
