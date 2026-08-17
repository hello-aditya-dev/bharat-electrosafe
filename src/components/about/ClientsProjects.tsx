'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionShell } from '@/components/ui/SectionShell';
import { InfiniteLogoRail } from '@/components/ui/InfiniteLogoRail';
import {
  organisationReferences,
  organisationReferenceEyebrow,
  organisationReferenceTitle,
  organisationReferenceNote,
} from '@/data/trust';
import { selectedClients } from '@/data/selected-clients';

/**
 * ClientsProjects — Industry References section (About page).
 *
 * Combines:
 *   1. Organisation reference logo rail (InfiniteLogoRail — matches homepage)
 *   2. "View all clients" disclosure (same as homepage IndustryReferences)
 *   3. Video carousel — local MP4s + verified YouTube embeds
 *
 * White background (was warm/yellow tint). Logo rail matches homepage
 * treatment: large logos, tight spacing, no card boxes, object-contain.
 */

/* ── Video data ── */
interface LocalVideo {
  type: 'local';
  src: string;
  poster: string;
  title: string;
}

interface YouTubeVideo {
  type: 'youtube';
  videoId: string;
  title: string;
  description: string;
}

type VideoItem = LocalVideo | YouTubeVideo;

const videos: VideoItem[] = [
  {
    type: 'local',
    src: '/media/videos/industry/industry-media-01.mp4',
    poster: '/media/video-posters/industry-media-01-poster.jpg',
    title: 'Bharat Electrosafe industry media — Clip 1',
  },
  {
    type: 'local',
    src: '/media/videos/industry/industry-media-02.mp4',
    poster: '/media/video-posters/industry-media-02-poster.jpg',
    title: 'Bharat Electrosafe industry media — Clip 2',
  },
  {
    type: 'local',
    src: '/media/videos/industry/industry-media-03.mp4',
    poster: '/media/video-posters/industry-media-03-poster.jpg',
    title: 'Bharat Electrosafe industry media — Clip 3',
  },
  {
    type: 'local',
    src: '/media/videos/industry/industry-media-04.mp4',
    poster: '/media/video-posters/industry-media-04-poster.jpg',
    title: 'Bharat Electrosafe industry media — Clip 4',
  },
  {
    type: 'youtube',
    videoId: 'e9jF3JYMLco',
    title: 'Plast India 2026 @ Bharat Mandapam - Delhi',
    description: 'Bharat Electrosafe showcasing insulating mat solutions at PlastIndia 2026, Bharat Mandapam, New Delhi.',
  },
  {
    type: 'youtube',
    videoId: 's6PHbPrf-lQ',
    title: 'Interview with Make In India Conclave @ ABP News',
    description: 'Co-Founder & Director Vishnu Gupta interviewed at the Make in India Conclave organised by ABP News.',
  },
];

const CLIENT_PANEL_ID = 'about-client-panel';

