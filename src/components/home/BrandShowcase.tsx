'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SectionShell } from '@/components/ui/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { BrandLogoPreview } from '@/components/ui/BrandLogoPreview';
import {
  brandShowcaseSlides,
  type BrandShowcaseItem,
} from '@/data/brand-showcase';

/**
 * BrandShowcase — compact premium brand showcase for the homepage.
 *
 * Visual concept:
 *   A single centered logo group per slide, with a category context label
 *   above the logos and pagination dots directly below. No two-column
 *   divider, no "table" look — the logos are the primary content.
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
 * The active slide's `label` is rendered as the category context above
 * the logo group, and updates with the carousel (so it always describes
 * the visible logos).
 *
 * Logo preview (independent state):
 *   - `previewBrand` controls only whether the view-only popup is open
 *     and which logo it shows. It is completely separate from `active`.
 *   - Clicking ANY logo opens the preview modal. It does NOT navigate,
 *     does NOT change the carousel slide, does NOT move the dot.
 *
 * Trademark / registered marks:
 *   - The ™ (INSULATICAA, Bharat PoleShield) and ® (BES / first logo)
 *     marks are ALREADY embedded in the supplied logo artwork, so no
 *     duplicate overlay marks are added here.
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

/** Rounded logo presentation tile — consistent stage, aspect ratio preserved, clickable.
 *  The tile has a soft rounded background + subtle border so logos feel
 *  like deliberate display units rather than floating images. Source
 *  artwork is never modified — `object-contain` + `overflow-hidden`
 *  keep each logo's native proportions inside the rounded stage. */
function BrandLogoButton({
  brand,
  onOpenPreview,
}: {
  brand: BrandShowcaseItem;
  onOpenPreview: (brand: BrandShowcaseItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenPreview(brand)}
      aria-label={`View ${brand.name} logo`}
      className="group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 transition-transform hover:-translate-y-0.5"
    >
      {/* Rounded display tile — subtle background + soft border, refined radius.
          Logos sit inside via object-contain; source artwork unchanged. */}
      <div className="relative w-[150px] h-[92px] sm:w-[175px] sm:h-[105px] lg:w-[195px] lg:h-[115px] rounded-2xl overflow-hidden bg-be-white border border-be-grey-200 shadow-sm">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={brand.logo}
            alt={brand.alt}
            fill
            className="object-contain p-2.5"
            sizes="(max-width: 768px) 150px, (max-width: 1280px) 175px, 195px"
          />
        </div>
      </div>
    </button>
  );
}

/** Render a single slide — one centered logo group (no two-column divider). */
function SlideContent({
  slide,
  onOpenPreview,
}: {
  slide: typeof brandShowcaseSlides[number];
  onOpenPreview: (brand: BrandShowcaseItem) => void;
}) {
  const count = slide.brands.length;
  // Slide 1 (4 logos): 2×2 on mobile, 4-up on desktop.
  // Slide 2 (2 logos): centered pair on all breakpoints.
  const gridCols =
    count === 4
      ? 'grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-2';

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={`grid ${gridCols} gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-x-10 items-center justify-items-center`}
      >
        {slide.brands.map((brand) => (
          <BrandLogoButton
            key={brand.name}
            brand={brand}
            onOpenPreview={onOpenPreview}
          />
        ))}
      </div>
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

  const activeSlide = brandShowcaseSlides[active];

  return (
    <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Our brands" className="!pt-7 lg:!pt-8 !pb-6 lg:!pb-7">
      {/* Compact header — eyebrow + supporting line only (no large title). */}
      <div className="flex flex-col items-center text-center gap-1 mb-4">
        <Eyebrow>OUR BRANDS</Eyebrow>
        <p className="text-[15px] leading-relaxed text-be-grey-650 max-w-2xl">
          Specialized brands across electrical safety, flooring and waterproofing.
        </p>
      </div>

      {/* Category context label for the active slide — describes the visible logos.
          Updates with the carousel so it always matches the current logo group. */}
      <div className="text-center mb-3">
        <span className="text-[11px] font-semibold text-be-navy-800 uppercase tracking-wider">
          {activeSlide.label}
        </span>
      </div>

      {/* Carousel viewport — overflow hidden, fixed min-height for layout stability.
          Both slides use the same compact stage height so the section never jumps. */}
      <div
        className="relative min-h-[100px] sm:min-h-[100px] lg:min-h-[108px] overflow-hidden"
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
              aria-hidden={activeSlide.id !== slide.id}
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
