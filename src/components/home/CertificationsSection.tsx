'use client';

import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { InfiniteLogoRail } from '@/components/ui/InfiniteLogoRail';
import { allTrustMarks } from '@/data/trust';

/**
 * CertificationsSection — homepage certifications, testing and
 * registrations rail.
 *
 * Interaction model: a seamless, continuously moving horizontal logo
 * rail (InfiniteLogoRail) that drifts right → left at a calm, linear
 * speed. The loop is mathematically seamless — no visible jump. The
 * rail pauses on hover and on keyboard focus, and falls back to a
 * static scrollable rail under `prefers-reduced-motion: reduce`.
 *
 * Visual model: a clean corporate certification strip where the LOGOS
 * are the focus — no boxed cards, no tinted backgrounds, no shadows.
 * Each mark shows LOGO + NAME only (no long description).
 * For marks with an attached document, the item itself is an
 * interactive link that opens the PDF. A subtle "Download" pill
 * appears on hover/focus.
 *
 * Logo → name gap is intentionally tight (gap-1.5) for a compact,
 * premium feel. Logo heights are slightly enlarged (~15%) for
 * better recognisability.
 *
 * Item cell widths are fixed responsively so the rail reserves its
 * layout before images load (no CLS).
 *
 * Spacing: mb-4 on the header wrapper keeps the gap between the
 * SectionHeader and the logo rail tight and visually balanced.
 */
export default function CertificationsSection() {
  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule className="reveal-up">
      <div className="reveal-up mb-4">
        <SectionHeader
          eyebrow="CERTIFICATIONS & MEMBERSHIPS"
          title="Industry Certifications, Testing & Registrations"
          supportingText="We are proudly affiliated with several esteemed organizations in the rubber industry. Our up-to-date certifications reflect our ongoing commitment to delivering value to our clients' businesses."
        />
      </div>

      <div className="reveal-up pb-2">
        <InfiniteLogoRail
          ariaLabel="Certifications, testing and registrations"
          duration={42}
          pauseOnHover
          pauseOnFocus
          itemSpacingClassName="pr-2 sm:pr-3 md:pr-4"
        >
          {allTrustMarks.map((mark) => {
            const isDownloadable = !!mark.document;

            const inner = (
              <>
                {/* Logo — large, clean, no box. object-contain never crops.
                    Slightly enlarged (~15%) for better recognisability.
                    Eager + unoptimized: these are tiny local WebP identity
                    assets drifting through a continuously moving rail. */}
                <span className="relative flex aspect-[3/2] w-full items-center justify-center">
                  <Image
                    src={mark.logo}
                    alt={mark.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 639px) 115px, (max-width: 767px) 130px, (max-width: 1023px) 145px, 155px"
                    loading="eager"
                    unoptimized
                  />
                </span>
                {/* Certification name — logo + name only, no description */}
                <span className="text-metadata text-center font-semibold text-be-charcoal-950 leading-tight">
                  {mark.label}
                </span>


              </>
            );

            if (isDownloadable) {
              return (
                <a
                  key={mark.label}
                  href={mark.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download ${mark.label} document`}
                  className="group/mark w-[115px] sm:w-[130px] md:w-[145px] lg:w-[150px] xl:w-[155px] flex flex-col items-center gap-1.5 py-1 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
                >
                  {inner}
                </a>
              );
            }

            return (
              <div
                key={mark.label}
                className="w-[115px] sm:w-[130px] md:w-[145px] lg:w-[150px] xl:w-[155px] flex flex-col items-center gap-1.5 py-1"
              >
                {inner}
              </div>
            );
          })}
        </InfiniteLogoRail>
      </div>
    </SectionShell>
  );
}
