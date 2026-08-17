'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { Leader } from '@/data/team';
import { cn } from '@/lib/utils';

/**
 * LeadershipGrid — three-column flip-card leadership grid.
 *
 * Reproduces the original bharatelectrosafe.com/about-us.php interaction:
 * each card has a front (portrait) face and a back (biography) face.
 * The card flips on Y-axis to reveal the biography inside a fixed-size
 * card, with internal scrolling where biography length exceeds the card body.
 *
 * The card itself does NOT expand the page vertically. The biography is
 * read inside the card via overflow-y scroll.
 *
 * Interaction:
 *   • Desktop: hover enters → flips; hover leaves → un-flips.
 *             Click anywhere on card toggles "lock" — a locked card stays
 *             flipped even on hover-leave. Click again to unlock. Escape
 *             always unlocks.
 *   • Mobile/Tablet: tap anywhere on card toggles the flip.
 *   • Keyboard: Enter/Space toggles; Escape returns to portrait.
 *
 * Accessibility:
 *   • aria-expanded on the toggle button.
 *   • Back-face content hidden from screen readers when not flipped
 *     (aria-hidden on the back face when collapsed).
 *   • Focus-visible ring on interactive elements.
 *   • prefers-reduced-motion: replaces 3D flip with immediate/fade change.
 *
 * Layout:
 *   • Desktop (≥1024px): three equal columns, fixed card height ~500px.
 *   • Tablet (640–1023px): two columns.
 *   • Mobile (<640px): one column.
 *
 * Touch targets: all interactive buttons have min-h-[44px] for mobile.
 */

interface LeadershipGridProps {
  leaders: Leader[];
}

