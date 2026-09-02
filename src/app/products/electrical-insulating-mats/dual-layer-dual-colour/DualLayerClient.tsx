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
  Palette,
  Ruler,
  Award,
  Check,
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
import {
  iecBiColourClasses,
  iecBiColourProductSpec,
} from '@/data/iec-61111';

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
  { label: 'Bi-Color' },
];

/* ── Quick spec cards (hero summary) ── */
const QUICK_SPECS: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Award, label: 'Standard', value: iecBiColourProductSpec.standard },
  { icon: Zap, label: 'Classes', value: '0, 1, 2, 3, 4' },
  { icon: Zap, label: 'Max. Use Voltage', value: 'AC up to 36,000 V · DC up to 54,000 V' },
  { icon: Layers, label: 'Thickness', value: iecBiColourProductSpec.thicknessRange },
  { icon: Palette, label: 'Colourway', value: iecBiColourProductSpec.colourway },
  { icon: Ruler, label: 'Finish', value: iecBiColourProductSpec.finish },
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
                <TechnicalBadge label="IEC 61111:2009" />
                <TechnicalBadge label="International / Global" />
              </div>

              <Eyebrow className="mb-3">An Innovative Safety Solution from India to the World</Eyebrow>

              <h1 className="product-hero-h1 text-product-h1 text-be-charcoal-950 mb-3 lg:mb-4">
                Bi-Color HV Electrical Insulating Mats
              </h1>

              <p className="product-hero-intro text-body-large text-be-grey-650 leading-relaxed mb-4 lg:mb-5">
                Bharat Electrosafe introduces an innovative advancement in the field
                of electrical safety with its Bi-Color High Voltage Electrical
                Insulating Mats, designed in line with IEC 61111:2009 to offer an
                additional visual safety advantage for critical electrical working
                environments. The dual-layer, two-colour construction provides a
                visible indication of wear to support inspection and replacement.
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

            {/* Media — Global Bi-Color hero image */}
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

        {/* ═══ 2. QUICK SPECIFICATION CARDS ═══ */}
        <section aria-label="Product summary" className="border-y border-be-yellow-100 bg-be-yellow-50">
          <div className="container-site page-horizontal-padding py-6 md:py-7">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
              {QUICK_SPECS.map(({ icon: Icon, label, value }) => (
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

        {/* ═══ 3. CORE INNOVATION — VISIBLE WEAR INDICATION ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule id="innovation" ariaLabel="The Innovation: A Visible Wear Indication">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Left — Bi-Colour dual-layer construction technical illustration */}
            <div className="lg:w-[45%]">
              <ImageFrame
                src="/media/products/bi-color-insulating-mats/client-uploads/bi-color-construction-diagram.png"
                alt="Bi-Color insulating mat — IEC 61111:2009 dual-layer construction with black top layer and yellow wear-indicator bottom layer"
                aspectRatio="landscape"
                fit="contain"
              />
            </div>

            {/* Right — innovation explanation */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              <SectionHeader
                eyebrow="The Innovation"
                title="A Visible Wear Indication"
                supportingText="Unlike conventional single-colour insulating mats, Bharat Electrosafe's innovative Bi-Color technology provides an additional visual reference for monitoring the condition of the mat."
              />

              <p className="text-body text-be-grey-650 leading-relaxed">
                Developed with a unique dual-layer, two-colour construction,
                these insulating mats are designed to provide a visible indication
                of wear or damage to the top layer. When the upper layer is
                significantly worn, damaged or deteriorated, the contrasting colour
                of the underlying layer can become visible, helping users identify
                the need for inspection and timely replacement.
              </p>

              <p className="text-body text-be-charcoal-800 font-medium">
                {iecBiColourProductSpec.dualLayerFunction}
              </p>

              <ColourwaySchematic
                size="full"
                topLabel="Black"
                bottomLabel="Yellow"
                note={`Documented colourway: Black surface with a contrasting Yellow wear-indicator layer, in line with the IEC 61111 dual-colour construction. Schematic illustration — request photographs for the actual finish.`}
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

        {/* ═══ 4. APPLICATIONS ═══ */}
        <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Applications">
          <SectionHeader
            eyebrow="Applications"
            title="Where It's Used"
            supportingText="Bi-Color HV Electrical Insulating Mats are designed for demanding high-voltage electrical working environments."
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

        {/* ═══ 5. TECHNICAL SPECIFICATIONS — Bi-Color class table ═══ */}
        <SectionShell variant="technical" bg="bg-be-cream" id="specifications" ariaLabel="Bi-Color technical specifications">
          <SectionHeader
            eyebrow="Technical Specifications"
            title="Bi-Color — Class Data (IEC 61111:2009)"
            supportingText="All five classes with thickness, maximum use voltage (AC and DC), and weight per width × length combination. Source-verified against the client-supplied IEC 61111:2009 Bi-Color catalogue (page 19 for Class 0, page 20 for Classes 1–4)."
          />

          {/* Class summary cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {iecBiColourClasses.map((cls) => (
              <div key={cls.classLabel} className="p-4 rounded-lg border border-be-grey-250 bg-be-white">
                <div className="text-metadata text-be-grey-650 mb-1">{cls.classLabel}</div>
                <div className="text-base font-semibold text-be-charcoal-950">{cls.thickness}</div>
                <div className="text-metadata text-be-charcoal-800 mt-2">
                  AC {cls.maxUseVoltageAC}
                </div>
                <div className="text-metadata text-be-charcoal-800">
                  DC {cls.maxUseVoltageDC}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed weight table — per class, per width × length */}
          <div className="mt-8 space-y-8">
            {iecBiColourClasses.map((cls) => (
              <div key={cls.classLabel}>
                <h3 className="text-lg font-semibold text-be-charcoal-950 mb-3">
                  {cls.classLabel} — {cls.thickness}
                  <span className="ml-3 text-metadata font-normal text-be-grey-650">
                    AC {cls.maxUseVoltageAC} · DC {cls.maxUseVoltageDC}
                  </span>
                </h3>
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[560px] border-collapse text-body">
                    <thead>
                      <tr className="border-b-2 border-be-yellow-500">
                        <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Length</th>
                        <th className="text-left py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">Width 1.0 Meter — Weight</th>
                        <th className="text-left py-3 font-semibold text-be-charcoal-950 whitespace-nowrap">Width 1.2 Meter — Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.weights.map((row) => (
                        <tr key={row.length} className="border-b border-be-grey-250 hover:bg-be-yellow-50/50 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-be-charcoal-950">{row.length}</td>
                          <td className="py-3 pr-4 text-be-charcoal-800">{row.weight1m}</td>
                          <td className="py-3 text-be-charcoal-800">{row.weight1_2m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 text-metadata text-be-grey-650">
            <ShieldCheck className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
            <p>
              All values per IEC 61111:2009 Bi-Color (dual-layer) source pages,
              visually verified against the rendered PDF. Maximum Use Voltage is
              listed separately for AC and DC — do not interchange the two.
              Proof voltage, dielectric strength and withstand voltage are
              intentionally not listed: they are not published by the source for
              this Bi-Color product. These are IEC classifications — do not
              confuse with IS 15652:2006 Classes A–C.
            </p>
          </div>
        </SectionShell>

        {/* ═══ 6. PRODUCT CONSTRUCTION & SIZES ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Construction, sizes and finish">
          <SectionHeader
            eyebrow="Construction & Sizes"
            title="Construction, Sizes and Finish"
            supportingText="Standard widths, lengths and finish for the Bi-Color IEC 61111:2009 insulating mats."
            align="center"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Standard Widths</h4>
              </div>
              <ul className="flex flex-col gap-1.5">
                {iecBiColourProductSpec.widths.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-body text-be-charcoal-800">
                    <Check className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Standard Lengths</h4>
              </div>
              <ul className="flex flex-col gap-1.5">
                {iecBiColourProductSpec.lengths.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-body text-be-charcoal-800">
                    <Check className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-be-grey-250 bg-be-cream">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="size-4 text-be-yellow-text" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-be-charcoal-950">Finish & Colourway</h4>
              </div>
              <p className="text-body text-be-charcoal-800">
                <span className="font-medium">Finish:</span> {iecBiColourProductSpec.finish}
              </p>
              <p className="text-body text-be-charcoal-800 mt-2">
                <span className="font-medium">Colourway:</span> {iecBiColourProductSpec.colourway}
              </p>
            </div>
          </div>
        </SectionShell>

        {/* ═══ 7. INNOVATION STORY ═══ */}
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

        {/* ═══ 8. INDIA TO THE WORLD ═══ */}
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
                electrical safety, our Bi-Color HV Electrical Insulating Mats
                represent Bharat Electrosafe's vision of delivering advanced
                insulating mat solutions — From India to the World.
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

        {/* ═══ 9. WHY BHARAT ELECTROSAFE ═══ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule ariaLabel="Why Bharat Electrosafe">
          <SectionHeader
            eyebrow="Why Bharat Electrosafe"
            title="A forward-looking innovation in electrical safety"
            supportingText="Designed in line with IEC 61111:2009, our Bi-Color HV Electrical Insulating Mats combine quality-driven Indian manufacturing with an additional visual safety advantage."
          />
          <div className="mt-8 max-w-3xl">
            <FeatureList
              items={[
                { icon: Layers, text: 'Innovative Bi-Color dual-layer technology' },
                { icon: ClipboardCheck, text: 'Designed in line with IEC 61111:2009' },
                { icon: Eye, text: 'Visible wear indication through contrasting layers' },
                { icon: Wrench, text: 'Focus on improved inspection and maintenance awareness' },
                { icon: ShieldCheck, text: 'Designed for demanding electrical environments' },
                { icon: Factory, text: 'Quality-driven Indian manufacturing' },
                { icon: Globe, text: 'A forward-looking innovation in the electrical insulating mat segment' },
              ]}
            />
          </div>
        </SectionShell>

        {/* ═══ 10. CTA ═══ */}
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
              Speak to our team about Bi-Color HV Electrical Insulating Mats
              for your electrical installation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <PrimaryButton href="/contact-us?type=quote&product=dual-layer-dual-colour" size="lg">
                Request a Quote
                <ArrowRight className="size-4 ml-1.5" />
              </PrimaryButton>
              <SecondaryButton href={PRODUCT_ROUTES.international}>
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
