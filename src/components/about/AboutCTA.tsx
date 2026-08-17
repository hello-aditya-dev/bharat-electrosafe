'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionShell } from '@/components/ui/SectionShell';

export default function AboutCTA() {
  return (
    <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
      <div className="reveal-up flex flex-col items-center text-center gap-6">
        <h2 className="text-section-h2 text-be-charcoal-950">
          Ready to discuss your requirements?
        </h2>
        <p className="text-body-large text-be-grey-650 max-w-xl">
          Our team is available to provide product specifications, application guidance and certification documentation.
        </p>
        <PrimaryButton href="/contact-us" size="lg">
          Contact Us
        </PrimaryButton>
      </div>
    </SectionShell>
  );
}
