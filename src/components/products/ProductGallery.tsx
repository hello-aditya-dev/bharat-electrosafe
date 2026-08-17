'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { SectionShell } from '@/components/ui/SectionShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { ProductVisualRole } from '@/data/product-visuals';

interface ProductGalleryProps {
  /** Hero image — always shown as the first large image. */
  hero: ProductVisualRole;
  /** Gallery images — thumbnails. Max 5 displayed. */
  gallery: ProductVisualRole[];
  /** Product short name for the section header. */
  productName: string;
}

/**
 * Product Gallery section — 1 large image + max 5 thumbnails.
 *
 * Selecting a thumbnail changes the large image.
 * Uses bg-[#FAFAF7] frame, rounded-2xl, subtle border.
 * Keyboard accessible with arrow key navigation on thumbnails.
 * No gallery library — pure React client island.
 */
export function ProductGallery({ hero, gallery, productName }: ProductGalleryProps) {
  const allImages: ProductVisualRole[] = [hero, ...gallery.slice(0, 5)];
  const [active, setActive] = useState(0);
  const count = allImages.length;

  const show = useCallback(
    (next: number) => {
      setActive(((next % count) + count) % count);
    },
    [count]
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => show(active - 1),
      ArrowRight: () => show(active + 1),
      Home: () => show(0),
      End: () => show(count - 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  const current = allImages[active];
  const isContain = current.fit === 'contain';

  if (count <= 1) return null;

  return (
    <SectionShell variant="standard" bg="bg-be-white" topRule>
      <SectionHeader
        eyebrow="Gallery"
        title={`${productName} Gallery`}
        supportingText="Browse product images and application photographs."
      />

      <div className="mt-6">
        {/* Large image */}
        <div
          className="relative aspect-[4/3] min-h-[280px] overflow-hidden rounded-2xl border border-be-grey-200 bg-[#FAFAF7]"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className={
              isContain
                ? 'object-contain p-8 md:p-12'
                : 'object-cover'
            }
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority={active === 0}
          />
        </div>

        {/* Thumbnails */}
        {count > 1 && (
          <div
            className="mt-4 flex gap-2.5"
            onKeyDown={handleKeyDown}
            role="tablist"
            aria-label="Select gallery image"
          >
            {allImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => show(index)}
                role="tab"
                aria-selected={index === active}
                aria-label={`View: ${image.alt}`}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-1 sm:h-20 sm:w-24 ${
                  index === active
                    ? 'border-be-yellow-500 ring-2 ring-be-yellow-500'
                    : 'border-be-grey-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className={
                    image.fit === 'contain'
                      ? 'object-contain p-1.5'
                      : 'object-cover'
                  }
                  sizes="120px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Screen-reader live region */}
        <p aria-live="polite" className="sr-only">
          {`Gallery image ${active + 1} of ${count}: ${current.alt}`}
        </p>
      </div>
    </SectionShell>
  );
}
