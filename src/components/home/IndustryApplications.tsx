'use client';

import { useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Zap, Building2, TrainFront, Flame, Factory, HardHat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Industry {
  name: string;
  phrase: string;
  icon: LucideIcon;
  accent?: 'left' | 'top';
  index: string;
}

const industries: Industry[] = [
  {
    name: 'Power Utilities',
    phrase: 'Generation, transmission and distribution',
    icon: Zap,
    accent: 'top',
    index: '01',
  },
  {
    name: 'Substations & Switchrooms',
    phrase: 'High-voltage protection zones',
    icon: Building2,
    accent: 'left',
    index: '02',
  },
  {
    name: 'Railways & Metro',
    phrase: 'Traction and depot safety',
    icon: TrainFront,
    accent: 'left',
    index: '03',
  },
  {
    name: 'Oil & Gas',
    phrase: 'Hazardous area compliance',
    icon: Flame,
    accent: 'top',
    index: '04',
  },
  {
    name: 'Manufacturing',
    phrase: 'Plant floor and panel safety',
    icon: Factory,
    accent: 'left',
    index: '05',
  },
  {
    name: 'Infrastructure & Construction',
    phrase: 'Site electrical safety',
    icon: HardHat,
    accent: 'top',
    index: '06',
  },
];

function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = industry.icon;

  return (
    <div className="group relative flex items-start gap-4 p-5 rounded-lg bg-be-white border border-be-grey-250 hover:border-be-yellow-400 transition-all duration-300 hover:bg-gradient-to-br hover:from-be-yellow-50/30 hover:to-be-white">
      {/* Accent line — thicker */}
      {industry.accent === 'top' && (
        <div className="absolute top-0 left-5 right-5 h-1 bg-be-yellow-500 rounded-b" />
      )}
      {industry.accent === 'left' && (
        <div className="absolute top-5 bottom-5 left-0 w-1 bg-be-yellow-500 rounded-r" />
      )}

      {/* Number index */}
      <span className="absolute top-3 right-3 text-[0.6rem] font-medium text-be-charcoal-950/80 tracking-wider">
        {industry.index}
      </span>

      <div className="shrink-0 mt-0.5 flex h-12 w-12 items-center justify-center rounded-lg bg-be-yellow-50 text-be-yellow-text group-hover:bg-be-yellow-100 transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-card-title text-be-charcoal-950">
          {industry.name}
        </h3>
        <p className="text-metadata text-be-grey-650">
          {industry.phrase}
        </p>
      </div>
    </div>
  );
}

export default function IndustryApplications() {
  const staggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!staggerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(staggerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="industries" className="bg-be-white section-padding-major">
      <div className="container-site page-horizontal-padding">
        <div className="reveal-up mb-12">
          <SectionHeader
            eyebrow="INDUSTRIES"
            title="Industries and applications"
            supportingText="Serving critical sectors where electrical safety is non-negotiable."
          />
        </div>

        <div ref={staggerRef} className="stagger-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((industry) => (
            <IndustryCard key={industry.name} industry={industry} />
          ))}
        </div>
      </div>
    </section>
  );
}
