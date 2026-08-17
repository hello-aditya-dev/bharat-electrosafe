'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TechnicalBadge } from '@/components/ui/TechnicalBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FeatureList } from '@/components/ui/FeatureList';
import { ImageFrame } from '@/components/ui/ImageFrame';
import {
  Layers,
  Zap,
  Building2,
  Shield,
  Check,
  Ruler,
  Phone,
  FileText,
  Download,
} from 'lucide-react';
import { pvcFlooringVisuals } from '@/data/product-visuals';

/* ── Breadcrumb items ── */

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'PVC Flooring Solutions' },
];

/* ── Key benefits (source-supported only) ── */

const keyBenefits = [
  { icon: Shield, text: 'PVC flooring manufactured as per IS 3462:1986 for residential and commercial interior flooring applications' },
  { icon: Layers, text: 'BharatSmart Floor™ product range — PVC flooring for homes, offices and commercial interiors' },
  { icon: Building2, text: 'Designed for residential and commercial interior flooring applications' },
  { icon: Zap, text: 'Available as a practical finished flooring option for everyday indoor spaces' },
];

/* ── Applications (source-supported) ── */

const applications = [
  {
    icon: Shield,
    name: 'Homes & Apartments',
    description: 'PVC flooring for living spaces, bedrooms, home offices and other residential interiors.',
  },
  {
    icon: Building2,
    name: 'Offices & Workspaces',
    description: 'Flooring for offices, reception areas, meeting spaces, waiting areas and shared work environments.',
  },
  {
    icon: Layers,
    name: 'Retail & Commercial Interiors',
    description: 'PVC flooring for showrooms, shops, customer-facing spaces and other commercial interiors.',
  },
];

/* ── Assurance items (source-supported) ── */

const assuranceItems = [
  { id: 'standard', icon: Ruler, label: 'IS 3462:1986' },
  { id: 'documentation', icon: FileText, label: 'Documentation available on request' },
  { id: 'delivery', icon: Check, label: 'Delivery schedule confirmed with quotation' },
  { id: 'technical-support', icon: Shield, label: 'Technical support available' },
];

