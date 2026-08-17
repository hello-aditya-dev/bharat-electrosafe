'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { EmptyMediaFallback } from './EmptyMediaFallback';
import { getSlotById } from '@/data/asset-slots';

interface ImageFrameProps {
  src?: string;
  alt: string;
  slotId?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide';
  className?: string;
  objectPosition?: string;
  /** `contain` for isolated product shots, `cover` for real photographs. */
  fit?: 'cover' | 'contain';
  /** Set on the single above-the-fold image of a page. */
  priority?: boolean;
  sizes?: string;
  /** Remove frame (border, radius, bg, padding) — for images that should render flush. */
  flush?: boolean;
}

const aspectRatioClasses = {
  landscape: 'aspect-[16/10]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
};

export function ImageFrame({
  src,
  alt,
  slotId,
  aspectRatio = 'landscape',
  className,
  objectPosition = 'center',
  fit = 'cover',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1360px) 50vw, 680px',
  flush = false,
}: ImageFrameProps) {
  const [hasError, setHasError] = useState(false);

  /* Editorial call sites identify their image by slot rather than passing a
     path, so resolve the slot registry when no explicit src is given. Product
     call sites pass `src` straight from the product's own image data. */
  const slot = slotId ? getSlotById(slotId) : undefined;
  const resolvedSrc = src || slot?.currentFallbackPath || undefined;
  const resolvedPosition =
    objectPosition !== 'center' ? objectPosition : slot?.objectPosition ?? 'center';
  const showImage = resolvedSrc && !hasError;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        !flush && 'rounded-lg border border-be-grey-250',
        aspectRatioClasses[aspectRatio],
        fit === 'contain' && !flush && 'bg-be-white',
        className
      )}
    >
      {showImage ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          className={cn(
            fit === 'contain' ? 'object-contain' : 'hover-image-scale object-cover',
            fit === 'contain' && !flush && 'p-3'
          )}
          style={{ objectPosition: resolvedPosition }}
          onError={() => setHasError(true)}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      ) : (
        <EmptyMediaFallback slotId={slotId} />
      )}
    </div>
  );
}
