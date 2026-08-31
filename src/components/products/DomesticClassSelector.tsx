'use client';

import { useState } from 'react';
import { Zap, Gauge, CircleCheck, Info, Shield } from 'lucide-react';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { cn } from '@/lib/utils';
import type { SpecificationTable } from '@/data/products';

/* ────────────────────────────────────────────
   DomesticClassSelector — interactive class
   helper for the DOMESTIC HV insulating mats
   page (IS 15652:2006, Class A / B / C).

   Data provenance: every displayed value is
   parsed from the product's own specification
   table (src/data/products.ts → matSpecifications,
   BES1001–BES1003). No IEC 61111 data may ever
   appear here — the domestic and global HV pages
   are separate products with separate standards.
   ──────────────────────────────────────────── */

interface DomesticClassRow {
  classLabel: string;
  classLetter: string;
  productCode: string;
  thickness: string;
  workingVoltage: string;
  workingVoltageNum: number;
  acProofVoltage: string;
  dielectricStrength: string;
}

/* Parse the first "number" out of a spec cell such as "3.3 kV". */
function numericFromCell(cell: string | undefined): number | null {
  if (!cell) return null;
  const match = /([\d.]+)/.exec(cell);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
}

/**
 * Extracts the domestic class rows from the product's specification
 * table. Returns only rows whose class cell is exactly A, B or C and
 * whose voltage cells parse — anything else is skipped rather than
 * guessed.
 */
export function parseDomesticClassRows(
  specifications: SpecificationTable,
): DomesticClassRow[] {
  const rows: DomesticClassRow[] = [];
  for (const row of specifications.rows) {
    const [productCode, classValue, thickness, workingVoltage, acProofVoltage, dielectricStrength] =
      row;
    const classLetter = (classValue ?? '').trim().toUpperCase();
    if (!/^[ABC]$/.test(classLetter)) continue;
    const workingVoltageNum = numericFromCell(workingVoltage);
    if (workingVoltageNum === null || workingVoltageNum <= 0) continue;
    rows.push({
      classLabel: `Class ${classLetter}`,
      classLetter,
      productCode: (productCode ?? '').trim(),
      thickness: (thickness ?? '').trim(),
      workingVoltage: (workingVoltage ?? '').trim(),
      workingVoltageNum,
      acProofVoltage: (acProofVoltage ?? '').trim(),
      dielectricStrength: (dielectricStrength ?? '').trim(),
    });
  }
  /* Lowest working voltage first — the selector recommends the first
     class whose max working voltage covers the user's input. */
  return rows.sort((a, b) => a.workingVoltageNum - b.workingVoltageNum);
}

export default function DomesticClassSelector({
  specifications,
}: {
  specifications: SpecificationTable;
}) {
  const classRows = parseDomesticClassRows(specifications);

  /* Specification table missing/unparseable — render nothing rather
     than an empty tool. */
  if (classRows.length === 0) return null;

  const maxVoltage = Math.max(...classRows.map((c) => c.workingVoltageNum));

  return (
    <ClassSelectorInner classRows={classRows} maxVoltage={maxVoltage} />
  );
}

