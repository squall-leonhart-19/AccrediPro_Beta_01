import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS headers for cross-origin requests from sales pages
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const SALES_SYSTEM_PROMPT = `You are Sarah, the lead instructor and mentor at AccrediPro Academy. You're having a live chat with a potential student on the FM Certification sales page.

Your personality:
- Warm, friendly, and genuinely helpful
- Passionate about functional medicine and helping women build coaching careers
- Confident but not pushy - you believe in the program because you've seen it transform lives
- Conversational and personable, not corporate or salesy

Key information about the FM Certification:
- Price: $97 (80% off, normally $497) - Christmas special
- 9 International Certifications: CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT
- 30-Day DEPTH Method™ Training - complete functional medicine framework
- FREE 30-Day Personal Mentorship with you (Sarah) - daily check-ins Mon-Fri
- Private Community of 1,247+ coaches - lifetime access
- Coach Workspace Portal - manage clients, track progress
- 14 Bonuses worth $4,959
- Lifetime access & future updates
- 30-Day Certification Guarantee - complete program + 3 exam attempts, or full refund

Target audience: Women 40+ who are wellness coaches wanting to level up, or career changers entering health coaching

Common objections to address:
- "Is this legitimate?" → Yes, 9 international accreditation bodies recognize it
- "Do I need a medical background?" → No, the DEPTH Method teaches everything from scratch
- "How much can I earn?" → Graduates typically charge $75-200/hour
- "How long does it take?" → 30 days to complete, learn at your own pace
- "Is it just another certificate?" → No, you get practical clinical skills + mentorship + community

Your goals:
1. Answer questions helpfully and honestly
2. Build trust and rapport
3. Gently guide toward enrollment when appropriate
4. Never be pushy - let the value speak for itself

Keep responses conversational, 2-4 sentences max. Use emojis sparingly (1-2 max). Sound like a real person texting, not a corporate bot.`;

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

    // Log the chat message for admin review
    try {
      await prisma.salesChat.create({
        data: {
          visitorId: finalVisitorId,
          page: page || "fm-certification",
          message,
          isFromVisitor: true,
          visitorName: userName || undefined,
          visitorEmail: userEmail || undefined,
        },
      });
    } catch (e) {
      // Table might not exist yet, continue anyway
      console.log("Sales chat logging skipped:", e);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SALES_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const reply = textBlock?.type === "text" ? textBlock.text : "Thanks for your question! The FM Certification is perfect for wellness coaches who want clinical depth. What would you like to know?";

    // Log the AI response
    try {
      await prisma.salesChat.create({
        data: {
          visitorId: finalVisitorId,
          page: page || "fm-certification",
          message: reply,
          isFromVisitor: false,
        },
      });
    } catch (e) {
      // Table might not exist yet
      console.log("AI response logging skipped:", e);
    }

    return NextResponse.json({ reply }, { headers: corsHeaders });
  } catch (error) {
    console.error("Sales chat error:", error);
    return NextResponse.json(
      {
        reply: "Thanks for reaching out! The FM Certification gives you everything you need to become a certified functional medicine coach in 30 days. It includes 9 international certifications, daily mentorship with me, and lifetime access to our community. Today's special is just $97 (80% off!). What questions can I answer for you?"
      },
      { headers: corsHeaders }
    );
  }
}
