/**
 * Distributed rate limiting for serverless environments.
 *
 * Uses Upstash Redis when configured (production), falls back to a
 * conservative in-memory rate limiter (development / Redis unavailable).
 *
 * The fallback is deliberately conservative: if Redis is unreachable,
 * each serverless instance tracks its own window. This means rate limits
 * are per-instance rather than global, but it still provides meaningful
 * protection against rapid automated abuse from a single IP hitting the
 * same instance. The alternative — disabling all rate limiting when
 * Redis is down — would be less safe.
 *
 * Environment variables:
 *   UPSTASH_REDIS_REST_URL  — Upstash Redis REST API URL
 *   UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST API token
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // per IP per window

// ---------------------------------------------------------------------------
// In-memory fallback (per-instance, conservative)
// ---------------------------------------------------------------------------

const memoryMap = new Map<string, { count: number; resetAt: number }>();

function cleanupMemoryLimits(): void {
  const now = Date.now();
  for (const [key, entry] of memoryMap) {
    if (now > entry.resetAt) memoryMap.delete(key);
  }
}

function checkMemoryRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  cleanupMemoryLimits();
  const now = Date.now();
  const entry = memoryMap.get(ip);

  if (!entry || now > entry.resetAt) {
    memoryMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = entry.resetAt - now;
    return { allowed: false, retryAfterMs };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

// ---------------------------------------------------------------------------
// Upstash Redis rate limiting (serverless-durable)
// ---------------------------------------------------------------------------

interface UpstashResponse {
  result?: unknown[];
  error?: string;
}

async function checkRedisRateLimit(
  ip: string,
  redisUrl: string,
  redisToken: string,
): Promise<{ allowed: boolean; retryAfterMs: number } | null> {
  const key = `ratelimit:contact:${ip}`;
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_MS;

  try {
    // Use Upstash REST API pipeline to atomically increment and set expiry
    const response = await fetch(redisUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        // INCR the counter
        ['INCR', key],
        // Set expiry on first increment (only sets if not already set)
        ['PEXPIRE', key, windowMs],
        // Get TTL to compute retry-after
        ['PTTL', key],
      ]),
    });

    if (!response.ok) {
      // Redis returned HTTP error — fall back to memory
      console.warn('[rate-limit] Upstash HTTP error, falling back to memory', {
        status: response.status,
      });
      return null;
    }

    const data = (await response.json()) as UpstashResponse;

    if (data.error) {
      console.warn('[rate-limit] Upstash command error, falling back to memory', {
        error: data.error,
      });
      return null;
    }

    const results = data.result;
    if (!results || results.length < 3) {
      console.warn('[rate-limit] Unexpected Upstash response, falling back to memory');
      return null;
    }

    const count = Number(results[0]);
    const ttl = Number(results[2]);

    // If count exceeds limit, reject
    if (count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterMs = ttl > 0 ? ttl : windowMs;
      return { allowed: false, retryAfterMs };
    }

    return { allowed: true, retryAfterMs: 0 };
  } catch (err) {
    // Network error, DNS failure, etc. — fall back to memory
    console.warn('[rate-limit] Redis unreachable, falling back to memory', {
      message: err instanceof Error ? err.message : 'unknown',
    });
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check rate limit for a given key (typically client IP).
 *
 * Uses Upstash Redis when configured, falls back to in-memory rate limiting.
 * Returns whether the request is allowed and how long to wait if not.
 */
export async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Try Redis first if configured
  if (redisUrl && redisToken) {
    const redisResult = await checkRedisRateLimit(ip, redisUrl, redisToken);
    if (redisResult !== null) {
      return redisResult;
    }
    // Redis failed — fall through to in-memory fallback
  }

  // In-memory fallback (conservative, per-instance)
  return checkMemoryRateLimit(ip);
}
