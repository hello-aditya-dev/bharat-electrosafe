'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import {
  ShieldCheck,
  BadgeCheck,
  FlaskConical,
  Globe2,
  Droplets,
  Shield,
  Layers,
  Pipette,
  LayoutGrid,
  Zap,
  CircleDot,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

/* ────────────────────────────────────────────
   Proof badge type
   ──────────────────────────────────────────── */
interface ProofItem {
  label: string;
  icon: LucideIcon;
}

/* ────────────────────────────────────────────
   Slide data type
   ──────────────────────────────────────────── */
interface HeroSlide {
  eyebrow: string;
  /** Heading level: 'h1' for slide 1, 'h2' for slides 2-4 */
  headingTag: 'h1' | 'h2';
  /** Headline text, split into the intended desktop line groups.
   *
   *   slide 1 → 4 lines, slides 2–4 → 3 lines.
   *
   *   Rendering: each entry becomes a <span className="xl:block">.
   *   Below the `xl` breakpoint (1280px) the spans are inline so the
   *   headline reflows naturally on tablet/mobile, preserving the exact
   *   wording without forcing awkward wraps. At `xl`+ each span becomes
   *   a block, producing the controlled desktop line composition.
   *
   *   Accessibility: the spans sit inside a single semantic <h1>/<h2>,
   *   so screen readers announce the headline as one continuous string. */
  headingLines: string[];
  lede: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  proofItems: ProofItem[];
  /** Desktop hero image */
  imageSrc: string;
  imageAlt: string;
  /** Mobile hero image — same as desktop if no separate mobile crop */
  imageSrcMobile?: string;
}

/* ────────────────────────────────────────────
   Slide definitions
   ──────────────────────────────────────────── */
