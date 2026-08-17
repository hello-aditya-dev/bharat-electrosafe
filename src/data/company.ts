/**
 * Central company data for Bharat Electrosafe.
 *
 * All contact literals live here. Do not duplicate phone numbers, emails,
 * addresses or WhatsApp links in component files — import from this module.
 */

import { productGroupCount } from './products';

/* ────────────────────────────────────────────
   Phone numbers — typed list
   ────────────────────────────────────────────
   Prefer iterating `phones` over hardcoding phonePrimary / phoneSecondary
   / phoneTertiary. Legacy named accessors are kept for backward
   compatibility with components that have not been migrated yet. */

export interface PhoneEntry {
  /** Human-readable display string, e.g. "+91 98703 94721" */
  display: string;
  /** Machine-readable tel: value, e.g. "+919870394721" */
  tel: string;
}

export const phones: PhoneEntry[] = [
  { display: '+91 76174 94968', tel: '+917617494968' },
  { display: '+91 96671 71444', tel: '+919667171444' },
  { display: '+91 98703 94721', tel: '+919870394721' },
] as const;

/* ────────────────────────────────────────────
   Locations — client-confirmed list
   ────────────────────────────────────────────
   These are locations where Bharat Electrosafe operates.
   We use the neutral "Locations" heading — we do NOT assert
   each one is an "Office", "Branch", "Factory" or "Dealer"
   unless the client explicitly confirms that status. */

export const locations: string[] = [
  'Guwahati',
  'Ahmedabad',
  'Ambala',
  'Bangalore',
  'Bhubaneswar',
  'Chandigarh',
  'Chennai',
  'Cochin',
  'Coimbatore',
  'Dehradun',
  'Delhi NCR',
  'Hyderabad',
  'Indore',
  'Jabalpur',
  'Jaipur',
  'Jalandhar',
  'Jammu',
  'Jharsuguda',
  'Kanpur',
  'Kolkata',
  'Lucknow',
  'Ludhiana',
  'Mumbai',
  'Prayagraj',
  'Pune',
  'Raipur',
  'Surat',
  'Udaipur',
  'Vadodara',
  'Visakhapatnam (Vizag)',
] as const;

export const company = {
  name: 'Bharat Electrosafe',
  legalName: 'Bharat Electrosafe',
  tagline: 'Electrical Safety. Engineered Right.',
  description:
    'At Bharat Electrosafe, we are India\'s trusted name in precision-engineered electrical safety, industrial safety, infrastructure protection, PVC flooring, and waterproofing solutions. Proudly contributing to the nation\'s safety and development under the Make in India initiative, we are committed to delivering high-quality products that protect lives, ensure compliance, and support critical industrial, commercial, and infrastructure operations across multiple sectors.',

  // Contact details — single source of truth
  // Legacy named accessors for backward compatibility
  phonePrimary: phones[0].display,
  phonePrimaryTel: phones[0].tel,
  phoneSecondary: phones[1].display,
  phoneSecondaryTel: phones[1].tel,
  email: 'info@bharatelectrosafe.com',
  whatsapp: {
    href: 'https://wa.me/917617494968',
    label: '+91 76174 94968',
  },

  address: {
    line1: '814, 8th Floor, I-thum, Tower A',
    line2: 'Plot No. A-40, Sector-62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    country: 'India',
    full: '814, 8th Floor, I-thum, Tower A, Plot No. A-40, Sector-62, Noida-201309, Uttar Pradesh, India',
  },

  /* Office hours — verified flag controls whether the OfficeHours component
     renders at all and whether openingHoursSpecification is emitted in
     structured data. The rows below are the values shown on the original
     company website, but they have NOT been independently confirmed by the
     client as the current operating schedule. Set `verified: true` only
     after the client confirms the current hours in writing. When
     `verified: false`, the OfficeHours component returns null and no
     openingHoursSpecification is emitted. */
  officeHours: {
    verified: false,
    rows: [
      { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
      { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
      { day: 'Sunday', hours: 'Closed', closed: true },
    ],
  },

  // Regulatory / standards
  certifications: {
    isiStandard: 'IS 15652:2006',
    cmL: 'CM/L:8800129617',
    iec: 'IEC 61111',
    membraneStandard: 'IS 15909:2020',
  },

  /* Only qualified, source-supported claims. The group count reflects the
     four top-level product groups and is sourced from productGroupCount in
     the product registry. The "Countries Served (company-stated)" qualifier
     mirrors the wording in trust.ts — it is a company self-statement, not an
     independently verified figure. */
  stats: [
    { value: String(productGroupCount), label: 'Product Groups' },
    { value: 'A · B · C', label: 'Insulation Classes' },
    { value: 'IS 15652:2006', label: 'Manufacturing Standard' },
    { value: 'CM/L:8800129617', label: 'BIS Licence Number' },
  ],

  social: {
    /* The generic LinkedIn homepage (linkedin.com) is not Bharat Electrosafe's
       genuine company page. Omit from structured data until a real profile URL
       is verified. The field is kept here as a placeholder so the data model
       does not need to change when one is confirmed. */
    linkedin: '',
  },

  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://bharatelectrosafe.com',
} as const;

/**
 * Build a pre-filled WhatsApp URL from contact-form context.
 *
 * Renamed parameter avoids shadowing the imported `company` object.
 * Handles empty, partial and full-message calls.
 */
export function generateWhatsAppUrl(
  name?: string,
  companyName?: string,
  product?: string,
  message?: string,
): string {
  const parts: string[] = [];

  if (name) parts.push(`Hi, I'm ${name}`);
  if (companyName) parts.push(`from ${companyName}`);
  if (product) parts.push(`I'm interested in ${product}`);
  if (message) parts.push(message);

  const text = parts.length > 0 ? `${parts.join('. ')}.` : '';
  const base = company.whatsapp.href;

  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type Company = typeof company;
