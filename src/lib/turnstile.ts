/**
 * Cloudflare Turnstile server-side verification.
 *
 * When TURNSTILE_SECRET_KEY is configured, incoming contact-form tokens
 * are verified against the Cloudflare Siteverify API. If the keys are
 * not configured, Turnstile verification is silently skipped (graceful
 * degradation for development / staging).
 *
 * Environment variables:
 *   TURNSTILE_SECRET_KEY        [SERVER] — Turnstile secret key (server-only)
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY [PUBLIC] — Turnstile site key (browser)
 *
 * Turnstile is preferred over reCAPTCHA because it is invisible to
 * genuine users (no visual puzzle) while still blocking bots.
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
}

/**
 * Verify a Turnstile token server-side.
 *
 * Returns:
 *   - { verified: true }  — token is valid or Turnstile is not configured
 *   - { verified: false, reason: string } — token is invalid
 *
 * When TURNSTILE_SECRET_KEY is not set, returns verified: true so the
 * contact form works in development without Turnstile. Other protections
 * (honeypot, timing, rate limit) remain active.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string,
): Promise<{ verified: boolean; reason?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile is not configured, skip verification gracefully
  if (!secretKey) {
    return { verified: true };
  }

  // If secret is configured but no token was provided, reject
  if (!token) {
    return { verified: false, reason: 'Verification token missing.' };
  }

  try {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    });

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      // Cloudflare API error — fail open to avoid blocking legitimate users
      console.warn('[turnstile] Siteverify API error', { status: response.status });
      return { verified: true };
    }

    const data = (await response.json()) as TurnstileVerifyResponse;

    if (data.success) {
      return { verified: true };
    }

    console.warn('[turnstile] Verification failed', {
      error_codes: data.error_codes,
    });

    return {
      verified: false,
      reason: 'Verification failed. Please try again.',
    };
  } catch (err) {
    // Network error — fail open rather than blocking all submissions
    console.warn('[turnstile] Verification request failed', {
      message: err instanceof Error ? err.message : 'unknown',
    });
    return { verified: true };
  }
}
