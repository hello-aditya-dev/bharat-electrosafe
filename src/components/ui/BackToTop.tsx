'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop — client component for the scroll-to-top floating button.
 *
 * Previously used framer-motion (AnimatePresence + motion.button) for the
 * show/hide animation. Replaced with CSS opacity/transform transitions to
 * eliminate the framer-motion runtime from every route. The button is
 * conditionally rendered (not just visually hidden) so it is removed from
 * the tab sequence and accessibility tree when not visible.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 size-12 rounded-full bg-be-yellow-500 text-be-charcoal-950 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-be-yellow-600 hover:scale-110 animate-back-to-top-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
      aria-label="Scroll back to top"
      type="button"
    >
      <ArrowUp className="size-5" aria-hidden="true" focusable="false" />
    </button>
  );
}
