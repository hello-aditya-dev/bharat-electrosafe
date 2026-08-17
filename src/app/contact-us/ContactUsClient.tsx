'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import ContactIntro, { ImmediateAssistanceStrip } from '@/components/contact/ContactIntro';
import EnquiryQuoteLayout from '@/components/contact/EnquiryQuoteLayout';
import OfficeLocation from '@/components/contact/OfficeLocation';

/**
 * Contact Us page — two chapters only:
 *
 *   Chapter 1 — Contact and Enquiry
 *   Chapter 2 — Office and Location
 *
 * Chapter 1 desktop layout (precision-polished):
 *   ┌──────────────────────┬─────────────────────────────┐
 *   │ Left (~40%)          │ Right (~60%) — the form     │
 *   │  • Breadcrumb        │  Send Us an Enquiry         │
 *   │  • H1                │  (form + submit + notes)    │
 *   │  • Supporting text   │                             │
 *   │  • Contact rows      │                             │
 *   │  • Response time     │                             │
 *   └──────────────────────┴─────────────────────────────┘
 *   ┌────────────────────────────────────────────────────┐
 *   │ Full-width immediate-assistance strip              │
 *   │ (text left, actions right; pale-yellow bg)         │
 *   └────────────────────────────────────────────────────┘
 *
 * The two main columns now end at approximately the same visual position
 * because the assistance block lives below both of them, not in the left
 * column. No justify-between, no min-height tricks.
 *
 * Mobile source order (per spec):
 *   1. Breadcrumb            6. Immediate-assistance strip
 *   2. Contact page title    7. Office information
 *   3. Supporting text       8. Office hours
 *   4. Contact rows          9. Map or directions card
 *   5. Enquiry form
 */
export default function ContactUsClient() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">
        {/* ───────── Chapter 1 — Contact and Enquiry ───────── */}
        <section
          aria-label="Contact and Enquiry"
          className="be-page-top-tint pt-10 pb-10 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16"
        >
          <div className="container-site page-horizontal-padding">
            {/* Two-column block: contact info (left) + form (right).
                Items-start so neither column is stretched; both end at
                their natural content height. */}
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.42fr_0.58fr] lg:gap-12 lg:items-start">
              {/* Left — breadcrumb, H1, contact rows, response time */}
              <ContactIntro />

              {/* Right — enquiry form */}
              <EnquiryQuoteLayout />
            </div>

            {/* Full-width assistance strip — spans both columns */}
            <ImmediateAssistanceStrip />
          </div>
        </section>

        {/* ───────── Chapter 2 — Office and Location ───────── */}
        <section
          aria-label="Office and Location"
          className="bg-be-white border-t border-be-grey-250 pt-9 pb-9 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
        >
          <div className="container-site page-horizontal-padding">
            <OfficeLocation />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
