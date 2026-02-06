import { NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/lib/elevenlabs";

/**
 * Voice Test API using ElevenLabs eleven_v3 model
 * Human-like and expressive speech generation, 70+ languages
 */

export async function POST(req: NextRequest) {
    try {
        const { text, settings } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (text.length > 5000) {
            return NextResponse.json(
                { error: "Text too long (max 5000 characters)" },
                { status: 400 }
            );
        }

        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { error: "ElevenLabs not configured" },
                { status: 500 }
            );
        }

        console.log(`🎙️ Voice test with ElevenLabs eleven_v3:`, settings);

        const result = await generateVoice(text, undefined, settings);

        if (!result.success || !result.audioBase64) {
            return NextResponse.json(
                { error: result.error || "Failed to generate voice" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            audio: `data:audio/mp3;base64,${result.audioBase64}`,
            duration: result.duration,
            model: "eleven_v3",
            settings,
        });
    } catch (error) {
        console.error("Voice test error:", error);
        return NextResponse.json(
            { error: "Failed to generate voice" },
            { status: 500 }
        );
    }
}
