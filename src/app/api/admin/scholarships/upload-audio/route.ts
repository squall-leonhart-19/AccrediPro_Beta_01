import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * POST /api/admin/scholarships/upload-audio
 *
 * Upload audio file for voice messages in scholarship chat.
 * Saves to public/audio/voice-messages/
 *
 * Body: FormData with:
 *   - audio: File (audio blob)
 *   - visitorId: string
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audio = formData.get("audio") as File | null;
    const visitorId = formData.get("visitorId") as string | null;

    if (!audio || !visitorId) {
      return NextResponse.json({ error: "Audio file and visitorId are required" }, { status: 400 });
    }

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "audio", "voice-messages");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedVisitorId = visitorId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `vm_${sanitizedVisitorId}_${timestamp}.webm`;
    const filepath = join(uploadDir, filename);

    // Write file
    const buffer = Buffer.from(await audio.arrayBuffer());
    await writeFile(filepath, buffer);

    // Return public URL
    const audioUrl = `/audio/voice-messages/${filename}`;

    console.log(`[Audio Upload] Saved voice message: ${audioUrl} for ${visitorId}`);

    return NextResponse.json({
      success: true,
      audioUrl,
    });
  } catch (error) {
    console.error("[Audio Upload] Error:", error);
    return NextResponse.json({ error: "Failed to upload audio" }, { status: 500 });
  }
}
