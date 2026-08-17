/**
 * Verified trust content — Bharat Electrosafe.
 *
 * Single source of truth for every credibility claim on the site, together
 * with the local path to the asset that evidences it.
 *
 * Rules this file exists to enforce:
 *
 *  - Nothing is stated more strongly than bharatelectrosafe.com states it.
 *    The source site uses "ERDA approved" in one place and "ERDA / NTH
 *    tested" in another; the conservative wording is used throughout, because
 *    no approval document has been supplied that would justify the stronger
 *    claim.
 *  - A logo is evidence that a mark exists, not that every product carries
 *    every claim. Marks without a released document get a label and no
 *    download control — never an invented certificate number or expiry.
 *  - No testimonials, order values, project descriptions, factory areas,
 *    capacities or headcounts appear anywhere. None are published by the
 *    source.
 */

import { productGroupCount } from './products';

/* ────────────────────────────────────────────
   Standards and licences
   ──────────────────────────────────────────── */

export const standards = {
  /** Insulating mats are manufactured for these requirements. */
  isMat: 'IS 15652:2006',
  /** BIS licence number, printed on the source product pages. */
  bisLicence: 'CM/L:8800129617',
  /** The mat range is marked against this IEC standard — referenced, not certified to. */
  iec: 'IEC 61111',
  /** Geo-membrane standard. */
  isMembrane: 'IS 15909:2020',
} as const;

/**
 * Short factual lines safe to render anywhere — hero trust row, product
 * badges, footer. Deliberately terse and deliberately unembellished.
 */
export const trustLines: string[] = [
  `BIS Licence ${standards.bisLicence}`,
  `Manufactured for ${standards.isMat} requirements`,
  'ERDA tested',
  `${standards.iec}:2009 international range`,
];

/* ────────────────────────────────────────────
   Certifications, testing and registrations
   ──────────────────────────────────────────── */

export interface TrustMark {
  /** Accurate, specific label. Never the generic word "Certificate". */
  label: string;
  /** One line explaining what the mark actually is. */
  note: string;
  logo: string;
  alt: string;
  /** Local PDF, when the client has released one. Opens in a new tab. */
  document?: string;
}

/**
 * The compact rail shown on the homepage — six marks, each labelled for what
 * it is rather than lumped together as "certificates".
 */
export const primaryTrustMarks: TrustMark[] = [
  {
    label: 'BIS licence',
    note: `Licence ${standards.bisLicence} against ${standards.isMat}`,
    logo: '/media/certifications/bis.webp',
    alt: 'Bureau of Indian Standards mark',
  },
  {
    label: 'ISI mark',
    note: 'ISI marking applied to the insulating mat range',
    logo: '/media/certifications/isi.webp',
    alt: 'ISI standard mark',
  },
  {
    label: 'ERDA testing — 2.0 mm',
    note: 'Insulating mats tested through ERDA — 2.0 mm thickness',
    logo: '/media/certifications/erda.webp',
    alt: 'Electrical Research and Development Association mark',
    document: '/documents/certifications/erda-test-report-2mm.pdf',
  },
  {
    label: 'ERDA testing — 2.5 mm',
    note: 'Insulating mats tested through ERDA — 2.5 mm thickness',
    logo: '/media/certifications/erda.webp',
    alt: 'Electrical Research and Development Association mark',
    document: '/documents/certifications/erda-test-report-2-5mm.pdf',
  },
  {
    label: 'ERDA testing — 3.0 mm',
    note: 'Insulating mats tested through ERDA — 3.0 mm thickness',
    logo: '/media/certifications/erda.webp',
    alt: 'Electrical Research and Development Association mark',
  },
  {
    label: 'NTH testing',
    note: 'National Test House testing referenced by the company',
    logo: '/media/certifications/nth.webp',
    alt: 'National Test House mark',
  },
  {
    label: 'ISO 9001:2015',
    note: 'Quality Management System certification',
    logo: '/media/certifications/iso.webp',
    alt: 'ISO 9001 certification mark',
    document: '/documents/certifications/iso-9001-2015-qms.pdf',
  },
  {
    label: 'CE mark',
    note: 'CE conformity marking referenced by the company',
    logo: '/media/certifications/ce.webp',
    alt: 'CE conformity mark',
  },
];

