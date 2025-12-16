import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SARAH_VOICE_ID = "uXRbZctVA9lTJBqMtWeE"; // Sarah's cloned voice

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow authenticated users (admin check optional for dev)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    console.log(`[TEST-AUDIO] User: ${session.user.email}, Role: ${session.user.role}`);

    const { text, stability, similarityBoost, style, speakerBoost, speed } =
      await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { success: false, error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    console.log(`🎙️ Generating test audio with params:`, {
      stability,
      similarityBoost,
      style,
      speakerBoost,
      speed,
      textLength: text.length,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${SARAH_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: stability ?? 0.5,
            similarity_boost: similarityBoost ?? 0.75,
            style: style ?? 0,
            use_speaker_boost: speakerBoost ?? true,
            speed: speed ?? 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs error:", errorText);
      return NextResponse.json(
        { success: false, error: `ElevenLabs API error: ${response.status}` },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    // Estimate duration (rough: ~150 chars per 10 seconds for this voice)
    const estimatedDuration = Math.round((text.length / 150) * 10);

    console.log(
      `✅ Test audio generated! Size: ${audioBuffer.byteLength} bytes, Est. duration: ~${estimatedDuration}s`
    );

    return NextResponse.json({
      success: true,
      audioBase64,
      duration: estimatedDuration,
      size: audioBuffer.byteLength,
    });
  } catch (error) {
    console.error("Test audio generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
