'use client';

import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';

/**
 * ActiveParticipation — Industry presence and media section.
 *
 * Premium 2-up layout (desktop) / stacked (mobile) for the two
 * verified company videos. Uses LOCAL poster images for fast,
 * reliable first-paint — no YouTube iframe loads on page load.
 *
 * Clicking a card opens the video on YouTube in a new tab.
 *
 * Content source: company's own YouTube uploads.
 */

const videos = [
  {
    videoId: 'e9jF3JYMLco',
    title: 'Plast India 2026 @ Bharat Mandapam - Delhi',
    description: 'Bharat Electrosafe showcasing insulating mat solutions at PlastIndia 2026, Bharat Mandapam, New Delhi.',
    poster: '/media/videos/plastindia-2026-poster.webp',
    alt: 'Insulating mat samples in several colours laid out on an exhibition stand table at Plast India 2026',
  },
  {
    videoId: 's6PHbPrf-lQ',
    title: 'Interview with Make In India Conclave @ ABP News',
    description: 'Co-Founder & Director Vishnu Gupta interviewed at the Make in India Conclave organised by ABP News.',
    poster: '/media/videos/makeinindia-abp-poster.webp',
    alt: 'Vishnu Gupta being interviewed on stage at the Make in India Conclave on ABP News',
  },
];

export default function ActiveParticipation() {
  return (
    <SectionShell variant="compact" bg="bg-be-warm-white" topRule>
      <div className="reveal-up mb-8">
        <SectionHeader
          eyebrow="Industry Presence"
          title="Engaged with the industry"
          supportingText="Bharat Electrosafe actively participates in national industry exhibitions and initiatives."
        />
      </div>

      {/* Premium 2-up grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {videos.map((video) => (
          <article key={video.videoId} className="reveal-up group flex flex-col">
            {/* Video card — poster with play overlay */}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch on YouTube: ${video.title}`}
              className="relative aspect-video w-full overflow-hidden rounded-lg border border-be-grey-250 bg-be-charcoal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <Image
                src={video.poster}
                alt={video.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Scrim overlay */}
              <span
                className="absolute inset-0 bg-gradient-to-t from-be-charcoal-950/50 via-be-charcoal-950/10 to-transparent transition-opacity duration-200 group-hover:from-be-charcoal-950/60"
                aria-hidden="true"
              />
              {/* Play button — centred */}
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-be-yellow-500/90 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-be-yellow-500">
                  <Play className="ml-0.5 h-6 w-6 fill-be-charcoal-950 text-be-charcoal-950" />
                </span>
              </span>
            </a>

            {/* Card info below thumbnail */}
            <div className="flex flex-col gap-1.5 mt-3">
              <h3 className="text-card-title font-semibold text-be-charcoal-950 leading-snug">
                {video.title}
              </h3>
              <p className="text-metadata text-be-grey-650 line-clamp-2">
                {video.description}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${video.title} on YouTube`}
                className="inline-flex items-center gap-1 text-metadata font-semibold text-be-yellow-text underline underline-offset-2 hover:text-be-yellow-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 rounded-sm w-fit mt-0.5"
              >
                Watch on YouTube
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
