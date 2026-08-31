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
import { iecClasses } from '@/data/iec-61111';

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
  // Domestic — IS 15652:2006 family
  'eim',
  'csim',
  'bcim',
  'agrim',
  // Global — IEC 61111:2009 family
  'iec-hv-insulating-mats',
  'dual-layer-dual-colour',
  'international-iec-61111',
  // Industrial / civil products
  'bm',
  'bhs',
  'bharat-poleshield',
  'pvc-flooring-solutions',
  'rubber-sheet',
  'rubber-hose-pipe',
  'esd-mat',
  'conveyor-belt',
] as const;

export type ProductValue = (typeof PRODUCT_VALUES)[number];

/** Select-group labels, in display order. */
export const PRODUCT_GROUPS = [
  'Domestic — IS 15652:2006',
  'Global — IEC 61111:2009',
  'Industrial & Civil Products',
] as const;

export type ProductGroup = (typeof PRODUCT_GROUPS)[number];

export const productOptions: {
  value: ProductValue;
  label: string;
  group: ProductGroup;
}[] = [
  { value: 'eim', label: 'Electrical Insulating Mats (IS 15652)', group: 'Domestic — IS 15652:2006' },
  { value: 'csim', label: 'Coloured Strip Insulating Mats', group: 'Domestic — IS 15652:2006' },
  { value: 'bcim', label: 'Bi-Colour Insulating Mats (Domestic)', group: 'Domestic — IS 15652:2006' },
  { value: 'agrim', label: 'Auto-Glow / Reflective Band Insulating Mats', group: 'Domestic — IS 15652:2006' },
  { value: 'iec-hv-insulating-mats', label: 'HV Insulating Mats — IEC 61111:2009 (Global)', group: 'Global — IEC 61111:2009' },
  { value: 'dual-layer-dual-colour', label: 'Dual Layer Dual Colour Mats — IEC 61111:2009 (Global)', group: 'Global — IEC 61111:2009' },
  { value: 'international-iec-61111', label: 'Global IEC 61111:2009 Range — General', group: 'Global — IEC 61111:2009' },
  { value: 'bm', label: 'Geo Membrane Lining', group: 'Industrial & Civil Products' },
  { value: 'bhs', label: 'Water Stop Seal', group: 'Industrial & Civil Products' },
  { value: 'bharat-poleshield', label: 'Bharat PoleShield', group: 'Industrial & Civil Products' },
  { value: 'pvc-flooring-solutions', label: 'PVC Flooring Solutions', group: 'Industrial & Civil Products' },
  { value: 'rubber-sheet', label: 'Rubber Sheet', group: 'Industrial & Civil Products' },
  { value: 'rubber-hose-pipe', label: 'Rubber Hose Pipe', group: 'Industrial & Civil Products' },
  { value: 'esd-mat', label: 'ESD Mat', group: 'Industrial & Civil Products' },
  { value: 'conveyor-belt', label: 'Conveyor Belt', group: 'Industrial & Civil Products' },
];

/**
 * Options grouped by family for the contact form's grouped
 * <SelectGroup> rendering. Order follows PRODUCT_GROUPS.
 */
export function groupedProductOptions(): {
  group: ProductGroup;
  options: { value: ProductValue; label: string }[];
}[] {
  return PRODUCT_GROUPS.map((group) => ({
    group,
    options: productOptions
      .filter((p) => p.group === group)
      .map(({ value, label }) => ({ value, label })),
  }));
}

/* ────────────────────────────────────────────
   Query-param aliases

   CTA links across the site send `?product=` values in three
   shapes: option values ("eim"), route slugs
   ("electrical-insulating-mats"), and display-name labels
   ("Geo Membrane Lining Solutions"). Every shape must resolve
   to a canonical option value or the prefill silently fails.
   ──────────────────────────────────────────── */

