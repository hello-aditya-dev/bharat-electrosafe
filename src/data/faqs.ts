/**
 * FAQ data — single source of truth for the visible FAQ accordions.
 *
 * FAQPage JSON-LD is intentionally not emitted because Google removed
 * FAQ rich-result display. The visible FAQ content is retained for users.
 */

import type { ProductData } from './products';

/* ────────────────────────────────────────────
   Public FAQ type
   ──────────────────────────────────────────── */

export interface SiteFAQ {
  question: string;
  answer: string;
}

/* Homepage FAQs — practical buyer questions.
   FAQPage JSON-LD is intentionally not emitted. */

export const homeFaqs: SiteFAQ[] = [
  {
    question: 'Which standard applies to the electrical insulating mats?',
    answer:
      'The insulating-mat range is offered for IS 15652:2006 requirements under BIS Licence CM/L:8800129617. The appropriate class and thickness depend on the electrical application and working voltage. IEC 61111 product information is available on request.',
  },
  {
    question: 'Can mats be supplied in project-specific dimensions?',
    answer:
      'Standard rolls and project-specific lengths may be quoted. Required width, length, thickness, colour configuration, surface pattern and quantity should be included with the enquiry.',
  },
  {
    question: 'How should the correct mat class be selected?',
    answer:
      'Selection should be based on the installation, system voltage, applicable standard and project requirements. Share the operating voltage and installation details so the appropriate product class can be proposed.',
  },
  {
    question: 'What documentation is available?',
    answer:
      'Available documents may include the BIS licence, test reports, product data and applicable company certificates. The exact document set is confirmed for the selected product during quotation.',
  },
  {
    question: 'What is the normal lead time?',
    answer:
      'Production and dispatch schedules depend on the product, dimensions, quantity, documentation requirements and delivery location. The confirmed schedule is included with the quotation.',
  },
  {
    question:
      'Do Geo Membrane Lining and Water Stop Seal follow the same electrical standards as insulating mats?',
    answer:
      'No. Geo Membrane Lining and Water Stop Seal are waterproofing products and do not inherit IS 15652:2006 insulating-mat certification, electrical insulation classes, the BIS insulating-mat licence or ERDA/NTH electrical-mat test reports. Geo Membrane Lining is presented for applications covered by IS 15909:2020 and Water Stop Seal references IS 15058:2002. They must not be specified as electrical safety mats.',
  },
];

/* Product-specific FAQs keyed by slug.
   FAQPage JSON-LD is intentionally not emitted. */

export const productFaqsBySlug: Record<string, SiteFAQ[]> = {
  /* ── Electrical insulating mats ── */
  'electrical-insulating-mats': [
    {
      question: 'What standards do Electrical Insulating Mats comply with?',
      answer:
        'Our electrical insulating mats are manufactured to IS 15652:2006 under BIS Licence CM/L:8800129617. Available supporting documents include ERDA and NTH test reports. Request the current document set for the exact product and thickness required.',
    },
    {
      question: 'How do I select between Class A, B and C?',
      answer:
        'Class selection is based on the maximum working voltage at the installation. Class A is rated for a 3.3 kV working voltage, Class B for 11 kV and Class C for 33 kV. Choose the class that meets or exceeds the highest voltage present at the work location. When in doubt, our technical team can recommend the appropriate class based on your substation or panel specifications.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],

  /* ── Coloured Strip Insulating Mats ── */
  'coloured-strip-insulating-mats': [
    {
      question: 'What standards do Coloured Strip Insulating Mats comply with?',
      answer:
        'Our electrical insulating mats are manufactured to IS 15652:2006 under BIS Licence CM/L:8800129617. Available supporting documents include ERDA and NTH test reports. Request the current document set for the exact product and thickness required.',
    },
    {
      question: 'What colour options are available for the strip configuration?',
      answer:
        'The standard strip configuration uses a vivid yellow marking on a black insulating base, providing clear visual cues around electrical panels and machinery. All variants retain the same IS 15652:2006 insulation performance.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],

  /* ── Bi-Color Insulating Mats ── */
  'bi-color-insulating-mats': [
    {
      question: 'What standards do Bi-Color Insulating Mats comply with?',
      answer:
        'Our electrical insulating mats are manufactured to IS 15652:2006 under BIS Licence CM/L:8800129617. Available supporting documents include ERDA and NTH test reports. Request the current document set for the exact product and thickness required.',
    },
    {
      question: 'What is the purpose of the dual-tone design?',
      answer:
        'The dual-tone colour scheme serves as a clear indicator of safety boundaries in the workspace. The contrasting colours make hazard zones and restricted areas immediately visible, supporting safe navigation around electrical installations.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],

  /* ── Auto-Glow / Reflective Band Insulating Mats ── */
  'auto-glow-reflective-band-insulating-mats': [
    {
      question: 'What standards do Auto-Glow Insulating Mats comply with?',
      answer:
        'Our electrical insulating mats are manufactured to IS 15652:2006 under BIS Licence CM/L:8800129617. Available supporting documents include ERDA and NTH test reports. Request the current document set for the exact product and thickness required.',
    },
    {
      question: 'What is the difference between the auto-glow and reflective variants?',
      answer:
        'The auto-glow variant carries a band that is visible in low ambient light after exposure to normal lighting. The reflective variant returns light from incident sources such as torches or emergency lamps. Specific glow duration, brightness and performance figures are confirmed against the current product documentation, which is available on request. The band is a visibility aid and does not provide emergency lighting.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],

  /* ── Geo Membrane Lining (civil — NO IS 15652 / no BIS mat licence) ── */
  'bharat-membrane': [
    {
      question: 'What standard does Geo Membrane Lining comply with?',
      answer:
        'Geo Membrane Lining is presented for applications covered by IS 15909:2020. Request the current product documentation for the exact membrane grade and project approval requirements.',
    },
    {
      question: 'Can Geo Membrane Lining be used in below-grade and underwater applications?',
      answer:
        'Geo Membrane Lining is used in below-grade waterproofing including basements, foundations, tunnel linings and other submerged or earth-retained structures. Thicker grades are recommended for higher hydrostatic pressure and continuous water exposure. Confirm the appropriate grade with the technical team for the specific project conditions.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],

  /* ── Water Stop Seal (civil — NO IS 15652 / no BIS mat licence) ── */
  'bharat-hydro-seal': [
    {
      question: 'What are PVC water stops and where are they used?',
      answer:
        'Water Stop Seal is a PVC water-stop product for concrete construction and expansion joints. The product information references IS 15058:2002. Request the current product and compliance documents required for your project.',
    },
    {
      question: 'What profiles are available for Water Stop Seal?',
      answer:
        'Profiles are available in centre-bulb, dumbbell and ribbed configurations to suit different joint types and movement requirements. Profile selection depends on the joint type, expected movement, water pressure and project specification. Intersections and terminations require an appropriate joining method to form a continuous system.',
    },
    {
      question: 'What dimensions are available?',
      answer:
        'Standard and custom dimensions are available. Contact our team with your specific requirements for a tailored solution.',
    },
    {
      question: 'How do I request a quotation?',
      answer:
        'Use our contact form, call our sales team, or send a WhatsApp message with your requirements including product, dimensions, quantity and delivery location.',
    },
    {
      question: 'What is the lead time?',
      answer:
        'Lead time varies based on product and quantity. Standard products ship faster; custom dimensions require additional production time. Timelines are confirmed with each quotation.',
    },
  ],
};

/* Lookup helper — used by product page routes and ProductFAQ. */

export function getProductFaqs(product: ProductData): SiteFAQ[] {
  return productFaqsBySlug[product.slug] ?? [];
}
