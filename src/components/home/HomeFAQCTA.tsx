
import { FAQ, type FAQItem } from '@/components/ui/FAQ';
import { SectionShell } from '@/components/ui/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TextLink } from '@/components/ui/TextLink';
import { homeFaqs } from '@/data/faqs';

const faqItems: FAQItem[] = homeFaqs;

/**
 * HomeFAQCTA — final content section before the footer.
 *
 * Minimal editorial layout (per IA + FAQ UX pass):
 *   - Desktop: ~32% LEFT (small intro), ~68% RIGHT (accordion)
 *   - Mobile/tablet: intro first, then questions (single column)
 *
 * The accordion uses the existing FAQ component's behavior with a
 * restrained visual treatment (thin border, no filled cards).
 *
 * The small inline "Technical Guidance" text link inside the FAQ intro
 * is the only conversion affordance in this section — no separate button
 * CTA row sits below the questions.
 */
export default function HomeFAQCTA() {
  return (
    <SectionShell
      variant="compact"
      bg="bg-be-warm-white"
      topRule
      ariaLabel="Frequently asked questions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.1fr] gap-8 lg:gap-12">
        {/* ── LEFT (desktop) / FIRST (mobile) — Small intro ── */}
        <div className="order-1 lg:order-1 lg:pt-1">
          <Eyebrow>COMMON QUESTIONS</Eyebrow>
          <h2 className="text-section-h2 text-be-charcoal-950 mt-3 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-body text-be-grey-650 leading-relaxed mb-5">
            Practical answers about our products, certifications, sizing and enquiry
            process — all in one place.
          </p>
          <TextLink href="/contact-us?type=technical-guidance">
            Technical Guidance
          </TextLink>
        </div>

        {/* ── RIGHT (desktop) / SECOND (mobile) — Questions accordion ── */}
        <div className="order-2 lg:order-2 min-w-0">
          <FAQ items={faqItems} />
        </div>
      </div>
    </SectionShell>
  );
}
