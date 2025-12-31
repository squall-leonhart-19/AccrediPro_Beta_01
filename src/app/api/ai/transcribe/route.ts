import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

/**
 * POST /api/ai/transcribe
 * Transcribe audio file using OpenAI Whisper
 *
 * Accepts: multipart/form-data with "audio" file
 * Returns: { success: true, text: "transcribed text" }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Transcription service not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const audioUrl = formData.get("audioUrl") as string;

    if (!audioFile && !audioUrl) {
      return NextResponse.json({ error: "Audio file or URL required" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });
    let transcription: string;

    if (audioFile) {
      // Direct file upload
      console.log(`🎤 Transcribing uploaded audio: ${audioFile.name} (${audioFile.size} bytes)`);

      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: "en",
      });

      transcription = response.text;
    } else if (audioUrl) {
      // Fetch from URL and transcribe
      console.log(`🎤 Transcribing audio from URL: ${audioUrl}`);

      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch audio from URL" }, { status: 400 });
      }

      const audioBlob = await audioResponse.blob();
      const audioFileFromUrl = new File([audioBlob], "audio.webm", { type: audioBlob.type });

      const response = await openai.audio.transcriptions.create({
        file: audioFileFromUrl,
        model: "whisper-1",
        language: "en",
      });

      transcription = response.text;
    } else {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    console.log(`✅ Transcription complete: "${transcription.substring(0, 100)}..."`);

    return NextResponse.json({
      success: true,
      text: transcription,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