export default function ClientsProjects() {
  /* ── View all clients disclosure ── */
  const [expanded, setExpanded] = useState(false);
  const handleToggle = useCallback(() => setExpanded((prev) => !prev), []);

  /* ── Video carousel (Embla) ── */
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    handler();
    emblaApi.on('select', handler);
    emblaApi.on('reInit', handler);
    return () => {
      emblaApi.off('select', handler);
      emblaApi.off('reInit', handler);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /* ── Track playing video to disable auto-scroll ── */
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const handleVideoPlay = useCallback((idx: number) => {
    setPlayingVideoIndex(idx);
  }, []);

  const handleVideoPause = useCallback(() => {
    setPlayingVideoIndex(null);
  }, []);

  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      {/* ── Section header ── */}
      <div className="reveal-up mb-10">
        <SectionHeader
          eyebrow={organisationReferenceEyebrow}
          title={organisationReferenceTitle}
          supportingText={organisationReferenceNote}
        />
      </div>

      {/* ── Organisation references — InfiniteLogoRail (matches homepage) ── */}
      <div className="reveal-up mb-8">
        <InfiniteLogoRail
          ariaLabel="Industry references"
          duration={32}
          pauseOnHover
          pauseOnFocus
          itemSpacingClassName="pr-3 sm:pr-4 md:pr-5"
        >
          {organisationReferences.map((org) => (
            <div
              key={org.name}
              className="w-[125px] sm:w-[140px] md:w-[150px] lg:w-[160px] xl:w-[165px] flex flex-col items-center gap-3 py-1"
            >
              <div className="relative h-[74px] sm:h-[88px] md:h-[98px] lg:h-[104px] w-full flex items-center justify-center">
                <Image
                  src={org.logo}
                  alt={`${org.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 639px) 125px, (max-width: 767px) 140px, (max-width: 1023px) 150px, 165px"
                  loading="eager"
                  unoptimized
                />
              </div>
              <span className="text-metadata font-semibold text-be-charcoal-950 text-center leading-tight">
                {org.name}
              </span>
            </div>
          ))}
        </InfiniteLogoRail>
      </div>

      {/* ── "View all clients" disclosure (matches homepage) ── */}
      <div className="reveal-up mb-10">
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={CLIENT_PANEL_ID}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-be-charcoal-800 border border-be-grey-250 bg-be-white hover:bg-be-cream hover:border-be-yellow-400 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 min-h-[44px]"
        >
          <svg
            className={`size-4 text-be-yellow-text transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          {expanded ? 'Show fewer' : 'View all clients'}
        </button>

        <div
          id={CLIENT_PANEL_ID}
          role="region"
          aria-label="Full client list"
          className={`mt-4 transition-all duration-300 ease-in-out ${
            expanded
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-be-cream/50 border border-be-grey-200/60">
            {selectedClients.map((client) => (
              <div
                key={client.name}
                className="flex items-center px-3 py-2.5 rounded-lg bg-be-white border border-be-grey-150/60 shadow-sm"
              >
                <span className="text-sm font-medium text-be-charcoal-950 leading-tight">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Video carousel ── */}
      <div className="reveal-up">
        <p className="text-metadata font-semibold uppercase tracking-wider text-be-grey-650 mb-4">
          Industry media
        </p>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden" role="region" aria-label="Industry media carousel" aria-roledescription="carousel">
            <div className="flex gap-5">
              {videos.map((video, idx) => (
                <div
                  key={video.type === 'youtube' ? video.videoId : video.src}
                  className="flex-none w-full md:w-[calc(50%-10px)]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${videos.length}`}
                >
                  <article className="flex flex-col h-full overflow-hidden rounded-lg border border-be-grey-250 bg-be-warm-white">
                    {/* Video / embed area */}
                    <div className="relative aspect-video w-full bg-be-charcoal-950 overflow-hidden">
                      {video.type === 'local' ? (
                        <video
                          ref={(el) => {
                            if (el) videoRefs.current.set(idx, el);
                            else videoRefs.current.delete(idx);
                          }}
                          src={video.src}
                          poster={video.poster}
                          controls
                          playsInline
                          preload="metadata"
                          onPlay={() => handleVideoPlay(idx)}
                          onPause={handleVideoPause}
                          onEnded={handleVideoPause}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Info below */}
                    <div className="flex flex-col gap-1.5 p-4">
                      <h3 className="text-card-title font-semibold text-be-charcoal-950 leading-snug">
                        {video.title}
                      </h3>
                      {video.type === 'youtube' && (
                        <>
                          <p className="text-metadata text-be-grey-650 line-clamp-2">
                            {video.description}
                          </p>
                          <a
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${video.title} on YouTube`}
                            className="inline-flex items-center gap-1 text-metadata font-semibold text-be-yellow-text underline underline-offset-2 hover:text-be-yellow-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 rounded-sm w-fit mt-0.5"
                          >
                            View on YouTube
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous video"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-be-grey-250 bg-be-white text-be-charcoal-950 hover:bg-be-cream hover:border-be-yellow-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next video"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-be-grey-250 bg-be-white text-be-charcoal-950 hover:bg-be-cream hover:border-be-yellow-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
