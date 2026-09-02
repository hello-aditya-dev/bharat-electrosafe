'use client';

import { useEffect, useRef, useState } from 'react';
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
  Gauge,
  Info,
  CircleCheck,
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
import { cn } from '@/lib/utils';
import { company } from '@/data/company';
import { iecVisuals } from '@/data/product-visuals';
import { CopyTableButton } from '@/components/ui/CopyTableButton';
import { CopyEstimateButton } from '@/components/ui/CopyEstimateButton';
import { WhatsAppShareButton } from '@/components/ui/WhatsAppShareButton';
import { PrintSpecSheetButton } from '@/components/ui/PrintSpecSheetButton';
import {
  normalizeClassLabel,
  readClassParam,
  readQueryParam,
  syncClassParam,
  syncQueryParams,
} from '@/lib/class-selector-url';
import {
  iecClasses,
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

/* ── Standard roll areas (real brochure data + arithmetic only) ──
   iecDimensions.standardSizes strings like '1.0 m × 10.0 m' are parsed
   into per-roll areas so the estimator can express an entered area as
   a number of standard rolls. Pure unit arithmetic on published
   dimensions — no invented product data. */
const STANDARD_ROLLS = iecDimensions.standardSizes.flatMap((size) => {
  const dims = size.split('×').map((part) => parseFloat(part));
  return dims.length === 2 && dims.every(Number.isFinite)
    ? [{ label: size, areaM2: dims[0] * dims[1] }]
    : [];
});

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
   Class selector — numeric thresholds derived
   from the same iecClasses data used by the
   specification table. No invented values.
   ──────────────────────────────────────────── */

const iecClassThresholds = iecClasses.map((c) => ({
  classLabel: c.classLabel,
  maxWorkingVoltageNum: parseFloat(c.maxWorkingVoltage),
}));

const MAX_IEC_VOLTAGE = Math.max(...iecClassThresholds.map((c) => c.maxWorkingVoltageNum));

function recommendClass(voltageKV: number) {
  return iecClassThresholds.find((c) => voltageKV <= c.maxWorkingVoltageNum) ?? null;
}

const CLASS_PRESETS = iecClassThresholds.map((c) => ({
  classLabel: c.classLabel,
  voltage: c.maxWorkingVoltageNum,
}));

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

  /* ── Class selector state ── */
  const [voltageInput, setVoltageInput] = useState('');
  const parsedVoltage = parseFloat(voltageInput);
  const hasValidVoltage = Number.isFinite(parsedVoltage) && parsedVoltage > 0;
  const recommended = hasValidVoltage ? recommendClass(parsedVoltage) : null;
  const exceedsRange = hasValidVoltage && parsedVoltage > MAX_IEC_VOLTAGE;
  const recommendedDetails = recommended
    ? iecClasses.find((c) => c.classLabel === recommended.classLabel) ?? null
    : null;

  const selectPreset = (v: number) => setVoltageInput(String(v));

  /* ── Weight estimator state ──
     Class defaults to "auto" (null) which follows the class selector
     recommendation above; picking a chip pins the class explicitly.
     All weight-per-m² values are parsed from the brochure approxWeight
     strings in iec-61111.ts — no invented data. */
  const [estimatorClass, setEstimatorClass] = useState<string | null>(null);
  const [estimatorArea, setEstimatorArea] = useState('');
  const [estimatorUnit, setEstimatorUnit] = useState<'m2' | 'ft2'>('m2');

  const effectiveEstimatorClass =
    estimatorClass ?? recommendedDetails?.classLabel ?? null;
  const estimatorDetails = effectiveEstimatorClass
    ? iecClasses.find((c) => c.classLabel === effectiveEstimatorClass) ?? null
    : null;
  const estimatorKgPerM2 = estimatorDetails
    ? parseFloat(estimatorDetails.approxWeight)
    : NaN;
  const hasValidKgPerM2 = Number.isFinite(estimatorKgPerM2) && estimatorKgPerM2 > 0;
  const parsedArea = parseFloat(estimatorArea);
  const hasValidArea = Number.isFinite(parsedArea) && parsedArea > 0;
  /* ft² → m² conversion uses the fixed international foot definition
     (1 ft = 0.3048 m exactly → 1 m² = 10.7639 ft²) — a unit constant,
     not product data. */
  const FT2_PER_M2 = 10.7639;
  const areaM2 = estimatorUnit === 'ft2' ? parsedArea / FT2_PER_M2 : parsedArea;
  const totalKg = hasValidArea && hasValidKgPerM2 ? areaM2 * estimatorKgPerM2 : null;
  const totalDisplay = totalKg === null
    ? null
    : totalKg >= 1000
      ? `${(totalKg / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} t`
      : `${totalKg.toLocaleString('en-IN', { maximumFractionDigits: 1 })} kg`;
  const areaDisplayM2 = hasValidArea
    ? areaM2.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : null;

  /* Roll coverage — how many standard rolls cover the entered area.
     ceil() rounds up because partial rolls must still be ordered. */
  const rollCoverage =
    hasValidArea && areaM2 > 0 && STANDARD_ROLLS.length > 0
      ? STANDARD_ROLLS.map((r) => ({
          ...r,
          rolls: Math.ceil(areaM2 / r.areaM2),
          coveredM2: Math.ceil(areaM2 / r.areaM2) * r.areaM2,
        }))
      : null;

  /* Estimate summary lines — one source of truth shared by the copy
     button and the WhatsApp action (both add the share link at click
     time via their includeLink prop). */
  const estimateLines = estimatorDetails
    ? [
        `Bharat Electrosafe — HV Insulating Mats (IEC 61111:2009)`,
        `Class: ${estimatorDetails.classLabel} (${estimatorDetails.productCode})`,
        `Thickness: ${estimatorDetails.thickness}`,
        ...(hasValidArea
          ? [
              `Mat area: ${areaDisplayM2} m²`,
              `Approx. weight basis: ${estimatorDetails.approxWeight}`,
              ...(totalDisplay ? [`Estimated total weight: ${totalDisplay}`] : []),
            ]
          : []),
        ...(rollCoverage
          ? rollCoverage.map(
              (r) =>
                `Standard rolls: ≈ ${r.rolls} × ${r.label} (${r.areaM2.toLocaleString('en-IN')} m² each)`,
            )
          : []),
        `Source: bharatelectrosafe.com — values per IEC 61111:2009 and the official Bharat Electrosafe brochure. Planning estimate only.`,
      ]
    : [];

  /* Deep-link init: a URL carrying ?class=Class 3 (e.g. a shared link)
     initialises the selector to that class's maximum working voltage.
     ?area= and ?unit= initialise the weight estimator the same way
     (unit defaults to m², so only ft² needs the param). Mount-effect
     (not useState initializers) to avoid any SSR/client markup mismatch. */
  const deepLinkAppliedRef = useRef(false);
  useEffect(() => {
    if (deepLinkAppliedRef.current) return;
    deepLinkAppliedRef.current = true;
    const klass = readClassParam();
    if (klass) {
      const match = iecClassThresholds.find(
        (c) => normalizeClassLabel(c.classLabel) === normalizeClassLabel(klass),
      );
      /* Deliberate post-mount initialisation from an external mutable source
         (the URL) — the deep-linked class cannot be known at SSR render time. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (match) setVoltageInput(String(match.maxWorkingVoltageNum));
    }
    const linkedArea = readQueryParam('area');
    const linkedUnit = readQueryParam('unit');
    if (linkedArea && Number.isFinite(parseFloat(linkedArea)) && parseFloat(linkedArea) > 0) {
      setEstimatorArea(linkedArea);
      if (linkedUnit === 'ft2' || linkedUnit === 'm2') setEstimatorUnit(linkedUnit);
    }
  }, []);

  /* Mirror the current recommendation into the URL (?class=Class 3) so the
     selector state is shareable. replaceState only — no navigation, no
     history pollution; other query params are preserved. */
  useEffect(() => {
    const target = recommended ? recommended.classLabel : null;
    if ((readClassParam() ?? null) === target) return;
    syncClassParam(target);
  }, [recommended, voltageInput]);

  /* Mirror the estimator state into the URL (?area=120&unit=ft2) so a
     planned estimate is shareable/bookmarkable alongside the class param.
     Only valid areas are written (clearing the input removes both params);
     unit=m² is the default and omitted to keep shared URLs tidy. */
  useEffect(() => {
    const nextArea = hasValidArea ? estimatorArea : null;
    const nextUnit = hasValidArea && estimatorUnit !== 'm2' ? estimatorUnit : null;
    const current = new URLSearchParams(window.location.search);
    if (
      (current.get('area') ?? null) === nextArea &&
      (current.get('unit') ?? null) === nextUnit
    ) {
      return;
    }
    syncQueryParams({ area: nextArea, unit: nextUnit });
  }, [estimatorArea, estimatorUnit, hasValidArea]);

  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            1. HERO
            ══════════════════════════════════════ */}
        <SectionShell variant="productHero" bg="be-page-top-tint" className="product-hero-compact">
          <Breadcrumb items={breadcrumbItems} className="print-hide mb-3 lg:mb-4" />

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

              <div className="print-hide flex flex-wrap gap-3">
                <PrimaryButton href="/contact-us?type=quote&product=iec-hv-insulating-mats" size="lg">
                  Request a Quote
                </PrimaryButton>
                <SecondaryButton href="#class-table">
                  View Class Table
                </SecondaryButton>
              </div>
            </div>

            {/* Media side — real IEC product imagery (screen only) */}
            <div className="print-hide min-w-0 lg:col-span-6 xl:col-span-7 flex flex-col gap-3">
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-class-2-yellow.webp"
                alt="Bharat Electrosafe HV insulating mat with moulded IEC 61111/2009 Class 2 marking — max use voltage 17000 V, proof voltage 20000 V, withstand voltage 30000 V"
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
            2b. CLASS SELECTOR — interactive
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule id="class-selector" ariaLabel="IEC class selector">
          <SectionHeader
            eyebrow="Interactive Tool"
            title="Which IEC Class Do You Need?"
            supportingText={`Enter your installation's maximum working voltage in kV AC. The selector matches it against the IEC 61111:2009 class thresholds (up to ${MAX_IEC_VOLTAGE.toFixed(1)} kV). The selected class is reflected in the page URL so you can share or bookmark it.`}
          />

          <div className="mt-8 max-w-3xl mx-auto">
            {/* Preset voltage chips (screen only — the recommendation
                result below is what appears on the printed sheet) */}
            <div className="print-hide flex flex-wrap justify-center gap-2 mb-5">
              {CLASS_PRESETS.map((preset) => {
                const active = hasValidVoltage && Math.abs(parsedVoltage - preset.voltage) < 0.001;
                return (
                  <button
                    key={preset.classLabel}
                    type="button"
                    onClick={() => selectPreset(preset.voltage)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 min-h-[44px]',
                      active
                        ? 'bg-be-yellow-500 border-be-yellow-500 text-be-charcoal-950 shadow-sm'
                        : 'bg-be-white border-be-grey-300 text-be-charcoal-800 hover:border-be-yellow-400 hover:bg-be-yellow-50',
                    )}
                  >
                    <Zap className="size-3.5" aria-hidden="true" />
                    Up to {preset.voltage.toFixed(1)} kV
                  </button>
                );
              })}
            </div>

            {/* Custom voltage input (screen only) */}
            <div className="print-hide flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
              <label htmlFor="voltage-input" className="sr-only">
                Maximum working voltage in kV AC
              </label>
              <div className="relative sm:w-64">
                <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-be-grey-650" aria-hidden="true" />
                <input
                  id="voltage-input"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  step="0.1"
                  placeholder="Custom voltage"
                  value={voltageInput}
                  onChange={(e) => setVoltageInput(e.target.value)}
                  className="w-full pl-10 pr-14 py-2.5 min-h-[44px] rounded-lg border border-be-grey-300 bg-be-white text-body text-be-charcoal-950 placeholder:text-be-grey-650 focus:outline-none focus:ring-2 focus:ring-be-yellow-500 focus:border-be-yellow-500 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-metadata text-be-grey-650 pointer-events-none">
                  kV AC
                </span>
              </div>
              {voltageInput !== '' && (
                <button
                  type="button"
                  onClick={() => setVoltageInput('')}
                  className="text-sm font-medium text-be-grey-650 hover:text-be-charcoal-950 underline underline-offset-2 px-2 min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 rounded"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Result panel — keyed on the outcome so the entrance animation
                replays whenever the recommendation changes. */}
            <div
              role="status"
              aria-live="polite"
              key={recommended?.classLabel ?? (exceedsRange ? 'over-range' : 'empty')}
              className={cn(
                'rounded-xl border p-5 sm:p-6 transition-colors duration-300 animate-in fade-in-0 slide-in-from-bottom-1 duration-500',
                recommended
                  ? 'border-be-yellow-400 bg-be-yellow-50'
                  : exceedsRange
                    ? 'border-be-grey-300 bg-be-cream'
                    : 'border-be-grey-250 bg-be-cream',
              )}
            >
              {recommended && recommendedDetails ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-be-yellow-500 text-be-charcoal-950" aria-hidden="true">
                      <CircleCheck className="size-5" />
                    </span>
                    <div>
                      <p className="text-metadata text-be-grey-650">Recommended class for {parsedVoltage.toFixed(1)} kV AC</p>
                      <p className="text-xl font-bold text-be-charcoal-950 leading-tight">
                        {recommended.classLabel}
                        <span className="ml-2 text-sm font-semibold text-be-grey-650">
                          (max working voltage {recommendedDetails.maxWorkingVoltage})
                        </span>
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Product code', value: recommendedDetails.productCode },
                      { label: 'Thickness', value: recommendedDetails.thickness },
                      { label: 'AC proof voltage', value: recommendedDetails.acProofVoltage },
                      { label: 'Dielectric strength', value: recommendedDetails.dielectricStrength },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-be-white border border-be-grey-250 px-3 py-2.5">
                        <dt className="text-metadata text-be-grey-650">{item.label}</dt>
                        <dd className="text-sm font-semibold text-be-charcoal-950 mt-0.5">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="print-hide flex flex-wrap items-center gap-3">
                    <PrimaryButton
                      href={`/contact-us?type=quote&product=iec-hv-insulating-mats&class=${encodeURIComponent(recommended.classLabel)}`}
                      className="self-start"
                    >
                      Request a Quote for {recommended.classLabel}
                    </PrimaryButton>
                    <p className="text-metadata text-be-grey-650 max-w-xs">
                      Final class selection should be confirmed against your installation requirements —
                      our team can advise.
                    </p>
                  </div>
                </div>
              ) : exceedsRange ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-be-charcoal-950 text-be-white" aria-hidden="true">
                      <Info className="size-5" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-be-charcoal-950 leading-tight">Above the IEC 61111:2009 range</p>
                      <p className="text-body text-be-grey-650">
                        {parsedVoltage.toFixed(1)} kV exceeds Class 4 (max working voltage 36.0 kV). Contact us for
                        technical guidance on alternative protection approaches.
                      </p>
                    </div>
                  </div>
                  <SecondaryButton href="/contact-us?type=technical-guidance&product=iec-hv-insulating-mats" className="self-start">
                    Ask for Technical Guidance
                  </SecondaryButton>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-be-grey-650">
                  <Gauge className="size-5 shrink-0" aria-hidden="true" />
                  <p className="text-body">
                    Select a preset above or type your maximum working voltage to see the recommended IEC class,
                    thickness and test voltages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            3. CLASS / VOLTAGE TABLE
            ══════════════════════════════════════ */}
        <SectionShell variant="technical" bg="bg-be-cream" id="class-table" ariaLabel="IEC 61111 HV class table">
          <SectionHeader
            eyebrow="Technical Specifications"
            title="IEC 61111:2009 Class Table — HV Insulating Mats"
            supportingText="All five classes with thickness, maximum working voltage, AC proof voltage, dielectric strength, and approximate weight per IEC 61111:2009 and the official Bharat Electrosafe brochure."
          />

          {/* Spreadsheet-ready copy + print of the IEC class table */}
          <div className="print-hide mt-4 flex flex-wrap justify-end gap-2">
            <CopyTableButton
              headers={[
                'Product Code',
                'Class',
                'Thickness',
                'Max Working Voltage',
                'AC Proof Voltage',
                'Dielectric Strength',
                'Approx. Weight',
              ]}
              rows={iecClasses.map((row) => [
                row.productCode,
                row.classLabel,
                row.thickness,
                row.maxWorkingVoltage,
                row.acProofVoltage,
                row.dielectricStrength,
                row.approxWeight,
              ])}
              label="Copy class table"
            />
            <PrintSpecSheetButton />
          </div>

          <div className="print-reset-x mt-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
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
                {iecClasses.map((row) => {
                  const isSelected = recommended?.classLabel === row.classLabel;
                  return (
                    <tr
                      key={row.classLabel}
                      className={cn(
                        'border-b border-be-grey-250 transition-colors duration-300',
                        isSelected
                          ? 'bg-be-yellow-100/70 shadow-[inset_3px_0_0_0_theme(colors.be-yellow-500)]'
                          : 'even:bg-be-white/70 hover:bg-be-yellow-50/50',
                      )}
                      aria-current={isSelected ? 'true' : undefined}
                    >
                      <td className="py-3 pr-4 font-semibold text-be-charcoal-950">{row.productCode}</td>
                      <td className="py-3 pr-4 font-semibold text-be-charcoal-950 whitespace-nowrap">
                        {row.classLabel}
                        {isSelected && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-be-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-be-charcoal-950 align-middle">
                            <CircleCheck className="size-3" aria-hidden="true" />
                            Recommended
                          </span>
                        )}
                      </td>
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
                  );
                })}
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

          {/* Print-only contact footer for the printed spec sheet */}
          <div className="hidden print:block mt-6 pt-4 border-t border-be-grey-300 text-metadata text-be-charcoal-800">
            <p className="font-semibold">Bharat Electrosafe — {company.email} — {company.phonePrimary}</p>
            <p className="mt-1">Printed from the official Bharat Electrosafe website. Values per IEC 61111:2009 and the official Bharat Electrosafe brochure.</p>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            3b. WEIGHT ESTIMATOR — interactive
            ══════════════════════════════════════ */}
        <SectionShell variant="standard" bg="bg-be-white" topRule id="weight-estimator" ariaLabel="Mat weight estimator">
          <SectionHeader
            eyebrow="Planning Tool"
            title="Estimate Total Mat Weight"
            supportingText={`Area × approximate weight per m², using the brochure values for the selected IEC class (3.2 – 6.4 kg/m²). The class follows your selection above unless you pick one explicitly — useful for logistics and freight planning. Your plan is reflected in the page URL, so you can share or bookmark the exact estimate.`}
          />

          <div className="mt-8 max-w-3xl mx-auto">
            {/* Class chips — Auto follows the selector above */}
            <div className="print-hide flex flex-wrap justify-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => setEstimatorClass(null)}
                aria-pressed={estimatorClass === null}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 min-h-[44px]',
                  estimatorClass === null
                    ? 'bg-be-charcoal-950 border-be-charcoal-950 text-be-white shadow-sm'
                    : 'bg-be-white border-be-grey-300 text-be-charcoal-800 hover:border-be-charcoal-800',
                )}
              >
                <CircleCheck className="size-3.5" aria-hidden="true" />
                {recommendedDetails ? `Auto — ${recommendedDetails.classLabel} (from selection)` : 'Auto — from class selection'}
              </button>
              {iecClasses.map((c) => {
                const active = estimatorClass === c.classLabel;
                return (
                  <button
                    key={c.classLabel}
                    type="button"
                    onClick={() => setEstimatorClass(c.classLabel)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 min-h-[44px]',
                      active
                        ? 'bg-be-yellow-500 border-be-yellow-500 text-be-charcoal-950 shadow-sm'
                        : 'bg-be-white border-be-grey-300 text-be-charcoal-800 hover:border-be-yellow-400 hover:bg-be-yellow-50',
                    )}
                  >
                    {c.classLabel}
                  </button>
                );
              })}
            </div>

            {/* Area input + unit toggle */}
            <div className="print-hide flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
              <label htmlFor="area-input" className="sr-only">
                Mat area
              </label>
              <div className="relative sm:w-64">
                <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-be-grey-650" aria-hidden="true" />
                <input
                  id="area-input"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  step="0.1"
                  placeholder="Mat area"
                  value={estimatorArea}
                  onChange={(e) => setEstimatorArea(e.target.value)}
                  className="w-full pl-10 pr-16 py-2.5 min-h-[44px] rounded-lg border border-be-grey-300 bg-be-white text-body text-be-charcoal-950 tabular-nums placeholder:text-be-grey-650 focus:outline-none focus:ring-2 focus:ring-be-yellow-500 focus:border-be-yellow-500 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-metadata text-be-grey-650 pointer-events-none">
                  {estimatorUnit === 'm2' ? 'm²' : 'ft²'}
                </span>
              </div>
              {/* Joined segmented control — reads as one unit switcher
                  instead of two loose chips */}
              <div
                className="inline-flex items-center self-center rounded-full border border-be-grey-300 bg-be-cream p-1"
                role="group"
                aria-label="Area unit"
              >
                {([
                  ['m2', 'm²'],
                  ['ft2', 'ft²'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEstimatorUnit(value)}
                    aria-pressed={estimatorUnit === value}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 min-h-[36px] tabular-nums',
                      estimatorUnit === value
                        ? 'bg-be-charcoal-950 text-be-white shadow-sm'
                        : 'bg-transparent text-be-charcoal-800 hover:text-be-charcoal-950 hover:bg-be-white',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result panel — keyed on the outcome so the entrance
                animation replays whenever the estimate changes. */}
            <div
              role="status"
              aria-live="polite"
              key={`${effectiveEstimatorClass ?? 'none'}-${totalDisplay ?? 'empty'}`}
              className={cn(
                'rounded-xl border p-5 sm:p-6 transition-colors duration-300 animate-in fade-in-0 slide-in-from-bottom-1 duration-500',
                totalDisplay
                  ? 'border-be-yellow-400 bg-be-yellow-50'
                  : 'border-be-grey-250 bg-be-cream',
              )}
            >
              {totalDisplay && estimatorDetails ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-be-yellow-500 text-be-charcoal-950" aria-hidden="true">
                      <Weight className="size-5" />
                    </span>
                    <div>
                      <p className="text-metadata text-be-grey-650">
                        Estimated total weight — {estimatorDetails.classLabel} ({estimatorDetails.productCode})
                      </p>
                      <p className="text-2xl font-bold text-be-charcoal-950 leading-tight tabular-nums tracking-tight">{totalDisplay}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Mat area', value: `${areaDisplayM2} m²` },
                      { label: 'Weight basis', value: `${estimatorDetails.approxWeight} (approx.)` },
                      { label: 'Thickness', value: estimatorDetails.thickness },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-be-white border border-be-grey-250 px-3 py-2.5">
                        <dt className="text-metadata text-be-grey-650">{item.label}</dt>
                        <dd className="text-sm font-semibold text-be-charcoal-950 mt-0.5">{item.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {/* Standard roll coverage — arithmetic on published
                      brochure roll sizes; ceil() because partial rolls
                      must still be ordered. */}
                  {rollCoverage && (
                    <div className="rounded-lg border border-be-grey-250 bg-be-white px-3 py-2.5">
                      <p className="text-metadata text-be-grey-650 flex items-center gap-1.5">
                        <Layers className="size-3.5" aria-hidden="true" />
                        Standard roll coverage
                      </p>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {rollCoverage.map((r) => (
                          <li key={r.label} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                            <span className="font-semibold text-be-charcoal-950">
                              ≈ {r.rolls} {r.rolls === 1 ? 'roll' : 'rolls'}
                            </span>
                            <span className="text-be-grey-650">
                              of {r.label} ({r.areaM2.toLocaleString('en-IN')} m² each)
                            </span>
                            {r.coveredM2 > areaM2 && (
                              <span className="text-metadata text-be-grey-650">
                                — covers {r.coveredM2.toLocaleString('en-IN')} m², {r.coveredM2 - areaM2 < 1 ? 'fully' : `${(r.coveredM2 - areaM2).toLocaleString('en-IN', { maximumFractionDigits: 1 })} m² spare`}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Shared by the copy button and the WhatsApp action —
                      one source of truth for the estimate summary text. */}
                  <div className="print-hide flex flex-wrap items-center gap-3">
                    <PrimaryButton
                      href={`/contact-us?type=quote&product=iec-hv-insulating-mats&class=${encodeURIComponent(estimatorDetails.classLabel)}`}
                      className="self-start"
                    >
                      Request a Quote for {estimatorDetails.classLabel}
                    </PrimaryButton>
                    <CopyEstimateButton
                      includeLink
                      lines={estimateLines}
                      label="Copy estimate"
                    />
                    <WhatsAppShareButton includeLink lines={estimateLines} />
                    <p className="text-metadata text-be-grey-650 max-w-xs">
                      {estimatorUnit === 'ft2'
                        ? `Entered ${parsedArea.toLocaleString('en-IN')} ft² — converted at 1 m² = ${FT2_PER_M2} ft².`
                        : 'Planning estimate — actual shipping weight depends on roll/sheet format and packaging.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-be-grey-650">
                  <Info className="size-5 shrink-0" aria-hidden="true" />
                  <p className="text-body">
                    {!estimatorDetails
                      ? 'Select a class above (or pick a voltage in the class selector) and enter the mat area to estimate the total weight.'
                      : 'Enter the mat area to estimate the total weight for the selected class.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 text-metadata text-be-grey-650">
              <Shield className="size-4 shrink-0 mt-0.5 text-be-yellow-text" aria-hidden="true" />
              <p>
                Weight basis: approximate brochure values per IEC 61111:2009 class
                ({iecClasses.map((c) => c.approxWeight.replace(' kg/m²', '')).join(', ')} kg/m²
                for Classes 0–4). Estimate only — not a substitute for certified shipping weight.
              </p>
            </div>
          </div>
        </SectionShell>

        {/* ══════════════════════════════════════
            4. CONSTRUCTION & KEY REQUIREMENTS
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
            {/* LEFT — heading + text + Image 1 (Class 2, large) */}
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
              {/* Position 1 — Image 1 (Class 2) in the left large area below the text */}
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-class-2-yellow.webp"
                alt="Bharat Electrosafe IEC 61111/2009 Class 2 mat marking — max use voltage 17000 V, proof voltage 20000 V, withstand voltage 30000 V"
                aspectRatio="landscape"
                fit="cover"
              />
            </div>

            {/* RIGHT — Image 2 (Class 0) as the primary gallery image */}
            <div className="lg:w-[55%]">
              <ImageFrame
                src="/media/products/international-iec/client-approved/iec-marking-class-0-red.webp"
                alt="Bharat Electrosafe IEC 61111/2009 Class 0 mat marking — max use voltage 1000 V, proof voltage 5000 V, withstand voltage 10000 V"
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
                  href={PRODUCT_ROUTES.internationalBiColor}
                  className="font-medium underline underline-offset-2 hover:text-be-charcoal-950"
                >
                  Bi-Color
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
        <SectionShell variant="conversion" bg="bg-be-yellow-50" yellowAccent className="print-hide">
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
