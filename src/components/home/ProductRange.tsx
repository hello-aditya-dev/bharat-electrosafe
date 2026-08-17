import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionShell } from '@/components/ui/SectionShell';
import { getProductBySlug } from '@/data/products';
import {
  hvVisuals,
  membraneVisuals,
  pvcFlooringVisuals,
  otherProductsVisuals,
  type ProductVisualRole,
} from '@/data/product-visuals';

/* ────────────────────────────────────────────
   4-Group Homepage Product Cards
   ────────────────────────────────────────────
   Four primary product groups with IEC as a
   subsection of Electrical Insulating Mats.
   Uses centralized product-visuals.ts as the
   single source of truth for all imagery. */

interface ProductGroupCardData {
  slug: string;
  href: string;
  name: string;
  description: string;
  visual: ProductVisualRole;
  /** Optional standards/range metadata shown as compact secondary line */
  standardsLine?: string;
  /** Per-image object-position for deliberate cropping */
  objectPosition?: string;
}

const productGroups: ProductGroupCardData[] = [
  {
    slug: 'electrical-insulating-mats',
    href: '/products/electrical-insulating-mats',
    name: 'Electrical Insulating Mats',
    description:
      'IS 15652 and IEC 61111 insulating mat solutions for electrical safety around switchgear and substations.',
    visual: {
      src: '/media/home/product-range/electrical-insulating-mats-autoglow26.png',
      alt: 'AutoGlow reflective band electrical insulating mat with safety visibility strip',
      fit: 'cover' as const,
    },
    standardsLine: 'Domestic · IS 15652:2006  ·  International · IEC 61111',
    objectPosition: 'center center',
  },
  {
    slug: 'waterproofing-solutions',
    href: '/products/waterproofing-solutions',
    name: 'Waterproofing Solutions',
    description:
      'Geo Membrane Lining and Water Stop Seal solutions for tunnels, containment and industrial waterproofing.',
    visual: membraneVisuals.homePreview,
    objectPosition: 'center center',
  },
  {
    slug: 'pvc-flooring-solutions',
    href: '/products/pvc-flooring-solutions',
    name: 'PVC Flooring Solutions',
    description:
      'PVC flooring for homes, offices, retail spaces and modern commercial interiors.',
    visual: pvcFlooringVisuals.homePreview,
    objectPosition: 'center center',
  },
  {
    slug: 'other-products',
    href: '/products/other-products',
    name: 'Other Products',
    description:
      'Rubber sheets, hose pipes, ESD mats and conveyor belts for industrial applications.',
    visual: otherProductsVisuals.homePreview,
    objectPosition: 'center center',
  },
];

function ProductGroupCard({ group, index }: { group: ProductGroupCardData; index: number }) {
  const { visual } = group;
  // Only render the compare toggle for cards that map to a real product in
  // the registry. Group pages (e.g. PVC Flooring, Other Products) have no
  // spec table to compare against, so the toggle is omitted there.
  const product = getProductBySlug(group.slug);

  return (
    <Link
      href={group.href}
      aria-label={`View ${group.name} product page`}
      className="hover-card-lift group relative flex flex-col rounded-xl border border-be-grey-250 bg-be-white overflow-hidden shadow-sm hover:shadow-xl hover:border-be-yellow-300 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
    >
      {/* Yellow accent line — grows on hover */}
      <div className="h-[3px] bg-gradient-to-r from-be-yellow-500 via-be-brand-yellow to-be-yellow-500 group-hover:h-[5px] transition-all duration-300" aria-hidden="true" />

      {/* Image area — tall dominant image region (≈55–62% card height) */}
      <div className="relative w-full overflow-hidden bg-be-cream aspect-[4/3] md:aspect-[16/10]">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          className={`${visual.fit === 'contain' ? 'object-contain' : 'object-cover'} ${visual.fit === 'cover' ? 'group-hover:scale-105' : ''} transition-transform duration-300`}
          style={group.objectPosition ? { objectPosition: group.objectPosition } : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
        />
        <div className="absolute inset-0 bg-be-charcoal-950/0 group-hover:bg-be-charcoal-950/5 transition-colors duration-300" aria-hidden="true" />
        {/* Category number badge on image */}
        <div className="absolute top-3 left-3 size-7 rounded-full bg-be-navy-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
          <span className="text-[0.6rem] font-bold text-be-brand-yellow">{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1.5 p-5 flex-1">
        {/* Label row */}
        <div className="flex items-center gap-2">
          <span className="text-metadata text-be-grey-650 font-medium">Product Group</span>
          <span className="text-[0.55rem] text-be-grey-400 font-mono" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-card-title text-be-charcoal-950 group-hover:text-be-yellow-text-hover transition-colors">
          {group.name}
        </h3>

        {/* Standards/range metadata line — compact, non-interactive secondary text */}
        {group.standardsLine && (
          <p className="text-[0.7rem] leading-tight text-be-grey-500">
            {group.standardsLine}
          </p>
        )}

        <p className="text-body text-be-grey-650 text-sm leading-relaxed line-clamp-2">
          {group.description}
        </p>
        <div className="mt-auto pt-2 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-be-yellow-text group-hover:text-be-yellow-text-hover transition-colors duration-200">
            View Products
          </span>
          <span className="inline-flex items-center justify-center size-5 rounded-full bg-be-yellow-50 group-hover:bg-be-yellow-100 transition-colors duration-200" aria-hidden="true">
            <svg className="size-3 text-be-yellow-text group-hover:text-be-yellow-text-hover transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductRange() {
  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      <div className="reveal-up mb-8">
        <SectionHeader
          eyebrow="PRODUCT RANGE"
          title="Products for electrical safety, industrial safety & infrastructure protection"
          supportingText="Electrical Insulating Mats, Waterproofing Solutions, PVC Flooring and related industrial rubber products."
        />
      </div>

      {/* Responsive grid — 2×2 desktop, 2-col tablet, 1-col mobile */}
      <div className="stagger-reveal grid grid-cols-1 md:grid-cols-2 gap-5" data-stagger="true">
        {productGroups.map((group, i) => (
          <ProductGroupCard key={group.slug} group={group} index={i} />
        ))}
      </div>

      {/* View all products CTA */}
      <div className="mt-8 flex justify-center reveal-up">
        <PrimaryButton href="/products">
          View All Products
        </PrimaryButton>
      </div>
    </SectionShell>
  );
}
