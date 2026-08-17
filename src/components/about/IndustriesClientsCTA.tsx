'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { LogoRail } from '@/components/ui/LogoRail';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import {
  Zap,
  Building2,
  TrainTrack,
  Droplets,
  Factory,
  HardHat,
} from 'lucide-react';

const industries = [
  { name: 'Power utilities', icon: Zap },
  { name: 'Substations', icon: Building2 },
  { name: 'Railways', icon: TrainTrack },
  { name: 'Oil & gas', icon: Droplets },
  { name: 'Manufacturing', icon: Factory },
  { name: 'Infrastructure', icon: HardHat },
];

const clientLogos = [
  { name: 'BIS' },
  { name: 'ERDA' },
  { name: 'NTH' },
  { name: 'Make in India' },
  { name: 'Indian Railways' },
  { name: 'Power Grid Corp' },
];

export default function IndustriesClientsCTA() {
  return (
    <>
      {/* ── Industries served ── */}
      <section className="bg-be-warm-white section-padding-supporting page-horizontal-padding">
        <div className="container-site">
          <div className="reveal-up mb-10">
            <SectionHeader
              eyebrow="Industries We Serve"
              title="Across Critical Infrastructure"
              supportingText="Bharat Electrosafe supplies products for power utilities, switchgear installations, railways, manufacturing facilities and infrastructure projects."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="reveal-up hover-card-lift flex flex-col items-center gap-3 rounded-lg border border-be-grey-250 bg-be-white p-5 text-center"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-be-yellow-50">
                    <Icon className="h-5 w-5 text-be-yellow-text" />
                  </div>
                  <span className="text-body font-medium text-be-charcoal-950">
                    {industry.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Industry-reference LogoRail */}
          <div className="reveal-up mt-12">
            <p className="text-metadata text-be-grey-650 mb-4 text-center uppercase tracking-wide font-semibold">
              Organisations represented on the original company website
            </p>
            <div className="rounded-lg border border-be-grey-250 p-4 bg-be-white">
              <LogoRail logos={clientLogos} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="bg-be-yellow-50 section-padding-supporting page-horizontal-padding">
        <div className="container-site">
          <div className="reveal-up flex flex-col items-center text-center gap-6">
            <SectionHeader
              eyebrow="Get in Touch"
              title="Ready to Discuss Your Requirements?"
              supportingText="Our team is available to provide product specifications, application guidance and certification documentation."
              align="center"
            />
            <PrimaryButton href="/contact-us" size="lg">
              Contact Us
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
