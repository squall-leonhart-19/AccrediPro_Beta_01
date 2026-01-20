import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Allowed file types whitelist - MIME types and extensions
const ALLOWED_FILE_TYPES: Record<string, { mimeTypes: string[]; extensions: string[] }> = {
  image: {
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  },
  voice: {
    mimeTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/ogg", "audio/mp4"],
    extensions: [".mp3", ".wav", ".webm", ".ogg", ".m4a"],
  },
  file: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv"],
  },
};

// Dangerous file extensions that should never be uploaded (even if they claim to be allowed types)
const BLOCKED_EXTENSIONS = [
  ".exe", ".dll", ".bat", ".cmd", ".ps1", ".sh", ".bash",
  ".php", ".jsp", ".asp", ".aspx", ".cgi", ".pl",
  ".js", ".mjs", ".ts", ".html", ".htm", ".svg",
  ".scr", ".com", ".pif", ".vbs", ".vbe", ".wsf", ".wsh",
];

/**
 * Validate file type against whitelist
 * Checks both MIME type and file extension for defense in depth
 */
function validateFileType(file: File, type: string): { valid: boolean; error?: string } {
  const allowedTypes = ALLOWED_FILE_TYPES[type];
  if (!allowedTypes) {
    return { valid: false, error: `Invalid upload type: ${type}` };
  }

  // Get file extension (lowercase)
  const fileName = file.name.toLowerCase();
  const ext = fileName.substring(fileName.lastIndexOf("."));

  // Check for blocked dangerous extensions
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    console.warn(`[UPLOAD] Blocked dangerous file extension: ${ext} for file ${file.name}`);
    return { valid: false, error: "This file type is not allowed for security reasons" };
  }

  // Validate extension
  if (!allowedTypes.extensions.includes(ext)) {
    return {
      valid: false,
      error: `File type ${ext} not allowed. Allowed: ${allowedTypes.extensions.join(", ")}`,
    };
  }

  // Validate MIME type
  if (!allowedTypes.mimeTypes.includes(file.type)) {
    // Some browsers report different MIME types, so warn but allow if extension matches
    console.warn(`[UPLOAD] MIME type mismatch: ${file.type} for ${file.name}, but extension ${ext} is allowed`);
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Initialize Supabase client inside the handler to avoid build-time errors
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Storage not configured - URL:", !!supabaseUrl, "Key:", !!supabaseKey);
      return NextResponse.json(
        { success: false, error: "Storage service not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "file"; // "image", "file", "voice"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type against whitelist (SECURITY: defense against malicious uploads)
    const typeValidation = validateFileType(file, type);
    if (!typeValidation.valid) {
      console.warn(`[UPLOAD] File type validation failed for ${file.name}: ${typeValidation.error}`);
      return NextResponse.json(
        { success: false, error: typeValidation.error },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Determine bucket and path based on type
    const bucket = "chat-attachments";
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${session.user.id}/${type}/${timestamp}-${sanitizedName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);

      // If bucket doesn't exist, create it and retry
      if (error.message?.includes("not found") || error.message?.includes("does not exist")) {
        // Try creating the bucket
        const { error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: maxSize,
        });

        if (!createError) {
          // Retry upload
          const { data: retryData, error: retryError } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

          if (retryError) {
            throw retryError;
          }

          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

          return NextResponse.json({
            success: true,
            data: {
              url: urlData.publicUrl,
              name: file.name,
              type: type,
              size: file.size,
            },
          });
        }
      }

      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        name: file.name,
        type: type,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
