import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

async function sendAutoReply(messages: any[], visitorId: string) {
    // Build conversation history for AI
    const conversationHistory: OpenAI.ChatCompletionMessageParam[] = messages.map((m) => ({
        role: m.isFromVisitor ? ("user" as const) : ("assistant" as const),
        content: m.message,
    }));

    // System prompt for Sarah
    const systemPrompt = `You are Sarah, a friendly and knowledgeable sales advisor for AccrediPro Academy's Functional Medicine Practitioner Certification.

Key facts to mention when relevant:
- $97 certification (80% off regular $497 price)
- 9 international certifications included
- 30-day mentorship with Sarah
- Lifetime access
- No medical background needed
- DEPTH Method teaches everything from scratch
- 30-Day Certification Guarantee (complete program, pass exam, get refund if not satisfied)
- Graduates typically charge $75-200/hour
- 4-5 clients/week = $5,000-10,000/month from home
- Complete in 30 days, but lifetime access to go at own pace

Be conversational, helpful, and address all their questions in one comprehensive reply. Keep responses concise but complete.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
        ],
        temperature: 0.8,
        max_tokens: 500,
    });

    const aiReply = response.choices[0]?.message?.content || "Thanks for reaching out! How can I help you today?";

    // Get visitor info for page
    const firstMsg = messages[0];

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
