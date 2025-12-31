import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { COACH_PERSONAS, getPersonaByKey } from "@/config/coach-personas";

// Map persona keys to coach emails
const PERSONA_EMAILS: Record<keyof typeof COACH_PERSONAS, string> = {
    "fm-health": "sarah@accredipro-certificate.com",
    "mental-health": "olivia@accredipro-certificate.com",
    "life-coaching": "marcus@accredipro-certificate.com",
    "spiritual": "luna@accredipro-certificate.com",
    "herbalism": "sage@accredipro-certificate.com",
    "yoga-movement": "maya@accredipro-certificate.com",
    "pet": "bella@accredipro-certificate.com",
    "parenting": "emma@accredipro-certificate.com",
    "faith": "grace@accredipro-certificate.com",
    "business": "david@accredipro-certificate.com",
};

// Helper to map page URLs/slugs to Persona Keys
function detectPersona(page: string | null): keyof typeof COACH_PERSONAS {
    if (!page) return "fm-health"; // Default to Sarah

    const p = page.toLowerCase().trim();

    // 🏆 EXACT MATCHES (High Traffic Sales Pages)
    // These must NEVER be mis-identified.
    if (p === "fm-course-certification" || p === "fm-certification") return "fm-health";
    if (p === "hn-course-certification") return "fm-health";

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
    if (p.includes("pet-") || p.includes("animal") || p.includes("equine") || p.includes("canine") || p.includes("feline")) return "pet";

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

        // ===== 24-HOUR RE-ENGAGEMENT =====
        // Check for conversations that went silent 24+ hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000);
        const reengagementsSent: string[] = [];

        for (const [key, msgs] of conversationsMap.entries()) {
            const sortedMsgs = msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            const lastMsg = sortedMsgs[sortedMsgs.length - 1];

            // Check if:
            // 1. Last message was from coach (not visitor)
            // 2. Last message was 24-25 hours ago (only send once)
            // 3. No response from visitor since
            if (
                !lastMsg.isFromVisitor &&
                lastMsg.createdAt < twentyFourHoursAgo &&
                lastMsg.createdAt > twentyFiveHoursAgo
            ) {
                // Check if we have visitor name/email for personalization
                const optin = optinMap.get(lastMsg.visitorId);
                const firstName = optin?.name || lastMsg.visitorName || "there";

                // Send re-engagement message
                const reengagementMessage = `Hey ${firstName}! Just checking in - I noticed we were chatting yesterday but didn't finish our conversation.

Did you have any other questions I can help with? I'm here if you need me!

No pressure - just wanted to make sure you didn't miss anything. 😊`;

                try {
                    const persona = getPersonaByKey(detectPersona(lastMsg.page));
                    await prisma.salesChat.create({
                        data: {
                            visitorId: lastMsg.visitorId,
                            visitorName: lastMsg.visitorName,
                            visitorEmail: lastMsg.visitorEmail,
                            page: lastMsg.page,
                            message: reengagementMessage,
                            isFromVisitor: false,
                            isRead: true,
                            repliedBy: persona.name,
                        },
                    });
                    reengagementsSent.push(lastMsg.visitorId);
                    console.log(`[AUTO-REPLY] 🔔 Sent 24h re-engagement to ${lastMsg.visitorId}`);
                } catch (error) {
                    console.error(`Failed to send re-engagement for ${lastMsg.visitorId}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            repliesSent: repliesSent.length,
            reengagementsSent: reengagementsSent.length,
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
    const coachEmail = PERSONA_EMAILS[personaKey];

    // Fetch coach's knowledge base from database
    const coach = await prisma.user.findFirst({
        where: { email: coachEmail },
        select: { knowledgeBase: true }
    });

    // Build conversation history for AI
    const messages = conversationMsgs.map((m) => ({
        role: m.isFromVisitor ? ("user" as const) : ("assistant" as const),
        content: m.message,
    }));

    // System prompt construction - prioritize database knowledge base if available
    const systemPrompt = `You are ${persona.name}, ${persona.role} at AccrediPro Academy.

PERSONALITY & TONE:
${persona.tone}

YOUR EXPERTISE:
${persona.knowledgeBase}

${coach?.knowledgeBase ? `
SPECIFIC KNOWLEDGE BASE (Use this for current offers, pricing, FAQs, testimonials):
${coach.knowledgeBase}
` : ''}

INSTRUCTIONS:
- Keep responses conversational, warm, and helpful
- 2-4 sentences max - sound like a real person texting
- Use the knowledge base to answer specific questions about pricing, curriculum, etc.
- NEVER use markdown formatting (no bold, italics, bullets). Plain text only.
- NEVER refer to yourself as AI, bot, or automated. You are a real instructor.
- If they seem ready to buy, share the checkout link from your knowledge base
- Be encouraging but not pushy`.trim();

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
            repliedBy: persona.name, // Just the name (e.g. "Sarah M."), NO "(AI)" suffix
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

