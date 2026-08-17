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
import { membraneVisuals, hydroSealVisuals, type ProductVisualRole } from '@/data/product-visuals';
import { ChevronRight } from 'lucide-react';

interface WaterproofingProduct {
  name: string;
  descriptor: string;
  href: string;
  description: string;
  visual: ProductVisualRole;
}

const products: WaterproofingProduct[] = [
  {
    name: 'Geo Membrane Lining',
    descriptor: 'Geo Membrane Lining',
    href: '/products/geo-membrane-lining',
    description:
      'Engineered PVC geo-membrane for waterproofing, lining and containment in tunnels, civil works and environmental projects.',
    visual: membraneVisuals.card,
  },
  {
    name: 'Water Stop Seal',
    descriptor: 'Water Stop Seal',
    href: '/products/water-stop-seal',
    description:
      'PVC water-stop profile for construction joints in concrete water-retaining structures.',
    visual: hydroSealVisuals.card,
  },
];

export default function WaterproofingHubClient() {
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
                { label: 'Waterproofing Solutions' },
              ]}
              className="mb-4 lg:mb-5"
            />
            <div className="max-w-3xl">
              <Eyebrow>WATERPROOFING SOLUTIONS</Eyebrow>
              <h1 className="text-products-hero-h1 text-be-charcoal-950 mt-3 mb-4">
                Waterproofing Solutions
              </h1>
              <p className="text-body-large text-be-grey-650 leading-relaxed">
                Bharat Electrosafe provides engineered waterproofing
                systems — PVC geo-membrane lining for tunnels and containment, and PVC water-stop
                profiles for concrete construction joints.
              </p>
            </div>
          </div>
        </section>

        {/* ── Product cards ── */}
        <section className="bg-be-white">
          <div className="container-site page-horizontal-padding py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {products.map((product) => {
                const { visual } = product;
                return (
                  <Link
                    key={product.href}
                    href={product.href}
                    aria-label={`View ${product.name} product page`}
                    className="group relative flex flex-col rounded-2xl border border-be-grey-250 bg-be-white overflow-hidden shadow-sm hover:shadow-md hover:border-be-yellow-300 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500"
                  >
                    <div className="relative w-full overflow-hidden bg-be-cream aspect-[16/10]">
                      <Image
                        src={visual.src}
                        alt={visual.alt}
                        fill
                        className={`${visual.fit === 'contain' ? 'object-contain p-6' : 'object-cover'} transition-transform duration-300 group-hover:scale-[1.03]`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-6 flex-1">
                      <span className="text-xs font-medium text-be-grey-650">
                        {product.name}
                      </span>
                      <h2 className="text-xl font-semibold text-be-charcoal-950 group-hover:text-be-yellow-text-hover transition-colors">
                        {product.descriptor}
                      </h2>
                      <p className="text-[0.9375rem] text-be-grey-650 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-be-yellow-text group-hover:text-be-yellow-text-hover transition-colors">
                        View Product
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Short CTA ── */}
        <section className="bg-be-warm-white border-t border-be-grey-150">
          <div className="container-site page-horizontal-padding py-10 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-body text-be-grey-650">
                Need guidance selecting the right waterproofing system for your project?
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
