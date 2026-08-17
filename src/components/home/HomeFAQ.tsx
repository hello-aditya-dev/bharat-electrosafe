
import { FAQ, type FAQItem } from '@/components/ui/FAQ';
import { homeFaqs } from '@/data/faqs';

/* The visible homepage FAQ accordion consumes the central `homeFaqs`
   array from src/data/faqs. FAQPage JSON-LD is intentionally not
   emitted (spec section 17: Google removed FAQ rich-result display
   in 2026). The visible FAQ content is retained for users. */
const faqItems: FAQItem[] = homeFaqs;

export default function HomeFAQ() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="bg-be-warm-white section-padding-supporting"
    >
      <div className="container-site page-horizontal-padding">
        <div className="max-w-3xl mx-auto">
          <FAQ
            eyebrow="COMMON QUESTIONS"
            title="Frequently asked questions"
            supportingText="Quick answers to common questions about our products, certifications and enquiry process."
            items={faqItems}
          />
        </div>
      </div>
    </section>
  );
}
