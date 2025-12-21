import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CORS headers for cross-origin requests from sales pages
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, name, email, page } = body;

    if (!visitorId || !name) {
      return NextResponse.json(
        { error: "visitorId and name are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Skip if name is "Friend" (skipped optin)
    if (name === "Friend") {
      return NextResponse.json(
        { success: true, skipped: true },
        { headers: corsHeaders }
      );
    }

    // Get IP and user agent for tracking
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || null;
    const userAgent = request.headers.get("user-agent") || null;

    // Upsert the chat optin
    const optin = await prisma.chatOptin.upsert({
      where: { visitorId },
      update: {
        name,
        email: email || undefined,
        updatedAt: new Date(),
      },
      create: {
        visitorId,
        name,
        email: email || undefined,
        page: page || "unknown",
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json(
      { success: true, optinId: optin.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Chat optin error:", error);
    return NextResponse.json(
      { error: "Failed to save optin" },
      { status: 500, headers: corsHeaders }
    );
  }
}
