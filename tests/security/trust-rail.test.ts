import { describe, test, expect } from 'bun:test';
import { allTrustMarks, primaryTrustMarks } from '../../src/data/trust';

/**
 * Trust-rail regression tests.
 *
 * Lock the homepage AND About Us certification rails to the COMPLETE canonical
 * `allTrustMarks` inventory. A future change must not silently reduce either
 * rail back to the compact `primaryTrustMarks` subset (7 marks) or to a
 * hand-picked slice.
 *
 * The authoritative inventory lives in `src/data/trust.ts`. This test does not
 * hardcode a count into production rendering — it asserts that:
 *   1. the canonical inventory carries every required trust mark, and
 *   2. each rendering component sources from `allTrustMarks` (not
 *      `primaryTrustMarks`, not `.slice(...)`).
 */

const REPO_ROOT = import.meta.dir.replace('/tests/security', '');

// ---------------------------------------------------------------------------
// 1. The canonical inventory carries the complete expected trust set
// ---------------------------------------------------------------------------

/**
 * The 15 trust marks the client requires on both rails. Labels are matched as
 * substrings so minor punctuation differences (em-dash vs hyphen) do not create
 * false failures — the intent is "this mark is present", not a string-equality
 * contract on the label field.
 */
const REQUIRED_TRUST_MARKS = [
  'BIS licence',
  'ISI mark',
  'ERDA testing',
  '2.0 mm',
  '2.5 mm',
  'NTH testing',
  'ISO 9001:2015',
  'CE mark',
  'ISO 14001:2015',
  'ISO 45001:2018',
  'MSME registration',
  'Startup India recognition',
  'ZED Bronze',
  'AIRIA membership',
  'NABL',
  'ACL Certification',
] as const;

