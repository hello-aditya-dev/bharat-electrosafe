
import { company } from '@/data/company';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { ShieldCheck, Phone, MessageCircle } from 'lucide-react';

export default function HomeCTA() {
  return (
    <section className="bg-gradient-to-b from-be-yellow-50 to-be-cream section-padding-major relative">
      {/* Subtle top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-be-yellow-500" />

      <div className="container-site page-horizontal-padding">
        <div className="reveal-up flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          {/* Decorative shield icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-be-yellow-50 border border-be-yellow-400/30 text-be-yellow-text shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="text-section-h2 text-be-charcoal-950">
            Need help selecting the correct product?
          </h2>

          <p className="text-body-large text-be-grey-650">
            Share your operating voltage, dimensions, quantity and delivery
            location.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
            <PrimaryButton href="/contact-us" size="lg">
              Request a Quote
            </PrimaryButton>

            <SecondaryButton href={`tel:${company.phonePrimaryTel}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call Sales
            </SecondaryButton>

            <SecondaryButton href={company.whatsapp.href} className="gap-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
