import nodemailer from 'nodemailer';

/**
 * SMTP mailer — production server-side email delivery via the client's
 * Hostinger SMTP configuration.
 *
 * All credentials are read server-side from environment variables.
 * No SMTP credentials are ever exposed to the browser.
 *
 * Required environment variables:
 *   SMTP_HOST     — e.g. smtp.hostinger.com
 *   SMTP_PORT     — e.g. 587 (STARTTLS) or 465 (SSL)
 *   SMTP_USER     — the authenticated business email account
 *   SMTP_PASSWORD — the email account password
 *   SMTP_SECURE   — "true" for port 465 (SSL), "false" for port 587 (STARTTLS)
 *   MAIL_FROM     — the From address (should match SMTP_USER for deliverability)
 *   MAIL_TO       — the recipient enquiry inbox
 *   MAIL_CC       — optional CC recipient
 */

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}

export interface MailOptions {
  to: string;
  cc?: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

let cachedTransporter: nodemailer.Transporter | null = null;

/**
 * Read SMTP configuration from environment variables.
 * Returns null if required variables are missing.
 */
export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const secureRaw = process.env.SMTP_SECURE;

  if (!host || !portRaw || !user || !password) {
    return null;
  }

  const port = parseInt(portRaw, 10);
  if (isNaN(port)) {
    return null;
  }

  // SMTP_SECURE: "true" → SSL (port 465), "false" or unset → STARTTLS (port 587)
  const secure = secureRaw === 'true';

  return { host, port, user, password, secure };
}

/**
 * Get a cached nodemailer transporter. Creates one on first use.
 * Returns null if SMTP configuration is missing.
 */
function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();
  if (!config) return null;

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  return cachedTransporter;
}

/**
 * Send an email via SMTP.
 *
 * Returns { ok: true } on success, or { ok: false, error } on failure.
 * The error message is safe for redacted server-side logging — it never
 * contains credentials.
 */
export async function sendMail(options: MailOptions): Promise<{ ok: true } | { ok: false; error: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, error: 'SMTP configuration missing' };
  }

  try {
    const mailData: nodemailer.SendMailOptions = {
      from: options.from,
      to: options.to,
      cc: options.cc || undefined,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailData);

    // Verify the message was accepted
    if (info.messageId || info.response) {
      return { ok: true };
    }

    return { ok: false, error: 'No confirmation from SMTP server' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown SMTP error';
    // Redacted — never include credentials in the error string
    return { ok: false, error: message.replace(/password|credential|auth/gi, '[redacted]') };
  }
}

/**
 * Verify the SMTP connection is ready.
 * Safe to call during server startup or health checks.
 * Does NOT expose credentials in the result.
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; message: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, message: 'SMTP configuration missing' };
  }

  try {
    await transporter.verify();
    return { ok: true, message: 'SMTP connection verified' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return { ok: false, message: message.replace(/password|credential|auth/gi, '[redacted]') };
  }
}
