'use client';

import Link from 'next/link';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center page-horizontal-padding">
      <div className="container-site text-center py-16">
        <h2 className="text-section-h2 text-be-charcoal-950 mb-4">
          Something went wrong
        </h2>
        <p className="text-body-large text-be-grey-650 max-w-md mx-auto mb-8">
          We encountered an unexpected error loading this page.
          Please try again, or contact our team if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryButton onClick={reset}>
            Try Again
          </PrimaryButton>
          <SecondaryButton href="/products">
            View All Products
          </SecondaryButton>
          <SecondaryButton href="/contact-us">
            Contact Us
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
