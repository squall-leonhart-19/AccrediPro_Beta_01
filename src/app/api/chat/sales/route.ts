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
    const { message, page, visitorId, userName, userEmail, isFromVisitor, repliedBy } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400, headers: corsHeaders });
    }

    const finalVisitorId = visitorId || "anonymous_" + Date.now();

    // Default to visitor message unless explicitly set to false (admin/Sarah message)
    const isMsgFromVisitor = isFromVisitor !== false;

    // Save chat optin if we have a name (only for visitor messages)
    if (isMsgFromVisitor && userName && userName !== "Friend") {
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

    // Log the chat message for admin review
    // NOTE: repliedBy is a FK to User.id — only use valid user IDs or null.
    // For auto-messages from "Sarah M. (Auto)", we set repliedBy to null
    // since there's no real User record. The isFromVisitor=false flag is
    // sufficient to identify it as a Sarah/admin message.
    let finalRepliedBy: string | null = null;
    if (!isMsgFromVisitor && repliedBy) {
      // Check if repliedBy looks like a cuid (valid User ID) vs a display name
      const looksLikeId = /^[a-z0-9]{20,}$/.test(repliedBy) || repliedBy.startsWith("cl");
      finalRepliedBy = looksLikeId ? repliedBy : null;
    }

    const savedMsg = await prisma.salesChat.create({
      data: {
        visitorId: finalVisitorId,
        page: page || "fm-certification",
        message,
        isFromVisitor: isMsgFromVisitor,
        visitorName: userName || null,
        visitorEmail: userEmail || null,
        repliedBy: finalRepliedBy,
      },
    });

    // Debug logging
    if (!isMsgFromVisitor) {
      console.log(`[SalesChat] 💬 Saved SARAH message: visitorId=${finalVisitorId}, page=${page}, repliedBy=${repliedBy}`);
    }

    // Return acknowledgment
    return NextResponse.json({
      reply: isMsgFromVisitor
        ? "Thanks for your message! I'm reading it now and will respond shortly. 💬"
        : "Message saved",
      status: "received"
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Sales chat error:", error);
    // Return 500 so callers know the save FAILED (don't mask with 200)
    return NextResponse.json(
      {
        error: "Failed to save message",
        reply: "Thanks for reaching out! I got your message and will respond shortly.",
        status: "error"
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
