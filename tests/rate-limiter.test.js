import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../lib/rate-limiter.js';

describe('Sliding-Window Rate Limiter Module', () => {
  it('20. should allow requests within the configured threshold', () => {
    const limiter = createRateLimiter(60000, 3);
    const ip = '192.168.1.1';

    assert.equal(limiter.isLimited(ip), false);
    assert.equal(limiter.isLimited(ip), false);
    assert.equal(limiter.isLimited(ip), false);
  });

  it('21. should reject requests that exceed the maximum threshold', () => {
    const limiter = createRateLimiter(60000, 2);
    const ip = '10.0.0.1';

    assert.equal(limiter.isLimited(ip), false);
    assert.equal(limiter.isLimited(ip), false);
    assert.equal(limiter.isLimited(ip), true); // 3rd request exceeds limit of 2
  });

  it('22. should reset counter after window time expires', () => {
    const limiter = createRateLimiter(1000, 1);
    const ip = '172.16.0.5';
    const now = 100000;

    assert.equal(limiter.isLimited(ip, now), false);
    assert.equal(limiter.isLimited(ip, now + 500), true); // within window

    // After window expires (> 1000ms)
    assert.equal(limiter.isLimited(ip, now + 1500), false);
  });

  it('23. should isolate tracking per distinct IP addresses', () => {
    const limiter = createRateLimiter(60000, 1);
    assert.equal(limiter.isLimited('1.1.1.1'), false);
    assert.equal(limiter.isLimited('1.1.1.1'), true);

    // Different IP should still be allowed
    assert.equal(limiter.isLimited('2.2.2.2'), false);
  });
});
