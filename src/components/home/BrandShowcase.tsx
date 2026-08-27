'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionShell } from '@/components/ui/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import {
  brandShowcaseSlides,
  waterproofingBrands,
  type BrandShowcaseItem,
} from '@/data/brand-showcase';

/**
 * BrandShowcase — slim, premium rotating brand strip for the homepage.
 *
 * Two banner compositions alternate automatically every ~6 seconds with
 * a smooth, restrained opacity fade. The carousel pauses on hover/focus
 * (desktop) and respects `prefers-reduced-motion`. Both slides share a
 * fixed minimum viewport height so the page layout never jumps when the
 * active slide changes.
 *
 * Visual approach: borderless logo zones (no card borders, no shadows,
 * no panel backgrounds) — logos sit directly on the section background
 * with `object-contain` to preserve each supplied logo's native aspect
 * ratio inside a consistent visual zone.
 *
 * Brand logos link to existing internal destinations only when a real
 * route exists (Bharat PoleShield, Bharat SmartFloor, BharatMembrane).
 * Other logos are informational (non-clickable) — no routes invented.
 */

const AUTOPLAY_MS = 6000;
const TRANSITION_MS = 700;

/** Single borderless logo zone — preserves aspect ratio, links only when href exists. */
function BrandLogo({ brand, className }: { brand: BrandShowcaseItem; className?: string }) {
  const inner = (
    <div className={className}>
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={brand.logo}
          alt={brand.alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 45vw, (max-width: 1280px) 22vw, 240px"
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
      className="group/link rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
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

  return (
    <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Our brands">
      {/* Compact header — eyebrow + supporting line only (no large title). */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <Eyebrow>OUR BRANDS</Eyebrow>
        <p className="text-[15px] leading-relaxed text-be-grey-650 max-w-2xl">
          Specialized brands across electrical safety, flooring and waterproofing.
        </p>
      </div>

      {/* Carousel viewport — fixed min-height keeps layout stable across slides.
          Tightly scoped to the logo zone + small gap to dots. */}
      <div
        className="relative min-h-[120px] sm:min-h-[110px] lg:min-h-[100px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Slide 1 — Insulating Mat Brands (4 logos, 2×2 on mobile, 4-up on desktop). */}
        <div
          aria-hidden={active !== 0}
          className={`absolute inset-0 transition-opacity ease-in-out ${
            active === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 sm:gap-x-6 lg:gap-x-8 w-full max-w-6xl items-center justify-items-stretch">
              {brandShowcaseSlides[0].brands.map((brand) => (
                <BrandLogo
                  key={brand.name}
                  brand={brand}
                  className="relative w-full h-[60px] sm:h-[72px] lg:h-[88px]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide 2 — PVC Floor + Waterproofing Brands (2 labeled sub-groups with subtle divider). */}
        <div
          aria-hidden={active !== 1}
          className={`absolute inset-0 transition-opacity ease-in-out ${
            active === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full items-center">
            {/* PVC Floor Brands */}
            <div className="flex flex-col items-center md:pr-8">
              <div className="text-[11px] font-semibold text-be-navy-800 uppercase tracking-wider mb-3">
                PVC Floor Brands
              </div>
              <BrandLogo
                brand={brandShowcaseSlides[1].brands[0]}
                className="relative w-full max-w-[240px] h-[72px] sm:h-[80px] lg:h-[88px]"
              />
            </div>

            {/* Waterproofing Brands — subtle vertical divider on desktop */}
            <div className="flex flex-col items-center md:border-l md:border-be-grey-200 md:pl-8">
              <div className="text-[11px] font-semibold text-be-navy-800 uppercase tracking-wider mb-3">
                Waterproofing Brands
              </div>
              <BrandLogo
                brand={waterproofingBrands[0]}
                className="relative w-full max-w-[240px] h-[72px] sm:h-[80px] lg:h-[88px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact pagination dots — keyboard accessible, close to logos. */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
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
    </SectionShell>
  );
}