/**
 * The full set shown on the About page. Same marks as the source site's
 * "Industry Certifications and Memberships" rail, plus the registrations it
 * lists alongside them.
 */
export const allTrustMarks: TrustMark[] = [
  ...primaryTrustMarks,
  {
    label: 'ISO 14001:2015',
    note: 'Environmental Management System certification',
    logo: '/media/certifications/iso-1400.webp',
    alt: 'ISO 14001 certification mark',
    document: '/documents/certifications/iso-14001-2015-ems.pdf',
  },
  {
    label: 'ISO 45001:2018',
    note: 'Occupational Health and Safety Management System certification',
    logo: '/media/certifications/iso-4500.webp',
    alt: 'ISO 45001 certification mark',
    document: '/documents/certifications/iso-45001-2018-ohsms.pdf',
  },
  {
    label: 'MSME registration',
    note: 'Registered under the Ministry of Micro, Small and Medium Enterprises',
    logo: '/media/certifications/msme.webp',
    alt: 'MSME registration mark',
  },
  {
    label: 'Startup India recognition',
    note: 'Recognised under the Startup India initiative',
    logo: '/media/certifications/startupindia.webp',
    alt: 'Startup India recognition mark',
    document: '/documents/certifications/startup-india-recognition.pdf',
  },
  {
    label: 'ZED Bronze',
    note: 'Zero Defect Zero Effect (ZED) Bronze certification',
    logo: '/media/certifications/zed.webp',
    alt: 'ZED Bronze certification mark',
    document: '/documents/certifications/zed-bronze-certificate.pdf',
  },
  {
    label: 'AIRIA membership',
    note: 'Member of the All India Rubber Industries Association',
    logo: '/media/certifications/airia.webp',
    alt: 'All India Rubber Industries Association mark',
  },
  {
    label: 'NABL',
    note: 'National Accreditation Board for Testing and Calibration Laboratories',
    logo: '/media/certifications/nabl.webp',
    alt: 'NABL accreditation mark',
  },
  {
    label: 'ACL Certification',
    note: 'Certificate of Compliance ACL25053002 — Accura Certification Limited — Expired 29 May 2026',
    logo: '/media/certifications/acl.webp',
    alt: 'ACL certification mark',
  },
];

/* ────────────────────────────────────────────
   Awards
   ──────────────────────────────────────────── */

export interface Award {
  title: string;
  presenter: string;
  detail: string;
  image: string;
  alt: string;
  /** Plaques are contained so the engraved text is never cropped; event
   *  photographs fill their frame. */
  fit?: 'cover' | 'contain';
}

/**
 * Recognition the company can evidence. Titles are verbatim from the award
 * itself — nothing is upgraded in wording.
 *
 * The third entry is an exhibitor appreciation, not a competitive award, and
 * is described as one. Two further items are legible only inside the grouped
 * trophy photograph (India Rubber & Tyre Show 2025 bronze sponsor, 12th India
 * Industrial Fair 2025 exhibitor); with no standalone image of either they are
 * left out rather than illustrated with a crop.
 */
/**
 * Recognition the company can evidence — five client-supplied images
 * from the 2026-08-14 update bundle.
 */
