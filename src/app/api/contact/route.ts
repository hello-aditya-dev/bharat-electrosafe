import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { company } from '@/data/company';
import { isAllowedOrigin, parseOrigin } from '@/lib/origin';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { contactSchema, type ContactInput } from '@/lib/contact-schema';

/**
 * Contact form API route.
 *
 * Security controls: HTML-escaped user input, strict Zod schema with
 * .strict(), exact origin validation, content-type enforcement, request
 * size limits, honeypot + timing anti-spam, distributed rate limiting
 * (Upstash Redis with in-memory fallback), Cloudflare Turnstile bot
 * protection (graceful degradation when unconfigured), server-side
 * Resend delivery, redacted logging, honest delivery messages with
 * direct-contact fallback, Cache-Control: no-store, X-Robots-Tag: noindex.
 */

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MAX_BODY_BYTES = 32 * 1024; // 32 KB
const MIN_FORM_SECONDS = 3; // minimum time form must be open
const MAX_FORM_SECONDS = 3600; // 1 hour — reject stale forms

// ---------------------------------------------------------------------------
// HTML escaping — prevents XSS in email content
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ---------------------------------------------------------------------------
// Zod schema — imported from the shared contract (src/lib/contact-schema.ts)
// so the frontend and API can never drift apart. `.strict()` rejects any
// key not defined in the schema (prevents alias drift).
// ---------------------------------------------------------------------------

const strictContactSchema = contactSchema.strict();

// ---------------------------------------------------------------------------
// Email body builders
// ---------------------------------------------------------------------------

