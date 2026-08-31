'use client';

import {
  Shield,
  Zap,
  Ruler,
  Award,
  Eye,
  Phone,
  Check,
  Palette,
  Factory,
  Building2,
  Server,
  Train,
  BatteryCharging,
  FlaskConical,
  ClipboardCheck,
  FileText,
  GripHorizontal,
  Weight,
  Globe,
  Layers,
  Thermometer,
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
import { company } from '@/data/company';
import { iecVisuals } from '@/data/product-visuals';
import {
  iecClasses,
  iecSpecialVariants,
  iecApplications,
  iecMaterialCharacteristics,
  iecDimensions,
  iecBrochureClaims,
} from '@/data/iec-61111';
import { PRODUCT_ROUTES } from '@/data/product-routes';

/* ────────────────────────────────────────────
   GLOBAL HV INSULATING MATS — client page.

   Technical data in this file comes EXCLUSIVELY from
   src/data/iec-61111.ts (IEC 61111:2009). Domestic
   IS 15652:2006 Class A/B/C data must never appear here.
   ──────────────────────────────────────────── */

/* Applications with icons — mapped from data */

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
  { label: 'Electrical Insulating Mats', href: PRODUCT_ROUTES.electricalInsulatingMats },
  { label: 'International / Global (IEC 61111:2009)', href: PRODUCT_ROUTES.international },
  { label: 'HV Insulating Mats' },
];

