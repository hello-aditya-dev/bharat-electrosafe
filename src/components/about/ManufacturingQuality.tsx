'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ImageFrame } from '@/components/ui/ImageFrame';

export default function ManufacturingQuality() {
  return (
    <section className="bg-be-cream section-padding-major page-horizontal-padding">
      <div className="container-site">
        <div className="reveal-up mb-10">
          <SectionHeader
            eyebrow="Manufacturing & Quality"
            title="Certified Production Process"
            supportingText="Our manufacturing facility produces certified insulating mats under controlled conditions, with in-process quality checks and third-party testing at every production stage."
          />
        </div>

        {/* Visual composition — 60/40 split */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12">
          {/* Large image — left (60%) */}
          <div className="lg:w-[60%] reveal-up">
            <ImageFrame
              alt="Manufacturing facility — production line"
              slotId="ABOUT-MANUFACTURING-01"
              aspectRatio="landscape"
            />
          </div>

          {/* Two smaller images stacked — right (40%) */}
          <div className="lg:w-[40%] flex flex-col gap-6">
            <div className="reveal-up">
              <ImageFrame
                alt="Testing and quality verification"
                slotId="ABOUT-TESTING-01"
                aspectRatio="landscape"
              />
            </div>
            <div className="reveal-up">
              <ImageFrame
                alt="Manufacturing detail — quality inspection"
                slotId="ABOUT-MANUFACTURING-02"
                aspectRatio="landscape"
              />
            </div>
          </div>
        </div>

        {/* Technical proof rows */}
        <div className="reveal-up">
          <DataTable
            headers={['Stage 1', 'Stage 2', 'Stage 3']}
            rows={[
              ['Raw material inspection', 'In-process testing', 'Final product certification'],
              ['IS 15652:2006 compliance', 'BIS licensed production', 'ERDA/NTH tested'],
              ['Thickness verification', 'Voltage class testing', 'Dimensional accuracy checks'],
            ]}
          />
        </div>
      </div>
    </section>
  );
}