describe('Canonical trust inventory (src/data/trust.ts)', () => {
  test('allTrustMarks contains every required trust mark', () => {
    // Build a single blob of all labels + notes so substring matching works
    // across both fields (e.g. "2.0 mm" lives in the label, "ERDA testing"
    // lives in the label too — both must be findable).
    const blob = allTrustMarks
      .map((m) => `${m.label} ${m.note}`)
      .join('\n');
    for (const required of REQUIRED_TRUST_MARKS) {
      expect(blob).toContain(required);
    }
  });

  test('allTrustMarks is strictly larger than the compact primaryTrustMarks', () => {
    // primaryTrustMarks is the 7-item homepage-compact subset.
    // allTrustMarks must always be a superset — if this fails, someone has
    // collapsed the canonical inventory.
    expect(allTrustMarks.length).toBeGreaterThan(primaryTrustMarks.length);
    expect(allTrustMarks.length).toBeGreaterThanOrEqual(15);
  });

  test('every trust mark has a label, note, logo and alt', () => {
    for (const mark of allTrustMarks) {
      expect(typeof mark.label).toBe('string');
      expect(mark.label.trim().length).toBeGreaterThan(0);
      expect(typeof mark.note).toBe('string');
      expect(mark.note.trim().length).toBeGreaterThan(0);
      expect(typeof mark.logo).toBe('string');
      expect(mark.logo.startsWith('/media/')).toBe(true);
      expect(typeof mark.alt).toBe('string');
      expect(mark.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test('document links point only to released PDFs (no fabricated paths)', () => {
    // Marks without a released document have `document === undefined`.
    // Marks WITH a document must point under /documents/certifications/.
    for (const mark of allTrustMarks) {
      if (mark.document !== undefined) {
        expect(mark.document.startsWith('/documents/certifications/')).toBe(true);
        expect(mark.document.endsWith('.pdf')).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Homepage CertificationsSection renders the FULL inventory
// ---------------------------------------------------------------------------

describe('Homepage CertificationsSection', () => {
  test('sources from allTrustMarks (not primaryTrustMarks, not a slice)', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/home/CertificationsSection.tsx',
    );
    const content = await file.text();

    // Must import and map over the full canonical inventory.
    expect(content).toContain('allTrustMarks');
    expect(content).toMatch(/allTrustMarks\.map/);

    // Must NOT fall back to the compact subset or slice the rail.
    expect(content).not.toContain('primaryTrustMarks');
    expect(content).not.toMatch(/\.slice\s*\(/);
    expect(content).not.toMatch(/\.slice\(/);
  });

  test('has no card box / border / filled background around mark items', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/home/CertificationsSection.tsx',
    );
    const content = await file.text();

    // Scope to the rendered map block so the doc-comment (which legitimately
    // contains the words "shadows"/"boxes" as prose) is not mistaken for a
    // class. The clean direction: no rounded-lg, border-be-grey-250,
    // bg-be-warm-white, or shadow class on the mark wrapper.
    const mapStart = content.indexOf('allTrustMarks.map');
    expect(mapStart).toBeGreaterThan(-1);
    const mapBlock = content.slice(mapStart, mapStart + 900);
    expect(mapBlock).not.toMatch(/rounded-lg/);
    expect(mapBlock).not.toMatch(/border-be-grey-250/);
    expect(mapBlock).not.toMatch(/bg-be-warm-white/);
    expect(mapBlock).not.toMatch(/shadow/);
  });
});

// ---------------------------------------------------------------------------
// 3. About Us AwardsCertifications renders the FULL inventory
// ---------------------------------------------------------------------------

describe('About Us AwardsCertifications — certification rail', () => {
  test('sources from allTrustMarks (not primaryTrustMarks, not a slice)', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/about/AwardsCertifications.tsx',
    );
    const content = await file.text();

    expect(content).toContain('allTrustMarks');
    expect(content).toMatch(/allTrustMarks\.map/);

    expect(content).not.toContain('primaryTrustMarks');
    expect(content).not.toMatch(/allTrustMarks\.slice/);
  });

  test('certification items have no card box / border / filled background', async () => {
    // The boxed treatment was `rounded-lg border border-be-grey-250
    // bg-be-warm-white p-5` on the certification item wrapper. After cleanup
    // those classes must not appear on a certification item.
    //
    // Awards cards legitimately keep `rounded-lg border ...` — so we only
    // assert that the certification map block (the allTrustMarks.map region)
    // is free of the boxed treatment.
    const file = Bun.file(
      REPO_ROOT + '/src/components/about/AwardsCertifications.tsx',
    );
    const content = await file.text();

    const certBlockStart = content.indexOf('allTrustMarks.map');
    expect(certBlockStart).toBeGreaterThan(-1);
    const certBlock = content.slice(
      certBlockStart,
      certBlockStart + 900,
    );
    expect(certBlock).not.toMatch(/rounded-lg/);
    expect(certBlock).not.toMatch(/border-be-grey-250/);
    expect(certBlock).not.toMatch(/bg-be-warm-white/);
    expect(certBlock).not.toMatch(/shadow/);
  });
});

// ---------------------------------------------------------------------------
// 4. About Us ClientsProjects — organisation references remain intact
// ---------------------------------------------------------------------------

describe('About Us ClientsProjects — organisation references', () => {
  test('renders the full organisationReferences list (no slice)', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/about/ClientsProjects.tsx',
    );
    const content = await file.text();

    expect(content).toContain('organisationReferences');
    expect(content).toMatch(/organisationReferences\.map/);
    expect(content).not.toMatch(/organisationReferences\.slice/);
  });

  test('organisation-reference items have no card box / border / filled background', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/about/ClientsProjects.tsx',
    );
    const content = await file.text();

    const orgBlockStart = content.indexOf('organisationReferences.map');
    expect(orgBlockStart).toBeGreaterThan(-1);
    const orgBlock = content.slice(
      orgBlockStart,
      orgBlockStart + 700,
    );
    expect(orgBlock).not.toMatch(/rounded-lg/);
    expect(orgBlock).not.toMatch(/border-be-grey-250/);
    expect(orgBlock).not.toMatch(/bg-be-white/);
    expect(orgBlock).not.toMatch(/shadow/);
  });

  test('preserves the "Selected Clients" text list and View-all disclosure', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/about/ClientsProjects.tsx',
    );
    const content = await file.text();
    // The client text list was renamed from "Clients served" to "Selected
    // Clients" so organisation-reference logos are not implied to be confirmed
    // customers. The list contents and the View-all disclosure remain.
    expect(content).toContain('Selected Clients');
    expect(content).toContain('View all clients');
    expect(content).toContain('additionalClients');
  });
});

// ---------------------------------------------------------------------------
// 5. FAQ CTA button row removed
// ---------------------------------------------------------------------------

describe('Homepage FAQ — CTA button row removed', () => {
  test('HomeFAQCTA no longer renders Request Technical Guidance / Request a Quote buttons', async () => {
    const file = Bun.file(
      REPO_ROOT + '/src/components/home/HomeFAQCTA.tsx',
    );
    const content = await file.text();

    // The inline "Technical Guidance" TextLink must remain — only the button
    // row below the FAQ grid is removed.
    expect(content).toContain('Technical Guidance');
    expect(content).toMatch(/TextLink/);

    // The button CTA row must be gone.
    expect(content).not.toContain('Request Technical Guidance');
    expect(content).not.toContain('Request a Quote');
    expect(content).not.toContain('PrimaryButton');
    expect(content).not.toContain('SecondaryButton');
    expect(content).not.toMatch(/mt-8 pt-6 border-t/);
  });
});
