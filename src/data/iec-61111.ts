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
  maxThicknessAllowed: string;
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
    maxThicknessAllowed: '6.0 mm',
    maxWorkingVoltage: '1.0 kV',
    acProofVoltage: '5.0 kV',
    dielectricStrength: '10.0 kV',
    approxWeight: '3.2 kg/m²',
  },
  {
    productCode: 'BES 002',
    classLabel: 'Class 1',
    thickness: '2.0 mm',
    maxThicknessAllowed: '6.0 mm',
    maxWorkingVoltage: '7.5 kV',
    acProofVoltage: '10.0 kV',
    dielectricStrength: '20.0 kV',
    approxWeight: '3.2 kg/m²',
  },
  {
    productCode: 'BES 003',
    classLabel: 'Class 2',
    thickness: '3.0 mm',
    maxThicknessAllowed: '8.0 mm',
    maxWorkingVoltage: '17.0 kV',
    acProofVoltage: '20.0 kV',
    dielectricStrength: '30.0 kV',
    approxWeight: '4.8 kg/m²',
  },
  {
    productCode: 'BES 004',
    classLabel: 'Class 3',
    thickness: '3.0 mm',
    maxThicknessAllowed: '11.0 mm',
    maxWorkingVoltage: '26.5 kV',
    acProofVoltage: '30.0 kV',
    dielectricStrength: '40.0 kV',
    approxWeight: '4.8 kg/m²',
  },
  {
    productCode: 'BES 005',
    classLabel: 'Class 4',
    thickness: '4.0 mm',
    maxThicknessAllowed: '14.0 mm',
    maxWorkingVoltage: '36.0 kV',
    acProofVoltage: '40.0 kV',
    dielectricStrength: '50.0 kV',
    approxWeight: '6.4 kg/m²',
  },
];

/* ────────────────────────────────────────────
   Special Ribbed Variants
   ──────────────────────────────────────────── */

export interface IECSpecialVariant {
  modelCode: string;
  description: string;
  classRange: string;
  thickness: string;
  maxThicknessAllowed: string;
  maxWorkingVoltage: string;
  proofVoltage: string;
  dielectricStrength: string;
  approxWeight: string;
}

export const iecSpecialVariants: IECSpecialVariant[] = [
  {
    modelCode: 'BES RB 001',
    description: 'Fine ribbed top surface with textured bottom surface',
    classRange: 'Class 0–2',
    thickness: '3.0 mm',
    maxThicknessAllowed: '8.0 mm',
    maxWorkingVoltage: '17.0 kV',
    proofVoltage: '20.0 kV',
    dielectricStrength: '30.0 kV',
    approxWeight: '4.5 kg/m²',
  },
  {
    modelCode: 'BES RB 002',
    description: 'Fine ribbed top surface with textured bottom surface',
    classRange: 'Class 3–4',
    thickness: '5.0 mm',
    maxThicknessAllowed: '14.0 mm',
    maxWorkingVoltage: '36.0 kV',
    proofVoltage: '40.0 kV',
    dielectricStrength: '50.0 kV',
    approxWeight: '7.5 kg/m²',
  },
  {
    modelCode: 'BES CD',
    description: 'Custom specification',
    classRange: '—',
    thickness: 'Up to 2.0 mm',
    maxThicknessAllowed: 'Up to 14.0 mm',
    maxWorkingVoltage: 'Up to 36.0 kV',
    proofVoltage: 'Up to 40.0 kV',
    dielectricStrength: 'Up to 40.0 kV',
    approxWeight: '—',
  },
];

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
  material: 'Elastomeric compound without insertion, typically comprising natural rubber and other synthetic polymers.',
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
  custom: 'Width × length according to customer requirement',
  standardColour: 'Black, without metallic derivatives',
  customizationNote: 'Cut lengths, custom shapes and colours are available on request.',
  manufacturingTolerance: '±10% on thickness; ±2% on length and width.',
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
    a: 'Recommended thickness increases with class: Class 0 and 1 require 2.0 mm, Class 2 and 3 require 3.0 mm, and Class 4 requires 4.0 mm. Maximum allowed thickness also varies by class. Confirm against the manufacturer\u2019s type-test documentation for the specific product.',
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
  resistance: [
    'Flame',
    'Mild acid & alkali',
    'Oil & water',
    'Moisture',
  ],
} as const;

