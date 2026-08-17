'use client';

import {
  Shield,
  Layers,
  Settings,
  BadgeCheck,
  Map,
  Palette,
  Settings2,
  Wrench,
  Eye,
  Contrast,
  Timer,
  Activity,
  Sun,
  Scan,
  Siren,
  Unplug,
  GitBranch,
  Hammer,
  Droplets,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { FeatureList } from '@/components/ui/FeatureList';
import { SectionShell } from '@/components/ui/SectionShell';
import type { ProductData, KeyBenefit } from '@/data/products';
import { getHeroImage } from '@/data/products';

/* ── Icon mapping ── */

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  layers: Layers,
  settings: Settings,
  'badge-check': BadgeCheck,
  map: Map,
  palette: Palette,
  'settings-2': Settings2,
  wrench: Wrench,
  eye: Eye,
  contrast: Contrast,
  timer: Timer,
  activity: Activity,
  sun: Sun,
  mirror: Scan,
  siren: Siren,
  unplug: Unplug,
  'git-branch': GitBranch,
  hammer: Hammer,
  droplets: Droplets,
};

/* ── Component ── */

interface ProductOverviewProps {
  product: ProductData;
}

export function ProductOverview({ product }: ProductOverviewProps) {
  const featureItems = product.keyBenefits.map((b: KeyBenefit) => ({
    icon: iconMap[b.icon] ?? Shield,
    text: b.text,
  }));

  /* Falls back to the hero only where a product has no second usable view;
     every product that has one shows something different here. */
  const overview = product.images.overview ?? getHeroImage(product);

  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Left: Application image */}
        <div className="lg:w-[45%] order-first lg:order-last">
          <ImageFrame
            src={overview.src}
            alt={overview.alt}
            aspectRatio="landscape"
            fit={overview.fit}
          />
        </div>

        {/* Right: Overview text + key benefits */}
        <div className="lg:w-[55%] flex flex-col gap-6">
          <SectionHeader
            eyebrow="Product Overview"
            title={`${product.shortName} Overview`}
            supportingText={product.overviewText}
          />

          <FeatureList items={featureItems} />
        </div>
      </div>
    </SectionShell>
  );
}
