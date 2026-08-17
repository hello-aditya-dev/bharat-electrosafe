'use client';

import { SectionShell } from '@/components/ui/SectionShell';
import { Target, Compass } from 'lucide-react';

/**
 * VisionMission — Vision & Mission section.
 *
 * Dark/navy band composition with client-provided vision and mission
 * statements. Content source: client Vision/Mission docx.
 */

const vision =
  'Make electrical and industrial protection products easier to specify, source and deploy with clear technical information.';

const mission =
  'Manufacture and supply electrical safety and industrial protection products with clear specifications, documented testing where applicable and responsive project support.';

export default function VisionMission() {
  return (
    <SectionShell variant="standard" bg="bg-be-navy-800" topRule>
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Vision */}
        <div className="lg:w-1/2 reveal-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-be-yellow-500/20">
              <Compass className="h-5 w-5 text-be-yellow-400" aria-hidden="true" />
            </div>
            <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-400">
              Vision
            </p>
          </div>
          <h2 className="text-section-h2 text-be-white mb-4">
            Where we aspire to be
          </h2>
          <p className="text-body-large text-be-grey-300 leading-relaxed">
            {vision}
          </p>
        </div>

        {/* Divider — visible on mobile */}
        <div className="lg:hidden h-px bg-be-navy-600" />

        {/* Mission */}
        <div className="lg:w-1/2 reveal-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-be-yellow-500/20">
              <Target className="h-5 w-5 text-be-yellow-400" aria-hidden="true" />
            </div>
            <p className="text-metadata font-semibold uppercase tracking-wider text-be-yellow-400">
              Mission
            </p>
          </div>
          <h2 className="text-section-h2 text-be-white mb-4">
            What drives us
          </h2>
          <p className="text-body-large text-be-grey-300 leading-relaxed">
            {mission}
          </p>
        </div>
      </div>

      {/* Yellow accent line at bottom */}
      <div className="mt-10 h-[3px] bg-gradient-to-r from-transparent via-be-yellow-500 to-transparent" />
    </SectionShell>
  );
}
