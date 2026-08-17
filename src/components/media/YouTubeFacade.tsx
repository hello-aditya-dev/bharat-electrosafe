'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Click-to-load YouTube embed.
 *
 * Nothing is requested from YouTube until the user activates the button: the
 * poster is a local file, so the page ships no third-party request and no
 * tracking cookie on first paint. The iframe is only mounted after the click,
 * and it points at youtube-nocookie.com.
 */

export interface YouTubeFacadeProps {
  /** YouTube video id, e.g. "e9jF3JYMLco". */
  videoId: string;
  /** Real video title — used for the iframe title and the accessible name. */
  title: string;
  /** Local poster image under /public. */
  poster: string;
  /** Describes the poster frame, not the video. */
  posterAlt: string;
  className?: string;
}

export function YouTubeFacade({
  videoId,
  title,
  poster,
  posterAlt,
  className,
}: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false);

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-be-grey-250 bg-be-charcoal-950">
        {activated ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
          >
            <Image
              src={poster}
              alt={posterAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Scrim keeps the play control legible over any frame. */}
            <span className="absolute inset-0 bg-be-charcoal-950/25 transition-colors duration-200 group-hover:bg-be-charcoal-950/35" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-be-yellow-500 shadow-lg transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-be-charcoal-950 text-be-charcoal-950" aria-hidden="true" focusable="false" />
              </span>
            </span>
          </button>
        )}
      </div>

      <figcaption className="flex flex-col gap-1">
        <span className="text-body font-semibold text-be-charcoal-950">{title}</span>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-metadata text-be-grey-650 underline underline-offset-2 hover:text-be-yellow-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 rounded-sm w-fit"
        >
          Watch on YouTube
        </a>
      </figcaption>
    </figure>
  );
}

export default YouTubeFacade;
