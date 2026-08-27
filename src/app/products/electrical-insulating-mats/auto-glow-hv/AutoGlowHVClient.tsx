'use client';

import {
  Sparkles,
  Eye,
  Moon,
  ShieldCheck,
  Wrench,
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
import { autoGlowVisuals } from '@/data/product-visuals';
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
  { icon: ShieldCheck, label: 'Critical electrical operating areas' },
];

/* ── Breadcrumb ── */
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: PRODUCT_ROUTES.products },
  { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { label: 'Auto Glow HV' },
];

export default function AutoGlowHVClient() {
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

              <Eyebrow className="mb-3">An Innovative Electrical Safety Solution – From India to the World</Eyebrow>

              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                Auto Glow HV Electrical Insulating Mats
              </h1>

              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                Bharat Electrosafe introduces an innovative advancement in
                electrical safety with its Auto Glow High Voltage Electrical
                Insulating Mats, designed to enhance visibility in low-light and
                dark working conditions.
              </p>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote&product=auto-glow-hv" size="lg">
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
                src={autoGlowVisuals.hero.src}
                alt={autoGlowVisuals.hero.alt}
                aspectRatio="landscape"
                fit={autoGlowVisuals.hero.fit}
                priority
              />
            </div>
          </div>
        </SectionShell>

        {/* ═══ 2. CORE INNOVATION — ENHANCES VISIBILITY ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule id="innovation" ariaLabel="Innovation That Enhances Visibility">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Left — visibility visual */}
            <div className="lg:w-[45%]">
              <ImageFrame
                src={autoGlowVisuals.application?.src ?? autoGlowVisuals.hero.src}
                alt={autoGlowVisuals.application?.alt ?? 'Auto glow insulating mat in low-light conditions'}
                aspectRatio="landscape"
                fit={autoGlowVisuals.application?.fit ?? 'cover'}
              />
            </div>

            {/* Right — innovation explanation */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="The Innovation"
                title="Innovation That Enhances Visibility"
                supportingText="Developed with innovative glow technology, these insulating mats are designed to absorb and store light energy and emit a visible glow in low-light conditions."
              />

              <p className="text-body text-be-grey-650 leading-relaxed">
                The glow feature is designed to help improve the visibility of
                designated electrical working areas during reduced lighting
                conditions or power interruptions. The product combines the
                functional role of an electrical insulating mat with a
                visibility-enhancing feature for modern electrical installations
                and critical working environments.
              </p>

              <FeatureList
                items={[
                  { icon: Eye, text: 'Improved visibility of electrical working areas in low-light conditions' },
                  { icon: ShieldCheck, text: 'Easier identification of designated standing and operating zones' },
                  { icon: Moon, text: 'Additional visual guidance during power interruptions' },
                  { icon: Sparkles, text: 'Enhanced awareness of electrical safety areas' },
                  { icon: Zap, text: 'Improved visibility without dependence on an external power source' },
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
            supportingText="Auto Glow HV Electrical Insulating Mats are designed for critical high-voltage electrical working environments."
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
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="Innovation Story">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Innovation Story"
              title="Functional insulation with enhanced visibility"
              align="center"
            />
            <p className="text-body-large text-be-grey-650 leading-relaxed">
              The product combines the functional role of an electrical insulating
              mat with a visibility-enhancing feature for modern electrical
              installations and critical working environments.
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
                This innovative offering represents Bharat Electrosafe's vision of
                taking Indian innovation and manufacturing excellence to global
                markets.
              </p>
              <p className="text-body text-be-charcoal-800 leading-relaxed">
                Developed in India with a focus on innovation, quality and
                electrical safety, our Auto Glow HV Electrical Insulating Mats
                represent a forward-looking advancement in the electrical insulating
                mat segment.
              </p>
              <p className="text-body font-medium text-be-charcoal-950">
                An innovative electrical safety solution – proudly developed in
                India and designed for the world.
              </p>
            </div>
            <div className="lg:w-[45%]">
              <ImageFrame
                src={autoGlowVisuals.card.src}
                alt={autoGlowVisuals.card.alt}
                aspectRatio="landscape"
                fit={autoGlowVisuals.card.fit}
              />
            </div>
          </div>
        </SectionShell>

        {/* ═══ 6. WHY BHARAT ELECTROSAFE ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Why Bharat Electrosafe">
          <SectionHeader
            eyebrow="Why Bharat Electrosafe"
            title="An innovative offering in electrical insulation"
            supportingText="Designed in line with IEC 61111, our Auto Glow HV Electrical Insulating Mats combine quality-driven Indian manufacturing with a visibility-enhancing glow feature."
          />
          <div className="mt-8 max-w-3xl">
            <FeatureList
              items={[
                { icon: Sparkles, text: 'Innovative glow technology for improved low-light visibility' },
                { icon: ShieldCheck, text: 'Designed in line with IEC 61111' },
                { icon: Eye, text: 'Helps identify designated electrical working areas' },
                { icon: Moon, text: 'Supports improved visibility during low-light conditions and power interruptions' },
                { icon: Zap, text: 'No external power source required for the glow feature' },
                { icon: Factory, text: 'Designed for demanding electrical environments' },
                { icon: Wrench, text: 'Quality-driven Indian manufacturing' },
                { icon: Globe, text: 'An innovative offering in the electrical insulating mat segment' },
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
              Speak to our team about Auto Glow HV Electrical Insulating Mats for
              your electrical installation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PrimaryButton href="/contact-us?type=quote&product=auto-glow-hv" size="lg">
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
