'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SectionShell } from '@/components/ui/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { BrandLogoPreview } from '@/components/ui/BrandLogoPreview';
import {
  brandShowcaseSlides,
  type BrandShowcaseItem,
  type BrandShowcaseSlide,
} from '@/data/brand-showcase';

/**
 * BrandShowcase — slim, premium rotating brand strip for the homepage.
 *
 * Carousel architecture (single source of truth):
 *   - `active` is the ONLY piece of carousel navigation state.
 *   - The visible logo group, the carousel transform (translateX), the
 *     active pagination dot, and the autoplay timer ALL derive from
 *     `active`. It is impossible for the visible logos and the active
 *     dot to disagree.
 *   - Slides are laid out in a single horizontal track (`flex`), each
 *     slide taking 100% of the viewport width. The track is translated
 *     by `-active * 100%` with a smooth `transition-transform` (~600ms,
 *     ease-in-out). No fade-to-blank, no empty intermediate state.
 *
 * Logo preview (independent state):
 *   - `previewBrand` controls only whether the view-only popup is open
 *     and which logo it shows. It is completely separate from `active`.
 *   - Clicking ANY logo opens the preview modal. It does NOT navigate,
 *     does NOT change the carousel slide, does NOT move the dot.
 *   - The carousel remains exactly where it was underneath the modal.
 *
 * Trademark / registered marks:
 *   - The ™ (INSULATICAA, Bharat PoleShield) and ® (BES / first logo)
 *     marks are ALREADY embedded in the supplied logo artwork, so no
 *     duplicate overlay marks are added here. See brand-showcase.ts
 *     for the asset paths.
 *
 * Accessibility:
 *   - pause on hover/focus (desktop); respects prefers-reduced-motion
 *   - keyboard-accessible dots with `aria-current` + descriptive labels
 *   - every logo is a real <button> with a descriptive aria-label
 *   - modal uses Radix Dialog (focus trap, ESC, focus restore)
 *   - timer cleanup on unmount (no leaks)
 */

const AUTOPLAY_MS = 6000;
const TRANSITION_MS = 600;

/** Single borderless logo zone — clickable, opens view-only preview. */
function BrandLogoButton({
  brand,
  className,
  onOpenPreview,
}: {
  brand: BrandShowcaseItem;
  className?: string;
  onOpenPreview: (brand: BrandShowcaseItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenPreview(brand)}
      aria-label={`View ${brand.name} logo`}
      className="group relative rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 transition-transform hover:-translate-y-0.5"
    >
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
    </button>
  );
}

/** Render a single slide — handles 1 sub-group (slide 1) or 2 sub-groups (slide 2). */
function SlideContent({
  slide,
  onOpenPreview,
}: {
  slide: BrandShowcaseSlide;
  onOpenPreview: (brand: BrandShowcaseItem) => void;
}) {
  if (slide.subGroups.length === 1) {
    // Slide 1 — 4 insulating-mat logos in a grid (2×2 mobile, 4-up desktop).
    const group = slide.subGroups[0];
    return (
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 sm:gap-x-6 lg:gap-x-8 w-full max-w-6xl items-center justify-items-stretch">
          {group.brands.map((brand) => (
            <BrandLogoButton
              key={brand.name}
              brand={brand}
              onOpenPreview={onOpenPreview}
              className="relative w-full h-[88px] sm:h-[104px] lg:h-[128px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Slide 2 — PVC Floor + Waterproofing sub-groups with a subtle divider.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0 h-full items-center">
      {slide.subGroups.map((group, idx) => (
        <div
          key={group.label}
          className={`flex flex-col items-center ${idx > 0 ? 'md:border-l md:border-be-grey-200 md:pl-6' : 'md:pr-6'}`}
        >
          <div className="text-[11px] font-semibold text-be-navy-800 uppercase tracking-wider mb-2.5">
            {group.label}
          </div>
          {group.brands.map((brand) => (
            <BrandLogoButton
              key={brand.name}
              brand={brand}
              onOpenPreview={onOpenPreview}
              className="relative w-[220px] sm:w-[260px] lg:w-[290px] h-[104px] sm:h-[120px] lg:h-[128px]"
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
  const [previewBrand, setPreviewBrand] = useState<BrandShowcaseItem | null>(null);
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
    // Pause autoplay while the preview modal is open, or while reduced
    // motion / hover-pause is active.
    if (reducedMotion || paused || previewBrand !== null) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
  }, [reducedMotion, paused, previewBrand, clearTimer, total]);

  // Autoplay loop — reschedules whenever active/paused/reduced/preview changes.
  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [active, scheduleNext, clearTimer]);

  // Single source of truth for ALL carousel navigation: dots, prev/next, autoplay.
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

  // Logo preview — independent of carousel state. Does NOT touch `active`.
  const openPreview = useCallback((brand: BrandShowcaseItem) => {
    setPreviewBrand(brand);
  }, []);
  const closePreview = useCallback(() => {
    setPreviewBrand(null);
  }, []);

  return (
    <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Our brands" className="!pt-7 lg:!pt-8 !pb-6 lg:!pb-7">
      {/* Compact header — eyebrow + supporting line only (no large title). */}
      <div className="flex flex-col items-center text-center gap-1 mb-3">
        <Eyebrow>OUR BRANDS</Eyebrow>
        <p className="text-[15px] leading-relaxed text-be-grey-650 max-w-2xl">
          Specialized brands across electrical safety, flooring and waterproofing.
        </p>
      </div>

      {/* Carousel viewport — overflow hidden, fixed min-height for layout stability. */}
      <div
        className="relative min-h-[120px] sm:min-h-[118px] lg:min-h-[128px] overflow-hidden"
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
              <SlideContent slide={slide} onOpenPreview={openPreview} />
            </div>
          ))}
        </div>
      </div>

      {/* Compact pagination dots — keyboard accessible, close to logos.
          Active state derived ONLY from `active` (single source of truth). */}
      <div className="mt-3.5 flex items-center justify-center gap-2.5">
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

      {/* View-only logo preview modal — independent of carousel state. */}
      <BrandLogoPreview
        open={previewBrand !== null}
        onOpenChange={(open) => {
          if (!open) closePreview();
        }}
        logo={previewBrand?.logo ?? ''}
        alt={previewBrand?.alt ?? ''}
        brandName={previewBrand?.name ?? ''}
      />
    </SectionShell>
  );
}
