'use client';

import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { capabilityPoints } from '@/data/trust';
import { companyValues } from '@/data/team';
import { CheckCircle2, ShieldCheck, BadgeCheck, HeadsetIcon, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * WhyBharatElectrosafe — "Why Bharat Electrosafe" section.
 *
 * Balanced 2-column editorial layout:
 *   LEFT  — Section header + capability list + Core Values cards
 *   RIGHT — Core Values image (top-aligned) + Manufacturing & Quality card
 *
 * Layout principles:
 *   - Both columns start at the same vertical level (items-start)
 *   - Right column self-starts (no stretch) so image sits at the top
 *   - Core Values image aligns with the upper portion of the left content
 *   - Manufacturing card sits directly beneath the image with 24-32px gap
 *   - Core Values cards are a deliberate subsection with consistent styling
 *   - Responsive: collapses to single column on tablet/mobile
 *
 * Content sources: src/data/trust.ts capabilityPoints,
 *                  src/data/team.ts companyValues.
 */

const iconMap: Record<string, LucideIcon> = {
  Respect: ShieldCheck,
  Trust: BadgeCheck,
  Ownership: HeadsetIcon,
  'Integrated Team Work': Users,
};

/** Only the core values (not Mission/Vision — those are in BrandsVisionMission) */
const values = companyValues.filter(
  (v) => v.title !== 'Mission' && v.title !== 'Vision',
);

/** Cap the capability points to max 6 for compact layout */
const displayCapabilities = capabilityPoints.slice(0, 6);

export default function WhyBharatElectrosafe() {
  return (
    <SectionShell variant="standard" bg="bg-be-cream">
      {/* Two-column editorial layout — balanced 58/42 split */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:w-[58%]">
          {/* Section header */}
          <div className="reveal-up mb-8">
            <SectionHeader
              eyebrow="Why Bharat Electrosafe"
              title="Capabilities and values that set us apart"
              supportingText="Every capability claim is traceable to our documented manufacturing and product credentials. Our values shape every decision — from specification to support."
            />
          </div>

          {/* Capability list */}
          <ul className="flex flex-col gap-4 mb-10">
            {displayCapabilities.map((point, index) => (
              <li
                key={point.title}
                className="reveal-up flex items-start gap-3"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CheckCircle2
                  className="h-5 w-5 text-be-yellow-text mt-0.5 shrink-0"
                  aria-hidden="true"
                  focusable="false"
                />
                <div>
                  <p className="text-sm font-semibold text-be-charcoal-950 leading-snug">
                    {point.title}
                  </p>
                  <p className="text-body text-be-grey-650 mt-1">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Core Values — deliberate subsection with 2×2 compact cards */}
          <div className="reveal-up">
            <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-4">
              Core Values
            </p>
            <div className="grid grid-cols-2 gap-3">
              {values.map((value) => {
                const Icon = iconMap[value.title] ?? ShieldCheck;
                return (
                  <div
                    key={value.title}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg border border-be-grey-250 bg-be-white"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-be-navy-800 shrink-0">
                      <Icon
                        className="h-3.5 w-3.5 text-be-white"
                        aria-hidden="true"
                        focusable="false"
                      />
                    </div>
                    <p className="text-xs font-bold text-be-charcoal-950 tracking-tight leading-tight">
                      {value.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:w-[42%] reveal-up lg:self-start">
          {/* Core Values image — top-aligned to sit alongside capability list */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/media/about/core-values.webp"
              alt="Bharat Electrosafe Core Values artwork showing Respect, Trust, Ownership and Integrated Team Work"
              width={700}
              height={500}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>

          {/* Manufacturing & Quality card — visually connected to image above */}
          <div className="mt-6 rounded-lg border border-be-grey-250 bg-be-white p-5">
            <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-2">
              Manufacturing &amp; Quality
            </p>
            <p className="text-body text-be-grey-650 leading-relaxed">
              Standard and project-specific insulating-mat configurations with
              options for class, thickness, surface pattern, dimensions and
              visible-safety markings. Three-stage quality: raw material
              inspection → in-process testing → final product documentation.
              IS&nbsp;15652:2006, BIS licensed, ERDA/NTH tested.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
