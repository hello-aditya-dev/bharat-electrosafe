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
  Sparkles,
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
  Thermometer,
  Scale,
  FileText,
  GripHorizontal,
  MoveVertical,
  Weight,
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
import {
  iecClasses,
  iecSpecialVariants,
  iecApplications,
  iecMaterialCharacteristics,
  iecDimensions,
  iecSafetyPrecautions,
  iecInstallationSteps,
  iecFaqItems,
  iecAstmComparison,
  iecBrochureClaims,
} from '@/data/iec-61111';

/* ────────────────────────────────────────────
   Applications with icons — mapped from data
   ──────────────────────────────────────────── */

const appIconMap: Record<string, LucideIcon> = {
  'Electrical Substations': Zap,
  'Power Plants': Factory,
  'High Voltage Rooms': Shield,
  'Switchgear Rooms': Building2,
  'Control Panels': ClipboardCheck,
  'Data Centers': Server,
  'Battery Rooms': BatteryCharging,
  'Transformer Stations': Zap,
  'Electrical Laboratories': FlaskConical,
  'Railway Electrification Systems': Train,
};

const iecApplicationsWithIcons: { icon: LucideIcon; label: string }[] = iecApplications.map(
  (label) => ({ icon: appIconMap[label] ?? Shield, label }),
);

