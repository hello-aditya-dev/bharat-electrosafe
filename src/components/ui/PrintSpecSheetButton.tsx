'use client';

import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrintSpecSheetButtonProps {
  /** Accessible name / tooltip text. */
  label?: string;
  /** Optional class name for layout adjustments. */
  className?: string;
}

/**
 * Opens the browser print dialog for the current page. Paired with the
 * global print stylesheet (globals.css @media print) the printed output
 * is a clean spec sheet: page title, class/spec tables, the current
 * selector recommendation and company contact details — all navigation,
 * imagery and interactive chrome are removed on paper.
 *
 * The button itself carries the `print-hide` class so it never appears
 * in the printed output.
 */
export function PrintSpecSheetButton({
  label = 'Print Spec Sheet',
  className,
}: PrintSpecSheetButtonProps) {
  return (
    <span className={cn('print-hide inline-flex items-center', className)}>
      <button
        type="button"
        onClick={() => window.print()}
        title={label}
        aria-label={label}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 min-h-[44px] text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2',
          'border-be-grey-300 bg-be-white text-be-charcoal-800 hover:border-be-yellow-400 hover:bg-be-yellow-50',
        )}
      >
        <Printer className="size-4" aria-hidden="true" />
        {label}
      </button>
    </span>
  );
}
