/**
 * IEC 61111:2009 International Product Data — Bharat Electrosafe
 *
 * Single source of truth for all IEC 61111:2009 technical data used
 * across the international product page. Every value is taken directly
 * from the official Bharat Electrosafe IEC 61111 brochure.
 */

/* ────────────────────────────────────────────
   IEC 61111:2009 Class specification data
   ──────────────────────────────────────────── */

export interface IECClass {
  productCode: string;
  classLabel: string;
  thickness: string;
  maxWorkingVoltage: string;
  acProofVoltage: string;
  dielectricStrength: string;
  approxWeight: string;
}

export const iecClasses: IECClass[] = [
  {
    productCode: 'BES 001',
    classLabel: 'Class 0',
    thickness: '2.0 mm',
    maxWorkingVoltage: '1.0 kV',
    acProofVoltage: '5.0 kV',
    dielectricStrength: '10.0 kV',
    approxWeight: '3.2 kg/m²',
  },
  {
    productCode: 'BES 002',
    classLabel: 'Class 1',
    thickness: '2.0 mm',
    maxWorkingVoltage: '7.5 kV',
    acProofVoltage: '10.0 kV',
    dielectricStrength: '20.0 kV',
    approxWeight: '3.2 kg/m²',
  },
  {
    productCode: 'BES 003',
    classLabel: 'Class 2',
    thickness: '3.0 mm',
    maxWorkingVoltage: '17.0 kV',
    acProofVoltage: '20.0 kV',
    dielectricStrength: '30.0 kV',
    approxWeight: '4.8 kg/m²',
  },
  {
    productCode: 'BES 004',
    classLabel: 'Class 3',
    thickness: '4.0 mm',
    maxWorkingVoltage: '26.5 kV',
    acProofVoltage: '30.0 kV',
    dielectricStrength: '40.0 kV',
    approxWeight: '4.8 kg/m²',
  },
  {
    productCode: 'BES 005',
    classLabel: 'Class 4',
    thickness: '5.2 mm',
    maxWorkingVoltage: '36.0 kV',
    acProofVoltage: '40.0 kV',
    dielectricStrength: '50.0 kV',
    approxWeight: '6.4 kg/m²',
  },
];

/* ────────────────────────────────────────────
   NOTE ON "SPECIAL VARIANTS" (removed):
   Earlier drafts carried "BES RB 001 / BES RB 002 / BES CD"
   ribbed/custom variant rows. The client's verify-or-remove rule
   requires every product code to be traceable to approved source
   material. Those variant codes are NOT present in the client-supplied
   "BharatElectrosafe- All Products" brochure (IEC 61111 Technical
   Specifications page lists BES 001–005 only), so they were removed
   from all client-facing UI rather than published as unverifiable fact.
   ──────────────────────────────────────────── */

/* ────────────────────────────────────────────
   IEC 61111:2009 Bi-Colour (Dual Layer) — class-specific data
   ────────────────────────────────────────────

   Source: client-supplied "2023 - Raychem RPG - Electrical Safety
   Protection" catalogue, pages 19 (Class 0) and 20 (Classes 1–4).
   Visually verified against the rendered PDF — not OCR-only.

   IMPORTANT — these values are Bi-Colour (Dual Layer) ONLY.
   They MUST NOT be merged into the HV `iecClasses` table above,
   which uses different thickness/weight values and an additional
   proof/dielectric column that the Bi-Colour source does NOT
   publish.

   Per the verify-or-remove rule, the Bi-Colour table contains
   ONLY the columns the source provides:
     - Thickness
     - Width
     - Length
     - Maximum Use Voltage AC
     - Maximum Use Voltage DC
     - Weight (per width × length combination)

   Proof voltage, dielectric strength and withstand voltage are
   intentionally ABSENT — the Bi-Colour source pages do not
   publish them for this product. Do NOT backfill them from the
   HV table, from IS 15652:2006, or from memory.
   ──────────────────────────────────────────── */

export interface IECBiColourWeightRow {
  /** Roll length in metres. */
  length: string;
  /** Weight for the 1.0 m width variant, in kg. */
  weight1m: string;
  /** Weight for the 1.2 m width variant, in kg. */
  weight1_2m: string;
}

