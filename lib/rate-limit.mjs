// Simple IP-based rate limiting with rolling window using KV (Redis).
//
// Usage:
//   const limiter = new RateLimiter(kv_url, kv_token);
//   const allowed = await limiter.checkLimit(ip, endpoint, opts);
//   if (!allowed) return error_response;
//

export class RateLimiter {
  constructor(kvUrl, kvToken) {
    this.kvUrl = kvUrl;
    this.kvToken = kvToken;
    // In-memory fallback limiter: Map of "endpoint:ip:minute_bucket" -> count.
    // Used when Upstash KV is unavailable to degrade gracefully instead of failing open.
    this.inMemoryLimits = new Map();
    // Cleanup interval: remove stale buckets every 2 minutes to prevent unbounded growth.
    this.cleanupInterval = setInterval(() => this.cleanupStaleEntries(), 120000);
  }

  // Extract client IP from request headers (Vercel/Cloudflare edge context).
  static getClientIp(req) {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp;
    return req.headers.get('x-real-ip') || '0.0.0.0';
  }

  // Remove in-memory entries older than 2 minutes to prevent memory leak.
  cleanupStaleEntries() {
    const now = Date.now();
    const twoMinutesAgo = now - 120000;
    for (const [key] of this.inMemoryLimits) {
      // Key format: "endpoint:ip:minute_bucket"
      const parts = key.split(':');
      if (parts.length >= 3) {
        const minuteBucket = Number(parts[parts.length - 1]);
        const bucketTime = minuteBucket * 60000;
        if (bucketTime < twoMinutesAgo) {
          this.inMemoryLimits.delete(key);
        }
      }
    }
  }

  // Check if the IP can make a request to the given endpoint.
  // Returns true if within limits, false if rate-limited.
  // opts = { perMinute: 10, perHour: 100 }  (optional defaults applied)
  async checkLimit(ip, endpoint, opts = {}) {
    const perMinute = opts.perMinute ?? 10;
    const perHour = opts.perHour ?? 100;

    // Graceful failure: if KV is not configured, allow all requests.
    if (!this.kvUrl || !this.kvToken) return true;

    const now = Date.now();
    const minuteKey = `rl:${endpoint}:m:${ip}:${Math.floor(now / 60000)}`;
    const hourKey = `rl:${endpoint}:h:${ip}:${Math.floor(now / 3600000)}`;

    try {
      // Check both windows atomically.
      const result = await this.kvPipeline([
        ['INCR', minuteKey],
        ['EXPIRE', minuteKey, '90'],  // Keep for 90s to cover the full minute window
        ['INCR', hourKey],
        ['EXPIRE', hourKey, '3700'],  // Keep for 3700s to cover the full hour window
      ]);

      const minuteCount = Number(result[0]?.result || 0);
      const hourCount = Number(result[2]?.result || 0);

      // Allow if both are within limits.
      return minuteCount <= perMinute && hourCount <= perHour;
    } catch {
      // KV failure: degrade to in-memory fallback instead of failing open.
      // This bounds abuse per serverless instance without blocking all real users on a KV blip.
      return this.checkInMemoryLimit(ip, endpoint, perMinute);
    }
  }

  // In-memory rate limit fallback (per-instance, per-IP, per-minute).
  // Conservative: same cap as KV-based limit to maintain security during outages.
  checkInMemoryLimit(ip, endpoint, perMinute) {
    const now = Date.now();
    const minuteBucket = Math.floor(now / 60000);
    const key = `${endpoint}:${ip}:${minuteBucket}`;

    const current = this.inMemoryLimits.get(key) || 0;
    if (current >= perMinute) {
      return false; // Rate limited by in-memory fallback
    }

    this.inMemoryLimits.set(key, current + 1);
    return true; // Within limit
  }

  async kvPipeline(cmds) {
    const r = await fetch(`${this.kvUrl}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.kvToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds),
      signal: AbortSignal.timeout(2000),
    });
    if (!r.ok) throw new Error('kv ' + r.status);
    return r.json();
  }
}

export default RateLimiter;
