'use client';

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
import { ImageFrame } from '@/components/ui/ImageFrame';
import {
  Package,
  Square,
  Pipette,
  Zap,
  ArrowRight,
  Phone,
  FileText,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { otherProductsVisuals } from '@/data/product-visuals';

/* ── Breadcrumb items ── */

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Other Products' },
];

/* ── Product sections data ──
 *
 * Each entry states only what the source establishes: Bharat Electrosafe
 * supplies these items. No invented specifications, dimensions, materials,
 * or performance claims.
 */

interface OtherProductSection {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  slotId: string;
}

const productSections: OtherProductSection[] = [
  {
    id: 'rubber-sheet',
    name: 'Rubber Sheet',
    icon: Square,
    description:
      'Bharat Electrosafe supplies industrial rubber sheets for a range of applications. Specifications and material grades are provided on request.',
    slotId: 'other-products-rubber-sheet',
  },
  {
    id: 'rubber-hose-pipe',
    name: 'Rubber Hose Pipe',
    icon: Pipette,
    description:
      'Bharat Electrosafe supplies rubber hose pipes for industrial fluid and air transfer applications. Specifications are provided on request.',
    slotId: 'other-products-rubber-hose-pipe',
  },
  {
    id: 'esd-mat',
    name: 'ESD Mat',
    icon: Zap,
    description:
      'Bharat Electrosafe supplies electrostatic discharge (ESD) protective mats for electronics manufacturing and sensitive equipment areas. Specifications are provided on request.',
    slotId: 'other-products-esd-mat',
  },
  {
    id: 'conveyor-belt',
    name: 'Conveyor Belt',
    icon: ArrowRight,
    description:
      'Bharat Electrosafe supplies conveyor belts for industrial material handling applications. Specifications are provided on request.',
    slotId: 'other-products-conveyor-belt',
  },
];

/* ── Assurance items (source-supported) ── */

const assuranceItems = [
  { id: 'documentation', icon: FileText, label: 'Documentation available on request' },
  { id: 'delivery', icon: Package, label: 'Delivery schedule confirmed with quotation' },
  { id: 'technical-support', icon: Shield, label: 'Technical support available' },
];

export default function OtherProductsClient() {

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
              {/* Eyebrow + H1 */}
              <Eyebrow className="mb-3">Other Products</Eyebrow>
              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                Other Products from Bharat Electrosafe
              </h1>

              {/* Introduction */}
              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                In addition to electrical insulating mats, waterproofing solutions
                and PVC flooring, Bharat Electrosafe supplies rubber sheets,
                rubber hose pipes, ESD mats and conveyor belts for industrial
                rubber and safety applications.
              </p>

              {/* Quick-nav links to anchored sections */}
              <div className="flex flex-wrap gap-2 mb-5 lg:mb-6">
                {productSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-be-cream text-be-charcoal-800 text-metadata font-semibold px-3 py-1.5 hover:bg-be-yellow-50 hover:text-be-charcoal-950 transition-colors"
                  >
                    <sec.icon className="size-3.5" aria-hidden="true" />
                    {sec.name}
                  </a>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="/contact-us?type=technical-guidance">
                  Contact Technical Team
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — hero image */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7">
              <ImageFrame
                src={otherProductsVisuals.hero.src}
                alt={otherProductsVisuals.hero.alt}
                aspectRatio="landscape"
                fit={otherProductsVisuals.hero.fit}
                priority
              />
            </div>
          </div>
        </SectionShell>

        {/* ── Assurance strip ── */}
        <section
          aria-labelledby="other-products-assurance-heading"
          className="be-assurance-strip border-y border-be-yellow-100 bg-be-yellow-50"
        >
          <div className="container-site page-horizontal-padding py-6 md:py-7">
            <h2 id="other-products-assurance-heading" className="sr-only">
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

        {/* ── 2. Product sections (anchored) ── */}
        {productSections.map((sec, index) => {
          const isEven = index % 2 === 0;
          const bg = isEven ? 'bg-be-white' : 'bg-be-warm-white';
          /* Map each product section to its gallery image index:
             rubber-sheet → 0, rubber-hose-pipe → 2, esd-mat → 3, conveyor-belt → 4 */
          const galleryIndexMap = [0, 2, 3, 4];
          const galleryItem = otherProductsVisuals.gallery[galleryIndexMap[index]];

          return (
            <SectionShell
              key={sec.id}
              id={sec.id}
              variant="standard"
              bg={bg}
              topRule
              ariaLabel={sec.name}
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
                {/* Product image */}
                <div className="lg:w-[40%] order-first lg:order-last">
                  <ImageFrame
                    src={galleryItem.src}
                    alt={galleryItem.alt}
                    aspectRatio="landscape"
                    fit={galleryItem.fit}
                  />
                </div>

                {/* Text + CTA */}
                <div className="lg:w-[60%] flex flex-col gap-5">
                  <SectionHeader
                    eyebrow="Product Range"
                    title={sec.name}
                    supportingText={sec.description}
                  />

                  <div className="flex flex-wrap gap-3">
                    <SecondaryButton href={`/contact-us?type=technical-guidance&product=${sec.id}`}>
                      <FileText className="size-4 mr-1.5" />
                      Request Specifications
                    </SecondaryButton>
                    <PrimaryButton href={`/contact-us?type=quote&product=${sec.id}`}>
                      Request a Quote
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </SectionShell>
          );
        })}

        {/* ── 3. CTA ── */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-be-charcoal-950">
              Need specifications or pricing?
            </h2>
            <p className="text-body-large text-be-grey-650">
              Contact our technical team for specifications, material grades and
              pricing on rubber sheets, hose pipes, ESD mats and conveyor belts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/contact-us?type=quote" size="lg">
                Request a Quote
              </PrimaryButton>
              <SecondaryButton href="/contact-us?type=technical-guidance">
                Contact Technical Team
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
