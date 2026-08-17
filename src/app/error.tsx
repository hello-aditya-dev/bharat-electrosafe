'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

/**
 * Route-segment error boundary.
 *
 * Catches errors thrown inside any route segment below the root layout.
 * The root layout (Header, Footer, Toaster, fonts, global styles) is still
 * mounted, so this boundary can safely use shared UI components and design
 * tokens.
 *
 * For errors that occur while the ROOT LAYOUT itself is rendering or
 * bootstrapping, see `src/app/global-error.tsx` — that file owns its own
 * <html> and <body> and does NOT depend on the root layout.
 *
 * Detailed error information is logged to the console only in development;
 * visitors never see raw error messages or stack traces.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Route-segment error:', error);
  }

  return (
    <div
      role="alert"
      className="min-h-[50vh] flex items-center justify-center page-horizontal-padding bg-be-warm-white"
    >
      <div className="container-site text-center py-16">
        <h2 className="text-section-h2 text-be-charcoal-950 mb-4">
          Something went wrong
        </h2>
        <p className="text-body-large text-be-grey-650 max-w-md mx-auto mb-8">
          We encountered an unexpected error. Please try again, or
          contact our team if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryButton onClick={reset}>
            Try Again
          </PrimaryButton>
          <SecondaryButton href="/contact-us">
            Contact Us
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
