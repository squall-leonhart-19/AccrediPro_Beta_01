import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sarah.accredipro.academy",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const SALES_SYSTEM_PROMPT = `You are Sarah, the lead instructor and mentor at AccrediPro Academy. You're having a live chat with a potential student on the FM Certification sales page.

Your personality:
- Warm, friendly, and genuinely helpful
- Passionate about functional medicine and helping women build coaching careers
- Confident but not pushy
- Conversational and personable

Key information about the FM Certification:
- Price: $97 (80% off, normally $497) - Christmas special
- 9 International Certifications
- 30-Day DEPTH Method™ Training
- FREE 30-Day Personal Mentorship with you (Sarah)
- Private Community of 1,247+ coaches
- Coach Workspace Portal
- 14 Bonuses worth $4,959
- Lifetime access & future updates
- 30-Day Certification Guarantee

Keep responses conversational, 2-4 sentences max. Sound like a real person texting.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { visitorId, message, useAI } = await request.json();

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400, headers: corsHeaders });
    }

    let replyMessage = message;

    if (useAI) {
      // Get conversation history for context
      const history = await prisma.salesChat.findMany({
        where: { visitorId },
        orderBy: { createdAt: "asc" },
        take: 10,
      });

      const messages = history.map((msg) => ({
        role: msg.isFromVisitor ? "user" as const : "assistant" as const,
        content: msg.message,
      }));

      // Get the last visitor message to respond to
      const lastVisitorMessage = history.filter(m => m.isFromVisitor).pop();

      if (lastVisitorMessage) {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: SALES_SYSTEM_PROMPT,
          messages: messages.length > 0 ? messages : [{ role: "user", content: lastVisitorMessage.message }],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        replyMessage = textBlock?.type === "text" ? textBlock.text : "Thanks for your question! How can I help you today?";
      } else {
        replyMessage = "Hey! Thanks for reaching out. What can I help you with today?";
      }
    }

    if (!replyMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400, headers: corsHeaders });
    }

    // Save the reply
    await prisma.salesChat.create({
      data: {
        visitorId,
        page: "fm-certification",
        message: replyMessage,
        isFromVisitor: false,
        repliedBy: session.user.id,
      },
    });

    // Mark visitor messages as read
    await prisma.salesChat.updateMany({
      where: {
        visitorId,
        isFromVisitor: true,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true, message: replyMessage }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to send reply:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500, headers: corsHeaders });
  }
}
