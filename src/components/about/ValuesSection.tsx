'use client';

import { SectionShell } from '@/components/ui/SectionShell';
import { companyValues } from '@/data/team';
import { ShieldCheck, BadgeCheck, HeadsetIcon, Sparkles, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * ValuesSection — Company values section.
 *
 * Uses the verified value names and copy from team.ts companyValues.
 * Blue/yellow palette with icon mapping for visual distinction.
 *
 * Content source: src/data/team.ts (verified).
 */

const iconMap: Record<string, LucideIcon> = {
  Quality: ShieldCheck,
  Responsibility: BadgeCheck,
  'Customer Focus': HeadsetIcon,
  'Continuous Improvement': Sparkles,
  Teamwork: Users,
};

/** Map of value title → accent colour class for the icon background */
const accentMap: Record<string, string> = {
  Quality: 'bg-be-navy-800',
  Responsibility: 'bg-be-yellow-500',
  'Customer Focus': 'bg-be-navy-700',
  'Continuous Improvement': 'bg-be-yellow-400',
  Teamwork: 'bg-be-navy-600',
};

/** Icon colour class */
const iconColourMap: Record<string, string> = {
  Quality: 'text-be-white',
  Responsibility: 'text-be-charcoal-950',
  'Customer Focus': 'text-be-white',
  'Continuous Improvement': 'text-be-charcoal-950',
  Teamwork: 'text-be-white',
};

/** Only the Value entries (skip Mission & Vision which have their own section) */
const values = companyValues.filter(
  (v) => v.title !== 'Mission' && v.title !== 'Vision',
);

export default function ValuesSection() {
  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      <div className="reveal-up mb-10">
        <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-3">
          Core Values
        </p>
        <h2 className="text-section-h2 text-be-charcoal-950 accent-line-yellow">
          The principles that guide us
        </h2>
        <p className="text-body-large text-be-grey-650 max-w-xl mt-3">
          These core values shape every decision — from product specification
          and manufacturing to customer support and documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => {
          const Icon = iconMap[value.title] ?? ShieldCheck;
          const accent = accentMap[value.title] ?? 'bg-be-navy-800';
          const iconColour = iconColourMap[value.title] ?? 'text-be-white';

          return (
            <div
              key={value.title}
              className="reveal-up flex flex-col gap-4 rounded-lg border border-be-grey-250 bg-be-warm-white p-6 hover-card-lift"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {/* Icon badge */}
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-lg ${accent}`}
              >
                <Icon
                  className={`h-5 w-5 ${iconColour}`}
                  aria-hidden="true"
                  focusable="false"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-be-charcoal-950 tracking-tight">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-body text-be-grey-650 leading-relaxed">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
