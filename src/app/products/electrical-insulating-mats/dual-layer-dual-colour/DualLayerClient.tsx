'use client';

import {
  Layers,
  Eye,
  ClipboardCheck,
  Wrench,
  ShieldCheck,
  Factory,
  Building2,
  Server,
  Zap,
  Globe,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
import { ImageFrame } from '@/components/ui/ImageFrame';
import { FeatureList } from '@/components/ui/FeatureList';
import ColourwaySchematic from '@/components/products/ColourwaySchematic';
import { biColourVisuals } from '@/data/product-visuals';
import { PRODUCT_ROUTES } from '@/data/product-routes';

/* ── Client-approved applications (exact list) ── */
const APPLICATIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: 'Electrical substations' },
  { icon: Building2, label: 'Switchgear and control rooms' },
  { icon: Zap, label: 'Transformer and panel areas' },
  { icon: Factory, label: 'Power generation facilities' },
  { icon: Wrench, label: 'Electrical maintenance areas' },
  { icon: Factory, label: 'Industrial plants and manufacturing facilities' },
  { icon: Server, label: 'Utility and infrastructure installations' },
  { icon: ShieldCheck, label: 'Other high-voltage electrical working environments' },
];

/* ── Breadcrumb ── */
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: PRODUCT_ROUTES.products },
  { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { label: 'Dual Layer Dual Colour' },
];

