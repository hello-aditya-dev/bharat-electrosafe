/**
 * Shared contact form contract — Bharat Electrosafe.
 *
 * Single authoritative schema consumed by BOTH the frontend contact form
 * (src/components/contact/EnquiryQuoteLayout.tsx) and the API route
 * (src/app/api/contact/route.ts). This eliminates the prior schema drift
 * where the frontend sent `company` / `productInterest` / `operatingVoltage`
 * / `requiredDimensions` / `_honeypot` and an enquiry-type enum that the
 * server's strict schema rejected.
 *
 * Canonical enquiry types:
 *   general      — general enquiry
 *   product      — product information
 *   quote        — request a quotation
 *   technical    — technical guidance / support
 *   partnership  — partnership / distribution
 *
 * `datasheet` (used by legacy product-page links) is mapped to `product`
 * at the prefill boundary so no frontend-only enum value reaches the API.
 *
 * Field names are final — no aliases. The API uses `.strict()` so any key
 * not defined here is rejected.
 */

import { z } from 'zod';

/* ────────────────────────────────────────────
   Enquiry type constants + labels
   ──────────────────────────────────────────── */

export const ENQUIRY_TYPES = [
  'general',
  'product',
  'quote',
  'technical',
  'partnership',
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const enquiryTypeLabels: { value: EnquiryType; label: string }[] = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'product', label: 'Product Information' },
  { value: 'quote', label: 'Request a Quote' },
  { value: 'technical', label: 'Technical Guidance' },
  { value: 'partnership', label: 'Partnership / Distribution' },
];

/* ────────────────────────────────────────────
   Product selection values (for prefill)
   ──────────────────────────────────────────── */

export const PRODUCT_VALUES = [
  'eim',
  'csim',
  'bcim',
  'agrim',
  'bm',
  'bhs',
] as const;

export type ProductValue = (typeof PRODUCT_VALUES)[number];

export const productOptions: { value: ProductValue; label: string }[] = [
  { value: 'eim', label: 'Electrical Insulating Mats' },
  { value: 'csim', label: 'Coloured Strip Insulating Mats' },
  { value: 'bcim', label: 'Bi-Colour Insulating Mats' },
  { value: 'agrim', label: 'Auto-Glow / Reflective Band Insulating Mats' },
  { value: 'bm', label: 'Geo Membrane Lining' },
  { value: 'bhs', label: 'Water Stop Seal' },
];

/* ────────────────────────────────────────────
   Shared Zod schema
   ──────────────────────────────────────────── */

const phoneRegex = /^[+\d\s\-().]{1,60}$/;

/**
 * The canonical contact payload schema.
 *
 * `phone` is REQUIRED — this is a B2B enquiry/quotation form and the sales
 * team needs a callback number. The frontend label reflects this.
 *
 * `website` is the honeypot (must be empty). `_formOpenAt` is the timing
 * anti-spam field. `turnstileToken` is the optional Cloudflare Turnstile
 * token.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(200),
  companyName: z.string().trim().max(200).optional(),
  email: z
    .string()
    .trim()
    .email('A valid email is required')
    .max(200)
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .max(60)
    .regex(phoneRegex, 'Please enter a valid phone number'),
  enquiryType: z.enum(ENQUIRY_TYPES, {
    message: 'Please select an enquiry type',
  }),
  product: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Please provide a message of at least 10 characters')
    .max(5000),
  voltage: z.string().trim().max(100).optional(),
  dimensions: z.string().trim().max(300).optional(),
  quantity: z.string().trim().max(100).optional(),
  deliveryLocation: z.string().trim().max(300).optional(),
  // Anti-spam: honeypot — must be empty
  website: z.string().max(0).optional(),
  // Anti-spam: timing (ms epoch)
  _formOpenAt: z.string().optional(),
  // Turnstile token
  turnstileToken: z.string().trim().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* ────────────────────────────────────────────
   Query-param → enquiry-type mapping
   ──────────────────────────────────────────── */

/**
 * Maps a `?type=` query parameter to a canonical enquiry type.
 *
 * Supports the public values used in CTA links across the site:
 *   - type=quote              → quote
 *   - type=technical-guidance → technical
 *   - type=technical          → technical
 *   - type=product            → product
 *   - type=datasheet          → product  (legacy product-page links)
 *   - type=partnership        → partnership
 *   - type=general            → general
 *
 * Unknown values return undefined (fail safe — no crash, no invalid enum).
 */
export function enquiryTypeFromQuery(type: string | null): EnquiryType | undefined {
  if (!type) return undefined;
  const normalized = type.toLowerCase().trim();
  switch (normalized) {
    case 'quote':
    case 'request-quote':
    case 'request-a-quote':
      return 'quote';
    case 'technical-guidance':
    case 'technical':
    case 'support':
      return 'technical';
    case 'product':
    case 'product-info':
    case 'datasheet':
      return 'product';
    case 'partnership':
      return 'partnership';
    case 'general':
      return 'general';
    default:
      return undefined;
  }
}

/**
 * Maps a `?product=` query parameter to a known product value.
 * Accepts either the value key (e.g. "eim") or the label.
 * Returns undefined for unknown values (fail safe).
 */
export function productFromQuery(
  product: string | null,
): ProductValue | undefined {
  if (!product) return undefined;
  const normalized = product.toLowerCase().trim();
  const byValue = productOptions.find((p) => p.value === normalized);
  if (byValue) return byValue.value;
  const byLabel = productOptions.find(
    (p) => p.label.toLowerCase() === normalized,
  );
  if (byLabel) return byLabel.value;
  return undefined;
}

/**
 * Reads contact-form prefill values from the current URL query string.
 * Safe to call in the browser; returns safe defaults if called elsewhere.
 */
export function readContactPrefillFromUrl(): {
  enquiryType: EnquiryType | undefined;
  product: ProductValue | undefined;
  message: string;
} {
  if (typeof window === 'undefined') {
    return { enquiryType: undefined, product: undefined, message: '' };
  }
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      enquiryType: enquiryTypeFromQuery(params.get('type')),
      product: productFromQuery(params.get('product')),
      message: params.get('message') ?? '',
    };
  } catch {
    return { enquiryType: undefined, product: undefined, message: '' };
  }
}
