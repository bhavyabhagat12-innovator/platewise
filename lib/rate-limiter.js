/**
 * @fileoverview Pure sliding-window IP rate limiter module.
 * @module lib/rate-limiter
 */

import { RATE_LIMIT_CONFIG } from './config.js';

/**
 * Creates an in-memory sliding window rate limiter instance.
 *
 * @param {number} [windowMs=RATE_LIMIT_CONFIG.WINDOW_MS]
 * @param {number} [maxRequests=RATE_LIMIT_CONFIG.MAX_REQUESTS]
 * @returns {{isLimited: (ip: string, now?: number) => boolean, reset: () => void, getCount: (ip: string) => number}}
 */
export function createRateLimiter(
  windowMs = RATE_LIMIT_CONFIG.WINDOW_MS,
  maxRequests = RATE_LIMIT_CONFIG.MAX_REQUESTS
) {
  /** @type {Map<string, {count: number, resetAt: number}>} */
  const store = new Map();

  return {
    /**
     * Checks if a client IP has exceeded the allowed request threshold.
     *
     * @param {string} ip - Client identifier/IP address.
     * @param {number} [now=Date.now()] - Timestamp override for testing.
     * @returns {boolean} True if rate limit is exceeded.
     */
    isLimited(ip, now = Date.now()) {
      const client = store.get(ip) || { count: 0, resetAt: now + windowMs };

      if (now > client.resetAt) {
        client.count = 1;
        client.resetAt = now + windowMs;
        store.set(ip, client);
        return false;
      }

      client.count += 1;
      store.set(ip, client);
      return client.count > maxRequests;
    },

    /**
     * Retrieves the current count for an IP.
     *
     * @param {string} ip
     * @returns {number}
     */
    getCount(ip) {
      return store.get(ip)?.count || 0;
    },

    /**
     * Resets the entire rate limiter state (useful in tests).
     */
    reset() {
      store.clear();
    }
  };
}

/**
 * Global default limiter instance for production use.
 */
export const defaultRateLimiter = createRateLimiter();