export function LeadershipGrid({ leaders }: LeadershipGridProps) {
  return (
    <div className="be-leadership-grid">
      {leaders.map((leader, index) => (
        <LeaderFlipCard
          key={leader.name}
          leader={leader}
          index={index}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   LeaderFlipCard — a single flip/swivel leadership card.
   ──────────────────────────────────────────── */

interface LeaderFlipCardProps {
  leader: Leader;
  index: number;
}

/** Check whether the primary pointer supports hover (desktop). */
function isHoverCapablePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

function LeaderFlipCard({ leader, index }: LeaderFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isLockedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonId = `leader-flip-toggle-${index}`;
  const bioRegionId = `leader-flip-bio-${index}`;

  /* ── Flip helpers ── */

  /** Toggle flip — used by click/tap and keyboard.
   *  On desktop, clicking the card toggles lock. */
  const handleToggle = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      // When toggling on via click/tap, lock the card so hover-leave
      // doesn't immediately un-flip it on desktop.
      // When toggling off, always unlock.
      isLockedRef.current = next;
      return next;
    });
  }, []);

  /** Explicitly un-flip (Escape key) */
  const handleEscape = useCallback(() => {
    setIsFlipped(false);
    isLockedRef.current = false;
  }, []);

  /** Desktop hover enter — flip if not locked */
  const handleMouseEnter = useCallback(() => {
    if (!isHoverCapablePointer()) return;
    if (!isLockedRef.current) {
      setIsFlipped(true);
    }
  }, []);

  /** Desktop hover leave — un-flip only if not locked */
  const handleMouseLeave = useCallback(() => {
    if (!isHoverCapablePointer()) return;
    if (!isLockedRef.current) {
      setIsFlipped(false);
    }
  }, []);

  /** Click anywhere on the card → toggle flip / lock */
  const handleCardClick = useCallback(
    (event: React.MouseEvent) => {
      // Card-level toggle. Ignore clicks that originated from ANY
      // button inside the card — the View Profile and Back buttons
      // each manage their own toggle and also call stopPropagation().
      // Without this guard, a Back-button tap would bubble here and
      // call handleToggle a SECOND time, cancelling the close. That
      // double-toggle is the root cause of the mobile "Back button
      // reopens the card" bug (desktop was masked because users
      // close cards via hover-leave, not Back).
      const target = event.target as HTMLElement;
      if (target.closest('button')) return;
      handleToggle();
    },
    [handleToggle],
  );

  /** Keyboard handler for the card wrapper */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleEscape();
      }
    },
    [handleEscape],
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        'be-leader-flip-card',
        isFlipped && 'be-leader-flip-card-flipped'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      /* Allow focus to reach the card so Escape works when card is focused */
      tabIndex={-1}
    >
      {/* ── Front face — Portrait presentation ── */}
      {/* pointer-events-none when flipped so the rotated-away front
          face cannot intercept taps (some mobile browsers still
          hit-test backface-hidden elements). Only the visible face
          is ever interactive. */}
      <div
        className={cn('be-leader-flip-front', isFlipped && 'pointer-events-none')}
        aria-hidden={isFlipped || undefined}
      >
        {/* Portrait — shorter aspect ratio for compact height */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-be-navy-800">
          <Image
            src={leader.image}
            alt={leader.imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
            style={
              leader.imagePosition
                ? { objectPosition: leader.imagePosition }
                : undefined
            }
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          {/* Subtle gradient overlay at bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-be-navy-800/60 to-transparent pointer-events-none" />
        </div>

        {/* Name + Role below portrait — tighter padding */}
        <div className="p-3 sm:p-4">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-be-charcoal-950 leading-tight">
            {leader.name}
          </h3>
          <p className="mt-1 text-sm font-semibold tracking-wide text-be-yellow-text">
            {leader.role}
          </p>

          {/* Toggle — text-link style on desktop, 44px button on mobile */}
          <button
            id={buttonId}
            type="button"
            onClick={(event) => {
              // Isolate the button tap from the card-level onClick so
              // the flip toggles exactly once (no double-toggle).
              event.stopPropagation();
              handleToggle();
            }}
            aria-expanded={isFlipped}
            aria-controls={bioRegionId}
            aria-label={`View profile of ${leader.name}`}
            className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-be-navy-700 hover:text-be-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-be-warm-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 px-2 py-1.5 sm:px-0 sm:py-0 rounded-md sm:rounded-none bg-be-navy-800/5 sm:bg-transparent"
          >
            <span className="sm:hidden">View Profile</span>
            <span className="hidden sm:inline">View profile</span>
            <span aria-hidden="true" className="hidden sm:inline">→</span>
          </button>
        </div>
      </div>

      {/* ── Back face — Biography presentation ── */}
      <div
        id={bioRegionId}
        className={cn('be-leader-flip-back', !isFlipped && 'pointer-events-none')}
        aria-hidden={!isFlipped || undefined}
        role={isFlipped ? 'region' : undefined}
        aria-labelledby={buttonId}
      >
        <div className="be-leader-flip-back-inner">
          {/* Name + Designation */}
          <div className="p-3 sm:p-4 border-b border-be-grey-250">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-be-charcoal-950 leading-tight">
              {leader.name}
            </h3>
            <p className="mt-1 text-sm font-semibold tracking-wide text-be-yellow-text">
              {leader.role}
            </p>
          </div>

          {/* Thin accent divider */}
          <div className="h-[3px] bg-gradient-to-r from-be-brand-yellow via-be-brand-blue to-be-brand-yellow mx-3 sm:mx-4" />

          {/* Scrollable biography area — full bio only */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 be-flip-card-scroll">
            <div className="space-y-2.5">
              {leader.fullProfile.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[0.875rem] leading-[1.65] text-be-grey-650"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Back button at bottom */}
          <div className="p-3 sm:p-4 border-t border-be-grey-250">
            <button
              type="button"
              onClick={(event) => {
                // Isolate the Back tap from the card-level onClick so
                // the close is not immediately cancelled by a second
                // toggle bubbling up to the card.
                event.stopPropagation();
                handleToggle();
              }}
              aria-expanded={isFlipped}
              aria-controls={bioRegionId}
              aria-label={`Return to portrait of ${leader.name}`}
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border border-be-grey-250 bg-be-white text-[0.8125rem] font-semibold text-be-charcoal-950 hover:border-be-yellow-400 hover:bg-be-yellow-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-be-warm-white w-full"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadershipGrid;
