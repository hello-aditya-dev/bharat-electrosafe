'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import {
  hvVisuals,
  autoGlowVisuals,
  biColourVisuals,
  coloredStripVisuals,
  type ProductVisualRole,
} from '@/data/product-visuals';
import { ChevronRight } from 'lucide-react';

/* ────────────────────────────────────────────
   Domestic range data
   ──────────────────────────────────────────── */

interface RangeProduct {
  name: string;
  href: string;
  description: string;
  visual: ProductVisualRole;
}

const domesticProducts: RangeProduct[] = [
  {
    name: 'HV Electrical Insulating Mats',
    href: '/products/electrical-insulating-mats/high-voltage-electrical-insulation-mats',
    description:
      'Standard high-voltage insulating mats for operator protection near live switchgear and substations.',
    visual: hvVisuals.card,
  },
  {
    name: 'Auto Glow',
    href: '/products/auto-glow-reflective-band-insulating-mats',
    description:
      'Insulating mats with a reflective/glow visibility band for low-light and emergency conditions.',
    visual: autoGlowVisuals.card,
  },
  {
    name: 'Bi-Colour',
    href: '/products/bi-color-insulating-mats',
    description:
      'Dual-colour insulating mats with visible layer differentiation for safety compliance.',
    visual: biColourVisuals.card,
  },
  {
    name: 'Colored Strip',
    href: '/products/coloured-strip-insulating-mats',
    description:
      'Insulating mats with a high-visibility coloured boundary strip for safe pathways.',
    visual: coloredStripVisuals.card,
  },
];

/* ────────────────────────────────────────────
   Product card
   ──────────────────────────────────────────── */

function RangeProductCard({ product }: { product: RangeProduct }) {
  const { visual } = product;
  return (
    <Link
      href={product.href}
      aria-label={`View ${product.name} product page`}
      className="group relative flex flex-col rounded-xl border border-be-grey-250 bg-be-white overflow-hidden shadow-sm hover:shadow-md hover:border-be-yellow-300 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
    >
      <div className="relative w-full overflow-hidden bg-be-cream aspect-[4/3]">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          className={`${visual.fit === 'contain' ? 'object-contain p-6' : 'object-cover'} transition-transform duration-300 group-hover:scale-[1.03]`}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-5 flex-1">
        <h3 className="text-lg font-semibold text-be-charcoal-950 group-hover:text-be-yellow-text-hover transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-be-grey-650 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-be-yellow-text group-hover:text-be-yellow-text-hover transition-colors">
          View Product
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export default function EIMHubClient() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">
        {/* ── Hero / intro ── */}
        <section className="bg-be-page-top-tint">
          <div className="container-site page-horizontal-padding pt-8 pb-10 lg:pt-10 lg:pb-12">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Electrical Insulating Mats' },
              ]}
              className="mb-4 lg:mb-5"
            />
            <div className="max-w-3xl">
              <Eyebrow>ELECTRICAL INSULATING MATS</Eyebrow>
              <h1 className="text-products-hero-h1 text-be-charcoal-950 mt-3 mb-4">
                Electrical Insulating Mats
              </h1>
              <p className="text-body-large text-be-grey-650 leading-relaxed">
                Bharat Electrosafe provides domestic insulating mats to{' '}
                <strong className="font-semibold text-be-charcoal-800">IS 15652:2006</strong>{' '}
                and a separate international range to{' '}
                <strong className="font-semibold text-be-charcoal-800">IEC 61111:2009</strong>.
                Select the range and product that matches your standard and application.
              </p>
            </div>
          </div>
        </section>

        {/* ── Domestic range ── */}
        <section className="bg-be-white">
          <div className="container-site page-horizontal-padding py-12 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-be-charcoal-950">
                Domestic — IS 15652:2006
              </h2>
              <span className="text-xs font-semibold text-be-yellow-700 bg-be-yellow-50 px-3 py-1 rounded-full w-fit">
                IS 15652:2006
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {domesticProducts.map((product) => (
                <RangeProductCard key={product.href} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── International range ── */}
        <section className="bg-[#faf8f2]">
          <div className="container-site page-horizontal-padding py-12 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-be-charcoal-950">
                International / Global — IEC 61111:2009
              </h2>
              <span className="text-xs font-semibold text-be-navy-700 bg-be-brand-blue/10 px-3 py-1 rounded-full w-fit">
                IEC 61111:2009
              </span>
            </div>
            <p className="text-body text-be-grey-650 max-w-2xl mb-6">
              IEC 61111:2009 compliant insulating mats for export and international projects —
              Class 0 through Class 4.
            </p>
            {/* Product navigation links */}
            <div className="flex flex-wrap gap-3 mb-5">
              <Link
                href="/products/electrical-insulating-mats/international-iec-61111#hv-insulating-mats"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-be-charcoal-950 border border-be-grey-300 bg-be-white px-4 py-2 rounded-lg hover:border-be-yellow-400 hover:bg-be-yellow-50 hover:text-be-yellow-text-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
              >
                HV Insulating Mats
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/products/electrical-insulating-mats/international-iec-61111#auto-glow"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-be-charcoal-950 border border-be-grey-300 bg-be-white px-4 py-2 rounded-lg hover:border-be-yellow-400 hover:bg-be-yellow-50 hover:text-be-yellow-text-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
              >
                Auto Glow
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/products/electrical-insulating-mats/international-iec-61111#bi-colour"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-be-charcoal-950 border border-be-grey-300 bg-be-white px-4 py-2 rounded-lg hover:border-be-yellow-400 hover:bg-be-yellow-50 hover:text-be-yellow-text-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
              >
                Bi-Colour
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <SecondaryButton href="/products/electrical-insulating-mats/international-iec-61111">
              View International / Global Products
            </SecondaryButton>
          </div>
        </section>

        {/* ── Short CTA ── */}
        <section className="bg-be-warm-white border-t border-be-grey-150">
          <div className="container-site page-horizontal-padding py-10 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-body text-be-grey-650">
                Not sure which class or standard applies to your installation?
              </p>
              <SecondaryButton href="/contact-us?type=technical-guidance">
                Technical Guidance
              </SecondaryButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
