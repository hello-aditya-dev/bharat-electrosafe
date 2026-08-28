'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionShell } from '@/components/ui/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import {
  brandShowcaseSlides,
  type BrandShowcaseItem,
  type BrandShowcaseSlide,
} from '@/data/brand-showcase';

/**
 * BrandShowcase — slim, premium rotating brand strip for the homepage.
 *
 * Carousel architecture (single source of truth):
 *   - `active` is the ONLY piece of navigation state.
 *   - The visible logo group, the carousel transform (translateX), the
 *     active pagination dot, and the autoplay timer ALL derive from
 *     `active`. It is impossible for the visible logos and the active
 *     dot to disagree.
 *   - Slides are laid out in a single horizontal track (`flex`), each
 *     slide taking 100% of the viewport width. The track is translated
 *     by `-active * 100%` with a smooth `transition-transform` (~600ms,
 *     ease-in-out). No fade-to-blank, no empty intermediate state.
 *
 * Logical slides: exactly 2 (Insulating Mat Brands; PVC + Waterproofing).
 * Pagination dot count = `brandShowcaseSlides.length` = 2. Dots are real
 * navigation buttons that set `active` directly.
 *
 * Visual approach: borderless logo zones (no card borders, no shadows,
 * no panel backgrounds) — logos sit directly on the section background
 * with `object-contain` to preserve each supplied logo's native aspect
 * ratio inside a consistent visual zone.
 *
 * Brand logos link to existing internal destinations only when a real
 * route exists (Bharat PoleShield, Bharat SmartFloor, BharatMembrane).
 * Other logos are informational (non-clickable) — no routes invented.
 *
 * Accessibility:
 *   - pause on hover/focus (desktop); respects prefers-reduced-motion
 *   - keyboard-accessible dots with `aria-current` + descriptive labels
 *   - timer cleanup on unmount (no leaks)
 */

const AUTOPLAY_MS = 6000;
const TRANSITION_MS = 600;

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

/** Render a single slide — handles 1 sub-group (slide 1) or 2 sub-groups (slide 2). */
function SlideContent({ slide }: { slide: BrandShowcaseSlide }) {
  if (slide.subGroups.length === 1) {
    // Slide 1 — 4 insulating-mat logos in a grid (2×2 mobile, 4-up desktop).
    const group = slide.subGroups[0];
    return (
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 sm:gap-x-6 lg:gap-x-8 w-full max-w-6xl items-center justify-items-stretch">
          {group.brands.map((brand) => (
            <BrandLogo
              key={brand.name}
              brand={brand}
              className="relative w-full h-[60px] sm:h-[72px] lg:h-[88px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Slide 2 — PVC Floor + Waterproofing sub-groups with a subtle divider.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full items-center">
      {slide.subGroups.map((group, idx) => (
        <div
          key={group.label}
          className={`flex flex-col items-center ${idx > 0 ? 'md:border-l md:border-be-grey-200 md:pl-8' : 'md:pr-8'}`}
        >
          <div className="text-[11px] font-semibold text-be-navy-800 uppercase tracking-wider mb-3">
            {group.label}
          </div>
          {group.brands.map((brand) => (
            <BrandLogo
              key={brand.name}
              brand={brand}
              className="relative w-full max-w-[240px] h-[72px] sm:h-[80px] lg:h-[88px]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BrandShowcase() {
  const total = brandShowcaseSlides.length;
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
      setActive((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
  }, [reducedMotion, paused, clearTimer, total]);

  // Autoplay loop — reschedules whenever active/paused/reduced changes.
  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [active, scheduleNext, clearTimer]);

  // Single source of truth for ALL navigation: dots, prev/next, autoplay.
  const goTo = useCallback(
    (index: number) => {
      const normalized = ((index % total) + total) % total;
      setActive(normalized);
      // Manual navigation resets the autoplay timer so the old timer
      // cannot immediately move the carousel again.
      clearTimer();
      scheduleNext();
    },
    [clearTimer, scheduleNext, total],
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

      {/* Carousel viewport — overflow hidden, fixed min-height for layout stability. */}
      <div
        className="relative min-h-[120px] sm:min-h-[110px] lg:min-h-[100px] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Horizontal track — each slide is 100% viewport width.
            Translated by -active * 100% with a smooth transition.
            No fade-to-blank, no empty intermediate state. */}
        <div
          className="flex w-full h-full transition-transform ease-in-out"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transitionDuration: reducedMotion ? '0ms' : `${TRANSITION_MS}ms`,
          }}
        >
          {brandShowcaseSlides.map((slide) => (
            <div
              key={slide.id}
              className="relative w-full shrink-0 h-full"
              aria-hidden={brandShowcaseSlides[active].id !== slide.id}
            >
              <SlideContent slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {/* Compact pagination dots — keyboard accessible, close to logos.
          Active state derived ONLY from `active` (single source of truth). */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
        {brandShowcaseSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to brand slide ${i + 1}: ${s.title}`}
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