export default function PVCFlooringClient() {

  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ── 1. Hero ── */}
        <SectionShell variant="productHero" bg="be-page-top-tint">
          <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Text side */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-5 flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2.5 lg:mb-3">
                <TechnicalBadge label="IS 3462:1986" />
                <TechnicalBadge label="BharatSmart Floor™" />
              </div>

              {/* Eyebrow + H1 */}
              <Eyebrow className="mb-3">PVC Flooring</Eyebrow>
              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                PVC Flooring Solutions
              </h1>

              {/* Introduction */}
              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                BharatSmart Floor™ PVC flooring is designed for homes, offices and commercial interiors, providing a practical and attractive flooring surface for everyday indoor spaces.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="/contact-us?type=technical-guidance&product=pvc-flooring-solutions">
                  Request Specifications
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — graphic placeholder (no photographic image available) */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7">
              <ImageFrame
                src={pvcFlooringVisuals.hero.src}
                alt={pvcFlooringVisuals.hero.alt}
                aspectRatio="landscape"
                fit={pvcFlooringVisuals.hero.fit}
                priority
              />
            </div>
          </div>
        </SectionShell>

        {/* ── Assurance strip ── */}
        <section
          aria-labelledby="pvc-assurance-heading"
          className="be-assurance-strip border-y border-be-yellow-100 bg-be-yellow-50"
        >
          <div className="container-site page-horizontal-padding py-6 md:py-7">
            <h2 id="pvc-assurance-heading" className="sr-only">
              Product assurance
            </h2>
            <ul className="be-assurance-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {assuranceItems.map((item) => (
                <li
                  key={item.id}
                  className="be-assurance-item flex items-center gap-3"
                  data-assurance-id={item.id}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-be-white border border-be-yellow-100"
                    aria-hidden="true"
                  >
                    <item.icon className="h-4 w-4 text-be-yellow-text" />
                  </span>
                  <span className="text-[14px] leading-snug font-medium text-be-charcoal-950">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 2. Overview ── */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Left: graphic placeholder for overview image */}
            <div className="lg:w-[45%] order-first lg:order-last">
              <ImageFrame
                src={pvcFlooringVisuals.gallery[0].src}
                alt={pvcFlooringVisuals.gallery[0].alt}
                aspectRatio="landscape"
                fit={pvcFlooringVisuals.gallery[0].fit}
              />
            </div>

            {/* Right: overview text + key benefits */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="Product Overview"
                title="BharatSmart Floor™ Overview"
                supportingText="BharatSmart Floor™ is Bharat Electrosafe's PVC flooring range for residential, office and commercial interiors. It is suitable for spaces such as homes, apartments, offices, reception areas, retail interiors, clinics, educational spaces and hospitality environments. The range provides a practical finished flooring surface for everyday interior use."
              />

              <FeatureList
                items={keyBenefits.map((b) => ({ icon: b.icon, text: b.text }))}
              />
            </div>
          </div>
        </SectionShell>

        {/* ── 3. Applications ── */}
        <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left: graphic placeholder for application image */}
            <div className="lg:w-[45%]">
              <ImageFrame
                src={pvcFlooringVisuals.gallery[1].src}
                alt={pvcFlooringVisuals.gallery[1].alt}
                aspectRatio="landscape"
                fit={pvcFlooringVisuals.gallery[1].fit}
              />
            </div>

            {/* Right: applications list */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="Applications"
                title="Where It's Used"
                supportingText="BharatSmart Floor™ PVC flooring is designed for residential, office and commercial interior applications as per IS 3462:1986."
              />

              <div className="flex flex-col gap-4">
                {applications.map((app) => (
                  <div key={app.name} className="flex items-start gap-4">
                    <span className="shrink-0 flex items-center justify-center size-9 rounded-md bg-be-yellow-50">
                      <app.icon className="size-4 text-be-yellow-text" />
                    </span>
                    <div>
                      <div className="text-body font-semibold text-be-charcoal-950">{app.name}</div>
                      <div className="text-body text-be-grey-650">{app.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Supporting field */}
              <div className="rounded-lg bg-be-yellow-50 p-5 border border-be-yellow-100">
                <p className="text-body-large text-be-charcoal-800 font-medium">
                  Need a custom PVC flooring configuration for your specific environment?
                </p>
                <p className="text-body text-be-grey-650 mt-1">
                  Contact our engineering team to discuss tailored solutions for your installation requirements.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ── 4. Standards compliance note (no invented technical table) ── */}
        <SectionShell variant="technical" bg="bg-be-cream" topRule>
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Standards Compliance"
              title="IS 3462:1986 Compliant"
              supportingText="BharatSmart Floor™ PVC flooring is manufactured as per IS 3462:1986, the Indian Standard for PVC floor coverings. Detailed technical specifications, thickness options and surface pattern availability are provided on request with a formal quotation."
            />

            {/* Clean standards card — no invented data */}
            <div className="rounded-lg border border-be-grey-250 bg-be-white p-6 max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center size-10 rounded-full bg-be-yellow-50 shrink-0">
                  <Ruler className="size-5 text-be-yellow-text" />
                </span>
                <div>
                  <div className="text-body font-semibold text-be-charcoal-950">IS 3462:1986</div>
                  <div className="text-metadata text-be-grey-650">Indian Standard — PVC Floor Coverings</div>
                </div>
              </div>
              <p className="text-body text-be-grey-650">
                For complete technical data including available thicknesses, surface
                patterns, colours, and performance characteristics, please request
                specifications through our sales team.
              </p>
            </div>
          </div>
        </SectionShell>

        {/* ── 5. CTA ── */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-be-charcoal-950">
              Request a quote for PVC Flooring Solutions
            </h2>
            <p className="text-body-large text-be-grey-650">
              Get pricing, specification details and delivery timelines for your
              project. Our sales team responds within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/contact-us?type=quote" size="lg">
                Request a Quote
              </PrimaryButton>
              <SecondaryButton href="/contact-us?type=technical-guidance&product=pvc-flooring-solutions">
                <Download className="size-4 mr-1.5" />
                Request Specifications
              </SecondaryButton>
              <SecondaryButton href="tel:+919870394721">
                <Phone className="size-4 mr-1.5" />
                Call Sales
              </SecondaryButton>
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
