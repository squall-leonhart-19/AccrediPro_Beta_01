import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

// Check for conversations that need auto-reply
export async function GET() {
    try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        // Get all conversations
        const messages = await prisma.salesChat.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });

        // Get optins for visitor info
        const optins = await prisma.chatOptin.findMany();
        const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

        // Group messages by email/visitorId
        const conversationsMap = new Map<string, typeof messages>();

        messages.forEach((msg) => {
            const optin = optinMap.get(msg.visitorId);
            const email = optin?.email || msg.visitorEmail;
            const key = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, []);
            }
            conversationsMap.get(key)!.push(msg);
        });

        const repliesSent: Array<{ visitorId: string; messageCount: number }> = [];

        // Check each conversation for auto-reply eligibility
        for (const [key, msgs] of conversationsMap.entries()) {
            const sortedMsgs = msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            const lastMsg = sortedMsgs[sortedMsgs.length - 1];

            // Only process if:
            // 1. Last message is from visitor
            // 2. Last message was >2 minutes ago
            // 3. No admin reply exists yet
            if (
                lastMsg.isFromVisitor &&
                lastMsg.createdAt < twoMinutesAgo &&
                !sortedMsgs.some((m) => !m.isFromVisitor && m.createdAt > lastMsg.createdAt)
            ) {
                // Generate and send auto-reply
                try {
                    await sendAutoReply(sortedMsgs, lastMsg.visitorId);
                    repliesSent.push({ visitorId: lastMsg.visitorId, messageCount: sortedMsgs.length });
                } catch (error) {
                    console.error(`Failed to send auto-reply for ${lastMsg.visitorId}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            repliesSent: repliesSent.length,
            details: repliesSent,
        });
    } catch (error) {
        console.error("Auto-reply check failed:", error);
        return NextResponse.json({ error: "Auto-reply check failed" }, { status: 500 });
    }
}

async function sendAutoReply(conversationMsgs: any[], visitorId: string) {
    // Lazy initialize Anthropic only when needed (avoids build-time errors)
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build conversation history for AI
    const messages = conversationMsgs.map((m) => ({
        role: m.isFromVisitor ? ("user" as const) : ("assistant" as const),
        content: m.message,
    }));

    // System prompt (same as manual AI reply)
    const systemPrompt = `You are Sarah, the lead instructor and mentor at AccrediPro Academy. You're having a live chat with a potential student on the FM Certification sales page.

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

    const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.length > 0 ? messages : [{ role: "user", content: "Hi" }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const aiReply = textBlock?.type === "text" ? textBlock.text : "Thanks for reaching out! How can I help you today?";

    // Get visitor info for page
    const firstMsg = conversationMsgs[0];

    // Save AI reply to database
    await prisma.salesChat.create({
        data: {
            visitorId,
            visitorName: firstMsg.visitorName,
            visitorEmail: firstMsg.visitorEmail,
            page: firstMsg.page,
            message: aiReply,
            isFromVisitor: false,
            isRead: true,
            repliedBy: "Sarah (Auto)",
        },
    });

    // Mark all visitor messages as read
    await prisma.salesChat.updateMany({
        where: {
            visitorId,
            isFromVisitor: true,
            isRead: false,
        },
        data: { isRead: true },
    });

    console.log(`[AUTO-REPLY] ✅ Sent reply to visitor ${visitorId}`);
}
