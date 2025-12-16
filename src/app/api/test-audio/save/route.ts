import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as fs from "fs";
import * as path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to save audio files
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { audioBase64, filename } = await request.json();

    if (!audioBase64 || !filename) {
      return NextResponse.json(
        { success: false, error: "audioBase64 and filename are required" },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "-");

    // Ensure audio directory exists
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(audioDir, sanitizedFilename);
    const buffer = Buffer.from(audioBase64, "base64");
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ Audio saved to: ${filePath} (${buffer.length} bytes)`);

    return NextResponse.json({
      success: true,
      path: `/audio/${sanitizedFilename}`,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Save audio error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save audio" },
      { status: 500 }
    );
  }
}