export interface IECBiColourClass {
  classLabel: string;
  thickness: string;
  /** Maximum use voltage, AC. */
  maxUseVoltageAC: string;
  /** Maximum use voltage, DC. */
  maxUseVoltageDC: string;
  /** Available roll widths (metres). */
  widths: string[];
  /** Available roll lengths (metres). */
  lengths: string[];
  /** Weight per width × length combination, source-verified. */
  weights: IECBiColourWeightRow[];
}

export const iecBiColourClasses: IECBiColourClass[] = [
  {
    classLabel: 'Class 0',
    thickness: '2.2 mm',
    maxUseVoltageAC: '1000 V',
    maxUseVoltageDC: '1500 V',
    widths: ['1.0 Meter', '1.2 Meter'],
    lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
    weights: [
      { length: '1 Meter', weight1m: '3.40 kg', weight1_2m: '4.00 kg' },
      { length: '2 Meter', weight1m: '6.80 kg', weight1_2m: '8.00 kg' },
      { length: '5 Meter', weight1m: '17.00 kg', weight1_2m: '20.50 kg' },
      { length: '10 Meter', weight1m: '34.00 kg', weight1_2m: '41.00 kg' },
    ],
  },
  {
    classLabel: 'Class 1',
    thickness: '2.3 mm',
    maxUseVoltageAC: '7500 V',
    maxUseVoltageDC: '11250 V',
    widths: ['1.0 Meter', '1.2 Meter'],
    lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
    weights: [
      { length: '1 Meter', weight1m: '3.50 kg', weight1_2m: '4.20 kg' },
      { length: '2 Meter', weight1m: '7.00 kg', weight1_2m: '8.50 kg' },
      { length: '5 Meter', weight1m: '17.80 kg', weight1_2m: '21.30 kg' },
      { length: '10 Meter', weight1m: '35.60 kg', weight1_2m: '42.80 kg' },
    ],
  },
  {
    classLabel: 'Class 2',
    thickness: '2.6 mm',
    maxUseVoltageAC: '17000 V',
    maxUseVoltageDC: '27500 V',
    widths: ['1.0 Meter', '1.2 Meter'],
    lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
    weights: [
      { length: '1 Meter', weight1m: '4.00 kg', weight1_2m: '4.80 kg' },
      { length: '2 Meter', weight1m: '8.00 kg', weight1_2m: '9.60 kg' },
      { length: '5 Meter', weight1m: '20.00 kg', weight1_2m: '24.00 kg' },
      { length: '10 Meter', weight1m: '40.00 kg', weight1_2m: '48.00 kg' },
    ],
  },
  {
    classLabel: 'Class 3',
    thickness: '3.3 mm',
    maxUseVoltageAC: '26500 V',
    maxUseVoltageDC: '39750 V',
    widths: ['1.0 Meter', '1.2 Meter'],
    lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
    weights: [
      { length: '1 Meter', weight1m: '5.10 kg', weight1_2m: '6.10 kg' },
      { length: '2 Meter', weight1m: '10.20 kg', weight1_2m: '12.30 kg' },
      { length: '5 Meter', weight1m: '25.60 kg', weight1_2m: '30.70 kg' },
      { length: '10 Meter', weight1m: '51.20 kg', weight1_2m: '61.40 kg' },
    ],
  },
  {
    classLabel: 'Class 4',
    thickness: '5.2 mm',
    maxUseVoltageAC: '36000 V',
    maxUseVoltageDC: '54000 V',
    widths: ['1.0 Meter', '1.2 Meter'],
    lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
    weights: [
      { length: '1 Meter', weight1m: '8.00 kg', weight1_2m: '9.60 kg' },
      { length: '2 Meter', weight1m: '16.00 kg', weight1_2m: '19.30 kg' },
      { length: '5 Meter', weight1m: '40.00 kg', weight1_2m: '48.00 kg' },
      { length: '10 Meter', weight1m: '80.00 kg', weight1_2m: '96.70 kg' },
    ],
  },
];

