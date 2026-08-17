import Image from 'next/image';
import type { Leader } from '@/data/team';
import { cn } from '@/lib/utils';

/**
 * LeaderProfileCard — Server Component (DEPRECATED — kept for reference).
 *
 * This is the old non-flip editorial profile card, no longer used on the
 * About page (replaced by LeadershipGrid flip cards). It is retained in
 * case other pages need a static profile card in the future.
 *
 * The `expertise` and `leadershipFocus` fields have been removed from the
 * Leader interface; this component now only renders portrait, name, role,
 * short bio, and full-profile paragraphs.
 */

interface LeaderProfileCardProps {
  leader: Leader;
  /** Optional extra className for layout (e.g. column spanning on tablet). */
  className?: string;
}

export function LeaderProfileCard({
  leader,
  className,
}: LeaderProfileCardProps) {
  return (
    <article
      className={cn(
        'leader-card group flex flex-col overflow-hidden rounded-lg border border-be-grey-250 bg-be-white',
        className
      )}
    >
      {/* Portrait */}
      <div className="leader-portrait relative aspect-[4/3] w-full overflow-hidden bg-be-grey-150">
        <Image
          src={leader.image}
          alt={leader.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="leader-portrait-img object-cover"
          style={
            leader.imagePosition
              ? { objectPosition: leader.imagePosition }
              : undefined
          }
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        {/* Yellow accent rule */}
        <div
          className="leader-accent mb-4 h-[3px] w-12 rounded-full bg-be-yellow-500"
          aria-hidden="true"
        />

        {/* Name — H3 */}
        <h3 className="text-xl font-bold tracking-tight text-be-charcoal-950 sm:text-2xl">
          {leader.name}
        </h3>

        {/* Role */}
        <p className="mt-1.5 text-sm font-semibold tracking-wide text-be-yellow-text sm:text-[0.95rem]">
          {leader.role}
        </p>

        {/* Short summary */}
        <p className="mt-3.5 text-[0.95rem] leading-relaxed text-be-grey-650">
          {leader.shortBio}
        </p>

        {/* Full profile paragraphs */}
        <div className="mt-4 space-y-3">
          {leader.fullProfile.map((paragraph, i) => (
            <p
              key={i}
              className="text-[0.9rem] leading-[1.65] text-be-grey-650"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
