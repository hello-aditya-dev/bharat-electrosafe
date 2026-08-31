'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { company } from '@/data/company';

interface WhatsAppShareButtonProps {
  /** Message lines; joined with newlines and URL-encoded at CLICK time. */
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
 * Opens a pre-filled WhatsApp chat with the given summary text.
 *
 * The wa.me URL is built inside the click handler so the share text always
 * carries the current page URL (the estimate state is mirrored into the URL
 * via history.replaceState, which does not trigger a re-render). Opens in a
 * new tab with noopener; falls back to same-tab navigation if the popup is
 * blocked. Shows the same transient "Ready"/sent feedback pattern as the
 * copy buttons. Styling follows the site's established WhatsApp affordance
 * (MessageCircle icon on navy — see MobileStickyCTA).
 */
export function WhatsAppShareButton({
  lines,
  includeLink = false,
  label = 'Send via WhatsApp',
  className,
}: WhatsAppShareButtonProps) {
  const [sent, setSent] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSend = () => {
    const out = [...lines.filter(Boolean)];
    if (includeLink && typeof window !== 'undefined') {
      out.push(`Estimate link: ${window.location.href}`);
    }
    const url = `${company.whatsapp.href}?text=${encodeURIComponent(out.join('\n'))}`;

    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      /* Popup blocked — same-tab navigation still delivers the user to
         WhatsApp with the pre-filled message. */
      window.open(url, '_self');
      return;
    }

    setSent(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setSent(false), 2200);
  };

  return (
    <span className={cn('inline-flex items-center', className)}>
      <button
        type="button"
        onClick={handleSend}
        title={label}
        aria-label={label}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2',
          'bg-be-navy-900 text-be-white hover:bg-be-navy-800',
        )}
      >
        {sent ? (
          <Check className="size-4 text-be-brand-yellow" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-4 text-be-brand-yellow" aria-hidden="true" />
        )}
        {label}
      </button>
    </span>
  );
}
