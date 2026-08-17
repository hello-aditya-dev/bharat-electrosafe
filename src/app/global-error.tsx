'use client';

import { useEffect } from 'react';

/**
 * Global error boundary — the TRUE root-level error boundary.
 *
 * This component catches errors that occur while the ROOT LAYOUT itself is
 * rendering or bootstrapping. Because the root layout may be the source of
 * the failure, this file:
 *
 *   - Renders its own <html> and <body> elements
 *   - Does NOT depend on Header, Footer, Toaster, or any layout-level
 *     component
 *   - Uses inline styles only, so it remains usable even if the global
 *     stylesheet fails to load
 *   - Logs the full error only in development — visitors never see raw
 *     error messages, stack traces, or sensitive information
 *
 * Coexists with src/app/error.tsx (RouteError), which handles errors
 * inside any route segment below the root layout while the root layout
 * is still functioning.
 */

const REASSURING_TEXT =
  'An unexpected error occurred while loading this page. Your data was not affected. Try again, or return to the home page. If the problem continues, contact our team.';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global (root-layout) error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#FAF7F0', // be-warm-white equivalent
          color: '#14110F', // be-charcoal-950 equivalent
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: 1.5,
        }}
      >
        {/* Accessible alert region — screen readers announce this immediately. */}
        <div
          role="alert"
          aria-live="assertive"
          style={{
            width: '100%',
            maxWidth: '520px',
            textAlign: 'center',
          }}
        >
          {/* Heading */}
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              margin: '0 0 16px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Something went wrong
          </h1>

          {/* Reassuring explanatory text — no raw error details. */}
          <p
            style={{
              fontSize: '16px',
              margin: '0 0 32px 0',
              opacity: 0.85,
            }}
          >
            {REASSURING_TEXT}
          </p>

          {/* Action buttons — adequate touch targets (min 44px height). */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: '44px',
                minWidth: '140px',
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #14110F',
                backgroundColor: '#14110F',
                color: '#FAF7F0',
                cursor: 'pointer',
                outlineOffset: '3px',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                minWidth: '140px',
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #D8D2C4',
                backgroundColor: 'transparent',
                color: '#14110F',
                textDecoration: 'none',
                outlineOffset: '3px',
              }}
            >
              Return to Home
            </a>
            <a
              href="/contact-us"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                minWidth: '140px',
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #D8D2C4',
                backgroundColor: 'transparent',
                color: '#14110F',
                textDecoration: 'none',
                outlineOffset: '3px',
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Inline focus-visible styles — scoped to this page only via a
            unique class, so they survive even when the global stylesheet
            fails to load. */}
        <style>{`
          button:focus-visible,
          a:focus-visible {
            outline: 3px solid #FFC400;
            outline-offset: 3px;
          }
        `}</style>
      </body>
    </html>
  );
}
