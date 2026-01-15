import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client using Vercel KV environment variables
// These are auto-populated when you connect Upstash via Vercel Storage
export const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

// =============================================================================
// RATE LIMITERS
// =============================================================================

// API Rate Limiter - 100 requests per 10 seconds per IP
export const apiRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "10 s"),
    analytics: true,
    prefix: "ratelimit:api",
});

// Auth Rate Limiter - 5 login attempts per minute per IP (prevent brute force)
export const authRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
});

// Lead Capture Rate Limiter - 3 submissions per hour per IP
export const leadRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "ratelimit:lead",
});

// =============================================================================
// CACHE HELPERS
// =============================================================================

const DEFAULT_CACHE_TTL = 60 * 5; // 5 minutes

/**
 * Get cached data or fetch and cache
 */
export async function getOrSetCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = DEFAULT_CACHE_TTL
): Promise<T> {
    try {
        // Try to get from cache
        const cached = await redis.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        // Fetch fresh data
        const data = await fetchFn();

        // Cache it
        await redis.set(key, data, { ex: ttlSeconds });

        return data;
    } catch (error) {
        // If Redis fails, just fetch directly
        console.error("Redis cache error:", error);
        return fetchFn();
    }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(keyOrPattern: string): Promise<void> {
    try {
        if (keyOrPattern.includes("*")) {
            // Pattern-based invalidation
            const keys = await redis.keys(keyOrPattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } else {
            await redis.del(keyOrPattern);
        }
    } catch (error) {
        console.error("Redis invalidation error:", error);
    }
}

// =============================================================================
// CACHE KEYS
// =============================================================================

export const CACHE_KEYS = {
    // Course data (cached for 5 min)
    course: (slug: string) => `course:${slug}`,
    courseList: "courses:list",

    // User progress (cached for 1 min)
    userProgress: (userId: string, courseId: string) => `progress:${userId}:${courseId}`,

    // Leaderboard (cached for 2 min)
    leaderboard: "leaderboard:global",

    // Directory (cached for 10 min)
    directory: "directory:professionals",

    // Stats (cached for 5 min)
    stats: "stats:global",
};