/* ────────────────────────────────────────────
   Bi-Colour (Dual Layer) — product-level specification
   ────────────────────────────────────────────

   Source: client-supplied catalogue page 19.
   - Standard: IEC 61111:2009
   - Finish: Fabric
   - Source-listed colour: Black / Orange
   - CLIENT'S CURRENT APPROVED PRODUCT DIRECTION: Black / Yellow
     (overrides the source-listed colourway for the active product
     presentation only — does NOT change the website's brand
     orange/yellow accent colours and does NOT change the domestic
     Bi-Colour product).

   The two-colour construction serves as a mechanical damage
   indication: when the upper layer is worn or damaged enough to
   expose the contrasting lower layer, this provides a visible
   cue to inspect and replace the mat. The source describes an
   indication/cue — NOT an automatic damage-detection guarantee.
   ──────────────────────────────────────────── */

export const iecBiColourProductSpec = {
  standard: 'IEC 61111:2009',
  productName: 'Electrical Insulating Rubber Matting',
  finish: 'Fabric Finish',
  /** Active client-approved product colourway. */
  colourway: 'Black / Yellow',
  /** Source-listed (legacy) colourway — not published as the active colour. */
  sourceListedColourway: 'Black / Orange',
  widths: ['1.0 Meter', '1.2 Meter'],
  lengths: ['1 Meter', '2 Meter', '5 Meter', '10 Meter'],
  /** Summary thickness range across all classes (client-approved summary). */
  thicknessRange: '2.0–5.2 mm',
  /** Two-colour construction purpose, per source. */
  dualLayerFunction:
    'The two colours serve as a mechanical damage indication and provide a cue to replace the mat when the colour change becomes visible on the surface.',
} as const;

/* ────────────────────────────────────────────
   Applications
   ──────────────────────────────────────────── */

export const iecApplications: string[] = [
  'Electrical Substations',
  'Power Plants',
  'High Voltage Rooms',
  'Switchgear Rooms',
  'Control Panels',
  'Data Centers',
  'Battery Rooms',
  'Transformer Stations',
  'Electrical Laboratories',
  'Railway Electrification Systems',
];

/* ────────────────────────────────────────────
   Material & Performance Characteristics
   ──────────────────────────────────────────── */

export const iecMaterialCharacteristics = {
  material: 'Elastomer-free; combination of natural rubber and synthetic polymers with anti-slip surface.',
  mechanicalPunctureResistance: '70 N minimum',
  slipResistance: '50 N minimum',
  ageing:
    'Mechanical puncture resistance not less than 80% of original value after 168 hours at 70 ± 2°C',
  lowTemperatureBehaviour:
    'No visible tear, crack, or break at approximately −25 ± 3°C',
  acidResistance: 'Mechanical test values not less than 75% of original value',
  oilResistance: 'Mechanical test values not less than 75% of original value',
  workingTemperature: '−25°C to 55°C',
  flame: 'Material does not catch fire',
} as const;

/* ────────────────────────────────────────────
   Dimensions
   ──────────────────────────────────────────── */

export const iecDimensions = {
  standardSizes: ['1.0 m × 10.0 m', '1.2 m × 10.0 m'],
  custom: 'Width × length as per customer requirement',
  standardColour: 'Blue OR Black',
  biColour: 'Black / Yellow',
  finish: 'Fabric Finish',
  customizationNote: 'Custom colours available on request.',
} as const;

/* ────────────────────────────────────────────
   Safety Precautions
   ──────────────────────────────────────────── */

export const iecSafetyPrecautions: string[] = [
  'Carry out regular visual inspection of mats before use.',
  'Remove any damaged or worn mats from service immediately.',
  'Select the correct voltage class for the working environment.',
  'Ensure complete work-area coverage so the operator is fully protected.',
  'Position mats correctly around the live equipment.',
  'Avoid overlapping adjacent mats — edges can create trip and insulation gaps.',
  'Keep the mat surface clean and free of conductive contamination.',
  'Avoid contact with sharp objects that can puncture the insulating compound.',
  'Use appropriate personal protective equipment alongside the mat.',
  'Follow the manufacturer\u2019s installation and use instructions.',
  'Ensure personnel are trained in correct mat selection and use.',
];

/* ────────────────────────────────────────────
   Installation Steps
   ──────────────────────────────────────────── */

export const iecInstallationSteps: string[] = [
  'Clean the installation area thoroughly before placement.',
  'Position the mat over the required work area around live equipment.',
  'Ensure complete coverage and correct placement for operator protection.',
  'Mats are designed to remain in position through their own weight and surface friction; adhesive or tape is not required.',
];

