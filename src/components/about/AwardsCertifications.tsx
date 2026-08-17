'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { InfiniteLogoRail } from '@/components/ui/InfiniteLogoRail';
import { awards, allTrustMarks } from '@/data/trust';

/**
 * About-page recognition section.
 *
 * Awards are presented in a responsive looping carousel using
 * embla-carousel-react with auto-advance.
 *
 * Certifications, testing and memberships use the same InfiniteLogoRail
 * component as the homepage — a seamless, continuously moving horizontal
 * rail that drifts right → left. The loop is mathematically seamless
 * (no visible jump), pauses on hover/focus, and falls back to a static
 * scrollable rail under prefers-reduced-motion.
 *
 * Certification cards show LOGO + NAME only — no long description.
 * Logo → name gap is tight (gap-1.5) with no empty vertical whitespace.
 *
 * The certification header and logo rail are wrapped in a tighter
 * flex-col gap-4 container so the spacing between them matches the
 * homepage certifications section (mb-4 on the header wrapper).
 *
 * Reliance is NOT shown here — it is an industry reference/client,
 * not a certification. It appears in the Industry References section
 * via the organisationReferences data in trust.ts.
 */

const AUTOPLAY_DELAY = 5000;

export default function AwardsCertifications() {
  /* ── reduced motion ── */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(mq.matches);
    queueMicrotask(sync);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* ── Embla carousel with Autoplay ── */
  const autoplayRootRef = useRef<ReturnType<typeof Autoplay> | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    prefersReducedMotion
      ? []
      : [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })],
  );

  /* Store autoplay plugin ref once emblaApi is available */
  useEffect(() => {
    if (!emblaApi) return;
    const ap = (emblaApi as unknown as Record<string, Record<string, unknown>>).plugin?.autoplay;
    if (ap) autoplayRootRef.current = ap as ReturnType<typeof Autoplay>;
  }, [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    handler();
    emblaApi.on('select', handler);
    emblaApi.on('reInit', handler);
    return () => {
      emblaApi.off('select', handler);
      emblaApi.off('reInit', handler);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /* ── Pause on hover/focus ── */
  const handlePointerEnter = useCallback(() => {
    if (autoplayRootRef.current?.stop) autoplayRootRef.current.stop();
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (autoplayRootRef.current?.play) autoplayRootRef.current.play();
  }, []);

  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule id="recognition">
      <div className="flex flex-col gap-12">
        {/* ── Awards ── */}
        <div className="reveal-up">
          <SectionHeader
            eyebrow="Awards and recognition"
            title="Recognition received"
            supportingText="Awards and recognition presented to Bharat Electrosafe and its founders."
          />
        </div>

        {/* ── Awards carousel ── */}
        <div
          className="reveal-up relative"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <div ref={emblaRef} className="overflow-hidden" role="region" aria-label="Awards carousel" aria-roledescription="carousel">
            <div className="flex gap-5">
              {awards.map((award, idx) => (
                <div
                  key={award.title}
                  className="flex-none w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${awards.length}`}
                >
                  <article className="flex flex-col h-full overflow-hidden rounded-lg border border-be-grey-250 bg-be-warm-white hover-card-lift">
                    <div className="relative aspect-[4/3] w-full bg-be-cream">
                      <Image
                        src={award.image}
                        alt={award.alt}
                        fill
                        className={
                          award.fit === 'contain' ? 'object-contain p-3' : 'object-cover'
                        }
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <h3 className="text-card-title text-be-charcoal-950">{award.title}</h3>
                      <p className="text-metadata font-semibold uppercase tracking-wide text-be-yellow-text">
                        {award.presenter}
                      </p>
                      <p className="text-body text-be-grey-650">{award.detail}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous award"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-be-grey-250 bg-be-white text-be-charcoal-950 hover:bg-be-cream hover:border-be-yellow-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next award"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-be-grey-250 bg-be-white text-be-charcoal-950 hover:bg-be-cream hover:border-be-yellow-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Certifications and memberships — wrapped in a tighter
            container so the gap between header and logo rail matches
            the homepage certifications section (mb-4 equivalent). ── */}
        <div className="flex flex-col gap-4">
          <div className="reveal-up">
            <SectionHeader
              eyebrow="Certifications and memberships"
              title="Standards, testing and registrations"
              supportingText="Marks the company holds, each labelled for what it actually is."
            />
          </div>

          <div className="reveal-up">
            <InfiniteLogoRail
              ariaLabel="Certifications and memberships"
              duration={42}
              pauseOnHover
              pauseOnFocus
              itemSpacingClassName="pr-2 sm:pr-3 md:pr-4"
            >
              {allTrustMarks.map((mark) => {
                const isDownloadable = !!mark.document;

                const inner = (
                  <>
                    {/* Logo — object-contain never crops. Slightly enlarged
                        for better recognisability (~15% larger than previous). */}
                    <span className="relative flex h-16 sm:h-[72px] md:h-[84px] lg:h-[92px] w-full items-center justify-center">
                      <Image
                        src={mark.logo}
                        alt={mark.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 639px) 150px, (max-width: 767px) 170px, (max-width: 1023px) 195px, 210px"
                        loading="eager"
                        unoptimized
                      />
                    </span>
                    {/* Certification name — logo + name only, no description */}
                    <span className="text-sm font-semibold text-be-charcoal-950 text-center leading-tight">
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
                      className="group/mark w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px] xl:w-[215px] flex flex-col items-center gap-1.5 py-1 text-center cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
                    >
                      {inner}
                    </a>
                  );
                }

                return (
                  <div
                    key={mark.label}
                    className="w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px] xl:w-[215px] flex flex-col items-center gap-1.5 py-1 text-center"
                  >
                    {inner}
                  </div>
                );
              })}
            </InfiniteLogoRail>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