export const awards: Award[] = [
  {
    title: 'Bharat Electrosafe recognition portfolio',
    presenter: 'Client-supplied recognition collection',
    detail:
      'A grouped photograph of Bharat Electrosafe awards and industry-event recognitions.',
    image: '/media/awards/client-2026-08-14/awards-1.jpeg',
    alt: 'Grouped photograph of Bharat Electrosafe awards and industry-event recognitions',
    fit: 'contain',
  },
  {
    title: 'Bronze Sponsor recognition — India Rubber & Tyre Show 2025',
    presenter: 'Rubber Manufacturers Welfare Association',
    detail:
      'Presented to Bharat Electrosafe Pvt. Ltd. in recognition of support as Bronze Sponsor.',
    image: '/media/awards/client-2026-08-14/awards-2.jpeg',
    alt: 'Bronze Sponsor recognition at India Rubber and Tyre Show 2025',
    fit: 'contain',
  },
  {
    title: 'Exhibitor appreciation — PlastIndia 2026',
    presenter: 'PlastIndia Foundation',
    detail:
      'Presented to Bharat Electrosafe Pvt. Ltd. for participation as an exhibitor at PlastIndia 2026, Bharat Mandapam, New Delhi.',
    image: '/media/awards/client-2026-08-14/awards-3.jpeg',
    alt: 'PlastIndia Foundation plaque presented to Bharatelectrosafe Pvt. Ltd. for exhibiting at PlastIndia 2026',
    fit: 'contain',
  },
  {
    title: 'Young Entrepreneur with Emerging Start-Up',
    presenter: 'Times Power Icons Awards, presented by the Times Group',
    detail:
      'Recognition associated with Bharat Electrosafe\'s leadership and entrepreneurial journey.',
    image: '/media/awards/client-2026-08-14/awards-4.jpeg',
    alt: 'Young Entrepreneur with Emerging Start-Up award at Times Power Icons Awards',
    fit: 'contain',
  },
  {
    title: 'Emerging Business in India',
    presenter: 'Make in India Conclave, organised by ABP News',
    detail:
      'Received by Co-Founder & Director Vishnu Gupta; the company\'s published source states it was presented by Shri Chirag Paswan, Honourable Cabinet Minister.',
    image: '/media/awards/client-2026-08-14/awards-5.jpeg',
    alt: 'Vishnu Gupta receiving the Emerging Business in India award at the Make in India Conclave',
    fit: 'contain',
  },
];

/* ────────────────────────────────────────────
   Organisation references
   ──────────────────────────────────────────── */

export interface OrganisationLogo {
  name: string;
  logo: string;
}

/**
 * Presented as references, not as confirmed direct customers — the source
 * site shows these logos but publishes nothing that establishes the nature of
 * each relationship.
 */
export const organisationReferences: OrganisationLogo[] = [
  { name: 'NTPC', logo: '/media/clients/ntpc.webp' },
  { name: 'BHEL', logo: '/media/clients/bhel.webp' },
  { name: 'ONGC', logo: '/media/clients/ongc.webp' },
  { name: 'Power Grid', logo: '/media/clients/power-grid.webp' },
  { name: 'JK Tyre', logo: '/media/clients/jk-tyre.webp' },
  { name: 'PTCUL', logo: '/media/clients/ptcul.webp' },
  { name: 'Indian Oil', logo: '/media/clients/indian-oil.webp' },
  { name: 'SAIL', logo: '/media/clients/sail.webp' },
  { name: 'Reliance Industries Limited', logo: '/media/clients/reliance.webp' },
];

export const organisationReferenceHeading = 'Industry references';
/** Eyebrow shown above the section heading. */
export const organisationReferenceEyebrow = 'INDUSTRY REFERENCES';
/** Section heading — client-approved marketing wording. */
export const organisationReferenceTitle =
  'Chosen by Industry Leaders and Top Professionals';
export const organisationReferenceNote =
  'Trusted by renowned brands worldwide for consistent quality, reliability, and performance.';
/** Compact CTA label for the About Us link. */
export const organisationReferenceCtaLabel = 'View awards and leadership';

/* ────────────────────────────────────────────
   Company scale
   ──────────────────────────────────────────── */

/**
 * Wording is fixed to the source About page. "Customers stated by the
 * company" is not clumsiness — it is the qualifier that keeps a company
 * self-statement from reading as an independently verified figure.
 *
 * `shortLabel` is the compact label used inside the homepage statistic cards
 * — the "company-stated" qualifier is moved to a footnote so the cards stay
 * scannable without losing the conservative wording.
 */
