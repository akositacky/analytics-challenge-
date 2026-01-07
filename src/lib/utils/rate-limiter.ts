/**
 * Simple in-memory rate limiter
 * 
 * NOTE: This is suitable for single-server deployments.
 * For production with multiple servers, use Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Number of requests remaining in the window */
  remaining: number
  /** Unix timestamp when the rate limit resets */
  resetTime: number
  /** Total requests allowed per window */
  limit: number
}

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier for the client (e.g., user ID, IP)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  let entry = rateLimitStore.get(key)

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
      limit: config.maxRequests,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    limit: config.maxRequests,
  }
}

/**
 * Create rate limit headers for the response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  }
}

/**
 * Default rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Standard API endpoints: 100 requests per minute
  standard: {
    maxRequests: 100,
    windowSeconds: 60,
  },
  // Auth endpoints: 10 requests per minute (more strict)
  auth: {
    maxRequests: 10,
    windowSeconds: 60,
  },
  // Heavy endpoints (analytics): 30 requests per minute
  analytics: {
    maxRequests: 30,
    windowSeconds: 60,
  },
} as const
