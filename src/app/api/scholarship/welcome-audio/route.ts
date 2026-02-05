import { NextRequest, NextResponse } from "next/server";
import { generateSarahVoice } from "@/lib/elevenlabs";
import { createClient } from "@supabase/supabase-js";

// Cache for generated audio URLs (keyed by firstName)
const audioCache = new Map<string, { audioUrl: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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
        audio: cached.audioUrl,
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
    const welcomeText = `Congratulations ${cleanName}! Sarah here... BIG NEWS! You've qualified for our scholarship!`;

    console.log(`🎙️ Generating scholarship welcome audio for: ${cleanName}`);

    const result = await generateSarahVoice(welcomeText, {
      stability: 0.65,
      similarityBoost: 0.85,
      style: 0.35,
      speed: 0.95,
    });

    if (!result.success || !result.audioBase64) {
      console.error("ElevenLabs failed:", result.error);
      return NextResponse.json(
        { error: "Failed to generate welcome audio" },
        { status: 500 }
      );
    }

    // Upload to Supabase storage for cross-browser compatibility
    let audioUrl: string;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const bucket = "chat-attachments";
      const filePath = `scholarship-welcome/${cacheKey}-${Date.now()}.mp3`;

      const buffer = Buffer.from(result.audioBase64, "base64");

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: "audio/mpeg",
          cacheControl: "86400",
          upsert: false,
        });

      if (!error) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        audioUrl = urlData.publicUrl;
        console.log(`✅ Scholarship audio uploaded to Supabase: ${audioUrl}`);
      } else {
        console.warn(`Failed to upload to Supabase: ${error.message}, falling back to base64`);
        audioUrl = `data:audio/mpeg;base64,${result.audioBase64}`;
      }
    } else {
      // Fallback to base64 if Supabase not configured
      audioUrl = `data:audio/mpeg;base64,${result.audioBase64}`;
    }

    // Cache the result
    audioCache.set(cacheKey, {
      audioUrl,
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
      audio: audioUrl,
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
