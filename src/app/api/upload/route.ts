import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

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

    console.log("DEBUG Upload - NEXT_PUBLIC_SUPABASE_URL exists:", !!supabaseUrl, "value:", supabaseUrl?.substring(0, 30));
    console.log("DEBUG Upload - SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log("DEBUG Upload - NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
    const type = formData.get("type") as string; // "image", "file", "voice"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
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
