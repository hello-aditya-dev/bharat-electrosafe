'use client';

import Image from 'next/image';
import {
  Shield,
  Zap,
  Eye,
  Sun,
  Layers,
  Ruler,
  Award,
  Globe,
  ChevronRight,
  Phone,
  Check,
  ArrowRight,
  Palette,
  Factory,
  Building2,
  Server,
  Train,
  BatteryCharging,
  FlaskConical,
  ClipboardCheck,
  AlertTriangle,
  Wrench,
  Flame,
  Droplets,
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
import { cn } from '@/lib/utils';
import { FeatureList } from '@/components/ui/FeatureList';
import { company } from '@/data/company';
import { iecVisuals } from '@/data/product-visuals';
import { iecClasses as iecClassData } from '@/data/iec-61111';
import { PRODUCT_ROUTES } from '@/data/product-routes';

/* ────────────────────────────────────────────
   IEC 61111:2009 Class specification data
   Single source of truth: src/data/iec-61111.ts
   (values taken directly from the official Bharat
   Electrosafe IEC 61111 brochure).
   ──────────────────────────────────────────── */

/* ────────────────────────────────────────────
   Applications — from client IEC 61111 brochure
   ──────────────────────────────────────────── */

const iecApplications: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: 'Electrical Substations' },
  { icon: Factory, label: 'Power Plants' },
  { icon: Shield, label: 'High Voltage Rooms' },
  { icon: Building2, label: 'Switchgear Rooms' },
  { icon: ClipboardCheck, label: 'Control Panels' },
  { icon: Server, label: 'Data Centers' },
  { icon: BatteryCharging, label: 'Battery Rooms' },
  { icon: Zap, label: 'Transformer Stations' },
  { icon: FlaskConical, label: 'Electrical Laboratories' },
  { icon: Train, label: 'Railway Electrification Systems' },
];

/* Use & Safety precautions — conservative, technical wording. */
const iecSafetyPrecautions: string[] = [
  'Carry out regular visual inspection of mats before use.',
  'Remove any damaged or worn mats from service immediately.',
  'Select the correct voltage class for the working environment.',
  'Ensure complete work-area coverage so the operator is fully protected.',
  'Position mats correctly around the live equipment.',
  'Avoid overlapping adjacent mats — edges can create trip and insulation gaps.',
  'Keep the mat surface clean and free of conductive contamination.',
  'Avoid contact with sharp objects that can puncture the insulating compound.',
  'Use appropriate personal protective equipment alongside the mat.',
  'Follow the manufacturer\u2019s installation and use instructions.',
  'Ensure personnel are trained in correct mat selection and use.',
];

/* Installation steps — verbatim from brochure, no added adhesive advice. */
const iecInstallationSteps: string[] = [
  'Clean the installation area thoroughly before placement.',
  'Place the mats in the required work locations around live equipment.',
  'Ensure complete work-area coverage for operator protection.',
  'Mats rely on their own weight and surface friction to remain in position.',
];

/* IEC FAQ — concise rewrites preserving brochure meaning. */
const iecFaqItems: { q: string; a: string }[] = [
  {
    q: 'What does IEC 61111 cover?',
    a: 'IEC 61111:2009 specifies requirements for insulating mats used for live working on electrical installations. It covers materials, classification by voltage, marking, testing and dimensions for mats that protect operators from electric shock.',
  },
  {
    q: 'What are the electrical mat classes under IEC 61111?',
    a: 'IEC 61111 defines five classes (0 through 4) based on maximum working voltage. Each class is tested at a proof voltage well above its working voltage to confirm the mat withstands the electrical stress of its intended environment.',
  },
  {
    q: 'How are thickness and class related?',
    a: 'Higher voltage classes generally require greater insulating thickness. The specific thickness for each class should be confirmed against the current standard text and the manufacturer\u2019s type-test documentation for the product being supplied.',
  },
  {
    q: 'What other mat properties matter besides class?',
    a: 'Beyond voltage class, consider mechanical durability, surface finish (anti-skid patterns), resistance to flame/oil/moisture where relevant, marking legibility, and whether a wear-indicator (bi-colour) feature is needed for the application.',
  },
  {
    q: 'What is the difference between IEC 61111 and ASTM D178?',
    a: 'IEC 61111 is the international standard used in IEC-member markets; ASTM D178 is the North American standard for rubber insulating blankets and mats. They use different class systems and test methods. A mat certified to one standard is not automatically certified to the other.',
  },
  {
    q: 'Why choose certified mats over non-certified mats?',
    a: 'Certified mats carry type-test evidence from an accredited laboratory and carry permanently moulded marking that confirms the class, voltage and manufacturer. Non-certified mats lack this evidence and cannot be relied upon for operator protection near live equipment.',
  },
];

