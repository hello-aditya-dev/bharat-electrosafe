'use client';

import { useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    year: '2000',
    title: 'Foundation',
    description:
      'Bharat Electrosafe established with a focus on electrical safety products.',
  },
  {
    year: '2008',
    title: 'BIS Certification',
    description:
      'Achieved BIS certification for IS 15652:2006 compliant insulating mats.',
  },
  {
    year: '2015',
    title: 'Manufacturing Expansion',
    description:
      'Expanded production capacity to serve growing infrastructure demand.',
  },
  {
    year: '2024',
    title: 'Product Range Growth',
    description:
      'Launched specialised products including Auto-Glow mats and Geo Membrane Lining.',
  },
];

export default function CompanyTimeline() {
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
      { threshold: 0.15 }
    );
    observer.observe(staggerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-be-warm-white section-padding-supporting page-horizontal-padding">
      <div className="container-site">
        {/* Section header */}
        <div className="reveal-up mb-12">
          <SectionHeader
            eyebrow="Our Journey"
            title="Milestones in safety manufacturing"
            supportingText="Two and a half decades of building certified electrical safety products, expanding capability and serving critical infrastructure across India."
          />
        </div>

        {/* Timeline — horizontal on desktop, vertical on mobile */}
        <div ref={staggerRef} className="stagger-reveal">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:block relative">
            {/* Horizontal timeline line */}
            <div className="absolute top-[31px] left-0 right-0 h-px bg-be-grey-250" />

            {/* Milestone row */}
            <div className="grid grid-cols-4 gap-6">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="flex flex-col items-start">
                  {/* Year */}
                  <div className="mb-4 h-8 flex items-center">
                    <span className="text-card-title text-be-yellow-text font-bold">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Active dot */}
                  <div className="relative mb-5 self-start">
                    <span className="block size-4 rounded-full bg-be-yellow-500 ring-4 ring-be-yellow-100" />
                  </div>

                  {/* Title */}
                  <h3 className="text-card-title text-be-charcoal-950 mb-2">
                    {milestone.title}
                  </h3>

                  {/* Description */}
                  <p className="text-body text-be-grey-650 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical layout */}
          <div className="md:hidden relative pl-6">
            {/* Vertical timeline line */}
            <div className="absolute top-2 bottom-2 left-[7px] w-px bg-be-grey-250" />

            <div className="flex flex-col gap-8">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative">
                  {/* Active dot */}
                  <span className="absolute -left-[22px] top-1 block size-4 rounded-full bg-be-yellow-500 ring-4 ring-be-yellow-100" />

                  {/* Year */}
                  <div className="mb-1">
                    <span className="text-card-title text-be-yellow-text font-bold">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-card-title text-be-charcoal-950 mb-1">
                    {milestone.title}
                  </h3>

                  {/* Description */}
                  <p className="text-body text-be-grey-650 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
