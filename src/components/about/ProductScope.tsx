'use client';

import Image from 'next/image';
import { SectionShell } from '@/components/ui/SectionShell';
import { CheckCircle2 } from 'lucide-react';

/**
 * ProductScope — Product bullet list paired with the electrical
 * insulation mat poster image.
 *
 * Layout (desktop):
 *   ┌──────────────────────────┬──────────────────────────┐
 *   │                          │                          │
 *   │ electrical-insulation    │  PRODUCT SCOPE          │
 *   │ poster image             │  • High Voltage ...     │
 *   │                          │  • Geo Membrane ...     │
 *   │                          │  • Water Proofing ...   │
 *   │                          │  • PVC Flooring ...     │
 *   │                          │  • Other Products ...   │
 *   │                          │  [closing paragraph]    │
 *   └──────────────────────────┴──────────────────────────┘
 *
 * CSS Grid with items-stretch. The poster image (portrait) is
 * naturally taller. The product list is vertically centered
 * beside it on desktop via flex-col + justify-center.
 *
 * Mobile: stacks vertically — poster image, then product list.
 *
 * Product names are bold (font-bold), standards/descriptions
 * remain normal weight.
 *
 * The closing engineering-excellence paragraph sits immediately
 * beneath the "Other Products" bullet as a natural conclusion
 * to the Product Scope.
 *
 * Content source: client-approved restructured copy — verbatim.
 */

export default function ProductScope() {
  return (
    <SectionShell variant="hero" bg="bg-be-white">
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr] items-stretch gap-8 lg:gap-10">
        {/* Left — Client-supplied poster */}
        <div className="reveal-up order-2 lg:order-1">
          <div className="rounded-lg overflow-hidden bg-be-cream/40 p-3">
            <Image
              src="/media/about/electrical-insulation-mat-poster-client-provided.png"
              alt="Bharat Electrosafe electrical insulation mat poster"
              width={700}
              height={900}
              className="w-full h-auto object-contain"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>

        {/* Right — Product Scope list */}
        <div className="reveal-up order-1 lg:order-2 lg:flex lg:flex-col lg:justify-center">
          <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-2">
            Product Scope
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-be-charcoal-950 mb-5">
            Our Wide Product Range
          </h2>

          <ul className="flex flex-col gap-3 mb-5">
            {/* 1. High Voltage Electrical Insulating Mats */}
            <li className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-body font-bold text-be-charcoal-950 leading-snug">
                  High Voltage Electrical Insulating Mats
                </p>
                <p className="text-body text-be-grey-650 leading-snug mt-0.5">
                  (As per IS 15652 &amp; IEC 61111 standards; ERDA-tested and BIS-certified)
                </p>
              </div>
            </li>

            {/* 2. Geo Membrane Lining Solutions */}
            <li className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-body font-bold text-be-charcoal-950 leading-snug">
                  Geo Membrane Lining Solutions
                </p>
                <p className="text-body text-be-grey-650 leading-snug mt-0.5">
                  (As per IS 15909:2020 for containment, lining, and environmental protection applications)
                </p>
              </div>
            </li>

            {/* 3. Water Proofing Solutions */}
            <li className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-body font-bold text-be-charcoal-950 leading-snug">
                  Water Proofing Solutions
                </p>
                <p className="text-body text-be-grey-650 leading-snug mt-0.5">
                  (Including BharatHydro Water Stop Seals as per IS 15058:2002 for concrete joint sealing and water leakage prevention)
                </p>
              </div>
            </li>

            {/* 4. PVC Flooring Solutions */}
            <li className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-body font-bold text-be-charcoal-950 leading-snug">
                  PVC Flooring Solutions
                </p>
                <p className="text-body text-be-grey-650 leading-snug mt-0.5">
                  (As per IS 3462:1986 for industrial, electrical, and commercial flooring applications)
                </p>
              </div>
            </li>

            {/* 5. Other Products */}
            <li className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 text-be-yellow-text mt-1.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-body text-be-charcoal-950 leading-snug">
                  <span className="font-bold">Other Products:</span> Rubber Sheets, Rubber Hose Pipes, ESD Mats, Conveyor Belts, and other industrial rubber and safety solutions.
                </p>
              </div>
            </li>
          </ul>

          {/* ── Closing paragraph — moved here from the Who We Are
           *   hero so it sits immediately beneath "Other Products"
           *   and reads as the conclusion of the Product Scope.
           *   Wording preserved verbatim — appears exactly once. */}
          <p className="text-body text-be-grey-650 leading-relaxed">
            At Bharat Electrosafe, we combine engineering excellence,
            compliance assurance, and customer-centric innovation to deliver
            reliable, durable, and standards-compliant solutions for modern
            industry and infrastructure.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