export default function DualLayerClient() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ═══ 1. HERO ═══ */}
        <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
          <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Text */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-5 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-2.5 lg:mb-3">
                <TechnicalBadge label="IEC 61111" />
                <TechnicalBadge label="Specialized Innovation" />
              </div>

              <Eyebrow className="mb-3">An Innovative Safety Solution from India to the World</Eyebrow>

              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                Dual Layer Dual Colour HV Electrical Insulating Mats
              </h1>

              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                Bharat Electrosafe introduces an innovative advancement in the field
                of electrical safety with its Dual Layer Dual Colour High Voltage
                Electrical Insulating Mats, designed to offer an additional visual
                safety advantage for critical electrical working environments.
              </p>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote&product=dual-layer-dual-colour" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="#innovation">
                  Explore the Innovation
                </SecondaryButton>
              </div>
            </div>

            {/* Media */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
              <ImageFrame
                src={biColourVisuals.hero.src}
                alt={biColourVisuals.hero.alt}
                aspectRatio="landscape"
                fit={biColourVisuals.hero.fit}
                priority
              />
            </div>
          </div>
        </SectionShell>

        {/* ═══ 2. CORE INNOVATION — VISIBLE WEAR INDICATION ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule id="innovation" ariaLabel="The Innovation: A Visible Wear Indication">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Left — two-layer visual */}
            <div className="lg:w-[45%]">
              <ImageFrame
                src={biColourVisuals.technicalDetail?.src ?? biColourVisuals.card.src}
                alt={biColourVisuals.technicalDetail?.alt ?? 'Dual layer dual colour insulating mat cross-section'}
                aspectRatio="landscape"
                fit="contain"
              />
            </div>

            {/* Right — innovation explanation */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="The Innovation"
                title="A Visible Wear Indication"
                supportingText="Unlike conventional single-colour insulating mats, Bharat Electrosafe's innovative Dual Layer Dual Colour technology provides an additional visual reference for monitoring the condition of the mat."
              />

              <p className="text-body text-be-grey-650 leading-relaxed">
                Developed with a unique dual-layer and dual-colour construction,
                these insulating mats are designed to provide a visible indication
                of wear or damage to the top layer. When the upper layer is
                significantly worn, damaged or deteriorated, the contrasting colour
                of the underlying layer can become visible, helping users identify
                the need for inspection and timely replacement.
              </p>

              <p className="text-body text-be-charcoal-800 font-medium">
                The contrasting lower layer is designed to act as a visible wear
                indicator, supporting:
              </p>

              <ColourwaySchematic
                size="full"
                topLabel="Black"
                bottomLabel="Yellow"
                note="Documented colourway: Black surface with a contrasting Yellow wear-indicator layer, in line with the IEC 61111 dual-colour construction. Schematic illustration — request photographs for the actual finish."
              />

              <FeatureList
                items={[
                  { icon: Eye, text: 'Easier identification of excessive surface wear or damage' },
                  { icon: ClipboardCheck, text: "Improved visual inspection of the mat's condition" },
                  { icon: Wrench, text: 'Better maintenance and replacement planning' },
                  { icon: ShieldCheck, text: 'Enhanced awareness of product condition in critical electrical areas' },
                  { icon: Layers, text: 'An additional layer of confidence for electrical safety applications' },
                ]}
              />
            </div>
          </div>
        </SectionShell>

        {/* ═══ 3. APPLICATIONS ═══ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Applications">
          <SectionHeader
            eyebrow="Applications"
            title="Where It's Used"
            supportingText="Dual Layer Dual Colour HV Electrical Insulating Mats are designed for demanding high-voltage electrical working environments."
            align="center"
          />
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {APPLICATIONS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-xl border border-be-grey-250 bg-be-white p-4"
              >
                <span className="shrink-0 flex items-center justify-center size-9 rounded-md bg-be-yellow-50" aria-hidden="true">
                  <Icon className="size-4 text-be-yellow-text" />
                </span>
                <span className="text-body font-medium text-be-charcoal-950">{label}</span>
              </li>
            ))}
          </ul>
        </SectionShell>

        {/* ═══ 4. INNOVATION STORY ═══ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="Innovation Driven by Safety">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Innovation Story"
              title="Innovation Driven by Safety"
              align="center"
            />
            <p className="text-body-large text-be-grey-650 leading-relaxed">
              This innovation addresses a practical challenge associated with
              conventional insulating mats: visually identifying significant wear
              or deterioration. By making the condition of the mat easier to
              observe, Bharat Electrosafe supports safer inspection and
              maintenance practices in critical electrical areas.
            </p>
          </div>
        </SectionShell>

        {/* ═══ 5. INDIA TO THE WORLD ═══ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="From India to the World">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center">
            <div className="lg:w-[55%] flex flex-col gap-5">
              <SectionHeader
                eyebrow="Our Vision"
                title="From India to the World"
              />
              <p className="text-body-large text-be-grey-650 leading-relaxed">
                With this innovation, Bharat Electrosafe aims to take Indian
                manufacturing and electrical safety solutions to global markets.
              </p>
              <p className="text-body text-be-charcoal-800 leading-relaxed">
                Developed in India with a focus on innovation, quality and
                electrical safety, our Dual Layer Dual Colour HV Electrical
                Insulating Mats represent Bharat Electrosafe's vision of
                delivering advanced insulating mat solutions — From India to the
                World.
              </p>
            </div>
            <div className="lg:w-[45%]">
              <ImageFrame
                src={biColourVisuals.card.src}
                alt={biColourVisuals.card.alt}
                aspectRatio="landscape"
                fit={biColourVisuals.card.fit}
              />
            </div>
          </div>
        </SectionShell>

        {/* ═══ 6. WHY BHARAT ELECTROSAFE ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Why Bharat Electrosafe">
          <SectionHeader
            eyebrow="Why Bharat Electrosafe"
            title="A forward-looking innovation in electrical safety"
            supportingText="Designed in line with IEC 61111, our Dual Layer Dual Colour HV Electrical Insulating Mats combine quality-driven Indian manufacturing with an additional visual safety advantage."
          />
          <div className="mt-8 max-w-3xl">
            <FeatureList
              items={[
                { icon: Layers, text: 'Innovative Dual Layer Dual Colour technology' },
                { icon: ClipboardCheck, text: 'Designed in line with IEC 61111' },
                { icon: Eye, text: 'Visible wear indication through contrasting layers' },
                { icon: Wrench, text: 'Focus on improved inspection and maintenance awareness' },
                { icon: ShieldCheck, text: 'Designed for demanding electrical environments' },
                { icon: Factory, text: 'Quality-driven Indian manufacturing' },
                { icon: Globe, text: 'A forward-looking innovation in the electrical insulating mat segment' },
              ]}
            />
          </div>
        </SectionShell>

        {/* ═══ 7. CTA ═══ */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent ariaLabel="Request a quote">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Get in Touch"
              title="Request a Quote"
              align="center"
            />
            <p className="text-body-large text-be-charcoal-800 font-semibold">
              Bharat Electrosafe – Innovating Electrical Safety. From India to the World.
            </p>
            <p className="text-body text-be-grey-650 leading-relaxed">
              Speak to our team about Dual Layer Dual Colour HV Electrical
              Insulating Mats for your electrical installation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PrimaryButton href="/contact-us?type=quote&product=dual-layer-dual-colour" size="lg">
                Request a Quote
                <ArrowRight className="size-4 ml-1.5" />
              </PrimaryButton>
              <SecondaryButton href="/products/electrical-insulating-mats/international-iec-61111">
                View IEC 61111 Range
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