/* ────────────────────────────────────────────
   Breadcrumb items
   ──────────────────────────────────────────── */

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'International / Global (IEC 61111:2009)' },
];

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export default function IECClient() {

  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            1. HERO — Products first, not marking
            ══════════════════════════════════════ */}
        <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
          <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Text side */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-5 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-2.5 lg:mb-3">
                <TechnicalBadge label="IEC 61111:2009" />
                <TechnicalBadge label="International Standard" />
              </div>

              <Eyebrow className="mb-3">International / Global</Eyebrow>

              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                Insulating Mats to IEC 61111:2009
              </h1>

              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                IEC 61111:2009 insulating mats for live working up to 36 000 V.
                Available in two variants — HV and Bi-Colour —
                across Classes 0 through 4 for IEC-member markets worldwide.
              </p>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="#specifications">
                  View Class Table
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — product visuals with IEC reference chip */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
              {/* Product thumbnails — HV + Bi-Colour (Auto Glow is domestic-only) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <ImageFrame
                    src={iecVisuals.hero.src}
                    alt={iecVisuals.hero.alt}
                    aspectRatio="landscape"
                    fit={iecVisuals.hero.fit}
                    priority
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-be-charcoal-950/80 text-be-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    HV
                  </span>
                </div>
                <div className="relative">
                  <ImageFrame
                    src={iecVisuals.gallery[0].src}
                    alt={iecVisuals.gallery[0].alt}
                    aspectRatio="landscape"
                    fit={iecVisuals.gallery[0].fit}
                    priority
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-be-charcoal-950/80 text-be-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Bi-Colour
                  </span>
                </div>
              </div>
              {/* Small IEC reference chip */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-be-cream border border-be-grey-250">
                <div className="relative w-12 h-8 shrink-0 overflow-hidden rounded">
                  <Image
                    src="/media/products/international-iec/iec-61111.webp"
                    alt="IEC 61111 marking reference"
                    fill
                    className="object-contain p-0.5"
                    sizes="48px"
                  />
                </div>
                <span className="text-metadata text-be-grey-650">
                  IEC 61111:2009 moulded marking — Class&nbsp;0 through Class&nbsp;4
                </span>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            2. QUICK FACTS — concise strip
            ══════════════════════════════════════ */}
        <section aria-label="Product assurance" className="border-y border-be-yellow-100 bg-be-yellow-50">
          <div className="container-site page-horizontal-padding py-6 md:py-7">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
              {[
                { icon: Award, label: 'Standard', value: 'IEC 61111:2009' },
                { icon: Zap, label: 'Classes', value: '0, 1, 2, 3, 4' },
                { icon: Ruler, label: 'Max Voltage', value: '36 000 V' },
                { icon: Layers, label: 'Thickness Range', value: '2.0–5.2 mm' },
                { icon: Shield, label: 'Testing', value: 'CPRI / NABL' },
                { icon: Globe, label: 'Markets', value: 'IEC-member' },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex flex-col items-center sm:items-start gap-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-be-white border border-be-yellow-100" aria-hidden="true">
                    <Icon className="h-3.5 w-3.5 text-be-yellow-text" />
                  </span>
                  <div className="text-metadata text-be-grey-650">{label}</div>
                  <div className="text-[14px] leading-snug font-semibold text-be-charcoal-950">{value}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════
            3. AVAILABLE PRODUCT VARIANTS — HV + Bi-Colour
            (Auto Glow is a domestic-only product and is deliberately
            not part of the international/Global IEC offering.)
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <div id="hv-insulating-mats" className="scroll-mt-24" aria-label="HV Insulating Mats" />
          <div id="bi-colour" className="scroll-mt-24" aria-label="Bi-Colour" />
          <SectionHeader
            eyebrow="Product Variants"
            title="Available IEC 61111:2009 Variants"
            supportingText="Two insulating mat variants — each fully compliant with IEC 61111:2009 across all five voltage classes, with distinct safety enhancements."
            align="center"
          />

          {/* Balanced two-card grid — HV Insulating Mats + Bi-Colour.
              These are the two valid international offerings; cards share
              equal width/height, consistent image area, title and CTA placement. */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* HV Card */}
            <div className="group flex flex-col h-full rounded-xl border border-be-grey-250 bg-be-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
                <Image
                  src={iecVisuals.hero.src}
                  alt={iecVisuals.hero.alt}
                  fill
                  className={`${iecVisuals.hero.fit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-be-charcoal-950">HV Insulating Mats</h3>
                </div>
                <p className="text-body text-be-grey-650 flex-1">
                  Standard high-voltage insulating mats. All five IEC classes with moulded
                  voltage identification marking. Reliable operator protection at installations
                  up to 36 000 V.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <PrimaryButton href="/contact-us?type=quote&product=iec-hv-insulating-mats">
                    Get Quote
                    <ArrowRight className="size-4 ml-1.5" />
                  </PrimaryButton>
                  <SecondaryButton href={PRODUCT_ROUTES.hv}>
                    View Product
                  </SecondaryButton>
                </div>
              </div>
            </div>

            {/* Bi-Colour Card */}
            <div className="group flex flex-col h-full rounded-xl border border-be-grey-250 bg-be-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
                <Image
                  src={iecVisuals.gallery[0].src}
                  alt={iecVisuals.gallery[0].alt}
                  fill
                  className={`${iecVisuals.gallery[0].fit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center gap-2">
                  <Palette className="size-5 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-be-charcoal-950">Bi-Colour Mats</h3>
                </div>
                <p className="text-body text-be-grey-650 flex-1">
                  Dual-colour layers — dark working surface over a contrasting inner layer.
                  When wear exposes the inner colour, it signals the mat needs replacement.
                  No measuring instruments needed.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <PrimaryButton href="/contact-us?type=quote&product=iec-bi-colour">
                    Get Quote
                    <ArrowRight className="size-4 ml-1.5" />
                  </PrimaryButton>
                  <SecondaryButton href={PRODUCT_ROUTES.dualLayerDualColour}>
                    View Product
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            4. IEC CLASS / VOLTAGE TABLE
            ══════════════════════════════════════ */}
        <SectionShell variant="technical" bg="bg-be-cream" id="specifications" ariaLabel="IEC 61111 Classifications">
          <SectionHeader
            eyebrow="Technical Specifications"
            title="IEC 61111:2009 Classification Table"
            supportingText="Product code, voltage class, maximum working voltage, proof test voltage, dielectric strength, thickness and weight per the official Bharat Electrosafe IEC 61111 brochure. Mat thickness ranges from 2.0 mm (Class 0) to 5.2 mm (Class 4)."
          />

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-body">
              <thead>
                <tr className="border-b-2 border-be-yellow-500">
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">Product Code</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">Class</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">Max Working Voltage</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">AC Proof Voltage</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">Dielectric Strength</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950">Thickness</th>
                  <th className="text-left py-3 font-semibold text-be-charcoal-950">Approx. Weight</th>
                </tr>
              </thead>
              <tbody>
                {iecClassData.map((row) => (
                  <tr key={row.productCode} className="border-b border-be-grey-250 hover:bg-be-yellow-50/50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">{row.productCode}</td>
                    <td className="py-3 pr-4 font-semibold text-be-charcoal-950">{row.classLabel}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.maxWorkingVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.acProofVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.dielectricStrength}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.thickness}</td>
                    <td className="py-3 text-be-charcoal-800 whitespace-nowrap">{row.approxWeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 text-metadata text-be-grey-650">
            <Shield className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
            <p>
              All values per IEC 61111:2009 and the official Bharat Electrosafe brochure.
              AC proof voltage is the withstand voltage applied during routine verification.
              These are IEC classifications — do not confuse with IS 15652:2006 Classes A–D.
            </p>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            5. PRODUCT CONSTRUCTION & REQUIREMENTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <SectionHeader
            eyebrow="Construction & Requirements"
            title="Product Construction & Requirements"
            supportingText="Shared requirements for all IEC 61111:2009 insulating mats, plus variant-specific enhancements."
          />

          <div className="mt-6 flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Shared requirements */}
            <div className="lg:w-[55%] flex flex-col gap-5">
              <h3 className="text-lg font-semibold text-be-charcoal-950 border-b border-be-grey-250 pb-2">
                All IEC 61111:2009 Variants
              </h3>
              <FeatureList
                items={[
                  { icon: Shield, text: 'Elastomer-free compound of natural rubber and synthetic polymers with anti-slip surface, 2.0–5.2 mm thickness by class' },
                  { icon: Zap, text: 'Type-tested at accredited and internationally recognized laboratories' },
                  { icon: Eye, text: 'Permanently moulded IEC marking: standard, class, voltage, manufacturer, date' },
                  { icon: Globe, text: 'Recognised in all IEC-member country markets' },
                  { icon: Ruler, text: 'Available in Classes 0, 1, 2, 3 and 4 (1.0 kV to 36.0 kV)' },
                  { icon: Award, text: 'Custom sizes available on request' },
                ]}
              />
            </div>

            {/* Variant-specific differences */}
            <div className="lg:w-[45%] flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-be-charcoal-950">HV — Standard</h3>
                </div>
                <p className="text-body text-be-grey-650">
                  Standard high-voltage compound with moulded IEC marking. Suitable for
                  all indoor and covered switchgear installations.
                </p>
              </div>

              <div className="border-t border-be-grey-250 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-be-charcoal-950">Bi-Colour — Visual Wear Indicator</h3>
                </div>
                <p className="text-body text-be-grey-650">
                  Dark working surface over a contrasting inner layer. When abrasion or
                  damage exposes the inner colour, operators receive an immediate visual
                  signal that replacement is required — no instruments needed.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            6. MARKING / TRACEABILITY
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="IEC Marking and Traceability">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Text */}
            <div className="lg:w-[55%] flex flex-col gap-5">
              <SectionHeader
                eyebrow="Identification & Traceability"
                title="IEC 61111 Moulded Marking"
                supportingText="Every mat carries a permanently moulded marking on the upper surface — it cannot rub off, fade, or peel — providing the information required by the standard for unambiguous identification and safe use."
              />
              <div className="flex flex-col gap-2 text-body text-be-charcoal-800">
                <p className="font-medium">The moulded IEC marking includes:</p>
                <ul className="flex flex-col gap-1.5 ml-1">
                  {[
                    'Standard reference: IEC 61111:2009',
                    'Class designation (e.g. Class 2)',
                    'Maximum working voltage (e.g. 17.0 kV)',
                    'Manufacturer name: Bharat Electrosafe',
                    'Month and year of manufacture',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Marking image gallery — small, contained */}
            <div className="lg:w-[45%] grid grid-cols-2 gap-3">
              <ImageFrame
                src="/media/products/international-iec/iec-61111.webp"
                alt="IEC 61111:2009 insulating mat marking — Class designation and voltage"
                aspectRatio="landscape"
                fit="contain"
              />
              <ImageFrame
                src="/media/products/international-iec/iec-61111-class-0-2-2mm.webp"
                alt="IEC 61111 Class 0 and Class 2 insulating mats — 2 mm with moulded marking"
                aspectRatio="landscape"
                fit="contain"
              />
              <ImageFrame
                src="/media/products/international-iec/iec-61111-class-2.webp"
                alt="Close-up of IEC 61111:2009 Class 2 moulded marking detail"
                aspectRatio="landscape"
                fit="contain"
                className="col-span-2"
              />
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            7. APPLICATIONS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <SectionHeader
            eyebrow="Applications"
            title="Where IEC 61111 Mats Are Used"
            supportingText="Typical applications for insulating mats across electrical and industrial installations."
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {iecApplications.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-be-grey-250 bg-be-cream text-center"
              >
                <Icon className="size-5 text-be-yellow-text" aria-hidden="true" />
                <span className="text-sm font-medium text-be-charcoal-950 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            8. MATERIAL / RESISTANCE CONSIDERATIONS
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Material and resistance considerations">
          <SectionHeader
            eyebrow="Material & Resistance"
            title="Resistance Considerations"
            supportingText="Product documentation references resistance considerations including flame, mild acid/alkali, oil/water and moisture. Specific performance should be confirmed against the type-test documentation for the class and variant supplied."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Flame, label: 'Flame resistance' },
              { icon: FlaskConical, label: 'Mild acid & alkali' },
              { icon: Droplets, label: 'Oil & water' },
              { icon: Eye, label: 'Moisture' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-be-grey-250 bg-be-white"
              >
                <Icon className="size-4 text-be-yellow-text" aria-hidden="true" />
                <span className="text-sm font-medium text-be-charcoal-950">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-metadata text-be-grey-650 leading-relaxed">
            These are material considerations referenced in the product documentation, not independent performance guarantees. Confirm suitability for a specific environment during quotation.
          </p>
        </SectionShell>

        {/* ══════════════════════════════════════
            9. USE & SAFETY
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Use and safety">
          <SectionHeader
            eyebrow="Use & Safety"
            title="Safe Use and Precautions"
            supportingText="Follow these precautions to ensure the mat provides the intended operator protection."
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {iecSafetyPrecautions.map((precaution) => (
              <div key={precaution} className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                <span className="text-body text-be-charcoal-800 leading-relaxed">{precaution}</span>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            10. INSTALLATION
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Installation">
          <SectionHeader
            eyebrow="Installation"
            title="Installation Guidance"
            supportingText="Straightforward placement — no special tooling required."
          />
          <div className="mt-6 flex flex-col gap-3 max-w-2xl">
            {iecInstallationSteps.map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-be-yellow-500 text-be-charcoal-950 text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-body text-be-charcoal-800 leading-relaxed pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            11. IEC FAQ
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="IEC frequently asked questions">
          <SectionHeader
            eyebrow="IEC FAQ"
            title="Frequently Asked Questions"
            supportingText="Practical answers about IEC 61111:2009 insulating mats — coverage, classes, properties and certification."
          />
          <div className="mt-6 flex flex-col gap-0 max-w-3xl">
            {iecFaqItems.map((item, i) => (
              <div key={item.q} className={cn('py-4', i > 0 && 'border-t border-be-grey-250')}>
                <h3 className="text-base font-semibold text-be-charcoal-950 mb-1.5">{item.q}</h3>
                <p className="text-body text-be-grey-650 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            12. QUOTE CTA
            ══════════════════════════════════════ */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-be-charcoal-950">
              Request a quote for IEC 61111:2009 insulating mats
            </h2>
            <p className="text-body-large text-be-grey-650">
              Get pricing, custom dimensions, and delivery timelines for your project.
              Our sales team responds within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/contact-us?type=quote" size="lg">
                Request a Quote
              </PrimaryButton>
              <SecondaryButton href="/contact-us?type=technical-guidance&product=international-iec-61111">
                Technical Guidance
              </SecondaryButton>
              <SecondaryButton href={`tel:${company.phonePrimaryTel}`}>
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
