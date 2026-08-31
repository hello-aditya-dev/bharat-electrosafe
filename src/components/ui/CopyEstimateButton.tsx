'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyTextToClipboard } from '@/lib/clipboard';

interface CopyEstimateButtonProps {
  /** Plain-text summary lines to place on the clipboard. */
  lines: string[];
  /** Append "Estimate link: <current URL>" at click time (reflects the
   *  latest replaceState URL, so it is never stale). */
  includeLink?: boolean;
  /** Accessible name / tooltip text. */
  label?: string;
  /** Optional class name for layout adjustments. */
  className?: string;
}

/**
 * Copies a free-form estimate summary (weight estimator result, class
 * recommendation, …) to the clipboard as plain text lines — paste-ready
 * for emails or procurement notes. Shows a transient "Copied" state and
 * announces success to screen readers. Same design language and fallback
 * behaviour as CopyTableButton (via the shared clipboard helper).
 */
export function CopyEstimateButton({
  lines,
  includeLink = false,
  label = 'Copy estimate',
  className,
}: CopyEstimateButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const out = [...lines.filter(Boolean)];
    if (includeLink && typeof window !== 'undefined') {
      out.push(`Estimate link: ${window.location.href}`);
    }
    const ok = await copyTextToClipboard(out.join('\n'));
    if (ok) {
      setCopied(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <span className={cn('inline-flex items-center', className)}>
      <button
        type="button"
        onClick={handleCopy}
        title={label}
        aria-label={copied ? 'Estimate copied to clipboard' : label}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 min-h-[44px] text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2',
          copied
            ? 'border-be-yellow-500 bg-be-yellow-50 text-be-charcoal-950'
            : 'border-be-grey-300 bg-be-white text-be-charcoal-800 hover:border-be-yellow-400 hover:bg-be-yellow-50',
        )}
      >
        {copied ? (
          <Check className="size-4 text-be-yellow-text" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? 'Copied' : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Estimate copied to clipboard' : ''}
      </span>
    </span>
  );
}
