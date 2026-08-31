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
  Factory,
  Server,
  Wrench,
  FlaskConical,
  ClipboardCheck,
  Route,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { pvcFlooringVisuals } from '@/data/product-visuals';

/* ── Breadcrumb items ── */

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'PVC Flooring Solutions' },
];

/* ── Key benefits — client-approved "Why Bharat Electrosafe" points (7) ── */

const keyBenefits = [
  { icon: Shield, text: 'Designed for demanding industrial and commercial environments' },
  { icon: Check, text: 'Quality-focused manufacturing and supply' },
  { icon: Ruler, text: 'Solutions aligned with IS 3462:1986' },
  { icon: Layers, text: 'Durable and practical flooring solutions' },
  { icon: Zap, text: 'Easy to maintain and suitable for regular use' },
  { icon: Building2, text: 'Suitable for diverse industrial, electrical and commercial applications' },
  { icon: Factory, text: "Part of Bharat Electrosafe's growing portfolio of industrial safety and infrastructure solutions" },
];

/* ── Applications — client-approved (8) ── */

const applications: { icon: LucideIcon; name: string; description: string }[] = [
  {
    icon: Factory,
    name: 'Industrial and manufacturing facilities',
    description: 'PVC flooring for industrial and manufacturing facilities with high-use working environments.',
  },
  {
    icon: Zap,
    name: 'Electrical and utility areas',
    description: 'Flooring for electrical and utility areas where durable, practical surfaces are required.',
  },
  {
    icon: Building2,
    name: 'Commercial buildings and offices',
    description: 'PVC flooring for commercial buildings, offices and corporate interiors.',
  },
  {
    icon: Server,
    name: 'Control rooms and operational areas',
    description: 'Flooring for control rooms and operational areas requiring ease of maintenance.',
  },
  {
    icon: Wrench,
    name: 'Workshops and maintenance facilities',
    description: 'PVC flooring for workshops and maintenance facilities with regular use.',
  },
  {
    icon: FlaskConical,
    name: 'Laboratories and technical areas',
    description: 'Flooring for laboratories and technical areas where hygiene and maintenance are essential.',
  },
  {
    icon: Route,
    name: 'Institutional and infrastructure projects',
    description: 'PVC flooring for institutional and infrastructure projects.',
  },
  {
    icon: ClipboardCheck,
    name: 'Other high-traffic and specialised flooring applications',
    description: 'PVC flooring for other high-traffic and specialised flooring applications.',
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
              <Eyebrow className="mb-3">Durable Flooring for Industrial, Electrical & Commercial Applications</Eyebrow>
              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                PVC Flooring Solutions
              </h1>

              {/* Introduction — client-approved */}
              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                Bharat Electrosafe offers PVC Flooring Solutions designed for demanding industrial, electrical and commercial environments where durability, safety, hygiene and ease of maintenance are essential. Our PVC flooring solutions are manufactured with a focus on quality, performance and long-term reliability and are designed in line with IS 3462:1986 for relevant industrial, electrical and commercial flooring applications.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote&product=pvc-flooring-solutions" size="lg">
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
                title="PVC Flooring Overview"
                supportingText="PVC flooring provides a practical and efficient flooring solution for a wide range of facilities, offering benefits such as durability, ease of cleaning and maintenance, and suitability for high-use working environments."
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
                supportingText="Bharat Electrosafe PVC Flooring Solutions can be considered for the following applications:"
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
              supportingText="Our PVC flooring solutions are designed in line with IS 3462:1986 for relevant industrial, electrical and commercial flooring applications. Detailed technical specifications, thickness options and surface pattern availability are provided on request with a formal quotation."
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

        {/* ── 5. Closing statement — client-approved ── */}
        <SectionShell variant="compact" bg="bg-be-warm-white" topRule ariaLabel="Our commitment">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Our Commitment"
              title="Reliable, quality-driven solutions"
              align="center"
            />
            <p className="text-body-large text-be-grey-650 leading-relaxed">
              At Bharat Electrosafe, we are committed to delivering reliable,
              quality-driven and standards-focused solutions for industries,
              infrastructure projects, utilities and commercial establishments.
            </p>
          </div>
        </SectionShell>

        {/* ── 6. CTA ── */}
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
              <PrimaryButton href="/contact-us?type=quote&product=pvc-flooring-solutions" size="lg">
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