/* ────────────────────────────────────────────
   Breadcrumb items
   ──────────────────────────────────────────── */

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electrical Insulating Mats', href: '/products/electrical-insulating-mats' },
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
                Available across IEC 61111:2009 Classes 0–4, with maximum working
                voltage up to 36,000 V AC for Class 4.
              </p>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="#specifications">
                  View Class Specifications
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — 3-product visual with IEC reference chip */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
              {/* Three product thumbnails */}
              <div className="grid grid-cols-3 gap-3">
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
                    Auto Glow
                  </span>
                </div>
                <div className="relative">
                  <ImageFrame
                    src={iecVisuals.gallery[1].src}
                    alt={iecVisuals.gallery[1].alt}
                    aspectRatio="landscape"
                    fit={iecVisuals.gallery[1].fit}
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
                  Product name marking provided on every metre.
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
                { icon: Ruler, label: 'Max Working Voltage', value: '36,000 V AC' },
                { icon: Layers, label: 'Thickness', value: '2.0–4.0 mm' },
                { icon: Shield, label: 'Testing', value: 'Test certificate with every supply' },
                { icon: Globe, label: 'Markets', value: 'International / Global' },
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
            3. AVAILABLE PRODUCT VARIANTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <SectionHeader
            eyebrow="Product Variants"
            title="Available IEC 61111:2009 Variants"
            supportingText="Three IEC 61111:2009 insulating mat variants, with class and configuration selected according to application requirements."
            align="center"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HV Card */}
            <div id="hv-insulating-mats" className="scroll-mt-24 group flex flex-col rounded-xl border border-be-grey-250 bg-be-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
                <Image
                  src={iecVisuals.hero.src}
                  alt={iecVisuals.hero.alt}
                  fill
                  className={`${iecVisuals.hero.fit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  sizes="(max-width: 768px) 100vw, 33vw"
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
                  up to 36,000 V AC.
                </p>
                <PrimaryButton href="/contact-us?type=quote&product=iec-hv-insulating-mats" className="mt-1 self-start">
                  Get Quote
                  <ArrowRight className="size-4 ml-1.5" />
                </PrimaryButton>
              </div>
            </div>

            {/* Auto Glow Card */}
            <div id="auto-glow" className="scroll-mt-24 group flex flex-col rounded-xl border border-be-grey-250 bg-be-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
                <Image
                  src={iecVisuals.gallery[0].src}
                  alt={iecVisuals.gallery[0].alt}
                  fill
                  className={`${iecVisuals.gallery[0].fit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-be-charcoal-950">Auto-Glow Mats</h3>
                </div>
                <p className="text-body text-be-grey-650 flex-1">
                  Auto-Glow variant.
                </p>
                <PrimaryButton href="/contact-us?type=quote&product=iec-auto-glow" className="mt-1 self-start">
                  Get Quote
                  <ArrowRight className="size-4 ml-1.5" />
                </PrimaryButton>
              </div>
            </div>

            {/* Bi-Colour Card */}
            <div id="bi-colour" className="scroll-mt-24 group flex flex-col rounded-xl border border-be-grey-250 bg-be-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
                <Image
                  src={iecVisuals.gallery[1].src}
                  alt={iecVisuals.gallery[1].alt}
                  fill
                  className={`${iecVisuals.gallery[1].fit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center gap-2">
                  <Palette className="size-5 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-be-charcoal-950">Bi-Colour Mats</h3>
                </div>
                <p className="text-body text-be-grey-650 flex-1">
                  Bi-Colour variant with dual-colour layers.
                </p>
                <PrimaryButton href="/contact-us?type=quote&product=iec-bi-colour" className="mt-1 self-start">
                  Get Quote
                  <ArrowRight className="size-4 ml-1.5" />
                </PrimaryButton>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            4. IEC CLASS / VOLTAGE TABLE — all 5 classes, all columns
            ══════════════════════════════════════ */}
        <SectionShell variant="technical" bg="bg-be-cream" id="specifications" ariaLabel="IEC 61111 Classifications">
          <SectionHeader
            eyebrow="Technical Specifications"
            title="IEC 61111:2009 Classification Table"
            supportingText="All five classes with thickness, maximum allowed thickness, maximum working voltage, AC proof voltage, dielectric strength, and approximate weight per IEC 61111:2009 Table 1."
          />

          <div className="mt-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[820px] border-collapse text-body">
              <thead>
                <tr className="border-b-2 border-be-yellow-500">
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Product Code</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Class</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Thickness</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Max Thickness Allowed</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Max Working Voltage</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">AC Proof Voltage</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Dielectric Strength</th>
                  <th className="text-left py-3 font-semibold text-be-charcoal-950 whitespace-nowrap">Approx. Weight</th>
                </tr>
              </thead>
              <tbody>
                {iecClasses.map((row) => (
                  <tr key={row.classLabel} className="border-b border-be-grey-250 hover:bg-be-yellow-50/50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-be-charcoal-950">{row.productCode}</td>
                    <td className="py-3 pr-4 font-semibold text-be-charcoal-950">{row.classLabel}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.thickness}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.maxThicknessAllowed}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.maxWorkingVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.acProofVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.dielectricStrength}</td>
                    <td className="py-3 text-be-charcoal-800">{row.approxWeight}</td>
                  </tr>
                ))}
                <tr className="border-b border-be-grey-250 bg-be-cream/50">
                  <td className="py-3 pr-4 font-semibold text-be-charcoal-950">BES CD</td>
                  <td className="py-3 pr-4 text-be-charcoal-800 italic">Custom</td>
                  <td className="py-3 pr-4 text-be-charcoal-800">Up to 2.0 mm</td>
                  <td className="py-3 pr-4 text-be-charcoal-800">Up to 14.0 mm</td>
                  <td className="py-3 pr-4 text-be-charcoal-800">Up to 36.0 kV</td>
                  <td className="py-3 pr-4 text-be-charcoal-800">Up to 40.0 kV</td>
                  <td className="py-3 pr-4 text-be-charcoal-800">Up to 40.0 kV</td>
                  <td className="py-3 text-be-charcoal-800">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 text-metadata text-be-grey-650">
            <Shield className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
            <p>
              All values per IEC 61111:2009 Table 1. AC proof voltage is the withstand
              voltage applied during routine verification. Dielectric strength is the
              voltage at which the insulation breaks down during type testing. These are
              IEC classifications — do not confuse with IS 15652:2006 Classes A–D.
            </p>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            5. SPECIAL RIBBED VARIANTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Special ribbed variants">
          <SectionHeader
            eyebrow="Fine Ribbed Top & Textured Bottom Surface"
            title="Fine Ribbed Variants"
            supportingText="Fine ribbed top surface with textured bottom surface. Available on request."
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {iecSpecialVariants.filter(v => v.modelCode !== 'BES CD').map((variant) => (
              <div
                key={variant.modelCode}
                className="flex flex-col rounded-xl border border-be-grey-250 bg-be-cream overflow-hidden"
              >
                <div className="px-5 pt-5 pb-3 border-b border-be-grey-250 bg-be-white">
                  <div className="flex items-center gap-2 mb-1">
                    <GripHorizontal className="size-4 text-be-yellow-text" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-be-charcoal-950">{variant.modelCode}</h3>
                  </div>
                  <p className="text-sm text-be-grey-650">{variant.description}</p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Class range</span>
                    <span className="font-medium text-be-charcoal-950">{variant.classRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Thickness</span>
                    <span className="font-medium text-be-charcoal-950">{variant.thickness}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Max thickness allowed</span>
                    <span className="font-medium text-be-charcoal-950">{variant.maxThicknessAllowed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Max working voltage</span>
                    <span className="font-medium text-be-charcoal-950">{variant.maxWorkingVoltage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Proof voltage</span>
                    <span className="font-medium text-be-charcoal-950">{variant.proofVoltage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Dielectric strength</span>
                    <span className="font-medium text-be-charcoal-950">{variant.dielectricStrength}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-be-grey-650">Approx. weight</span>
                    <span className="font-medium text-be-charcoal-950">{variant.approxWeight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            6. PRODUCT CONSTRUCTION & REQUIREMENTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule>
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
                  { icon: Shield, text: 'Elastomeric insulating compound (natural rubber and synthetic polymers)' },
                  { icon: Zap, text: 'Classes 0–4: maximum working voltage 1.0 kV to 36.0 kV' },
                  { icon: Eye, text: 'Product name marking provided on the mat.' },
                  { icon: Globe, text: 'International / Global IEC 61111:2009 applications' },
                  { icon: Ruler, text: 'Thickness 2.0–4.0 mm depending on class' },
                  { icon: FileText, text: 'Test certificate supplied with every supply.' },
                  { icon: Shield, text: 'Tested in accredited and internationally recognized laboratories' },
                  { icon: GripHorizontal, text: 'Anti-slip surface with 50 N minimum slip resistance' },
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
                  Standard elastomeric compound with moulded IEC marking. Suitable for
                  all indoor and covered switchgear installations.
                </p>
              </div>

              <div className="border-t border-be-grey-250 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-be-charcoal-950">Auto Glow</h3>
                </div>
                <p className="text-body text-be-grey-650">
                  Auto-Glow variant.
                </p>
              </div>

              <div className="border-t border-be-grey-250 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-be-charcoal-950">Bi-Colour</h3>
                </div>
                <p className="text-body text-be-grey-650">
                  Bi-Colour variant with dual-colour layers.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            7. MARKING / TRACEABILITY
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="IEC Marking and Traceability">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Text */}
            <div className="lg:w-[55%] flex flex-col gap-5">
              <SectionHeader
                eyebrow="Identification & Traceability"
                title="Product Identification & Marking"
                supportingText="Product name marking is provided on every metre of the mat, as specified in the product literature."
              />
              <p className="text-body text-be-charcoal-800">
                Product name marking provided on every metre.
              </p>
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
            8. MATERIAL & PERFORMANCE CHARACTERISTICS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Material and performance characteristics">
          <SectionHeader
            eyebrow="Material & Performance"
            title="Material & Performance Characteristics"
            supportingText="Key material properties and performance requirements per IEC 61111:2009."
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Material</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.material}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Mechanical Puncture Resistance</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.mechanicalPunctureResistance}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <GripHorizontal className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Slip Resistance</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.slipResistance}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Working Temperature</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.workingTemperature}</p>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Flame</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.flame}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Ageing</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.ageing}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Low-Temperature Behaviour</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.lowTemperatureBehaviour}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Acid Resistance</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.acidResistance}</p>
              </div>

              <div className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="size-4 text-be-yellow-text" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-be-charcoal-950">Oil Resistance</h4>
                </div>
                <p className="text-body text-be-charcoal-800">{iecMaterialCharacteristics.oilResistance}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-metadata text-be-grey-650 leading-relaxed">
            These are requirements and test methods specified in IEC 61111:2009. Specific performance should be confirmed against the type-test documentation for the class and variant supplied.
          </p>
        </SectionShell>

        {/* ══════════════════════════════════════
            9. DIMENSIONS & CUSTOMIZATION
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="Dimensions and customization">
          <SectionHeader
            eyebrow="Dimensions"
            title="Dimensions & Customization"
            supportingText="Standard and custom size options for IEC 61111:2009 insulating mats."
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Standard Sizes</h4>
              </div>
              <ul className="flex flex-col gap-1.5">
                {iecDimensions.standardSizes.map((size) => (
                  <li key={size} className="flex items-start gap-2 text-body text-be-charcoal-800">
                    <Check className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                    <span>{size}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Custom Sizes</h4>
              </div>
              <p className="text-body text-be-charcoal-800">{iecDimensions.custom}</p>
              <p className="text-body text-be-charcoal-800 mt-2">{iecDimensions.customizationNote}</p>
            </div>

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Standard Colour</h4>
              </div>
              <p className="text-body text-be-charcoal-800">{iecDimensions.standardColour}</p>
              <div className="flex items-start gap-2 mt-4">
                <Ruler className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                <p className="text-body text-be-charcoal-800">Manufacturing tolerance: {iecDimensions.manufacturingTolerance}</p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            10. APPLICATIONS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule>
          <SectionHeader
            eyebrow="Applications"
            title="Where IEC 61111 Mats Are Used"
            supportingText="Typical applications for insulating mats across electrical and industrial installations."
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {iecApplicationsWithIcons.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-be-grey-250 bg-be-white text-center"
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
            11. RESISTANCE CONSIDERATIONS (enhanced)
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="Material and resistance considerations">
          <SectionHeader
            eyebrow="Material & Resistance"
            title="Resistance Considerations"
            supportingText="IEC 61111:2009 specifies test methods and requirements for resistance to flame, ageing, low temperature, acid, and oil. Specific performance should be confirmed against the type-test documentation for the class and variant supplied."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Flame, label: 'Resistance to flame' },
              { icon: Sun, label: 'Ageing resistance' },
              { icon: Thermometer, label: 'Low-temperature behaviour' },
              { icon: FlaskConical, label: 'Resistance to mild acid & alkali' },
              { icon: Droplets, label: 'Resistance to oil & water' },
              { icon: Droplets, label: 'Moisture resistance' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-be-grey-250 bg-be-cream"
              >
                <Icon className="size-4 text-be-yellow-text" aria-hidden="true" />
                <span className="text-sm font-medium text-be-charcoal-950">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-metadata text-be-grey-650 leading-relaxed">
            These are material requirements and test methods referenced in IEC 61111:2009, not independent performance guarantees. Confirm suitability for a specific environment during quotation.
          </p>
        </SectionShell>

        {/* ══════════════════════════════════════
            12. USE & SAFETY
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Use and safety">
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
            13. INSTALLATION
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="Installation">
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
            14. ASTM D178 COMPARISON
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="IEC 61111 vs ASTM D178 comparison">
          <SectionHeader
            eyebrow="Standards Comparison"
            title={iecAstmComparison.title}
          />
          <p className="mt-4 text-body text-be-charcoal-800 leading-relaxed max-w-3xl">
            {iecAstmComparison.statement}
          </p>
          <p className="mt-3 text-body text-be-charcoal-800 leading-relaxed max-w-3xl">
            {iecAstmComparison.guidance}
          </p>
        </SectionShell>

        {/* ══════════════════════════════════════
            15. IEC FAQ — 10 questions
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
            16. QUOTE CTA
            ══════════════════════════════════════ */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-be-charcoal-950">
              Request a quote for IEC 61111:2009 insulating mats
            </h2>
            <p className="text-body-large text-be-grey-650">
              Get pricing, custom dimensions, and delivery timelines for your project.
              Test certificate supplied with every supply. Our sales team responds
              within 24 hours.
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
