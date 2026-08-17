'use client';

import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { capabilityPoints } from '@/data/trust';
import { CheckCircle2 } from 'lucide-react';

/**
 * WhyChooseUs — Why Choose Us section.
 *
 * Uses ONLY source-supported capability bullets from trust.ts
 * capabilityPoints. Does NOT invent facility size, production
 * capacity, employee numbers, or any unsourced claims.
 *
 * Content source: src/data/trust.ts capabilityPoints.
 */

export default function WhyChooseUs() {
  return (
    <SectionShell variant="standard" bg="bg-be-cream" topRule yellowAccent>
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        {/* Left — content */}
        <div className="lg:w-[58%]">
          <div className="reveal-up mb-8">
            <SectionHeader
              eyebrow="Why Choose Us"
              title="Capabilities that set us apart"
              supportingText="Every claim below is traceable to our documented manufacturing and product capabilities — nothing is invented."
            />
          </div>

          <ul className="flex flex-col gap-5">
            {capabilityPoints.map((point, index) => (
              <li
                key={point.title}
                className="reveal-up flex items-start gap-3"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CheckCircle2
                  className="h-5 w-5 text-be-yellow-text mt-0.5 shrink-0"
                  aria-hidden="true"
                  focusable="false"
                />
                <div>
                  <p className="text-sm font-semibold text-be-charcoal-950 leading-snug">
                    {point.title}
                  </p>
                  <p className="text-body text-be-grey-650 mt-1">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — image */}
        <div className="lg:w-[42%] reveal-up">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/media/manufacturing/production-line.webp"
              alt="Bharat Electrosafe manufacturing facility — production line"
              width={700}
              height={500}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
