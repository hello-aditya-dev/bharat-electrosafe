import { describe, test, expect } from 'bun:test';

/**
 * Security regression tests for the Bharat Electrosafe website.
 *
 * These tests verify that security controls remain in place after
 * code changes. They run against the source code and configuration
 * rather than a live server.
 */

// ---------------------------------------------------------------------------
// 1. No secrets in tracked files
// ---------------------------------------------------------------------------

describe('Secret scanning', () => {
  test('no .env file is tracked by git', async () => {
    const proc = Bun.spawn(['git', 'ls-files', '.env'], {
      cwd: import.meta.dir.replace('/tests/security', ''),
      stdout: 'pipe',
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe('');
  });

  test('no .env.local is tracked by git', async () => {
    const proc = Bun.spawn(['git', 'ls-files', '.env.local'], {
      cwd: import.meta.dir.replace('/tests/security', ''),
      stdout: 'pipe',
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe('');
  });

  test('no real API keys in source files', async () => {
    const proc = Bun.spawn(
      ['git', 'grep', '-i', 're_[a-zA-Z0-9]', '--', 'src/'],
      {
        cwd: import.meta.dir.replace('/tests/security', ''),
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );
    const output = await new Response(proc.stdout).text();
    // Resend API keys start with "re_" — should not appear in source
    expect(output).not.toContain('re_');
  });
});

// ---------------------------------------------------------------------------
// 2. CSP does not contain unsafe-eval
// ---------------------------------------------------------------------------

describe('Content Security Policy', () => {
  test('CSP does not contain unsafe-eval', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    // Check the CSP header definition, not comments
    const cspStart = content.indexOf("const cspHeader");
    const cspEnd = content.indexOf("].filter(Boolean)");
    const cspBlock = content.substring(cspStart, cspEnd);
    expect(cspBlock).not.toContain("unsafe-eval");
  });

  test('CSP contains object-src none', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).toContain("object-src 'none'");
  });

  test('CSP contains frame-ancestors none', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).toContain("frame-ancestors 'none'");
  });
});

// ---------------------------------------------------------------------------
// 3. Security headers are configured
// ---------------------------------------------------------------------------

describe('Security headers', () => {
  test('X-Content-Type-Options is set to nosniff', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).toContain("'nosniff'");
  });

  test('poweredByHeader is disabled', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).toContain('poweredByHeader: false');
  });

  test('HSTS is configured for production', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).toContain('Strict-Transport-Security');
  });

  test('sandbox IP is not in allowedDevOrigins', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/next.config.ts',
    );
    const content = await file.text();
    expect(content).not.toContain('21.0.13.102');
  });
});

// ---------------------------------------------------------------------------
// 4. No internal editorial notes in public content
// ---------------------------------------------------------------------------

describe('Public content leakage', () => {
  const editorialPatterns = [
    'CLIENT_CONTENT_CONFIRMATION',
    'CONTENT_VERIFICATION',
    'client confirmation',
    'client approval',
    'subject to company confirmation',
    'the original company website presents',
    'corrective-engineering',
    'master prompt',
    'spec section',
  ];

  for (const pattern of editorialPatterns) {
    test(`source files do not contain "${pattern}" in rendered content`, async () => {
      const proc = Bun.spawn(
        ['rg', '-i', pattern, 'src/data/', '--no-filename'],
        {
          cwd: import.meta.dir.replace('/tests/security', ''),
          stdout: 'pipe',
          stderr: 'pipe',
        },
      );
      const output = await new Response(proc.stdout).text();
      // Only check for patterns that appear in data that would be rendered
      // (comments in data files are OK — they don't appear in HTML)
      const lines = output
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .filter((line) => !line.trim().startsWith('*'))
        .filter((line) => !line.trim().startsWith('//'))
        .filter((line) => !line.trim().startsWith('/*'))
        .filter((line) => !line.trim().startsWith('<!--'));
      expect(lines.length).toBe(0);
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Contact form security
// ---------------------------------------------------------------------------

describe('Contact form security', () => {
  test('contact route uses strict Zod schema', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    // The route must reject unknown keys (strict validation) to prevent
    // alias drift between frontend and API. Accept either z.strictObject
    // (inline definition) or contactSchema.strict() (shared contract).
    const hasStrict =
      content.includes('z.strictObject') ||
      content.includes('.strict()');
    expect(hasStrict).toBe(true);
    // The schema must be imported from the shared contract so frontend
    // and API cannot drift apart.
    expect(content).toContain('contact-schema');
  });

  test('contact route validates content type', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('application/json');
    expect(content).toContain('415');
  });

  test('contact route implements rate limiting', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('429');
    expect(content).toContain('Retry-After');
  });

  test('contact route uses Cache-Control no-store', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('no-store');
  });

  test('contact route has honeypot field', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('website');
    expect(content).toContain('honeypot');
  });

  test('contact route has timing check', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('_formOpenAt');
    expect(content).toContain('MIN_FORM_SECONDS');
  });

  test('contact route uses HTML escaping', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('escapeHtml');
  });

  test('contact route uses redacted logging', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('nameLength');
    expect(content).not.toContain('console.log(input.name)');
  });

  test('contact route prevents subject-header injection', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/app/api/contact/route.ts',
    );
    const content = await file.text();
    expect(content).toContain('[\\r\\n]');
  });
});

