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
        ...(email ? { email } : {}),
        updatedAt: new Date(),
      },
      create: {
        visitorId,
        name,
        email: email || null,
        page: page || "unknown",
        ipAddress,
        userAgent,
      },
    });

    // === SEQUENCE ENROLLMENT TRIGGER ===
    // If email is provided, check if eligible for chat-conversion sequence
    if (email) {
      try {
        // Check if this email is already a customer (User exists)
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        });

        // Only proceed if NOT already a customer
        if (!existingUser) {
          // Find the chat-conversion sequence
          const chatSequence = await prisma.sequence.findFirst({
            where: {
              slug: "chat-conversion",
              isActive: true
            }
          });

          if (chatSequence) {
            console.log(`[CHAT-OPTIN] 📧 Lead ${email} eligible for chat-conversion sequence`);
            // Note: Actual enrollment happens via the cron job that processes
            // chat optins and creates temporary User records for sequence enrollment
          }
        } else {
          console.log(`[CHAT-OPTIN] ✅ ${email} is already a customer, skipping sequence`);
        }
      } catch (enrollError) {
        // Don't fail the optin if enrollment logic fails
        console.error("[CHAT-OPTIN] Enrollment check error:", enrollError);
      }
    }

    return NextResponse.json(
      { success: true, optinId: optin.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Chat optin error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to save optin", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
