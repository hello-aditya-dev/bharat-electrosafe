'use client';

import { Eye, Download, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TechnicalBadge } from './TechnicalBadge';
import { EmptyMediaFallback } from './EmptyMediaFallback';
import { PrimaryButton } from './PrimaryButton';
import { getDocumentMeta } from '@/lib/document-meta';
import type { DocumentKind } from '@/data/products';

interface DocumentCardProps {
  type?: string;
  name: string;
  issuer?: string;
  kind: DocumentKind;
  /** Local path under /public when a genuine document exists. */
  href?: string;
  thumbnail?: string;
  /** Product name, used to prefill the datasheet / document request. */
  productName?: string;
  className?: string;
}

/**
 * Per-kind labels for the primary (view) and secondary (download) actions.
 * The datasheet and unavailable-licence kinds intentionally have no download —
 * they route to the prefilled contact form instead.
 */
const actionLabels: Record<
  DocumentKind,
  { primary?: string; secondary?: string; fallback: string }
> = {
  'test-report': {
    primary: 'View test report',
    secondary: 'Download PDF',
    fallback: 'Request document',
  },
  certificate: {
    primary: 'View certificate',
    secondary: 'Download PDF',
    fallback: 'Request document',
  },
  licence: {
    primary: 'View licence',
    secondary: 'Download PDF',
    fallback: 'Request document',
  },
  datasheet: {
    fallback: 'Request datasheet',
  },
  'standards-information': {
    fallback: 'Request information',
  },
};

export function DocumentCard({
  type,
  name,
  issuer,
  kind,
  href,
  thumbnail,
  productName,
  className,
}: DocumentCardProps) {
  const labels = actionLabels[kind];
  const meta = getDocumentMeta(href);
  const hasFile = Boolean(href && meta);
  // The datasheet is never a downloadable document — it is always "on request".
  const isDatasheet = kind === 'datasheet';
  const showViewDownload = hasFile && !isDatasheet;

  // Request URL for the datasheet / unavailable document, prefilled.
  const requestType = isDatasheet ? 'datasheet' : 'product';
  const requestMessage = isDatasheet
    ? `I would like to request the product datasheet for ${productName ?? 'this product'}.`
    : `I would like to request the ${type?.toLowerCase() ?? 'document'}: ${name}${productName ? ` for ${productName}` : ''}.`;
  const requestHref = `/contact-us?type=${requestType}&product=${encodeURIComponent(productName ?? '')}&message=${encodeURIComponent(requestMessage)}`;

  // If a genuine file exists, the thumbnail opens it in a new tab.
  const thumbHref = showViewDownload ? href : undefined;

  return (
    <div
      className={cn(
        'hover-card-lift flex flex-col rounded-lg border border-be-grey-250 bg-be-white overflow-hidden',
        className
      )}
    >
      {/* Thumbnail / first-page preview */}
      <div className="relative aspect-[4/3] overflow-hidden bg-be-cream">
        {thumbnail ? (
          thumbHref ? (
            <a
              href={thumbHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name} preview in a new tab`}
              className="group/thumb block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-500 focus-visible:ring-offset-2"
            >
              <Image
                src={thumbnail}
                alt={`${type} — ${name} preview`}
                fill
                className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </a>
          ) : (
            <Image
              src={thumbnail}
              alt={`${type} — ${name} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )
        ) : (
          <EmptyMediaFallback label={name} slotId={`doc-${name}`} />
        )}
        {/* PDF chip */}
        {hasFile && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-be-charcoal-950/85 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-be-white">
            <FileText className="h-3 w-3" aria-hidden="true" />
            PDF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {type && <TechnicalBadge label={type} />}

        <h3 className="text-card-title text-be-charcoal-950 leading-snug">{name}</h3>

        {issuer && (
          <p className="text-metadata text-be-grey-650">{issuer}</p>
        )}

        {/* File size label, only when a genuine file exists */}
        {hasFile && meta && (
          <p className="text-metadata text-be-grey-650">{meta.sizeLabel}</p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {showViewDownload && href ? (
            <>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${name} in a new tab`}
                className="inline-flex items-center justify-center min-h-[40px] rounded-lg border border-be-grey-250 bg-transparent px-4 py-2 text-sm font-semibold text-be-charcoal-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-be-yellow-400 hover:text-be-charcoal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
              >
                <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" focusable="false" />
                {labels.primary}
              </a>
              <a
                href={href}
                download
                aria-label={`Download ${name} PDF`}
                className="inline-flex items-center justify-center min-h-[40px] rounded-lg bg-be-yellow-500 px-4 py-2 text-sm font-semibold text-be-charcoal-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-be-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4 mr-1.5" aria-hidden="true" focusable="false" />
                {labels.secondary}
              </a>
            </>
          ) : (
            <PrimaryButton
              href={requestHref}
              className="text-sm px-4 py-2 min-h-[40px]"
              aria-label={`Request ${name}`}
            >
              {isDatasheet ? labels.fallback : labels.fallback}
              <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" focusable="false" />
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shared helper for non-card "request document" links. */
export function documentRequestHref(
  kind: DocumentKind,
  name: string,
  productName?: string
): string {
  const isDatasheet = kind === 'datasheet';
  const type = isDatasheet ? 'datasheet' : 'product';
  const message = isDatasheet
    ? `I would like to request the product datasheet for ${productName ?? 'this product'}.`
    : `I would like to request ${name}${productName ? ` for ${productName}` : ''}.`;
  return `/contact-us?type=${type}&product=${encodeURIComponent(productName ?? '')}&message=${encodeURIComponent(message)}`;
}
