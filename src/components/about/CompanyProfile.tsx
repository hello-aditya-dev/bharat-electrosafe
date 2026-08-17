'use client';

import { SectionShell } from '@/components/ui/SectionShell';
import { CheckCircle2 } from 'lucide-react';

/**
 * CompanyProfile — "Company Profile" editorial block.
 *
 * Text-only layout (poster image moved to AboutIntro media column
 * for balanced composition). Contains intro paragraphs, Product Scope
 * list, and any remaining approved profile content.
 *
 * Content: client-supplied source material.
 */

const productScope = [
  'High Voltage Electrical Insulating Mats (IS 15652:2006 & IEC 61111:2009; ERDA-tested and BIS licensed)',
  'Geo Membrane Lining (IS 15909:2020 for containment, lining and environmental protection applications)',
  'Water Stop Seal (IS 15058:2002 for concrete joint sealing and water leakage prevention)',
  'PVC Flooring Solutions (IS 3462:1986 for residential, office and commercial interior flooring applications)',
  'Other Products: Rubber Sheets, Rubber Hose Pipes, ESD Mats, Conveyor Belts',
];

export default function CompanyProfile() {
  return (
    <SectionShell variant="standard" bg="bg-be-warm-white">
      <div className="reveal-up max-w-3xl">
        <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-2">
          Company Profile
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-be-charcoal-950 tracking-tight leading-snug mb-5">
          About Bharat Electrosafe
        </h2>

        <p className="text-body-large text-be-grey-650 leading-relaxed mb-4">
          At Bharat Electrosafe, we are India&rsquo;s trusted name in
          precision-engineered electrical safety, industrial safety,
          infrastructure protection, PVC flooring, and waterproofing
          solutions. Proudly contributing to the nation&rsquo;s safety and
          development under the Make in India initiative, we are committed
          to delivering high-quality products that protect lives, ensure
          compliance, and support critical industrial, commercial, and
          infrastructure operations across multiple sectors.
        </p>

        <p className="text-body text-be-grey-650 leading-relaxed mb-6">
          With a strong focus on quality, durability, and regulatory
          compliance, our solutions are designed to meet the highest Indian
          standards and serve industries such as power, construction,
          infrastructure, water management, manufacturing, and industrial
          utilities.
        </p>

        {/* Product scope list */}
        <p className="text-sm font-bold uppercase tracking-wider text-be-charcoal-950 mb-3">
          Product Scope
        </p>
        <ul className="flex flex-col gap-2.5">
          {productScope.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="text-body text-be-grey-650 leading-snug">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
