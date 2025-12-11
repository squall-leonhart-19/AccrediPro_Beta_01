import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin/instructor/mentor to use TTS
    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "TTS service not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const { text, voice = "nova" } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length for cost control
    if (text.length > 1000) {
      return NextResponse.json({ error: "Text too long (max 1000 characters)" }, { status: 400 });
    }

    // Generate speech using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: text,
      response_format: "mp3",
    });

    // Convert to base64
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    // Calculate approximate duration (TTS is about 150 words/minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.ceil((wordCount / 150) * 60);

    return NextResponse.json({
      success: true,
      audio: `data:audio/mp3;base64,${base64Audio}`,
      duration: estimatedDuration,
      voice,
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