// ---------------------------------------------------------------------------
// 6. No dangerous client-side patterns
// ---------------------------------------------------------------------------

describe('Frontend security', () => {
  test('dangerouslySetInnerHTML is only used for escaped JSON-LD', async () => {
    const proc = Bun.spawn(
      ['rg', 'dangerouslySetInnerHTML', 'src/', '-n'],
      {
        cwd: import.meta.dir.replace('/tests/security', ''),
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );
    const output = await new Response(proc.stdout).text();
    // All uses should be in structured-data.tsx, Breadcrumb.tsx, or page files
    // that emit JSON-LD structured data (new product pages)
    const lines = output.split('\n').filter((l) => l.trim().length > 0);
    for (const line of lines) {
      expect(line).toMatch(
        /structured-data\.tsx|Breadcrumb\.tsx|page\.tsx/,
      );
    }
    // Verify that the JSON-LD serialization escapes < to prevent XSS
    const sdFile = Bun.file(
      import.meta.dir.replace('/tests/security', '') +
        '/src/lib/structured-data.ts',
    );
    const sdContent = await sdFile.text();
    // serializeJsonLd escapes < to prevent script-breakout injection
    expect(sdContent).toContain('serializeJsonLd');
    expect(sdContent).toMatch(/replace.*<.*u003c|escapeHtml/);
  });

  test('no eval() in source', async () => {
    const proc = Bun.spawn(['rg', '\\beval\\s*\\(', 'src/', '--count'], {
      cwd: import.meta.dir.replace('/tests/security', ''),
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe('');
  });

  test('no new Function() in source', async () => {
    const proc = Bun.spawn(
      ['rg', 'new\\s+Function\\s*\\(', 'src/', '--count'],
      {
        cwd: import.meta.dir.replace('/tests/security', ''),
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 7. .env.example has no real tokens
// ---------------------------------------------------------------------------

describe('Environment variable safety', () => {
  test('.env.example contains no real API keys', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/.env.example',
    );
    const content = await file.text();
    // Check for real-looking keys — the example format "re_xxxxxxxxxxxx" is OK
    // Real keys are much longer and contain alphanumeric characters, not just x
    const lines = content.split('\n').filter((l) => !l.startsWith('#'));
    for (const line of lines) {
      // Only check lines that have actual values after the =
      const eqIndex = line.indexOf('=');
      if (eqIndex >= 0) {
        const value = line.substring(eqIndex + 1).trim();
        // Empty values are OK
        if (value.length === 0) continue;
        // Should not contain a real-looking key
        expect(value).not.toMatch(/^re_[a-zA-Z0-9]{10,}$/);
        expect(value).not.toMatch(/^sk_[a-zA-Z0-9]{10,}$/);
        expect(value).not.toMatch(/^ghp_[a-zA-Z0-9]{10,}$/);
      }
    }
  });

  test('.env.example separates public and server variables', async () => {
    const file = Bun.file(
      import.meta.dir.replace('/tests/security', '') + '/.env.example',
    );
    const content = await file.text();
    expect(content).toContain('[SERVER]');
    expect(content).toContain('[PUBLIC]');
  });
});
