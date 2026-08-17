'use client';

import { Target, Compass } from 'lucide-react';

/**
 * BrandsVisionMission — Vision/Mission section.
 *
 * Design:
 *   One deep-navy section containing:
 *     1. Section heading (eyebrow + title)
 *     2. One shared Vision/Mission panel (lighter navy, 2-col, subtle divider)
 *
 * Contrast rule: all body text on navy uses rgba white ~78%.
 * No dark-grey/black text on navy. No navy-on-navy cards.
 */

/* ── Vision / Mission text ── */
const vision =
  'To become India\u2019s most trusted and preferred brand in electrical safety, industrial safety, infrastructure protection, PVC flooring, and waterproofing solutions by delivering innovative, high-quality, and standards-compliant products that contribute to safer workplaces and stronger infrastructure.';

const mission =
  'To protect lives, assets, and infrastructure by providing reliable, durable, and high-performance safety and protection solutions that meet the highest quality standards, support industrial growth, and strengthen the nation\u2019s development under the Make in India initiative.';

export default function BrandsVisionMission() {
  return (
    <section className="relative bg-be-navy-900" aria-label="Vision and Mission">
      {/* ── Section content ── */}
      <div className="container-site page-horizontal-padding py-16 md:py-20">

        {/* ── Heading ── */}
        <div className="reveal-up mb-10 md:mb-12">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-be-yellow-400 mb-2.5">
            Vision &amp; Mission
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-white tracking-tight leading-snug mb-3">
            Clear products, documented requirements and practical project support.
          </h2>
        </div>

        {/* ── Vision / Mission Panel ── */}
        <div className="rounded-2xl bg-be-navy-800/70 border border-be-navy-600/30 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">

            {/* Vision */}
            <div className="lg:w-1/2 reveal-up lg:pr-8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-be-yellow-500/15">
                  <Compass className="h-4.5 w-4.5 text-be-yellow-400" aria-hidden="true" />
                </div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-be-yellow-400">
                  Our Vision
                </p>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight">
                Where we aspire to be
              </h3>
              <p className="text-[0.9375rem] text-white/78 leading-relaxed">
                {vision}
              </p>
            </div>

            {/* Vertical divider — desktop only */}
            <div className="hidden lg:block w-px self-stretch bg-white/10" aria-hidden="true" />

            {/* Mobile divider */}
            <div className="lg:hidden h-px bg-white/10" aria-hidden="true" />

            {/* Mission */}
            <div className="lg:w-1/2 reveal-up lg:pl-8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-be-yellow-500/15">
                  <Target className="h-4.5 w-4.5 text-be-yellow-400" aria-hidden="true" />
                </div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-be-yellow-400">
                  Our Mission
                </p>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight">
                What drives us
              </h3>
              <p className="text-[0.9375rem] text-white/78 leading-relaxed">
                {mission}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