/* ────────────────────────────────────────────
   FAQ — 10 questions per spec
   ──────────────────────────────────────────── */

export const iecFaqItems: { q: string; a: string }[] = [
  {
    q: 'What is IEC 61111:2009?',
    a: 'IEC 61111:2009 is the international standard specifying requirements for insulating mats used for live working on electrical installations. It covers classification, construction, marking, testing, and dimensions for mats that protect operators from electric shock at voltages up to 36,000 V AC.',
  },
  {
    q: 'What are the IEC 61111 classes?',
    a: 'IEC 61111:2009 defines five classes — Class 0 through Class 4 — based on maximum working voltage. Each class has a corresponding proof test voltage and dielectric strength that the mat must withstand during type and routine testing.',
  },
  {
    q: 'What is the maximum working voltage for each class?',
    a: 'Class 0: 1.0 kV, Class 1: 7.5 kV, Class 2: 17.0 kV, Class 3: 26.5 kV, Class 4: 36.0 kV. These are the maximum AC working voltages per IEC 61111:2009 Table 1.',
  },
  {
    q: 'How does thickness relate to class?',
    a: 'Recommended thickness increases with class: Class 0 and 1 require 2.0 mm, Class 2 requires 3.0 mm, Class 3 requires 4.0 mm, and Class 4 requires 5.2 mm. Maximum allowed thickness also varies by class. Confirm against the manufacturer\u2019s type-test documentation for the specific product.',
  },
  {
    q: 'What properties matter besides electrical insulation?',
    a: 'Beyond voltage class, consider mechanical puncture resistance (70 N minimum), slip resistance (50 N minimum), ageing behaviour, low-temperature flexibility (−25 ± 3°C), acid and oil resistance, and flame resistance. These are specified in the standard and should be confirmed against type-test documentation.',
  },
  {
    q: 'What are the standard mat sizes?',
    a: 'Standard sizes are 1.0 m × 10.0 m and 1.2 m × 10.0 m. Custom dimensions can be supplied according to customer requirements. The standard colour is black, without metallic derivatives.',
  },
  {
    q: 'Can custom sizes be supplied?',
    a: 'Yes. Custom widths and lengths can be manufactured according to customer requirements. Contact Bharat Electrosafe with the specific dimensions and voltage class needed for your installation.',
  },
  {
    q: 'What is the difference between IEC 61111 and ASTM D178?',
    a: 'IEC 61111:2009 is the international standard used in IEC-member markets; ASTM D178 is the North American standard for rubber insulating blankets and mats. They use different classification systems, test methods, and material terminology. A mat certified to one standard is not automatically certified to the other.',
  },
  {
    q: 'What documentation is supplied?',
    a: 'Test certificate supplied with every supply, confirming the mat meets the type-test requirements of IEC 61111:2009 for the designated class.',
  },
  {
    q: 'Which IEC class should I choose?',
    a: 'Class selection should be based on the maximum working voltage and the requirements of the installation. Contact Bharat Electrosafe for technical guidance.',
  },
];

/* ────────────────────────────────────────────
   ASTM D178 Comparison — neutral statement
   ──────────────────────────────────────────── */

export const iecAstmComparison = {
  title: 'IEC 61111:2009 and ASTM D178',
  statement:
    'IEC 61111:2009 and ASTM D178 are different electrical-insulating-material standards with different classification and testing frameworks. The appropriate standard depends on the market, regulatory framework, and installation requirements. A mat certified to one standard is not automatically certified to the other.',
  guidance:
    'For project-specific requirements, contact Bharat Electrosafe for technical guidance.',
} as const;

/* ────────────────────────────────────────────
   Brochure-Supported Claims
   ──────────────────────────────────────────── */

export const iecBrochureClaims = {
  testCertificate: 'Test certificate supplied with every supply.',
  labTesting: 'Tested in accredited and internationally recognized laboratories.',
  marking: 'Product name marking provided on the mat.',
  antiSlip: 'Anti-slip surface with 50 N minimum slip resistance.',
  positioning: 'International / Global IEC 61111:2009 insulating mats for international and global applications.',
  warranty: 'High-end quality at competitive pricing, backed by a 1-year warranty with every supply.',
  resistance: [
    'Flame',
    'Mild acid & alkali',
    'Oil & water',
    'Moisture',
  ],
} as const;

