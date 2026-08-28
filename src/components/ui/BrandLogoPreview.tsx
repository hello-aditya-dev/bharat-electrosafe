'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

/**
 * BrandLogoPreview — reusable view-only logo preview modal.
 *
 * Opens a centered, accessible dialog showing a larger version of a
 * brand logo. The popup is strictly view-only:
 *   - no navigation
 *   - no CTA
 *   - no product links
 *   - no descriptions
 *
 * Accessibility:
 *   - Radix Dialog primitives (focus trap, scroll lock, ARIA wiring)
 *   - ESC closes (Radix built-in)
 *   - overlay click closes (Radix built-in)
 *   - visible close button with aria-label
 *   - focus restored to trigger on close (Radix built-in)
 *
 * The logo is rendered with `object-contain` so it is never stretched
 * or cropped. On desktop the modal is sized for comfortable inspection;
 * on mobile it uses a large percentage of the viewport with margins.
 */

interface BrandLogoPreviewProps {
  /** Whether the preview is open. */
  open: boolean;
  /** Close handler. */
  onOpenChange: (open: boolean) => void;
  /** Logo asset path. */
  logo: string;
  /** Accessible alt text / brand name for the logo. */
  alt: string;
  /** Brand display name (used in the dialog title for screen readers). */
  brandName: string;
}

export function BrandLogoPreview({
  open,
  onOpenChange,
  logo,
  alt,
  brandName,
}: BrandLogoPreviewProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus to the close button when the dialog opens for clear
  // keyboard landing, then let Radix restore focus on close.
  useEffect(() => {
    if (open && closeButtonRef.current) {
      // Defer to next tick so Radix has mounted the content.
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[min(90vw,560px)] p-0 overflow-hidden bg-be-white border border-be-grey-250 shadow-lg rounded-xl"
        aria-describedby={`${brandName}-preview-desc`}
      >
        {/* Visually-hidden title + description for screen readers. */}
        <DialogTitle className="sr-only">{brandName} logo preview</DialogTitle>
        <DialogDescription id={`${brandName}-preview-desc`} className="sr-only">
          View-only preview of the {brandName} logo. Press Escape or click outside to close.
        </DialogDescription>

        {/* Close button — top-right, visible, keyboard accessible. */}
        <DialogClose
          ref={closeButtonRef}
          aria-label={`Close ${brandName} logo preview`}
          className="absolute top-3 right-3 z-10 flex items-center justify-center size-9 rounded-full bg-be-white border border-be-grey-250 text-be-charcoal-800 hover:bg-be-cream hover:text-be-charcoal-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogClose>

        {/* Logo display area — object-contain, never stretched/cropped. */}
        <div className="relative w-full aspect-[16/10] bg-be-warm-white">
          <Image
            src={logo}
            alt={alt}
            fill
            className="object-contain p-6 sm:p-8"
            sizes="(max-width: 768px) 90vw, 560px"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
