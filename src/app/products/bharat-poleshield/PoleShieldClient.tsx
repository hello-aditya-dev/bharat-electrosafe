'use client';

import Image from 'next/image';
import { ArrowRight, Info } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { TechnicalBadge } from '@/components/ui/TechnicalBadge';
import { PRODUCT_ROUTES } from '@/data/product-routes';

/** Client-supplied Bharat PoleShield logo asset. */
const POLESHIELD_LOGO_SRC = '/brand/bharat-poleshield-logo.jpeg';
const POLESHIELD_LOGO_ALT =
  'Bharat PoleShield logo — shield emblem with utility pole, protective sleeve, and lightning bolt, with the tagline Protecting Every Pole • Protecting Every Life';

/**
 * Bharat PoleShield brand placeholder page.
 *
 * The client has supplied the brand identity and tagline for Bharat PoleShield.
 * Verified technical product content (material composition, standards,
 * performance, installation, dimensions, etc.) has NOT yet been supplied.
 *
 * Per the master content rule, NO technical specifications, standards or
 * performance claims are invented on this page. The page presents the brand
 * direction and directs enquiries to the contact team until verified technical
 * content is provided.
 */
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: PRODUCT_ROUTES.products },
  { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { label: 'Bharat PoleShield' },
];

export default function PoleShieldClient() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ═══ 1. HERO — BRAND DIRECTION ═══ */}
        <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
          <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-1">
              <TechnicalBadge label="Brand Direction" />
              <TechnicalBadge label="Bharat Electrosafe" />
            </div>

            <Eyebrow className="mb-1">A New Brand Direction</Eyebrow>

            {/* Client-supplied PoleShield logo */}
            <div className="flex items-center gap-4">
              <div className="relative size-20 sm:size-24 shrink-0 rounded-lg overflow-hidden border border-be-grey-250 bg-be-white">
                <Image
                  src={POLESHIELD_LOGO_SRC}
                  alt={POLESHIELD_LOGO_ALT}
                  fill
                  className="object-contain p-1"
                  sizes="96px"
                  priority
                />
              </div>
              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950">
                Bharat PoleShield
              </h1>
            </div>

            {/* Client-approved tagline */}
            <p className="text-body-large font-semibold text-be-navy-800 tracking-wide">
              Protecting Every Pole &nbsp;•&nbsp; Protecting Every Life
            </p>

            <p className="text-body-large text-be-grey-650 leading-relaxed">
              Bharat PoleShield is a distinct brand direction from Bharat
              Electrosafe, focused on pole protection. The brand identity and
              tagline have been established; detailed technical product
              information will be shared separately.
            </p>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/contact-us?type=quote&product=bharat-poleshield" size="lg">
                Enquire About PoleShield
                <ArrowRight className="size-4 ml-1.5" />
              </PrimaryButton>
              <SecondaryButton href="/products">
                View All Products
              </SecondaryButton>
            </div>
          </div>
        </SectionShell>

        {/* ═══ 2. BRAND POSITIONING ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Brand Positioning">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="Brand Positioning"
                title="Protecting Every Pole • Protecting Every Life"
                supportingText="Bharat PoleShield represents Bharat Electrosafe's focus on pole protection — extending the company's commitment to industrial and infrastructure safety."
              />
              <p className="text-body text-be-grey-650 leading-relaxed">
                The Bharat PoleShield brand direction has been established to
                address pole protection requirements. As part of Bharat
                Electrosafe's growing portfolio of industrial safety and
                infrastructure solutions, the PoleShield brand carries the
                company's tagline: <span className="font-semibold text-be-charcoal-950">Protecting Every Pole • Protecting Every Life</span>.
              </p>
            </div>

            {/* Client-supplied logo panel */}
            <div className="lg:w-[45%]">
              <div className="rounded-2xl border border-be-grey-250 bg-be-cream overflow-hidden">
                <div className="flex flex-col items-center text-center gap-4 p-8 lg:p-10">
                  <div className="relative w-full max-w-[240px] aspect-square rounded-xl overflow-hidden bg-be-white border border-be-grey-250">
                    <Image
                      src={POLESHIELD_LOGO_SRC}
                      alt={POLESHIELD_LOGO_ALT}
                      fill
                      className="object-contain p-3"
                      sizes="240px"
                    />
                  </div>
                  <div className="text-sm font-semibold text-be-navy-800 tracking-wide uppercase">
                    Protecting Every Pole • Protecting Every Life
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ═══ 3. INFORMATION NOTE + CTA ═══ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Product Information">
          <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
            <span
              className="flex items-center justify-center size-12 rounded-full bg-be-yellow-50"
              aria-hidden="true"
            >
              <Info className="size-6 text-be-yellow-text" />
            </span>
            <SectionHeader
              eyebrow="Product Information"
              title="Detailed specifications on request"
              align="center"
            />
            <p className="text-body-large text-be-grey-650 leading-relaxed">
              Verified technical product information for Bharat PoleShield —
              including material composition, applicable standards, performance,
              installation and dimensions — will be shared separately. Please
              contact our team to learn more about the PoleShield brand direction
              and its intended applications.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PrimaryButton href="/contact-us?type=quote&product=bharat-poleshield" size="lg">
                Contact Our Team
                <ArrowRight className="size-4 ml-1.5" />
              </PrimaryButton>
            </div>
          </div>
        </SectionShell>
      </main>
      <Footer />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
