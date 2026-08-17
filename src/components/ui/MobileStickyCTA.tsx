'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { company } from '@/data/company';

/**
 * MobileStickyCTA — a bottom-fixed action bar shown only on mobile-width
 * screens. Surfaces the three highest-value conversion actions the moment
 * the user scrolls past the hero: Call, WhatsApp, Request a Quote.
 *
 * Behaviour:
 *   • Hidden on screens ≥ `lg` (1024px) — desktop users see the header CTA.
 *   • Slides up after the user has scrolled past ~1.4 viewport heights, so
 *     it does not cover the hero CTAs on first paint.
 *   • Retracts briefly when the footer enters view, so it never overlaps
 *     the footer's own contact block (avoids double CTA stacks).
 *   • Reduced-motion: appears instantly without slide (handled by CSS
 *     media query in globals.css targeting the be-mobile-cta-in animation).
 *   • Safe-area aware: respects iOS bottom inset via env(safe-area-inset-bottom).
 *   • All buttons expose descriptive aria-labels and are keyboard reachable.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const nearBottom =
        doc.scrollHeight - (scrollY + vh) < 360; // approaching footer
      setVisible(scrollY > vh * 1.4 && !nearBottom);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 animate-[be-mobile-cta-in_0.25s_ease-out]"
      role="region"
      aria-label="Quick contact actions"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="border-t border-be-yellow-500/30 bg-be-navy-900/95 backdrop-blur-md shadow-[0_-6px_20px_-8px_rgba(0,26,67,0.4)]">
        <div className="grid grid-cols-3 gap-px bg-white/5">
          {/* Call */}
          <a
            href={`tel:${company.phonePrimaryTel}`}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-be-navy-900 text-be-white active:bg-be-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-inset"
            aria-label={`Call ${company.phonePrimary}`}
          >
            <Phone className="size-[18px] text-be-brand-yellow" aria-hidden="true" />
            <span className="text-[0.65rem] font-semibold tracking-wide">Call</span>
          </a>
          {/* WhatsApp */}
          <a
            href={company.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-be-navy-900 text-be-white active:bg-be-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-inset"
            aria-label={`Chat on WhatsApp ${company.whatsapp.label}`}
          >
            <MessageCircle className="size-[18px] text-be-brand-yellow" aria-hidden="true" />
            <span className="text-[0.65rem] font-semibold tracking-wide">WhatsApp</span>
          </a>
          {/* Quote */}
          <Link
            href="/contact-us"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-be-brand-yellow text-be-charcoal-950 active:bg-be-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-white focus-visible:ring-inset"
            aria-label="Request a quote"
          >
            <FileText className="size-[18px]" aria-hidden="true" />
            <span className="text-[0.65rem] font-bold tracking-wide">Get Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
