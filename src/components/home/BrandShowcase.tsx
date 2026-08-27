'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  brandShowcaseSlides,
  waterproofingBrands,
  type BrandShowcaseItem,
} from '@/data/brand-showcase';

/**
 * BrandShowcase — homepage rotating brand banner.
 *
 * Two banner compositions alternate automatically every ~6 seconds with
 * a smooth, restrained opacity fade. The carousel pauses on hover/focus
 * (desktop) and respects `prefers-reduced-motion`. Both banners share a
 * fixed minimum viewport height so the page layout never jumps when the
 * active slide changes.
 *
 * Reuses the existing design system (SectionShell, SectionHeader) and
 * `next/image` with `object-contain` so each supplied logo preserves its
 * native aspect ratio inside a consistent visual area.
 *
 * Brand logos link to existing internal destinations only when a real
 * route exists (Bharat PoleShield, Bharat SmartFloor, BharatMembrane).
 * Other logos are informational (non-clickable) — no routes invented.
 */

const AUTOPLAY_MS = 6000;
const TRANSITION_MS = 700;

/** Single logo tile — preserves aspect ratio, links only when href exists. */
function BrandLogo({ brand, className }: { brand: BrandShowcaseItem; className?: string }) {
  const inner = (
    <div className={className}>
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={brand.logo}
          alt={brand.alt}
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 45vw, (max-width: 1280px) 22vw, 260px"
        />
      </div>
    </div>
  );

  if (!brand.href) {
    return inner;
  }

  return (
    <Link
      href={brand.href}
      aria-label={`${brand.name} — view product page`}
      className="group/link rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  );
}

export default function BrandShowcase() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect reduced-motion preference (defers setState via queueMicrotask
  // to match the existing repo convention — see InfiniteLogoRail).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    queueMicrotask(sync);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    if (reducedMotion || paused) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % brandShowcaseSlides.length);
    }, AUTOPLAY_MS);
  }, [reducedMotion, paused, clearTimer]);

  // Autoplay loop — reschedules whenever active/paused/reduced changes.
  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [active, scheduleNext, clearTimer]);

  const goTo = useCallback(
    (index: number) => {
      setActive(index);
      // Manual navigation resets the autoplay timer.
      clearTimer();
      scheduleNext();
    },
    [clearTimer, scheduleNext],
  );

  const slide = brandShowcaseSlides[active];

  return (
    <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Our brands">
      <div className="mb-8">
        <SectionHeader
          eyebrow="OUR BRANDS"
          title="Our Brands"
          supportingText="Specialized brands across electrical safety, flooring and waterproofing."
          align="center"
        />
      </div>

      {/* Carousel viewport — fixed min-height keeps layout stable across slides */}
      <div
        className="relative min-h-[260px] sm:min-h-[240px] lg:min-h-[220px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Slide 1 — Insulating Mat Brands (4 logos, 2×2 on mobile, 4-up on desktop) */}
        <div
          aria-hidden={active !== 0}
          className={`absolute inset-0 transition-opacity ease-in-out ${
            active === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <div className="flex flex-col items-center h-full">
            <div className="text-sm font-semibold text-be-navy-800 uppercase tracking-wider mb-6">
              {slide.title}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full max-w-5xl flex-1 items-stretch">
              {slide.brands.map((brand) => (
                <div
                  key={brand.name}
                  className="relative aspect-[4/3] rounded-lg bg-be-white border border-be-grey-250 overflow-hidden"
                >
                  <BrandLogo brand={brand} className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 2 — PVC Floor + Waterproofing Brands (2 labeled sub-groups) */}
        <div
          aria-hidden={active !== 1}
          className={`absolute inset-0 transition-opacity ease-in-out ${
            active === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-full items-stretch">
            {/* PVC Floor Brands */}
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold text-be-navy-800 uppercase tracking-wider mb-4">
                PVC Floor Brands
              </div>
              <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg bg-be-white border border-be-grey-250 overflow-hidden">
                <BrandLogo brand={brandShowcaseSlides[1].brands[0]} className="w-full h-full" />
              </div>
            </div>

            {/* Waterproofing Brands */}
            <div className="flex flex-col items-center md:border-l md:border-be-grey-250 md:pl-6 lg:pl-8">
              <div className="text-sm font-semibold text-be-navy-800 uppercase tracking-wider mb-4">
                Waterproofing Brands
              </div>
              <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg bg-be-white border border-be-grey-250 overflow-hidden">
                <BrandLogo brand={waterproofingBrands[0]} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle pagination dots — keyboard accessible */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {brandShowcaseSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${s.title} (${i + 1} of ${brandShowcaseSlides.length})`}
            aria-current={active === i}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 rounded-full p-1"
          >
            <span
              className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                active === i
                  ? 'bg-be-charcoal-800 scale-125'
                  : 'bg-be-charcoal-800/20 hover:bg-be-charcoal-800/40'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide counter for screen readers + visual reference */}
      <div
        className="mt-3 text-center text-metadata text-be-grey-650"
        aria-live="polite"
      >
        {String(active + 1).padStart(2, '0')} / {String(brandShowcaseSlides.length).padStart(2, '0')}
      </div>
    </SectionShell>
  );
}
