'use client';

import {
  PanelTop,
  Factory,
  DoorOpen,
  Plug,
  HardHat,
  TriangleAlert,
  Footprints,
  Box,
  Route,
  ShieldCheck,
  Hammer,
  ShieldAlert,
  ClipboardCheck,
  Moon,
  Mountain,
  TrainFront,
  Cloud,
  Layers,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { SectionShell } from '@/components/ui/SectionShell';
import type { ProductData, Application } from '@/data/products';
import { getHeroImage } from '@/data/products';

/* ── Icon mapping ── */

const iconMap: Record<string, LucideIcon> = {
  'panel-top': PanelTop,
  factory: Factory,
  'door-open': DoorOpen,
  plug: Plug,
  'hard-hat': HardHat,
  'triangle-alert': TriangleAlert,
  footprints: Footprints,
  box: Box,
  route: Route,
  'shield-check': ShieldCheck,
  hammer: Hammer,
  'shield-alert': ShieldAlert,
  'clipboard-check': ClipboardCheck,
  moon: Moon,
  mountain: Mountain,
  'train-front': TrainFront,
  cloud: Cloud,
  layers: Layers,
  'building-2': Building2,
};

/* ── Component ── */

interface ProductApplicationsProps {
  product: ProductData;
}

export function ProductApplications({ product }: ProductApplicationsProps) {
  /* Where the client has no genuine in-situ photograph, this falls back to
     the strongest product view rather than to whatever image happened to be
     last in the gallery — which is how a brand logo and a scanned drawing
     ended up illustrating "Where It's Used". */
  const application = product.images.application ?? getHeroImage(product);

  return (
    <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left: installed-use image */}
          <div className="lg:w-[45%]">
            <ImageFrame
              src={application.src}
              alt={application.alt}
              aspectRatio="landscape"
              fit={application.fit}
              flush={product.slug === 'auto-glow-reflective-band-insulating-mats'}
            />
          </div>

          {/* Right: applications list */}
          <div className="lg:w-[55%] flex flex-col gap-6">
            <SectionHeader
              eyebrow="Applications"
              title="Where It's Used"
              supportingText={`${product.name} is designed for the following installed environments and use cases.`}
            />

            <div className="flex flex-col gap-4">
              {product.applications.map((app: Application) => {
                const Icon = iconMap[app.icon] ?? Factory;
                return (
                  <div key={app.name} className="flex items-start gap-4">
                    <span className="shrink-0 flex items-center justify-center size-9 rounded-md bg-be-yellow-50">
                      <Icon className="size-4 text-be-yellow-text" />
                    </span>
                    <div>
                      <div className="text-body font-semibold text-be-charcoal-950">{app.name}</div>
                      <div className="text-body text-be-grey-650">{app.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pale-yellow supporting field */}
            <div className="rounded-lg bg-be-yellow-50 p-5 border border-be-yellow-100">
              <p className="text-body-large text-be-charcoal-800 font-medium">
                Need a custom configuration for your specific environment?
              </p>
              <p className="text-body text-be-grey-650 mt-1">
                Contact our engineering team to discuss tailored solutions for your installation requirements.
              </p>
            </div>
          </div>
      </div>
    </SectionShell>
  );
}
