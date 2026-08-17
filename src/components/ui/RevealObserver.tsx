'use client';

import { useEffect } from 'react';

/**
 * RevealObserver — progressive-enhancement client component.
 *
 * Mounted once from the root layout so every route that uses `.reveal-up`
 * or `.stagger-reveal` gets the same visibility behaviour.
 *
 * The observer directly watches reveal elements, immediately reveals content
 * that is already inside the viewport, and tracks reveal elements added after
 * hydration (for client-rendered islands). If IntersectionObserver is missing
 * or anything goes wrong, content is revealed instead of remaining hidden.
 */
export function RevealObserver() {
  useEffect(() => {
    const REVEAL_SELECTOR = '.reveal-up, .stagger-reveal';
    const SAFETY_TIMEOUT_MS = 2500;

    const reveal = (element: Element) => {
      element.classList.add('revealed');
    };

    const revealAll = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(reveal);
    };

    // Visibility is content-critical; animation is only progressive enhancement.
    // If the browser cannot observe intersections, show everything immediately.
    if (!('IntersectionObserver' in window)) {
      revealAll();

      const mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;

            if (node.matches(REVEAL_SELECTOR)) reveal(node);
            node.querySelectorAll(REVEAL_SELECTOR).forEach(reveal);
          });
        });
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    const register = (element: Element) => {
      if (observed.has(element)) return;
      observed.add(element);

      // Avoid a flash of hidden content when the page loads/restores scroll
      // with a reveal element already visible in the viewport.
      const rect = element.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        reveal(element);
        return;
      }

      observer.observe(element);
    };

    document.querySelectorAll(REVEAL_SELECTOR).forEach(register);

    // React/client islands can add reveal-marked nodes after the initial pass.
    // Register them as soon as they enter the DOM so they cannot remain hidden.
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          if (node.matches(REVEAL_SELECTOR)) register(node);
          node.querySelectorAll(REVEAL_SELECTOR).forEach(register);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Final fail-safe: animation must never gate page content.
    const safetyTimer = window.setTimeout(revealAll, SAFETY_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(safetyTimer);
    };
  }, []);

  return null;
}