export const scaleFacts = [
  {
    value: '11+',
    label: 'Countries served (company-stated)',
    shortLabel: 'Countries served',
    companyStated: true,
  },
  {
    value: '1,000+',
    label: 'Customers stated by the company',
    shortLabel: 'Customers',
    companyStated: true,
  },
  {
    value: String(productGroupCount),
    label: 'Product groups',
    shortLabel: 'Product groups',
    companyStated: false,
  },
] as const;

/* ────────────────────────────────────────────
   Homepage statistics strip
   ──────────────────────────────────────────── */

/**
 * Icon key maps to a Lucide icon in the StatisticsStrip component.
 * - globe  → Globe
 * - users  → Users
 * - grid   → LayoutGrid
 * - shield → ShieldCheck
 */
export type StatIconKey = 'globe' | 'users' | 'grid' | 'shield' | 'briefcase' | 'award';

export interface CompanyStatistic {
  /** Large display value (e.g. "11+", "1,000+"). */
  value: string;
  /** Compact label for the homepage strip card. */
  label: string;
  /** Icon key resolved to a Lucide icon in the component. */
  icon: StatIconKey;
  /** True if the figure is company-stated rather than independently audited. */
  companyStated: boolean;
}

/**
 * Homepage credibility strip — four statistics.
 *
 * Client-supplied company-stated figures as of 2026-08-14 update.
 * These are NOT independently audited. The `companyStated` flag is
 * preserved in data but not rendered on the compact homepage cards;
 * a subtle footnote appears below the strip.
 */
export const companyStatistics: CompanyStatistic[] = [
  {
    value: '1,070',
    label: 'Happy Customers Served',
    icon: 'users',
    companyStated: true,
  },
  {
    value: '11',
    label: 'Countries Served',
    icon: 'globe',
    companyStated: true,
  },
  {
    value: '5',
    label: 'Years of Work',
    icon: 'briefcase',
    companyStated: true,
  },
  {
    value: '712',
    label: 'Successful Projects',
    icon: 'award',
    companyStated: true,
  },
];

/* ────────────────────────────────────────────
   Manufacturing and capability
   ──────────────────────────────────────────── */

/**
 * Six capability points covering all major product families.
 * Updated 2026-08-14 to broaden beyond insulating mats per client directive.
 */
export const capabilityPoints = [
  {
    title: 'Electrical insulating mat manufacturing',
    description:
      'An integrated production setup running from compound manufacturing through to finished insulating mats, with domestic and international product configurations.',
  },
  {
    title: 'Geo Membrane Lining',
    description:
      'PVC geo-membrane solutions for tunnel waterproofing, containment, lining and environmental protection applications, referenced to IS 15909:2020.',
  },
  {
    title: 'Water Stop Seal',
    description:
      'Water-stop profiles for concrete construction and expansion joints, referenced to IS 15058:2002.',
  },
  {
    title: 'PVC Flooring',
    description:
      'BharatSmart Floor™ PVC flooring for residential, office and commercial interiors as per IS 3462:1986.',
  },
  {
    title: 'Other industrial products',
    description:
      'Rubber Sheets, Rubber Hose Pipes, ESD Mats and Conveyor Belts for industrial rubber and safety requirements.',
  },
  {
    title: 'Testing, documentation and project support',
    description:
      'BIS licence and ERDA/NTH testing are referenced for the insulating-mat range, with product documentation and enquiry support provided where available.',
  },
] as const;

/** Sectors the source About page names. */
export const industriesServed = [
  'Power utilities',
  'Railways',
  'Oil and gas',
  'Construction',
  'Infrastructure',
  'Heavy industry',
] as const;

/** Manufacturing collaboration — placeholder only; not rendered on public pages.
 *  Tata Precision branding removed per client directive. */
export const manufacturingCollaboration = {
  partner: '',
  statement: '',
  logo: '',
  alt: '',
};

export const manufacturingImage = {
  src: '/media/manufacturing/production-line.webp',
  alt: 'Insulating mat production line inside the Bharat Electrosafe manufacturing setup',
};

/* ────────────────────────────────────────────
   Company statistics — restored
   ────────────────────────────────────────────
   The CompanyStatistic type and companyStatistics array are
   defined above (line ~330). They power the homepage credibility
   strip with defensible, company-stated figures. */

