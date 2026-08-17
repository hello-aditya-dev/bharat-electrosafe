'use client';

import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionShell } from '@/components/ui/SectionShell';
import {
  Zap,
  Layers,
  Shield,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * AboutIntro — "Who We Are" section (intro only, no product list).
 *
 * Layout (desktop):
 *   ┌──────────────────────────┬──────────────────────────┐
 *   │ WHO WE ARE               │                          │
 *   │ Bharat Electrosafe       │  insulating-mat hero     │
 *   │ profile paragraph 1      │  image (centered         │
 *   │ profile paragraph 2      │  vertically beside       │
 *   │                          │  the text content)       │
 *   │ ┌──────────┬──────────┐ │                          │
 *   │ │ standards│ standards│ │                          │
 *   │ ├──────────┼──────────┤ │                          │
 *   │ │ standards│ standards│ │                          │
 *   │ └──────────┴──────────┘ │                          │
 *   └──────────────────────────┴──────────────────────────┘
 *
 * CSS Grid with items-center: the image column is vertically
 * centered beside the text column. The image uses a fixed
 * aspect-[4/3] ratio container on all viewports.
 *
 * A compact 2 × 2 standards / product-reference grid sits below
 * the two profile paragraphs, listing the four key product
 * standards the company manufactures to. This replaces the
 * previous credential badge row (BIS / ERDA / ISO) — those
 * credentials remain referenced in the dedicated Certifications
 * and Quality sections elsewhere on the site.
 *
 * The closing engineering-excellence paragraph now lives in the
 * ProductScope component, immediately beneath "Other Products".
 *
 * "Bharat Electrosafe" is a single-line heading on desktop
 * (whitespace-nowrap at lg+), natural wrap on smaller viewports.
 *
 * Content source: client-approved restructured copy — verbatim.
 */

/* ── Standards / product-reference items ──
 *   Four product lines with their governing Indian (and where
 *   relevant, international) standards. Reuses the existing
 *   lucide-react icon set already imported elsewhere on the
 *   site — no new icon library introduced. */
interface StandardItem {
  title: string;
  standard: string;
  icon: LucideIcon;
}

const STANDARD_ITEMS: StandardItem[] = [
  {
    title: 'High Voltage Insulating Mats',
    standard: 'IS 15652:2006 & IEC 61111:2009',
    icon: Zap,
  },
  {
    title: 'Geo Membrane Lining',
    standard: 'IS 15909:2020',
    icon: Layers,
  },
  {
    title: 'Water Stop Seal',
    standard: 'IS 15058:2002',
    icon: Shield,
  },
  {
    title: 'PVC Flooring',
    standard: 'IS 3462:1986',
    icon: LayoutGrid,
  },
];

export default function AboutIntro() {
  return (
    <SectionShell variant="hero" bg="be-page-top-tint">
      {/* Breadcrumb */}
      <div className="reveal-up mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      </div>

      {/* ── Who We Are text (left) + hero image (right) ──
       *  CSS Grid with items-center: the image is vertically
       *  centered beside the text column. */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] items-center gap-8 lg:gap-10">
        {/* Left — Who We Are text column (two paragraphs + standards grid) */}
        <div className="reveal-up">
          <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-text mb-2">
            Who We Are
          </p>
          {/* Single-line on desktop (lg+), natural wrap on mobile */}
          <h1 className="text-about-h1 text-be-charcoal-950 mb-5 whitespace-normal lg:whitespace-nowrap">
            Bharat Electrosafe
          </h1>

          <p className="text-about-body text-be-grey-650 leading-relaxed mb-4">
            At Bharat Electrosafe, we are India&rsquo;s trusted name in
            precision-engineered electrical safety, industrial safety,
            infrastructure protection, PVC flooring, and waterproofing
            solutions. Proudly contributing to the nation&rsquo;s safety and
            development under the Make in India initiative, we are committed
            to delivering high-quality products that protect lives, ensure
            compliance, and support critical industrial, commercial, and
            infrastructure operations across multiple sectors.
          </p>

          <p className="text-about-body text-be-grey-650 leading-relaxed mb-5">
            With a strong focus on quality, durability, and regulatory
            compliance, our solutions are designed to meet the highest Indian
            standards and serve industries such as power, construction,
            infrastructure, water management, manufacturing, and industrial
            utilities.
          </p>

          {/* ── Compact 2 × 2 standards / product-reference grid ──
           *   Four items in a two-column / two-row grid, sitting
           *   naturally in the Who We Are text column with no
           *   enclosing box, border, background, or shadow —
           *   only the grid spacing and the icon + title + standards
           *   typography remain. Icons are small, vertically aligned
           *   with each title; the title line is bold, the standards
           *   line is lighter and smaller. Replaces the previous
           *   credential badge row (BIS / ERDA / ISO). */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
            {STANDARD_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-2.5"
                >
                  <Icon
                    className="size-4 text-be-yellow-text mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-be-charcoal-950 leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-be-grey-650 leading-snug mt-0.5">
                      {item.standard}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Hero image — fixed aspect ratio, centered
         *  vertically beside the text column via items-center. */}
        <div className="reveal-up">
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/media/hero/bharat-electrosafe-insulating-mat-hero.webp"
              alt="Bharat Electrosafe electrical insulating mat in use"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