export default function GlobalHVClient() {

  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            1. HERO
            ══════════════════════════════════════ */}
        <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
          <Breadcrumb items={breadcrumbItems} className="mb-3 lg:mb-4" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Text side */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-5 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-2.5 lg:mb-3">
                <TechnicalBadge label="IEC 61111:2009" />
                <TechnicalBadge label="Class 0 – Class 4" />
              </div>

              <Eyebrow className="mb-3">International / Global</Eyebrow>

              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                HV Insulating Mats to IEC 61111:2009
              </h1>

              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                High-voltage insulating mats for international and global markets,
                certified across IEC 61111:2009 Classes 0–4 with maximum working
                voltages from 1.0 kV up to 36,000 V AC and thickness from
                2.0 mm to 5.2 mm.
              </p>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote&product=iec-hv-insulating-mats" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="#class-table">
                  View Class Table
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — real IEC product imagery */}
            <div className="min-w-0 lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-range.webp"
                alt="Bharat Electrosafe HV insulating mat with moulded marking reading IEC 61111/2009, Class 2, max use voltage 17000 V, proof voltage 20000 V, withstand voltage 30000 V"
                aspectRatio="landscape"
                fit="cover"
                priority
              />
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-be-cream border border-be-grey-250">
                <Shield className="size-4 shrink-0 text-be-yellow-text" aria-hidden="true" />
                <span className="text-metadata text-be-grey-650">
                  Product name marking provided on every metre of the mat.
                </span>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            2. QUICK FACTS
            ══════════════════════════════════════ */}
        <section aria-label="Product assurance" className="border-y border-be-yellow-100 bg-be-yellow-50">
          <div className="container-site page-horizontal-padding py-6 md:py-7">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
              {[
                { icon: Award, label: 'Standard', value: 'IEC 61111:2009' },
                { icon: Zap, label: 'Classes', value: '0, 1, 2, 3, 4' },
                { icon: Ruler, label: 'Working Voltage', value: '1.0 – 36.0 kV AC' },
                { icon: Layers, label: 'Thickness', value: '2.0 – 5.2 mm' },
                { icon: FileText, label: 'Testing', value: 'Test certificate with every supply' },
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
            3. CLASS / VOLTAGE TABLE
            ══════════════════════════════════════ */}
        <SectionShell variant="technical" bg="bg-be-cream" id="class-table" ariaLabel="IEC 61111 HV class table">
          <SectionHeader
            eyebrow="Technical Specifications"
            title="IEC 61111:2009 Class Table — HV Insulating Mats"
            supportingText="All five classes with thickness, maximum working voltage, AC proof voltage, dielectric strength, and approximate weight per IEC 61111:2009 and the official Bharat Electrosafe brochure."
          />

          <div className="mt-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[820px] border-collapse text-body">
              <thead>
                <tr className="border-b-2 border-be-yellow-500">
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Product Code</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Class</th>
                  <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Thickness</th>
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
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.maxWorkingVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.acProofVoltage}</td>
                    <td className="py-3 pr-4 text-be-charcoal-800">{row.dielectricStrength}</td>
                    <td className="py-3 text-be-charcoal-800">
                      <span className="inline-flex items-center gap-1.5">
                        <Weight className="size-3.5 text-be-grey-650" aria-hidden="true" />
                        {row.approxWeight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 text-metadata text-be-grey-650">
            <Shield className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
            <p>
              All values per IEC 61111:2009 Table 1. Max working voltage is the highest
              voltage at which the mat may be used. AC proof voltage is applied during
              routine verification; dielectric strength is verified during type testing.
              These are IEC classifications — do not confuse with IS 15652:2006 domestic
              classifications, which are covered separately on the domestic HV page.
            </p>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            4. FINE RIBBED VARIANTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Fine ribbed HV variants">
          <SectionHeader
            eyebrow="Fine Ribbed Top & Textured Bottom Surface"
            title="Fine Ribbed HV Variants"
            supportingText="Fine ribbed top surface with textured bottom surface. Available on request across the HV class range."
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
            5. CONSTRUCTION & KEY REQUIREMENTS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule>
          <SectionHeader
            eyebrow="Construction & Requirements"
            title="Construction & Key Requirements"
            supportingText="Shared requirements for HV insulating mats per IEC 61111:2009 and the official Bharat Electrosafe brochure."
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <FeatureList
              items={[
                { icon: Shield, text: 'Elastomer-free; combination of natural rubber and synthetic polymers with anti-slip surface' },
                { icon: Zap, text: 'Classes 0–4: maximum working voltage 1.0 kV to 36.0 kV' },
                { icon: Ruler, text: 'Thickness 2.0–5.2 mm depending on class' },
                { icon: FileText, text: iecBrochureClaims.testCertificate },
                { icon: Award, text: iecBrochureClaims.labTesting },
                { icon: Eye, text: iecBrochureClaims.marking },
              ]}
            />
            <FeatureList
              items={[
                { icon: GripHorizontal, text: iecBrochureClaims.antiSlip },
                { icon: Thermometer, text: `Working temperature ${iecMaterialCharacteristics.workingTemperature}` },
                { icon: Layers, text: 'Mechanical puncture resistance 70 N minimum' },
                { icon: FlaskConical, text: 'Resistance to flame, mild acid & alkali, oil & water, and moisture' },
                { icon: Ruler, text: 'Custom sizes available on request' },
                { icon: Check, text: iecBrochureClaims.warranty },
              ]}
            />
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            6. MARKING / TRACEABILITY
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-white" topRule ariaLabel="IEC marking and traceability">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div className="lg:w-[45%] flex flex-col gap-5">
              <SectionHeader
                eyebrow="Identification & Traceability"
                title="Product Identification & Marking"
                supportingText="Every HV insulating mat carries moulded product name marking on every metre, including class designation and voltage ratings."
              />
              <p className="text-body text-be-charcoal-800">
                The marking identifies the standard (IEC 61111/2009), the class, the
                maximum use voltage, the proof voltage and the withstand voltage —
                so the correct class is always verifiable on site.
              </p>
            </div>

            <div className="lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-range.webp"
                alt="IEC 61111/2009 Class 2 mat marking — max use voltage 17000 V, proof voltage 20000 V, withstand voltage 30000 V"
                aspectRatio="landscape"
                fit="cover"
              />
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-class-2.webp"
                alt="Close-up of IEC 61111:2009 Class 2 moulded marking on an HV insulating mat"
                aspectRatio="landscape"
                fit="cover"
              />
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            7. DIMENSIONS & COLOURS
            ══════════════════════════════════════ */}
        <SectionShell variant="compact" bg="bg-be-cream" topRule ariaLabel="Dimensions and colours">
          <SectionHeader
            eyebrow="Dimensions"
            title="Dimensions & Colour Options"
            supportingText="Standard and custom supply options for HV insulating mats to IEC 61111:2009."
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-white">
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

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-white">
              <div className="flex items-center gap-2 mb-3">
                <GripHorizontal className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Custom Sizes</h4>
              </div>
              <p className="text-body text-be-charcoal-800">{iecDimensions.custom}</p>
              <p className="text-body text-be-charcoal-800 mt-2">{iecDimensions.customizationNote}</p>
            </div>

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-white">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Colours</h4>
              </div>
              <p className="text-body text-be-charcoal-800">{iecDimensions.standardColour}</p>
              <p className="text-body text-be-charcoal-800 mt-2">
                Bi-colour: {iecDimensions.biColour} — see the{' '}
                <a
                  href={PRODUCT_ROUTES.dualLayerDualColour}
                  className="font-medium underline underline-offset-2 hover:text-be-charcoal-950"
                >
                  Dual Layer Dual Colour
                </a>{' '}
                variant.
              </p>
              <p className="text-metadata text-be-grey-650 mt-2">Finish: {iecDimensions.finish}</p>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            8. APPLICATIONS
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule>
          <SectionHeader
            eyebrow="Applications"
            title="Where HV Insulating Mats Are Used"
            supportingText="Typical applications for IEC 61111:2009 HV insulating mats across electrical and industrial installations."
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {iecApplicationsWithIcons.map(({ icon: Icon, label }) => (
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
            9. GLOBAL RANGE CTA
            ══════════════════════════════════════ */}
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-be-charcoal-950">
              Request a quote for IEC 61111:2009 HV insulating mats
            </h2>
            <p className="text-body-large text-be-grey-650">
              Get pricing, custom dimensions, and delivery timelines for your project.
              Test certificate supplied with every supply. Our sales team responds
              within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/contact-us?type=quote&product=iec-hv-insulating-mats" size="lg">
                Request a Quote
              </PrimaryButton>
              <SecondaryButton href={PRODUCT_ROUTES.international}>
                View Complete IEC 61111 Range
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
