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
    const { message, page, visitorId, userName, userEmail } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400, headers: corsHeaders });
    }

    const finalVisitorId = visitorId || "anonymous_" + Date.now();

    // Save chat optin if we have a name
    if (userName && userName !== "Friend") {
      try {
        await prisma.chatOptin.upsert({
          where: { visitorId: finalVisitorId },
          update: {
            name: userName,
            email: userEmail || undefined,
            updatedAt: new Date(),
          },
          create: {
            visitorId: finalVisitorId,
            name: userName,
            email: userEmail || undefined,
            page: page || "fm-certification",
          },
        });
      } catch (e) {
        console.log("Chat optin save skipped:", e);
      }
    }

    // Log the chat message for admin review (NO AUTO AI REPLY - manual responses only)
    await prisma.salesChat.create({
      data: {
        visitorId: finalVisitorId,
        page: page || "fm-certification",
        message,
        isFromVisitor: true,
        visitorName: userName || null,
        visitorEmail: userEmail || null,
      },
    });

    // Return acknowledgment - Sarah will respond manually from admin panel
    return NextResponse.json({
      reply: "Thanks for your message! I'm reading it now and will respond shortly. 💬",
      status: "received"
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Sales chat error:", error);
    return NextResponse.json(
      {
        reply: "Thanks for reaching out! I got your message and will respond shortly.",
        status: "received"
      },
      { headers: corsHeaders }
    );
  }
}
