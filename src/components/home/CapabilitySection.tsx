
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { FeatureList } from '@/components/ui/FeatureList';
import { TextLink } from '@/components/ui/TextLink';
import { ShieldCheck, Layers, Ruler, FileText } from 'lucide-react';

const proofPoints = [
  { icon: ShieldCheck, text: 'Certified and tested products' },
  { icon: Layers, text: 'Classes A, B and C available' },
  { icon: Ruler, text: 'Custom dimensions and configurations' },
  { icon: FileText, text: 'Technical documentation and enquiry support' },
];

export default function CapabilitySection() {
  return (
    <section id="capability" className="bg-be-warm-white section-padding-major">
      <div className="container-site page-horizontal-padding">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 reveal-up">
          {/* Left — Image */}
          <div className="w-full lg:w-1/2">
            <ImageFrame
              alt="Manufacturing & Quality Control"
              slotId="HOME-CAPABILITY-01"
              aspectRatio="landscape"
              className="w-full"
            />
          </div>

          {/* Right — Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <SectionHeader
              eyebrow="CAPABILITY"
              title="Built around safety, quality and application support"
            />

            <p className="text-body-large text-be-grey-650">
              Bharat Electrosafe manufactures certified electrical insulating
              mats and engineered protection products, serving utilities,
              substations, railways and industrial facilities across India.
            </p>

            {/* Decorative "Est. India" text */}
            <p className="text-metadata text-be-grey-650 font-medium tracking-wider">
              Est. India — Serving since decades
            </p>

            {/* Feature list with yellow left border */}
            <div className="[&_li]:border-l-2 [&_li]:border-be-yellow-400 [&_li]:pl-3 [&_li]:ml-[-3px]">
              <FeatureList items={proofPoints} />
            </div>

            <div className="mt-2">
              <TextLink
                href="/about-us"
                className="text-lg font-semibold hover-arrow-shift inline-flex items-center gap-2 text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors duration-200"
              >
                About Us
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
