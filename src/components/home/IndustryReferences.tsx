'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { InfiniteLogoRail } from '@/components/ui/InfiniteLogoRail';
import {
  organisationReferences,
  organisationReferenceEyebrow,
  organisationReferenceTitle,
  organisationReferenceNote,
} from '@/data/trust';
import { selectedClients } from '@/data/selected-clients';

/**
 * IndustryReferences — homepage industry references rail.
 *
 * Rendered as its own section immediately after Capability (per final
 * homepage production pass). Information architecture:
 *   Header → Hero → Statistics → Product Range → Certifications →
 *   Capability → Industry References → FAQ → Footer.
 *
 * Interaction model: a seamless, continuously moving horizontal logo
 * rail (InfiniteLogoRail) — the same interaction as the Certifications
 * section above, but slightly faster (32 s vs 42 s) because the
 * content is simpler. Pauses on hover/focus; falls back to a static
 * scrollable rail under reduced motion.
 *
 * Below the logo rail, a "View all clients" disclosure button expands
 * to show the full selected-client list in a responsive grid. Uses
 * aria-expanded, aria-controls, and keyboard accessibility.
 *
 * Visual model: a clean editorial logo rail — no boxed cards, no
 * borders, no shadows. Logos sit on the same white background used
 * for Certifications, with the organisation name beneath each.
 * Logos are enlarged for prominence; inter-logo spacing is tight
 * so the row reads as a dense, premium brand strip.
 *
 * Organisations are presented as references. The client-approved
 * heading and supporting copy are used verbatim; no stronger claim
 * ("our clients include", "partnered with") is introduced elsewhere.
 * Trademarks and organisation names are never altered.
 */

const CLIENT_PANEL_ID = 'industry-references-client-panel';

export default function IndustryReferences() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <SectionShell variant="compact" bg="bg-be-white" topRule className="reveal-up">
      <div className="reveal-up mb-6">
        <SectionHeader
          eyebrow={organisationReferenceEyebrow}
          title={organisationReferenceTitle}
          supportingText={organisationReferenceNote}
        />
      </div>

      <div className="reveal-up">
        <InfiniteLogoRail
          ariaLabel="Industry references"
          duration={32}
          pauseOnHover
          pauseOnFocus
          itemSpacingClassName="pr-3 sm:pr-4 md:pr-5"
        >
          {organisationReferences.map((org) => (
            <div
              key={org.name}
              className="w-[125px] sm:w-[140px] md:w-[150px] lg:w-[160px] xl:w-[165px] flex flex-col items-center gap-3 py-1"
            >
              {/* Logo — large, clean, no box. object-contain never crops.
                  Eager + unoptimized: these are tiny local WebP identity
                  assets drifting through a continuously moving rail, so
                  they must be fetched/decoded immediately and served
                  directly (no Next image-optimization hop). No priority
                  is set so these never compete with hero/above-the-fold
                  resources. */}
              <div className="relative h-[74px] sm:h-[88px] md:h-[98px] lg:h-[104px] w-full flex items-center justify-center">
                <Image
                  src={org.logo}
                  alt={`${org.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 639px) 125px, (max-width: 767px) 140px, (max-width: 1023px) 150px, 165px"
                  loading="eager"
                  unoptimized
                />
              </div>
              <span className="text-metadata font-semibold text-be-charcoal-950 text-center leading-tight">
                {org.name}
              </span>
            </div>
          ))}
        </InfiniteLogoRail>
      </div>

      {/* ── "View all clients" disclosure ── */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={CLIENT_PANEL_ID}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-be-charcoal-800 border border-be-grey-250 bg-be-white hover:bg-be-cream hover:border-be-yellow-400 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 min-h-[44px]"
        >
          <svg
            className={`size-4 text-be-yellow-text transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          {expanded ? 'Show fewer' : 'View all clients'}
        </button>

        {/* Expandable client list panel */}
        <div
          id={CLIENT_PANEL_ID}
          role="region"
          aria-label="Full client list"
          className={`mt-4 transition-all duration-300 ease-in-out ${
            expanded
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-be-cream/50 border border-be-grey-200/60">
            {selectedClients.map((client) => (
              <div
                key={client.name}
                className="flex items-center px-3 py-2.5 rounded-lg bg-be-white border border-be-grey-150/60 shadow-sm"
              >
                <span className="text-sm font-medium text-be-charcoal-950 leading-tight">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
