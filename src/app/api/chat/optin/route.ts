import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmail } from "@/lib/neverbounce";

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

    // Verify email with NeverBounce before storing (prevents bounces later)
    let verifiedEmail: string | null = null;
    if (email) {
      console.log(`[CHAT-OPTIN] 🔍 Verifying email with NeverBounce: ${email}`);
      const emailVerification = await verifyEmail(email);

      if (emailVerification.isValid) {
        verifiedEmail = email.toLowerCase();
        console.log(`[CHAT-OPTIN] ✅ Email verified (${emailVerification.result}): ${email}`);
      } else {
        console.log(`[CHAT-OPTIN] ⚠️ Invalid email rejected (${emailVerification.result}): ${email} - ${emailVerification.reason}`);
        // Return error so user knows to fix their email
        return NextResponse.json(
          {
            error: "Invalid email address",
            reason: emailVerification.reason || "Please enter a valid email address",
            suggestedEmail: emailVerification.suggestedEmail,
          },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Upsert the chat optin (only store verified emails)
    const optin = await prisma.chatOptin.upsert({
      where: { visitorId },
      update: {
        name,
        ...(verifiedEmail ? { email: verifiedEmail } : {}),
        updatedAt: new Date(),
      },
      create: {
        visitorId,
        name,
        email: verifiedEmail,
        page: page || "unknown",
        ipAddress,
        userAgent,
      },
    });

    // === TAG APPLICATION & SEQUENCE ENROLLMENT ===
    // If verified email is provided, check for User record and apply appropriate tag
    if (verifiedEmail) {
      try {
        // Check if this email has a User record
        const existingUser = await prisma.user.findUnique({
          where: { email: verifiedEmail },
          include: { marketingTags: { select: { tagId: true } } }
        });

        if (existingUser) {
          // Check if they've completed a course (already customer)
          const hasCompletedEnrollment = await prisma.enrollment.findFirst({
            where: {
              userId: existingUser.id,
              status: "COMPLETED"
            }
          });

          if (!hasCompletedEnrollment) {
            // Find the chat_lead tag
            const chatLeadTag = await prisma.marketingTag.findFirst({
              where: { name: "chat_lead" }
            });

            if (chatLeadTag) {
              // Check if already has this tag
              const hasTag = existingUser.marketingTags.some(t => t.tagId === chatLeadTag.id);

              if (!hasTag) {
                await prisma.userMarketingTag.create({
                  data: {
                    userId: existingUser.id,
                    tagId: chatLeadTag.id,
                    source: "chat_optin",
                  }
                });
                console.log(`[CHAT-OPTIN] 🏷️ Applied chat_lead tag to ${verifiedEmail}`);
              }
            }

            // Check if chat-conversion sequence is active
            const chatSequence = await prisma.sequence.findFirst({
              where: { slug: "chat-conversion", isActive: true }
            });
            if (chatSequence) {
              console.log(`[CHAT-OPTIN] 📧 Lead ${verifiedEmail} eligible for chat-conversion sequence`);
            }
          } else {
            console.log(`[CHAT-OPTIN] ✅ ${verifiedEmail} is already a customer, skipping tag/sequence`);
          }
        }
      } catch (enrollError) {
        // Don't fail the optin if tag/enrollment logic fails
        console.error("[CHAT-OPTIN] Tag/enrollment error:", enrollError);
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
