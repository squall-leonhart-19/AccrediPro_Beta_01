import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { COACH_PERSONAS, getPersonaByKey } from "@/config/coach-personas";

// Helper to map page URLs/slugs to Persona Keys
function detectPersona(page: string | null): keyof typeof COACH_PERSONAS {
    if (!page) return "fm-health"; // Default to Sarah

    const p = page.toLowerCase();

    // 🧠 MENTAL HEALTH (Olivia)
    if (p.includes("narcissistic") || p.includes("trauma") || p.includes("abuse") || p.includes("grief") || p.includes("addiction") || p.includes("neuro") || p.includes("adhd") || p.includes("autism") || p.includes("anxiety") || p.includes("depression")) return "mental-health";

    // 🎯 LIFE COACHING (Marcus)
    if (p.includes("life-coach") || p.includes("career") || p.includes("finance") || p.includes("money") || p.includes("habit") || p.includes("success") || p.includes("confidence")) return "life-coaching";

    // 🔮 SPIRITUAL (Luna)
    if (p.includes("spiritual") || p.includes("energy") || p.includes("reiki") || p.includes("chakra") || p.includes("crystal") || p.includes("tarot") || p.includes("astrology") || p.includes("sacred") || p.includes("manifest")) return "spiritual";

    // 🌿 HERBALISM (Sage)
    if (p.includes("herbal") || p.includes("plant") || p.includes("ayurveda") || p.includes("tcm") || p.includes("chinese") || p.includes("naturopath")) return "herbalism";

    // 🧘 YOGA/MOVEMENT (Maya)
    if (p.includes("yoga") || p.includes("somatic") || p.includes("movement") || p.includes("breath") || p.includes("sound") || p.includes("music") || p.includes("meditation")) return "yoga-movement";

    // 🐾 PET (Bella)
    if (p.includes("pet") || p.includes("animal") || p.includes("equine") || p.includes("canine") || p.includes("feline")) return "pet";

    // 👨‍👩‍👧 PARENTING (Emma)
    if (p.includes("parent") || p.includes("family") || p.includes("kid") || p.includes("teen") || p.includes("couple")) return "parenting";

    // 🙏 FAITH (Grace)
    if (p.includes("christian") || p.includes("faith") || p.includes("biblical") || p.includes("ministry") || p.includes("jesus")) return "faith";

    // 💼 BUSINESS (David)
    if (p.includes("business") || p.includes("marketing") || p.includes("practice-building")) return "business";

    // 🏥 DEFAULT: FM/HEALTH (Sarah)
    // Covers: fm-course-certification, hn-course-certification, women, hormone, gut, fitness, etc.
    return "fm-health";
}

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

        const repliesSent: Array<{ visitorId: string; messageCount: number; persona: string }> = [];

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
                    const personaKey = await sendAutoReply(sortedMsgs, lastMsg.visitorId);
                    repliesSent.push({
                        visitorId: lastMsg.visitorId,
                        messageCount: sortedMsgs.length,
                        persona: personaKey
                    });
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

async function sendAutoReply(conversationMsgs: any[], visitorId: string): Promise<string> {
    // Lazy initialize Anthropic only when needed
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Determine Persona
    const firstMsg = conversationMsgs[0];
    const personaKey = detectPersona(firstMsg.page);
    const persona = getPersonaByKey(personaKey);

    // Build conversation history for AI
    const messages = conversationMsgs.map((m) => ({
        role: m.isFromVisitor ? ("user" as const) : ("assistant" as const),
        content: m.message,
    }));

    // System prompt construction

    // 🌍 SYSTEM-WIDE KNOWLEDGE (Applies to ALL Personas)
    const GLOBAL_SALES_LOGIC = `
[GLOBAL BUSINESS RULES - APPLY TO ALL QUESTIONS]
1. PRICE: The certifications are normally $497-$997, but TODAY they are on special for just $97.
2. ACCESS: All programs are 100% online, self-paced, and include LIFETIME access.
3. ACCREDITATION: We are accredited by 9 international bodies including CMA, IPHM, and IAOTH. Graduates can practice in 30+ countries.
4. GUARANTEE: "Success or Your Money Back" - If they complete the course and don't feel confident to practice, we refund them in full.
5. EARNING POTENTIAL: Certified coaches typically charge $100-$300 per hour.
6. START: They can start immediately after purchase.
    `.trim();

    const systemPrompt = `
You are ${persona.name}, ${persona.role}.
You are interacting with a potential student on AccrediPro Academy.

${GLOBAL_SALES_LOGIC}

YOUR SPECIFIC EXPERTISE (Use this for niche questions):
${persona.knowledgeBase}

YOUR PERSONALITY:
${persona.tone}

INSTRUCTIONS:
- Keep responses conversational, warm, and helpful.
- Approx 2-4 sentences max.
- ALWAYS pivot to the $97 offer if they ask about price or "how to join".
- If they ask about a topic you cover, respond with expertise.
- If they ask about something totally unrelated to your niche, gently pivot or mention we have 400+ courses.
    `.trim();

    const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001", // Or standard Haiku if this ID is internal
        max_tokens: 400,
        system: systemPrompt,
        messages: messages.length > 0 ? messages : [{ role: "user", content: "Hi" }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const aiReply = textBlock?.type === "text" ? textBlock.text : "Thanks for reaching out! How can I help you today?";

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
            repliedBy: `${persona.name} (AI)`, // e.g., "Sarah (AI)" or "Olivia (AI)"
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

    console.log(`[AUTO-REPLY] ✅ Sent reply to visitor ${visitorId} as ${persona.name}`);
    return personaKey;
}

