import { Globe, Users, LayoutGrid, ShieldCheck, Briefcase, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { companyStatistics, type StatIconKey } from '@/data/trust';
import { AnimatedStatValue } from '@/components/home/AnimatedStatValue';

/**
 * StatisticsStrip — Server Component.
 *
 * Compact horizontal strip showing four company credibility statistics
 * below the homepage hero.
 *
 * Design:
 *   - Warm cream background with subtle gradient
 *   - Navy/dark blue primary numbers (animated count-up on scroll)
 *   - Muted labels
 *   - Small circular yellow-accent icons with soft glow
 *   - Thin top/bottom separators (border-y)
 *   - Card-based layout with hover lift micro-interaction
 *   - Centered content
 *   - Desktop: 4 columns in one row
 *   - Tablet: 2×2
 *   - Mobile: 2×2
 *
 * Data sourced from `companyStatistics` in `src/data/trust.ts`.
 * Product Groups is sourced from `productGroupCount` (4 top-level groups).
 *
 * Animation: numbers count up from 0 when scrolled into view
 * (progressive enhancement — values render immediately as text,
 * the animation is purely decorative).
 */

/** Map icon key to Lucide component. */
const iconMap: Record<StatIconKey, LucideIcon> = {
  globe: Globe,
  users: Users,
  grid: LayoutGrid,
  shield: ShieldCheck,
  briefcase: Briefcase,
  award: Award,
};

export default function StatisticsStrip() {
  return (
    <section
      className="reveal-up relative bg-gradient-to-b from-be-cream/60 via-be-cream/40 to-be-warm-white border-y border-be-grey-200/80 overflow-hidden"
      aria-label="Company statistics"
    >
      {/* Decorative top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-24 bg-gradient-to-r from-transparent via-be-yellow-500 to-transparent"
      />
      <div className="container-site page-horizontal-padding py-3 sm:py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {companyStatistics.map((stat, idx) => {
            const Icon = iconMap[stat.icon];
            return (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center text-center gap-1.5 p-2 sm:p-3 rounded-xl bg-be-white/80 border border-be-grey-150/60 shadow-sm hover:shadow-md hover:bg-be-white hover:-translate-y-0.5 hover:border-be-yellow-200 transition-all duration-300"
                style={{ transitionDelay: `${idx * 30}ms` }}
              >
                {/* Icon — circular yellow-accent with soft glow, scales on hover */}
                <div className="flex items-center justify-center size-8 rounded-full bg-be-yellow-50 border border-be-yellow-200/60 shadow-[0_0_8px_rgba(244,195,19,0.12)] group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(244,195,19,0.25)] transition-all duration-300">
                  <Icon
                    className="size-[14px] text-be-yellow-text group-hover:text-be-yellow-text-hover transition-colors"
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                {/* Value — bold, navy, large with tabular-nums + count-up animation */}
                <AnimatedStatValue
                  value={stat.value}
                  className="text-xl sm:text-2xl font-bold tracking-tight text-be-navy-800 leading-none tabular-nums"
                />
                {/* Label — small, muted, uppercase tracking */}
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-be-grey-500 leading-snug uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Subtle footnote for company-stated figures */}
        <p className="mt-2 text-center text-[0.625rem] sm:text-[0.6875rem] text-be-grey-400 leading-none">
          Figures are company-stated.
        </p>
      </div>
    </section>
  );
}
