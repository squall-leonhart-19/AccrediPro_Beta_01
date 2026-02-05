import { NextRequest, NextResponse } from "next/server";
import { generateSarahVoice } from "@/lib/elevenlabs";

// Cache for generated audio to save API calls (keyed by firstName)
const audioCache = new Map<string, { audio: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours - names don't change often

// Rate limiting per IP
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 5;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
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

    const { firstName } = await req.json();

    if (!firstName || firstName.trim().length === 0) {
      return NextResponse.json({ error: "firstName is required" }, { status: 400 });
    }

    // Sanitize and limit firstName
    const cleanName = firstName.trim().slice(0, 30).replace(/[^a-zA-Z\s'-]/g, "");
    if (!cleanName) {
      return NextResponse.json({ error: "Invalid firstName" }, { status: 400 });
    }

    // Check cache first
    const cacheKey = cleanName.toLowerCase();
    const cached = audioCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`🎵 Scholarship welcome audio cache hit for: ${cleanName}`);
      return NextResponse.json({
        success: true,
        audio: cached.audio,
        cached: true,
      });
    }

    // Check if ElevenLabs is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn("ELEVENLABS_API_KEY not set");
      return NextResponse.json(
        { error: "Voice service not configured" },
        { status: 500 }
      );
    }

    // Generate personalized welcome message
    // Keep it SHORT (under 10 seconds) for best engagement
    const welcomeText = `Congratulations ${cleanName}! Sarah here... BIG NEWS! You've qualified for our scholarship!`;

    console.log(`🎙️ Generating scholarship welcome audio for: ${cleanName}`);

    const result = await generateSarahVoice(welcomeText, {
      stability: 0.65,       // Slightly more stable for consistency
      similarityBoost: 0.85, // High similarity to Sarah's voice
      style: 0.35,           // A bit more expressive for excitement
      speed: 0.95,           // Natural pace, slightly faster for energy
    });

    if (!result.success || !result.audioBase64) {
      console.error("ElevenLabs failed:", result.error);
      return NextResponse.json(
        { error: "Failed to generate welcome audio" },
        { status: 500 }
      );
    }

    const audioDataUrl = `data:audio/mpeg;base64,${result.audioBase64}`;

    // Cache the result
    audioCache.set(cacheKey, {
      audio: audioDataUrl,
      timestamp: Date.now(),
    });

    // Clean old cache entries periodically
    if (audioCache.size > 500) {
      const now = Date.now();
      for (const [key, value] of audioCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          audioCache.delete(key);
        }
      }
    }

    console.log(`✅ Scholarship welcome audio generated for: ${cleanName} (~${result.duration}s)`);

    return NextResponse.json({
      success: true,
      audio: audioDataUrl,
      duration: result.duration,
      cached: false,
    });
  } catch (error) {
    console.error("Scholarship welcome audio error:", error);
    return NextResponse.json(
      { error: "Failed to generate welcome audio" },
      { status: 500 }
    );
  }
}
