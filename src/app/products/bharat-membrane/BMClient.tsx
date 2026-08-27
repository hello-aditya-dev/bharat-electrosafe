'use client';

import { ProductDetailTemplate } from '@/components/products/ProductDetailTemplate';
import { membraneVisuals } from '@/data/product-visuals';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { FeatureList } from '@/components/ui/FeatureList';
import type { ProductData } from '@/data/products';

/**
 * Geo Membrane Lining client page.
 *
 * Uses the shared ProductDetailTemplate and injects two client-approved
 * sections specific to the Geo Membrane Lining solution:
 *   1. "Why Bharat Electrosafe" — the client-approved positioning points.
 *   2. A closing statement + containment/lining visual.
 *
 * The technical specifications table is already rendered by
 * ProductSpecifications within the template, so the previous duplicate
 * "Variant Comparison" table is intentionally omitted to keep the page
 * concise per the client's direction.
 */
export default function BMClient({ product }: { product: ProductData }) {

  const whyBharatElectrosafe = (
    <SectionShell variant="standard" bg="bg-be-cream" topRule ariaLabel="Why Bharat Electrosafe">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Left — containment / lining visual */}
        <div className="lg:w-[45%] order-first lg:order-last">
          <ImageFrame
            src={membraneVisuals.application?.src ?? membraneVisuals.hero.src}
            alt={
              membraneVisuals.application?.alt ??
              'Geo membrane lining installed across a containment basin'
            }
            aspectRatio="landscape"
            fit={membraneVisuals.application?.fit ?? 'cover'}
          />
        </div>

        {/* Right — Why Bharat Electrosafe points */}
        <div className="lg:w-[55%] flex flex-col gap-6">
          <SectionHeader
            eyebrow="Why Bharat Electrosafe"
            title="A quality-focused lining partner"
            supportingText="Bharat Electrosafe's Geo Membrane Lining Solutions are part of a growing portfolio of industrial safety and infrastructure solutions."
          />
          <FeatureList
            items={[
              { text: 'Designed for containment and lining applications' },
              { text: 'Quality-focused manufacturing and supply' },
              { text: 'Solutions aligned with IS 15909:2020' },
              { text: 'Durable and reliable lining solutions' },
              { text: 'Suitable for water management, industrial and environmental applications' },
              { text: 'Designed for long-term protection and containment requirements' },
              {
                text: "Part of Bharat Electrosafe's growing portfolio of industrial safety and infrastructure solutions",
              },
            ]}
          />
        </div>
      </div>
    </SectionShell>
  );

  const closingStatement = (
    <SectionShell variant="compact" bg="bg-be-warm-white" topRule ariaLabel="Our commitment">
      <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Our Commitment"
          title="Reliable, quality-driven solutions"
          align="center"
        />
        <p className="text-body-large text-be-grey-650 leading-relaxed">
          At Bharat Electrosafe, we are committed to delivering reliable,
          quality-driven and standards-focused solutions for industries,
          infrastructure projects, water management and environmental
          protection applications.
        </p>
      </div>
    </SectionShell>
  );

  return (
    <ProductDetailTemplate
      product={product}
      visuals={membraneVisuals}
      ctaHeadingPrefix="Project enquiry for"
      extraContent={
        <>
          {whyBharatElectrosafe}
          {closingStatement}
        </>
      }
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Waterproofing Solutions', href: '/products/waterproofing-solutions' },
        { label: product.name },
      ]}
    />
  );
}
