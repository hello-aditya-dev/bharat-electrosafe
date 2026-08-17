'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import type { ProductData } from '@/data/products';
import { cn } from '@/lib/utils';

/* ── Helper: simple key-value list ── */

function KVList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-start justify-between gap-4 text-body">
          <span className="text-be-grey-650 font-medium shrink-0">{item.label}</span>
          <span className="text-be-charcoal-950 text-right">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Component ── */

interface ProductMaterialDimensionsProps {
  product: ProductData;
}

export function ProductMaterialDimensions({ product }: ProductMaterialDimensionsProps) {
  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      <SectionHeader
          eyebrow="Material & Dimensions"
          title="Material Properties & Dimensions"
        />

        {/* Desktop: two-column layout */}
        <div className="hidden lg:flex lg:flex-row gap-12 mt-6">
          {/* Material properties */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <h3 className="text-card-title text-be-charcoal-950 border-b border-be-grey-250 pb-2">
              Material Properties
            </h3>
            <KVList items={product.materialProperties} />
          </div>

          {/* Dimensions, colours, surface, installation */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-card-title text-be-charcoal-950 border-b border-be-grey-250 pb-2">
                Dimensions
              </h3>
              <KVList items={product.dimensions} />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-card-title text-be-charcoal-950 border-b border-be-grey-250 pb-2">
                Available Colours
              </h3>
              <ul className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <li
                    key={color}
                    className="inline-flex items-center rounded-md bg-be-yellow-50 text-be-charcoal-800 text-metadata font-semibold px-3 py-1.5"
                  >
                    {color}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-card-title text-be-charcoal-950 border-b border-be-grey-250 pb-2">
                Surface Patterns
              </h3>
              <ul className="flex flex-wrap gap-2">
                {product.surfacePatterns.map((pattern) => (
                  <li
                    key={pattern}
                    className="inline-flex items-center rounded-md border border-be-grey-250 bg-be-white text-be-charcoal-800 text-metadata font-medium px-3 py-1.5"
                  >
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: accordion sections */}
        <div className="lg:hidden mt-4">
          <Accordion type="single" collapsible defaultValue="material">
            <AccordionItem value="material">
              <AccordionTrigger className="text-card-title text-be-charcoal-950 min-h-[44px]">
                Material Properties
              </AccordionTrigger>
              <AccordionContent>
                <KVList items={product.materialProperties} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dimensions">
              <AccordionTrigger className="text-card-title text-be-charcoal-950 min-h-[44px]">
                Dimensions
              </AccordionTrigger>
              <AccordionContent>
                <KVList items={product.dimensions} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors">
              <AccordionTrigger className="text-card-title text-be-charcoal-950 min-h-[44px]">
                Available Colours
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-wrap gap-2 pb-2">
                  {product.colors.map((color) => (
                    <li
                      key={color}
                      className="inline-flex items-center rounded-md bg-be-yellow-50 text-be-charcoal-800 text-metadata font-semibold px-3 py-1.5"
                    >
                      {color}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="surface">
              <AccordionTrigger className="text-card-title text-be-charcoal-950 min-h-[44px]">
                Surface Patterns
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-wrap gap-2 pb-2">
                  {product.surfacePatterns.map((pattern) => (
                    <li
                      key={pattern}
                      className="inline-flex items-center rounded-md border border-be-grey-250 bg-be-white text-be-charcoal-800 text-metadata font-medium px-3 py-1.5"
                    >
                      {pattern}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="installation">
              <AccordionTrigger className="text-card-title text-be-charcoal-950 min-h-[44px]">
                Installation
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-3 pb-2">
                  {product.installation.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-body text-be-charcoal-800">
                      <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-be-yellow-50 text-be-yellow-text text-metadata font-semibold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop installation section (outside the two-column) */}
        <div className="hidden lg:block mt-8">
          <h3 className="text-card-title text-be-charcoal-950 border-b border-be-grey-250 pb-2 mb-4">
            Installation Guidelines
          </h3>
          <ol className="flex flex-col gap-3">
            {product.installation.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-body text-be-charcoal-800">
                <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-be-yellow-50 text-be-yellow-text text-metadata font-semibold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
    </SectionShell>
  );
}