function ClassSelectorInner({
  classRows,
  maxVoltage,
}: {
  classRows: DomesticClassRow[];
  maxVoltage: number;
}) {
  const [voltageInput, setVoltageInput] = useState('');
  const parsedVoltage = parseFloat(voltageInput);
  const hasValidVoltage = Number.isFinite(parsedVoltage) && parsedVoltage > 0;
  const recommended = hasValidVoltage
    ? classRows.find((c) => parsedVoltage <= c.workingVoltageNum) ?? null
    : null;
  const exceedsRange = hasValidVoltage && parsedVoltage > maxVoltage;

  const selectPreset = (v: number) => setVoltageInput(String(v));

  return (
    <SectionShell
      variant="standard"
      bg="bg-be-white"
      topRule
      id="domestic-class-selector"
      ariaLabel="IS 15652:2006 class selector"
    >
      <SectionHeader
        eyebrow="Interactive Tool"
        title="Which IS 15652:2006 Class Do You Need?"
        supportingText={`Enter your installation's working voltage in kV AC. The selector matches it against the domestic class thresholds (Class A to Class ${classRows[classRows.length - 1]?.classLetter ?? 'C'}, up to ${maxVoltage.toFixed(1)} kV).`}
      />

      <div className="mt-8 max-w-3xl mx-auto">
        {/* Preset voltage chips — one per domestic class */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {classRows.map((c) => {
            const active =
              hasValidVoltage && Math.abs(parsedVoltage - c.workingVoltageNum) < 0.001;
            return (
              <button
                key={c.classLabel}
                type="button"
                onClick={() => selectPreset(c.workingVoltageNum)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2 min-h-[44px]',
                  active
                    ? 'bg-be-yellow-500 border-be-yellow-500 text-be-charcoal-950 shadow-sm'
                    : 'bg-be-white border-be-grey-300 text-be-charcoal-800 hover:border-be-yellow-400 hover:bg-be-yellow-50',
                )}
              >
                <Zap className="size-3.5" aria-hidden="true" />
                Up to {c.workingVoltageNum.toFixed(1)} kV
              </button>
            );
          })}
        </div>

        {/* Custom voltage input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
          <label htmlFor="domestic-voltage-input" className="sr-only">
            Working voltage in kV AC
          </label>
          <div className="relative sm:w-64">
            <Gauge
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-be-grey-650"
              aria-hidden="true"
            />
            <input
              id="domestic-voltage-input"
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

        {/* Result panel */}
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'rounded-xl border p-5 sm:p-6 transition-colors duration-300',
            recommended
              ? 'border-be-yellow-400 bg-be-yellow-50'
              : exceedsRange
                ? 'border-be-grey-300 bg-be-cream'
                : 'border-be-grey-250 bg-be-cream',
          )}
        >
          {recommended ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-be-yellow-500 text-be-charcoal-950"
                  aria-hidden="true"
                >
                  <CircleCheck className="size-5" />
                </span>
                <div>
                  <p className="text-metadata text-be-grey-650">
                    Recommended class for {parsedVoltage.toFixed(1)} kV AC
                  </p>
                  <p className="text-xl font-bold text-be-charcoal-950 leading-tight">
                    {recommended.classLabel}
                    <span className="ml-2 text-sm font-semibold text-be-grey-650">
                      (working voltage {recommended.workingVoltage})
                    </span>
                  </p>
                </div>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Product code', value: recommended.productCode },
                  { label: 'Thickness', value: recommended.thickness },
                  { label: 'AC proof voltage', value: recommended.acProofVoltage },
                  { label: 'Dielectric strength', value: recommended.dielectricStrength },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg bg-be-white border border-be-grey-250 px-3 py-2.5"
                  >
                    <dt className="text-metadata text-be-grey-650">{item.label}</dt>
                    <dd className="text-sm font-semibold text-be-charcoal-950 mt-0.5">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton
                  href={`/contact-us?type=quote&product=eim&class=${encodeURIComponent(recommended.classLabel)}`}
                  className="self-start"
                >
                  Request a Quote for {recommended.classLabel}
                </PrimaryButton>
                <p className="text-metadata text-be-grey-650 max-w-xs">
                  Final class selection should be confirmed against your installation
                  requirements — our team can advise.
                </p>
              </div>
            </div>
          ) : exceedsRange ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-be-charcoal-950 text-be-white"
                  aria-hidden="true"
                >
                  <Info className="size-5" />
                </span>
                <div>
                  <p className="text-lg font-bold text-be-charcoal-950 leading-tight">
                    Above the IS 15652:2006 domestic range
                  </p>
                  <p className="text-body text-be-grey-650">
                    {`${parsedVoltage.toFixed(1)} kV exceeds ${classRows[classRows.length - 1]?.classLabel ?? 'the highest class'} (working voltage ${classRows[classRows.length - 1]?.workingVoltage ?? ''}). For export-market requirements, see our IEC 61111:2009 range — or contact us for technical guidance.`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <SecondaryButton
                  href="/contact-us?type=technical-guidance&product=eim"
                  className="self-start"
                >
                  Ask for Technical Guidance
                </SecondaryButton>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-be-grey-650">
              <Gauge className="size-5 shrink-0" aria-hidden="true" />
              <p className="text-body">
                Select a preset above or type your working voltage to see the
                recommended IS 15652:2006 class, thickness and test voltages.
              </p>
            </div>
          )}
        </div>

        {/* Class overview cards — highlight follows the selection */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classRows.map((c) => {
            const active =
              hasValidVoltage &&
              !exceedsRange &&
              recommended?.classLetter === c.classLetter;
            return (
              <div
                key={c.classLabel}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300 flex flex-col gap-2',
                  active
                    ? 'border-be-yellow-500 bg-be-yellow-50 shadow-sm ring-1 ring-be-yellow-400'
                    : 'border-be-grey-250 bg-be-cream',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-be-charcoal-950">
                    <Shield
                      className={cn(
                        'size-4',
                        active ? 'text-be-yellow-text' : 'text-be-grey-650',
                      )}
                      aria-hidden="true"
                    />
                    {c.classLabel}
                  </span>
                  {active && (
                    <span className="text-metadata font-semibold text-be-yellow-text">
                      Recommended
                    </span>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {[
                    { label: 'Product code', value: c.productCode },
                    { label: 'Thickness', value: c.thickness },
                    { label: 'Working voltage', value: c.workingVoltage },
                    { label: 'Dielectric', value: c.dielectricStrength },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-metadata text-be-grey-650">{item.label}</dt>
                      <dd className="text-sm font-semibold text-be-charcoal-950">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-metadata text-be-grey-650">
          All values are taken from the IS 15652:2006 specification table above — the
          domestic range is separate from the IEC 61111:2009 global range.
        </p>
      </div>
    </SectionShell>
  );
}
