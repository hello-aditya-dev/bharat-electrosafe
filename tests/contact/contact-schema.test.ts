import { describe, test, expect } from 'bun:test';
import {
  contactSchema,
  ENQUIRY_TYPES,
  enquiryTypeFromQuery,
  productFromQuery,
  readContactPrefillFromUrl,
} from '../../src/lib/contact-schema';

/**
 * Contact form contract regression tests.
 *
 * These tests verify that the shared contact schema (src/lib/contact-schema.ts)
 * — consumed by BOTH the frontend form and the API route — accepts valid
 * canonical payloads, rejects invalid ones, and that query-param prefill
 * maps public CTA links to the correct canonical enquiry types.
 *
 * The goal: the frontend can never generate a payload that the API rejects
 * solely due to schema-name mismatch.
 */

// ---------------------------------------------------------------------------
// 1. Valid canonical payload accepted by the shared schema
// ---------------------------------------------------------------------------

describe('Contact schema — valid payload', () => {
  const validPayload = {
    name: 'Test User',
    companyName: 'Test Company Pvt Ltd',
    email: 'user@example.in',
    phone: '+91 98703 94721',
    enquiryType: 'quote',
    product: 'eim',
    message: 'I would like a quotation for 25 insulating mats.',
    voltage: '11 kV',
    dimensions: '1000mm x 2000mm',
    quantity: '25',
    deliveryLocation: 'Noida, UP',
    website: '', // honeypot empty
    _formOpenAt: String(Date.now() - 10000),
    turnstileToken: 'tok_abc',
  };

  test('accepts a fully-populated valid payload', () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  test('accepts a minimal valid payload (only required fields)', () => {
    const minimal = {
      name: 'Test User',
      email: 'user@example.in',
      phone: '+91 98703 94721',
      enquiryType: 'general',
      message: 'Please provide general information about your products.',
      website: '',
    };
    const result = contactSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  test('lowercases the email on parse', () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      email: 'USER@EXAMPLE.IN',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.in');
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Required fields — phone is REQUIRED (B2B form)
// ---------------------------------------------------------------------------

describe('Contact schema — required fields', () => {
  const base = {
    name: 'Test User',
    email: 'user@example.in',
    phone: '+91 98703 94721',
    enquiryType: 'quote' as const,
    message: 'I would like a quotation for 25 insulating mats.',
    website: '',
  };

  test('rejects empty phone', () => {
    const result = contactSchema.safeParse({ ...base, phone: '' });
    expect(result.success).toBe(false);
  });

  test('rejects missing phone', () => {
    const { phone: _phone, ...withoutPhone } = base;
    const result = contactSchema.safeParse(withoutPhone);
    expect(result.success).toBe(false);
  });

  test('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...base, name: '' });
    expect(result.success).toBe(false);
  });

  test('rejects name shorter than 2 chars', () => {
    const result = contactSchema.safeParse({ ...base, name: 'A' });
    expect(result.success).toBe(false);
  });

  test('rejects empty email', () => {
    const result = contactSchema.safeParse({ ...base, email: '' });
    expect(result.success).toBe(false);
  });

  test('rejects invalid email format', () => {
    const result = contactSchema.safeParse({ ...base, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  test('rejects message shorter than 10 chars', () => {
    const result = contactSchema.safeParse({ ...base, message: 'short' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. Invalid enquiry type rejected
// ---------------------------------------------------------------------------

describe('Contact schema — enquiry type enum', () => {
  const base = {
    name: 'Test User',
    email: 'user@example.in',
    phone: '+91 98703 94721',
    message: 'I would like a quotation for 25 insulating mats.',
    website: '',
  };

  test('rejects legacy frontend-only enum value "product-info"', () => {
    const result = contactSchema.safeParse({
      ...base,
      enquiryType: 'product-info',
    });
    expect(result.success).toBe(false);
  });

  test('rejects legacy frontend-only enum value "support"', () => {
    const result = contactSchema.safeParse({
      ...base,
      enquiryType: 'support',
    });
    expect(result.success).toBe(false);
  });

  test('rejects legacy frontend-only enum value "datasheet"', () => {
    const result = contactSchema.safeParse({
      ...base,
      enquiryType: 'datasheet',
    });
    expect(result.success).toBe(false);
  });

  test('rejects completely unknown enum value', () => {
    const result = contactSchema.safeParse({
      ...base,
      enquiryType: 'something-new',
    });
    expect(result.success).toBe(false);
  });

  test('accepts every canonical enquiry type', () => {
    for (const type of ENQUIRY_TYPES) {
      const result = contactSchema.safeParse({ ...base, enquiryType: type });
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Honeypot — must be empty
// ---------------------------------------------------------------------------

describe('Contact schema — honeypot', () => {
  const base = {
    name: 'Test User',
    email: 'user@example.in',
    phone: '+91 98703 94721',
    enquiryType: 'general' as const,
    message: 'Please provide general information about your products.',
  };

  test('accepts empty honeypot (website field)', () => {
    const result = contactSchema.safeParse({ ...base, website: '' });
    expect(result.success).toBe(true);
  });

  test('rejects non-empty honeypot (bot filled the hidden field)', () => {
    const result = contactSchema.safeParse({
      ...base,
      website: 'http://spam.example.com',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. Strict mode — unknown keys rejected by API (prevents alias drift)
// ---------------------------------------------------------------------------

describe('Contact schema — API strict mode (no alias drift)', () => {
  const valid = {
    name: 'Test User',
    email: 'user@example.in',
    phone: '+91 98703 94721',
    enquiryType: 'general',
    message: 'Please provide general information about your products.',
    website: '',
  };

  test('API strict schema rejects legacy alias "company"', () => {
    const strictSchema = contactSchema.strict();
    const result = strictSchema.safeParse({ ...valid, company: 'Test Co' });
    expect(result.success).toBe(false);
  });

  test('API strict schema rejects legacy alias "productInterest"', () => {
    const strictSchema = contactSchema.strict();
    const result = strictSchema.safeParse({
      ...valid,
      productInterest: 'eim',
    });
    expect(result.success).toBe(false);
  });

  test('API strict schema rejects legacy alias "operatingVoltage"', () => {
    const strictSchema = contactSchema.strict();
    const result = strictSchema.safeParse({
      ...valid,
      operatingVoltage: '11 kV',
    });
    expect(result.success).toBe(false);
  });

  test('API strict schema rejects legacy alias "_honeypot"', () => {
    const strictSchema = contactSchema.strict();
    const result = strictSchema.safeParse({
      ...valid,
      _honeypot: '',
    });
    expect(result.success).toBe(false);
  });

  test('API strict schema accepts a clean canonical payload', () => {
    const strictSchema = contactSchema.strict();
    const result = strictSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. Query-param prefill mapping
// ---------------------------------------------------------------------------

describe('Query-param prefill — enquiryTypeFromQuery', () => {
  test('type=quote maps to quote', () => {
    expect(enquiryTypeFromQuery('quote')).toBe('quote');
  });

  test('type=technical-guidance maps to technical', () => {
    expect(enquiryTypeFromQuery('technical-guidance')).toBe('technical');
  });

  test('type=technical maps to technical', () => {
    expect(enquiryTypeFromQuery('technical')).toBe('technical');
  });

  test('type=product maps to product', () => {
    expect(enquiryTypeFromQuery('product')).toBe('product');
  });

  test('type=datasheet maps to product (legacy safe mapping)', () => {
    expect(enquiryTypeFromQuery('datasheet')).toBe('product');
  });

  test('type=product-info maps to product (legacy safe mapping)', () => {
    expect(enquiryTypeFromQuery('product-info')).toBe('product');
  });

  test('type=partnership maps to partnership', () => {
    expect(enquiryTypeFromQuery('partnership')).toBe('partnership');
  });

  test('type=general maps to general', () => {
    expect(enquiryTypeFromQuery('general')).toBe('general');
  });

  test('unknown type returns undefined (fail safe)', () => {
    expect(enquiryTypeFromQuery('unknown-value')).toBeUndefined();
  });

  test('null type returns undefined', () => {
    expect(enquiryTypeFromQuery(null)).toBeUndefined();
  });

  test('case-insensitive (Technical-Guidance)', () => {
    expect(enquiryTypeFromQuery('Technical-Guidance')).toBe('technical');
  });
});

// ---------------------------------------------------------------------------
// 7. Product query-param mapping
// ---------------------------------------------------------------------------

describe('Query-param prefill — productFromQuery', () => {
  test('product=eim maps to eim', () => {
    expect(productFromQuery('eim')).toBe('eim');
  });

  test('product label "Electrical Insulating Mats" maps to eim', () => {
    expect(productFromQuery('Electrical Insulating Mats')).toBe('eim');
  });

  test('unknown product returns undefined (fail safe)', () => {
    expect(productFromQuery('iec-hv-insulating-mats')).toBeUndefined();
  });

  test('null product returns undefined', () => {
    expect(productFromQuery(null)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 8. readContactPrefillFromUrl — safe outside browser
// ---------------------------------------------------------------------------

describe('readContactPrefillFromUrl — SSR safety', () => {
  test('returns safe defaults when window is undefined', () => {
    // In the bun test environment, window is not defined — this exercises
    // the SSR guard path.
    const result = readContactPrefillFromUrl();
    expect(result.enquiryType).toBeUndefined();
    expect(result.product).toBeUndefined();
    expect(result.message).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 9. Phone validation
// ---------------------------------------------------------------------------

describe('Contact schema — phone validation', () => {
  const base = {
    name: 'Test User',
    email: 'user@example.in',
    enquiryType: 'general' as const,
    message: 'Please provide general information about your products.',
    website: '',
  };

  test('accepts +91 format with spaces', () => {
    const result = contactSchema.safeParse({
      ...base,
      phone: '+91 98703 94721',
    });
    expect(result.success).toBe(true);
  });

  test('accepts pure digits', () => {
    const result = contactSchema.safeParse({
      ...base,
      phone: '919870394721',
    });
    expect(result.success).toBe(true);
  });

  test('accepts hyphens and parentheses', () => {
    const result = contactSchema.safeParse({
      ...base,
      phone: '+91 (987) 039-4721',
    });
    expect(result.success).toBe(true);
  });

  test('rejects letters in phone', () => {
    const result = contactSchema.safeParse({
      ...base,
      phone: '+91 98703 abcde',
    });
    expect(result.success).toBe(false);
  });
});
