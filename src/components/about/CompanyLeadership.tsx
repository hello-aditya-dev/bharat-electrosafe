import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { LeadershipGrid } from '@/components/about/LeadershipGrid';
import { leaders } from '@/data/team';

/**
 * CompanyLeadership — Server Component.
 *
 * Leadership section only — Mission, Vision and Values have been
 * moved to their own dedicated sections (VisionMission, ValuesSection).
 *
 * The flip-card LeadershipGrid is preserved as-is.
 */

export default function CompanyLeadership() {
  return (
    <SectionShell variant="standard" bg="bg-be-warm-white" topRule>
      <div className="reveal-up">
        <SectionHeader
          eyebrow="Leadership"
          title="The people guiding Bharat Electrosafe"
          supportingText="Meet the directors shaping the company's manufacturing, finance, quality, operations, partnerships and international development. Tap a card to view the detailed profile."
        />

        <div className="mt-10 lg:mt-12">
          <LeadershipGrid leaders={leaders} />
        </div>
      </div>
    </SectionShell>
  );
}