const PRODUCT_PARAM_ALIASES: Record<string, ProductValue> = {
  // Route slugs → option values
  'electrical-insulating-mats': 'eim',
  'coloured-strip-insulating-mats': 'csim',
  'bi-color-insulating-mats': 'bcim',
  'bi-colour-insulating-mats': 'bcim',
  'auto-glow-reflective-band-insulating-mats': 'agrim',
  'auto-glow': 'agrim',
  'bharat-membrane': 'bm',
  'geo-membrane-lining': 'bm',
  'bharat-hydro-seal': 'bhs',
  'water-stop-seal': 'bhs',
  // Display-name variants (DocumentCard sends product.name)
  'bi-color insulating mats': 'bcim',
  'geo membrane lining solutions': 'bm',
  'auto-glow / reflective band mats': 'agrim',
  // IEC hub uses the bi-colour product page value
  'iec-bi-colour': 'dual-layer-dual-colour',
};

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

/**
 * Resolves a stored product value to its human-readable label
 * (used by the enquiry email so the sales team sees
 * "HV Insulating Mats — IEC 61111:2009 (Global)" instead of a
 * raw slug). Unknown values are returned unchanged.
 */
export function productLabelFromValue(value: string): string {
  return productOptions.find((p) => p.value === value)?.label ?? value;
}

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
  // 1) Explicit aliases (slugs + display-name variants)
  const alias = PRODUCT_PARAM_ALIASES[normalized];
  if (alias) return alias;
  // 2) Canonical option values
  const byValue = productOptions.find((p) => p.value === normalized);
  if (byValue) return byValue.value;
  // 3) Canonical labels (case-insensitive)
  const byLabel = productOptions.find(
    (p) => p.label.toLowerCase() === normalized,
  );
  if (byLabel) return byLabel.value;
  return undefined;
}

/* ────────────────────────────────────────────
   ?class= param — IEC 61111:2009 class prefill

   The Global HV page class selector links to the contact form
   with `?class=Class N`. The class is resolved against the real
   iec-61111 data (no invented values): the quote block's
   Operating Voltage field is prefilled and, when the caller did
   not supply an explicit message, a quotation message is
   composed from the brochure data.
   ──────────────────────────────────────────── */

function classFromQueryParam(
  klass: string | null,
): (typeof iecClasses)[number] | undefined {
  if (!klass) return undefined;
  const normalized = klass.toLowerCase().trim().replace(/\s+/g, ' ');
  return iecClasses.find(
    (c) => c.classLabel.toLowerCase() === normalized,
  );
}

export function iecClassPrefillFromQuery(klass: string | null): {
  voltage: string;
  message: string;
} {
  const match = classFromQueryParam(klass);
  if (!match) return { voltage: '', message: '' };
  return {
    voltage: `${match.maxWorkingVoltage} max working voltage — ${match.classLabel} (IEC 61111:2009, ${match.productCode})`,
    message: `Please quote for IEC 61111:2009 ${match.classLabel} electrical insulating mats (product code ${match.productCode}, thickness ${match.thickness}, max working voltage ${match.maxWorkingVoltage}).`,
  };
}

/**
 * Reads contact-form prefill values from the current URL query string.
 * Safe to call in the browser; returns safe defaults if called elsewhere.
 */
export function readContactPrefillFromUrl(): {
  enquiryType: EnquiryType | undefined;
  product: ProductValue | undefined;
  message: string;
  voltage: string;
} {
  if (typeof window === 'undefined') {
    return { enquiryType: undefined, product: undefined, message: '', voltage: '' };
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const explicitMessage = params.get('message') ?? '';
    const classPrefill = iecClassPrefillFromQuery(params.get('class'));
    return {
      enquiryType: enquiryTypeFromQuery(params.get('type')),
      product: productFromQuery(params.get('product')),
      message: explicitMessage || classPrefill.message,
      voltage: classPrefill.voltage,
    };
  } catch {
    return { enquiryType: undefined, product: undefined, message: '', voltage: '' };
  }
}