const HERO_SLIDES: HeroSlide[] = [
  /* ── Slide 1: Electrical Insulating Mats (PRESERVED exactly) ── */
  {
    eyebrow: 'ELECTRICAL INSULATING MATS · IS 15652:2006',
    headingTag: 'h1',
    headingLines: [
      'Electrical insulating mats',
      'for safer work around',
      'switchgear and',
      'electrical installations',
    ],
    lede: 'Bharat Electrosafe manufactures insulating mats for electrical work areas, with IS 15652:2006 domestic configurations and a separate IEC 61111:2009 range for international requirements.',
    primaryCta: { label: 'Explore Products', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact-us' },
    proofItems: [
      { label: 'IS 15652:2006 domestic range', icon: ShieldCheck },
      { label: 'BIS Licence CM/L:8800129617', icon: BadgeCheck },
      { label: 'ERDA tested', icon: FlaskConical },
      { label: 'IEC 61111:2009 international range', icon: Globe2 },
    ],
    imageSrc:
      '/media/home/hero/electrical-insulating-mat-switchgear-hero.webp',
    imageSrcMobile:
      '/media/home/hero/electrical-insulating-mat-switchgear-hero-mobile.webp',
    imageAlt:
      'Electrical technician standing on a blue insulating mat while operating switchgear',
  },
  /* ── Slide 2: Waterproofing Solutions ── */
  {
    eyebrow: 'WATERPROOFING SOLUTIONS · IS 15909:2020 / IS 15058:2002',
    headingTag: 'h2',
    headingLines: [
      'Waterproofing solutions',
      'for stronger protection',
      'of buildings and',
      'infrastructure',
    ],
    lede: 'Geo Membrane Lining supports tunnel, containment and lining applications, while Water Stop Seal is designed for concrete construction and expansion joints.',
    primaryCta: { label: 'Explore Waterproofing', href: '/products/waterproofing-solutions' },
    secondaryCta: { label: 'Request a Quote', href: '/contact-us?type=quote' },
    proofItems: [
      { label: 'Geo Membrane Lining · IS 15909:2020', icon: Droplets },
      { label: 'Water Stop Seal · IS 15058:2002', icon: Shield },
      { label: 'Tunnel & containment applications', icon: Layers },
      { label: 'Concrete joint sealing', icon: Pipette },
    ],
    imageSrc:
      '/media/products/bharat-membrane/bharatmembrane-tunnel-lining-clean.webp',
    imageAlt:
      'Waterproof membrane lining installed inside an underground tunnel for infrastructure protection',
  },
  /* ── Slide 3: PVC Flooring ── */
  {
    eyebrow: 'PVC FLOORING · BHARATSMART FLOOR™',
    headingTag: 'h2',
    headingLines: [
      'PVC flooring solutions',
      'for safer, cleaner',
      'industrial and',
      'commercial spaces',
    ],
    lede: 'BharatSmart Floor™ provides PVC flooring for residential, office and commercial interiors, including homes, workspaces, reception areas, retail spaces and similar indoor environments.',
    primaryCta: { label: 'Explore PVC Flooring', href: '/products/pvc-flooring-solutions' },
    secondaryCta: { label: 'Request a Quote', href: '/contact-us?type=quote' },
    proofItems: [
      { label: 'IS 3462:1986', icon: ShieldCheck },
      { label: 'BharatSmart Floor™', icon: LayoutGrid },
      { label: 'Residential flooring', icon: Layers },
      { label: 'Office & commercial interiors', icon: Zap },
    ],
    imageSrc:
      '/media/products/pvc-flooring-solutions/bharatsmart-floor-residential-interior.webp',
    imageAlt:
      'Wood-look BharatSmart Floor PVC flooring in a modern residential living and home-office interior',
  },
  /* ── Slide 4: Other Products ── */
  {
    eyebrow: 'OTHER INDUSTRIAL PRODUCTS',
    headingTag: 'h2',
    headingLines: [
      'Industrial safety products',
      'for safer workplaces',
      'equipment protection',
      'and infrastructure',
    ],
    lede: 'Rubber sheets, rubber hose pipes, ESD mats and conveyor belts for industrial rubber and safety applications.',
    primaryCta: { label: 'Explore Other Products', href: '/products/other-products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact-us?type=quote' },
    proofItems: [
      { label: 'Rubber Sheets', icon: Layers },
      { label: 'Rubber Hose Pipes', icon: Pipette },
      { label: 'ESD Mats', icon: CircleDot },
      { label: 'Conveyor Belts', icon: LayoutGrid },
    ],
    imageSrc: '/media/categories/other-products-category.png',
    imageAlt:
      'Industrial rubber sheet, hose, ESD mat and conveyor belt products',
  },
];

/* ────────────────────────────────────────────
   Single slide renderer
   ──────────────────────────────────────────── */
function HeroSlideContent({ slide }: { slide: HeroSlide }) {
  const HeadingTag = slide.headingTag;

  return (
    <div className="container-site page-horizontal-padding be-split-hero__inner">
      {/* ── Copy block (pre-image): eyebrow + headline ───────── */}
      <div className="be-split-hero__copy-pre">
        <div className="be-split-hero__eyebrow">
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <div
            className="mt-2 h-0.5 bg-be-yellow-500 rounded animate-slide-in"
            style={{ width: '80px' }}
          />
        </div>

        <HeadingTag className="be-split-hero__headline text-be-charcoal-950">
          {slide.headingLines.map((line, i, arr) => (
            <span key={i} className="xl:block">
              {line}
              {/* Trailing space keeps words separated when the spans are
                  inline (below xl). When the spans become block at xl+,
                  trailing whitespace inside a block is collapsed, so the
                  desktop line composition stays clean. */}
              {i < arr.length - 1 ? ' ' : null}
            </span>
          ))}
        </HeadingTag>
      </div>

      {/* ── Visual column ───────────────────────────────────── */}
      <div className="be-split-hero__visual">
        {/* Desktop visual */}
        <div className="be-split-hero__visual-desktop">
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="be-split-hero__image object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>
        {/* Mobile visual — use dedicated mobile crop if provided, else desktop image */}
        <div className="be-split-hero__visual-mobile">
          <Image
            src={slide.imageSrcMobile ?? slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
        </div>
      </div>

      {/* ── Copy block (post-image): paragraph + CTAs + badges ── */}
      <div className="be-split-hero__copy-post">
        <p className="be-split-hero__lede text-be-grey-650">
          {slide.lede}
        </p>

        <div className="be-split-hero__ctas">
          <PrimaryButton href={slide.primaryCta.href} size="lg" className="be-hero-cta">
            {slide.primaryCta.label}
          </PrimaryButton>
          <SecondaryButton href={slide.secondaryCta.href} className="be-hero-cta">
            {slide.secondaryCta.label}
          </SecondaryButton>
        </div>

        <div className="be-split-hero__proof">
          {slide.proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.label} className="be-proof-badge">
                <Icon
                  className="be-proof-badge__icon size-3.5"
                  aria-hidden="true"
                />
                <span className="be-proof-badge__label">{item.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   HomeHero — Client Component (Embla Carousel)
   ────────────────────────────────────────────
   4-slide looping carousel with auto-advance,
   pause on hover/focus, manual prev/next arrows,
   swipe/drag, keyboard navigation, and
   prefers-reduced-motion respect. */
export default function HomeHero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 14 }, [
    autoplayRef.current,
  ]);

  /* ── Pointer-over tracking for hover pause/resume ── */
  const isPointerOverRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleAutoplayResume = useCallback((delayMs: number) => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (!prefersReducedMotion.current && !isPointerOverRef.current) {
        autoplayRef.current.play();
      }
    }, delayMs);
  }, [clearResumeTimer]);

  /* ── Reduced-motion detection ── */
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion.current && emblaApi) {
      autoplayRef.current.stop();
    }
  }, [emblaApi]);

  /* ── Slide selection tracking ── */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    /* After a drag/swipe, schedule autoplay resume (plugin already stopped it). */
    const onPointerUp = () => {
      scheduleAutoplayResume(1500);
    };
    emblaApi.on('pointerUp', onPointerUp);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('pointerUp', onPointerUp);
      clearResumeTimer();
    };
  }, [emblaApi, onSelect, scheduleAutoplayResume, clearResumeTimer]);

  /* ── Scroll helpers (stop autoplay, schedule resume after 1500 ms) ── */
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    scheduleAutoplayResume(1500);
  }, [emblaApi, scheduleAutoplayResume]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    scheduleAutoplayResume(1500);
  }, [emblaApi, scheduleAutoplayResume]);

  /* ── Hover: pause while pointer is over hero, resume immediately on leave ── */
  const handleMouseEnter = useCallback(() => {
    isPointerOverRef.current = true;
    clearResumeTimer();
    if (!prefersReducedMotion.current) {
      autoplayRef.current.stop();
    }
  }, [clearResumeTimer]);

  const handleMouseLeave = useCallback(() => {
    isPointerOverRef.current = false;
    if (!prefersReducedMotion.current) {
      autoplayRef.current.play();
    }
  }, []);

  /* ── Focus: pause on focus-in, schedule resume on focus-out ── */
  const handleFocusIn = useCallback(() => {
    if (!prefersReducedMotion.current) {
      autoplayRef.current.stop();
    }
  }, []);

  const handleFocusOut = useCallback(() => {
    scheduleAutoplayResume(1500);
  }, [scheduleAutoplayResume]);

  return (
    <section
      aria-label="Bharat Electrosafe product solutions — homepage introduction"
      className="be-split-hero"
    >
      <div
        ref={rootRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleFocusIn}
        onBlurCapture={handleFocusOut}
      >
        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {HERO_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className="min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${HERO_SLIDES.length}`}
              >
                <HeroSlideContent slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Carousel controls: ← dots →  (one centered cluster) ──
            Prev arrow, dot indicators and next arrow are grouped into a
            single horizontally-centered flex cluster. The dots remain
            physically between the two arrows and the whole group is
            centered relative to the hero — never split to the far edges.

            Mobile spacing fix: each 44px arrow button holds a 16px icon.
            With justify-center, the icon is centred in the button leaving
            ~14px of invisible-but-taken space on the dots-side, so the
            visible icon-to-dot gap read as ~26px (14px dead space + 12px
            flex gap) even though the button boxes were only 12px apart.

            On mobile (<640px) the arrow icons are aligned to each button's
            inner edge (justify-end on prev, justify-start on next) so the
            visible icon sits flush against the dots-side of its hit area,
            eliminating the dead space. The flex gap is tightened to gap-2
            (8px) to match the dot-to-dot spacing (also gap-2), reading as
            one balanced cluster. The 44px hit targets (size-11) are
            preserved and the button boxes do not overlap the dots.

            On >=640px (sm:) the original justify-center + gap-3 layout is
            restored, so desktop/tablet read as one centered group.

            All behaviour (loop, autoplay, pause on hover/focus,
            prefers-reduced-motion, dot/arrow navigation) is unchanged. */}
        <div className="container-site page-horizontal-padding">
          <div className="flex items-center justify-center gap-2 sm:gap-3 pb-1.5 pt-1.5">
            {/* Prev arrow — 44px touch target; icon aligned to inner (right)
                edge on mobile so it sits flush next to the dots. */}
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="flex items-center justify-end sm:justify-center size-11 rounded-full text-be-charcoal-800/50 hover:text-be-charcoal-800 hover:bg-be-charcoal-800/5 active:bg-be-charcoal-800/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-charcoal-800/30 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>

            {/* Dot indicators — between the arrows */}
            <div className="flex items-center gap-2" role="tablist">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === selectedIndex}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`size-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex
                      ? 'bg-be-charcoal-800 scale-125'
                      : 'bg-be-charcoal-800/20 hover:bg-be-charcoal-800/40'
                  }`}
                  onClick={() => {
                    if (emblaApi) {
                      emblaApi.scrollTo(idx);
                      scheduleAutoplayResume(1500);
                    }
                  }}
                />
              ))}
            </div>

            {/* Next arrow — 44px touch target; icon aligned to inner (left)
                edge on mobile so it sits flush next to the dots. */}
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next slide"
              className="flex items-center justify-start sm:justify-center size-11 rounded-full text-be-charcoal-800/50 hover:text-be-charcoal-800 hover:bg-be-charcoal-800/5 active:bg-be-charcoal-800/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-charcoal-800/30 focus-visible:ring-offset-2"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

