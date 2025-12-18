import { NextRequest, NextResponse } from "next/server";
import { generateSarahVoice } from "@/lib/elevenlabs";

// Cache for generated audio to reduce API calls
const audioCache = new Map<string, { audio: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Rate limiting
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

function getClientIP(req: NextRequest): string {
    return req.headers.get("x-forwarded-for")?.split(",")[0] ||
           req.headers.get("x-real-ip") ||
           "unknown";
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const limit = rateLimits.get(ip);

    if (!limit || now > limit.resetTime) {
        rateLimits.set(ip, { count: 1, resetTime: now + 60000 });
        return true;
    }

    if (limit.count >= MAX_REQUESTS_PER_MINUTE) {
        return false;
    }

    limit.count++;
    return true;
}

function getCacheKey(text: string): string {
    // Create a simple hash of the text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `tts_${hash}`;
}

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const clientIP = getClientIP(req);
        if (!checkRateLimit(clientIP)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again in a minute." },
                { status: 429 }
            );
        }

        const { text } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Limit text length for public endpoint
        if (text.length > 1000) {
            return NextResponse.json(
                { error: "Text too long (max 1000 characters)" },
                { status: 400 }
            );
        }

        // Check cache first
        const cacheKey = getCacheKey(text);
        const cached = audioCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log("🎵 TTS cache hit");
            return NextResponse.json({
                success: true,
                audio: cached.audio,
                cached: true,
            });
        }

        // Generate with ElevenLabs (Sarah's voice)
        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { error: "Voice service not configured" },
                { status: 500 }
            );
        }

        console.log(`🎙️ Generating Sarah voice for public TTS (${text.length} chars)...`);

        const result = await generateSarahVoice(text);

        if (!result.success || !result.audioBase64) {
            console.error("ElevenLabs failed:", result.error);
            return NextResponse.json(
                { error: "Failed to generate voice" },
                { status: 500 }
            );
        }

        const audioDataUrl = `data:audio/mp3;base64,${result.audioBase64}`;

        // Cache the result
        audioCache.set(cacheKey, {
            audio: audioDataUrl,
            timestamp: Date.now(),
        });

        // Clean old cache entries periodically
        if (audioCache.size > 100) {
            const now = Date.now();
            for (const [key, value] of audioCache.entries()) {
                if (now - value.timestamp > CACHE_TTL) {
                    audioCache.delete(key);
                }
            }
        }

        return NextResponse.json({
            success: true,
            audio: audioDataUrl,
            duration: result.duration,
            cached: false,
        });
    } catch (error) {
        console.error("Public TTS error:", error);
        return NextResponse.json(
            { error: "Failed to generate voice" },
            { status: 500 }
        );
    }
}