function buildPlainTextEmail(
  input: ContactInput,
  meta: { sourcePage: string },
): string {
  const lines: Array<string | null> = [
    `New enquiry for ${company.name}`,
    '',
    `Name: ${input.name}`,
    input.companyName ? `Company: ${input.companyName}` : null,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Enquiry type: ${input.enquiryType}`,
    input.product ? `Product: ${input.product}` : null,
    input.voltage ? `Voltage / class: ${input.voltage}` : null,
    input.dimensions ? `Dimensions: ${input.dimensions}` : null,
    input.quantity ? `Quantity: ${input.quantity}` : null,
    input.deliveryLocation ? `Delivery location: ${input.deliveryLocation}` : null,
    '',
    'Message:',
    input.message,
    '',
    `Source page: ${meta.sourcePage || '(unknown)'}`,
  ];
  return lines.filter((line): line is string => line !== null).join('\n');
}

function buildHtmlEmail(
  input: ContactInput,
  meta: { sourcePage: string },
): string {
  const rows: Array<[string, string]> = [
    ['Name', escapeHtml(input.name)],
    ...(input.companyName
      ? ([['Company', escapeHtml(input.companyName)]] as Array<[string, string]>)
      : []),
    ['Email', escapeHtml(input.email)],
    ['Phone', escapeHtml(input.phone)],
    ['Enquiry type', escapeHtml(input.enquiryType)],
    ...(input.product
      ? ([['Product', escapeHtml(input.product)]] as Array<[string, string]>)
      : []),
    ...(input.voltage
      ? ([['Voltage / class', escapeHtml(input.voltage)]] as Array<[string, string]>)
      : []),
    ...(input.dimensions
      ? ([['Dimensions', escapeHtml(input.dimensions)]] as Array<[string, string]>)
      : []),
    ...(input.quantity
      ? ([['Quantity', escapeHtml(input.quantity)]] as Array<[string, string]>)
      : []),
    ...(input.deliveryLocation
      ? (
        [['Delivery location', escapeHtml(input.deliveryLocation)]] as Array<[string, string]>
      )
      : []),
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0f172a;background:#f1f5f9;border:1px solid #e2e8f0;width:180px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#1e293b;border:1px solid #e2e8f0;vertical-align:top;">${value}</td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <tr><td style="padding:18px 24px;background:#0f172a;color:#ffffff;">
            <h1 style="margin:0;font-size:18px;font-weight:700;">New enquiry for ${escapeHtml(company.name)}</h1>
          </td></tr>
          <tr><td style="padding:18px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${rowsHtml}</table>
          </td></tr>
          <tr><td style="padding:0 24px 6px 24px;">
            <h2 style="margin:0 0 6px 0;font-size:14px;color:#0f172a;">Message</h2>
            <p style="margin:0;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;white-space:pre-wrap;color:#1e293b;font-size:14px;line-height:1.5;">${escapeHtml(input.message)}</p>
          </td></tr>
          <tr><td style="padding:18px 24px;">
            <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">
              Source page: ${escapeHtml(meta.sourcePage || '(unknown)')}
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// ---------------------------------------------------------------------------
// Origin validation — exact comparison, no startsWith
// ---------------------------------------------------------------------------

function readOriginFromHeaders(req: Request): string | null {
  const origin = req.headers.get('origin');
  if (origin) return parseOrigin(origin);
  const referer = req.headers.get('referer');
  if (referer) return parseOrigin(referer);
  return null;
}

// ---------------------------------------------------------------------------
// Helper: extract client IP
// ---------------------------------------------------------------------------

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

// ---------------------------------------------------------------------------
// No-store + noindex response helper
// ---------------------------------------------------------------------------

function apiHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  // --- Content-type check (only application/json accepted) ---
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { ok: false, message: 'Unsupported content type.' },
      { status: 415, headers: apiHeaders() },
    );
  }

  // --- Request body size limit ---
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, message: 'Request too large.' },
      { status: 413, headers: apiHeaders() },
    );
  }

  // --- Origin check (exact comparison) ---
  const requestOrigin = readOriginFromHeaders(req);
  if (!isAllowedOrigin(requestOrigin)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'This form can only be submitted from the official Bharat Electrosafe website.',
      },
      { status: 403, headers: apiHeaders() },
    );
  }

  // --- Rate limiting (Upstash Redis with in-memory fallback) ---
  const clientIp = getClientIp(req);
  const rateCheck = await checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...apiHeaders(),
          'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)),
        },
      },
    );
  }

  // --- Body parse + zod validation ---
  let payload: unknown;
  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, message: 'Request too large.' },
        { status: 413, headers: apiHeaders() },
      );
    }
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request body.' },
      { status: 400, headers: apiHeaders() },
    );
  }

  const parsed = strictContactSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    const message = firstError
      ? `${firstError.path.length ? firstError.path.join('.') + ': ' : ''}${firstError.message}`
      : 'Please check the form fields and try again.';
    return NextResponse.json(
      { ok: false, message },
      { status: 400, headers: apiHeaders() },
    );
  }

  const input = parsed.data;

  // --- Honeypot check (hidden field must be empty) ---
  if (input.website) {
    // Silently accept but do not deliver — avoids confirming the honeypot exists
    return NextResponse.json(
      { ok: true, message: 'Thank you for your enquiry. Your message has been delivered to Bharat Electrosafe.' },
      { status: 200, headers: apiHeaders() },
    );
  }

  // --- Timing check (anti-automation) ---
  const formOpenAt = input._formOpenAt ? parseInt(input._formOpenAt, 10) : 0;
  const now = Date.now();
  if (formOpenAt && !isNaN(formOpenAt)) {
    const elapsed = (now - formOpenAt) / 1000;
    if (elapsed < MIN_FORM_SECONDS) {
      // Too fast — silently reject
      return NextResponse.json(
        { ok: true, message: 'Thank you for your enquiry. Your message has been delivered to Bharat Electrosafe.' },
        { status: 200, headers: apiHeaders() },
      );
    }
    if (elapsed > MAX_FORM_SECONDS) {
      return NextResponse.json(
        { ok: false, message: 'The form has expired. Please reload and try again.' },
        { status: 400, headers: apiHeaders() },
      );
    }
  }

  // --- Cloudflare Turnstile verification ---
  const turnstileResult = await verifyTurnstile(input.turnstileToken, clientIp);
  if (!turnstileResult.verified) {
    return NextResponse.json(
      { ok: false, message: turnstileResult.reason || 'Verification failed. Please try again.' },
      { status: 400, headers: apiHeaders() },
    );
  }

  // --- Resend configuration ---
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'We could not deliver your message right now because email delivery is not configured. Please reach us directly using the contact details below.',
        fallback: {
          phone: company.phonePrimary,
          phoneTel: company.phonePrimaryTel,
          email: company.email,
          whatsapp: company.whatsapp.href,
          whatsappLabel: company.whatsapp.label,
          address: company.address.full,
        },
      },
      { status: 503, headers: apiHeaders() },
    );
  }

  const resend = new Resend(apiKey);

  // Extract only the pathname from the referer for privacy
  const referer = req.headers.get('referer') || '';
  let sourcePage = '(unknown)';
  try {
    const refererUrl = new URL(referer);
    sourcePage = refererUrl.pathname;
  } catch {
    // Keep (unknown) for invalid referer
  }

  const meta = { sourcePage };

  const plainText = buildPlainTextEmail(input, meta);
  const html = buildHtmlEmail(input, meta);

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || company.email;

  if (!fromEmail) {
    console.error('[contact] CONTACT_FROM_EMAIL is not configured');
    return NextResponse.json(
      {
        ok: false,
        message:
          'We could not deliver your message right now. Please reach us directly using the contact details below.',
      },
      { status: 500, headers: apiHeaders() },
    );
  }

  // Prevent subject-header injection — strip CR/LF
  const safeEnquiryType = input.enquiryType.replace(/[\r\n]/g, '');

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: input.email,
      subject: `New enquiry — ${safeEnquiryType} — ${company.name}`,
      text: plainText,
      html,
    });

    if (error) {
      // Redacted logging — no PII
      console.error('[contact] Resend delivery error', {
        message: error.message,
        nameLength: input.name.length,
        enquiryType: input.enquiryType,
      });

      return NextResponse.json(
        {
          ok: false,
          message:
            'We could not deliver your message right now. Please reach us directly using the contact details below.',
          fallback: {
            phone: company.phonePrimary,
            phoneTel: company.phonePrimaryTel,
            email: company.email,
            whatsapp: company.whatsapp.href,
            whatsappLabel: company.whatsapp.label,
            address: company.address.full,
          },
        },
        { status: 503, headers: apiHeaders() },
      );
    }

    // Redacted success log — no PII
    console.info('[contact] enquiry delivered', {
      nameLength: input.name.length,
      enquiryType: input.enquiryType,
      hasCompany: Boolean(input.companyName),
    });

    return NextResponse.json(
      {
        ok: true,
        message:
          'Thank you for your enquiry. Your message has been delivered to Bharat Electrosafe.',
      },
      { status: 200, headers: apiHeaders() },
    );
  } catch (err) {
    console.error('[contact] Unexpected delivery failure', {
      message: err instanceof Error ? err.message : 'unknown',
      nameLength: input.name.length,
      enquiryType: input.enquiryType,
    });

    return NextResponse.json(
      {
        ok: false,
        message:
          'We could not deliver your message right now. Please reach us directly using the contact details below.',
        fallback: {
          phone: company.phonePrimary,
          phoneTel: company.phonePrimaryTel,
          email: company.email,
          whatsapp: company.whatsapp.href,
          whatsappLabel: company.whatsapp.label,
          address: company.address.full,
        },
      },
      { status: 503, headers: apiHeaders() },
    );
  }
}
