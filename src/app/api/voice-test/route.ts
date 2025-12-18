import { NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/lib/elevenlabs";

export async function POST(req: NextRequest) {
    try {
        const { text, settings } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (text.length > 1000) {
            return NextResponse.json(
                { error: "Text too long (max 1000 characters)" },
                { status: 400 }
            );
        }

        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { error: "ElevenLabs not configured" },
                { status: 500 }
            );
        }

        console.log(`🎙️ Voice test with settings:`, settings);

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
