'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyTableButtonProps {
  /** Column headers, in display order. */
  headers: string[];
  /** Row cells, each aligned with `headers`. */
  rows: string[][];
  /** Accessible name / tooltip text. */
  label?: string;
  /** Optional class name for layout adjustments. */
  className?: string;
}

/**
 * Copies a specification table to the clipboard as tab-separated values
 * (paste-ready for Excel / Google Sheets / email). Shows a transient
 * "Copied" state and announces success to screen readers.
 */
export function CopyTableButton({
  headers,
  rows,
  label = 'Copy table',
  className,
}: CopyTableButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const buildTsv = (): string => {
    const lines = [headers.join('\t')];
    for (const row of rows) {
      lines.push(row.join('\t'));
    }
    return lines.join('\n');
  };

  const copyWithFallback = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through to the legacy path */
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    const ok = await copyWithFallback(buildTsv());
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
        aria-label={copied ? 'Table copied to clipboard' : label}
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
      {/* Screen-reader announcement — the visible button label change is
          often not re-read by assistive tech without a live region. */}
      <span aria-live="polite" role="status" className="sr-only">
        {copied ? 'Specification table copied to clipboard as spreadsheet-compatible text.' : ''}
      </span>
    </span>
  );
}
