import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateVoiceWithSettings, VoiceSettings } from "@/lib/elevenlabs";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Admin only
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text, settings } = await request.json();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { success: false, error: "Text is required (min 10 characters)" },
        { status: 400 }
      );
    }

    // Generate voice with custom settings
    const voiceResult = await generateVoiceWithSettings(text, settings as VoiceSettings);

    if (!voiceResult.success || !voiceResult.audioBase64) {
      return NextResponse.json(
        { success: false, error: voiceResult.error || "Voice generation failed" },
        { status: 500 }
      );
    }

    // Upload to Supabase storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return base64 audio if Supabase not configured
      return NextResponse.json({
        success: true,
        audioUrl: `data:audio/mpeg;base64,${voiceResult.audioBase64}`,
        duration: voiceResult.duration,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucket = "chat-attachments";
    const filePath = `test/voice-test-${Date.now()}.mp3`;

    // Convert base64 to buffer
    const buffer = Buffer.from(voiceResult.audioBase64, "base64");

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      // Try creating bucket if it doesn't exist
      if (error.message?.includes("not found") || error.message?.includes("does not exist")) {
        await supabase.storage.createBucket(bucket, { public: true });
        const { error: retryError } = await supabase.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: "audio/mpeg",
            cacheControl: "3600",
            upsert: false,
          });
        if (retryError) {
          throw retryError;
        }
      } else {
        throw error;
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      audioUrl: urlData.publicUrl,
      duration: voiceResult.duration,
    });
  } catch (error) {
    console.error("Voice test error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
