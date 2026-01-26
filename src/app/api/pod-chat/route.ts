import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Flag keywords for admin attention
const FLAG_KEYWORDS = [
    "refund", "cancel", "angry", "frustrated", "disappointed",
    "not working", "broken", "scam", "lawsuit", "lawyer",
    "money back", "waste of money", "terrible", "horrible"
];

// Determine if Coach Sarah or zombie should respond
function shouldCoachRespond(message: string, isFirstMessage: boolean): boolean {
    // Coach Sarah ALWAYS responds first to student's first message
    if (isFirstMessage) return true;

    // Coach Sarah responds to appreciation/thanks
    const appreciationWords = ["thank", "thanks", "appreciate", "grateful", "love this", "amazing"];
    const lowerMsg = message.toLowerCase();
    if (appreciationWords.some(w => lowerMsg.includes(w))) return true;

    // Coach Sarah responds to questions
    const questionWords = ["how", "what", "why", "when", "where", "can", "should", "?"];
    const helpWords = ["help", "stuck", "confused", "don't understand", "struggling", "difficult"];

    if (questionWords.some(w => lowerMsg.includes(w))) return true;
    if (helpWords.some(w => lowerMsg.includes(w))) return true;

    // 30% chance for other messages
    return Math.random() < 0.3;
}

// Calculate realistic delay based on response length - OPTIMIZED FOR LIVE FEEL
function calculateDelay(responseLength: number): number {
    if (responseLength < 30) {
        return 1500 + Math.random() * 1000; // 1.5-2.5 sec
    } else if (responseLength < 80) {
        return 2500 + Math.random() * 1500; // 2.5-4 sec
    } else {
        return 4000 + Math.random() * 2000; // 4-6 sec
    }
}

// Check for flagged keywords
function checkForFlags(message: string): boolean {
    const lowerMsg = message.toLowerCase();
    return FLAG_KEYWORDS.some(keyword => lowerMsg.includes(keyword));
}

// Detect if this is the student's first message (introduction)
function isFirstMessage(conversationHistory: { senderType: string }[]): boolean {
    // Check if there are any previous user messages
    const userMessages = (conversationHistory || []).filter(msg => msg.senderType === "user");
    return userMessages.length === 0;
}

// Import Mastermind Resources
import resourceData from "@/data/mastermind-resources.json";

// Check if message matches any high-value resource
function checkForResourceMatch(message: string): { resource: typeof resourceData.resources[0], context: string } | null {
    const lowerMsg = message.toLowerCase();

    for (const res of resourceData.resources) {
        // specific trigger keywords for this resource
        if (res.trigger_keywords.some(kw => lowerMsg.includes(kw))) {
            return {
                resource: res,
                context: `\n\n[CRITICAL OPPORTUNITY]: The student asked about "${res.trigger_keywords.find(k => lowerMsg.includes(k))}".\nYOU HAVE A HIGH-VALUE ASSET FOR THIS: "${res.title}".\nValue Prop: ${res.value_proposition}\n\nINSTRUCTION: Briefly mention you have a specific tool/guide that helped you with exactly this. Do not ask if they want it. Just say you are attaching it below. Be confident. It's a gift.`
            };
        }
    }
    return null;
}

// Load knowledge base from JSON file and search for relevant entries
async function loadKnowledgeBase(studentMessage: string): Promise<string> {
    try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const knowledgePath = path.join(process.cwd(), "src/data/knowledge-base.json");
        const knowledgeData = await fs.readFile(knowledgePath, "utf-8");
        const knowledge = JSON.parse(knowledgeData);

        const lowerMessage = studentMessage.toLowerCase();
        const relevantEntries: string[] = [];

        for (const category of knowledge.categories || []) {
            for (const entry of category.entries || []) {
                const question = (entry.question || "").toLowerCase();
                // Simple keyword matching
                const keywords = lowerMessage.split(/\s+/).filter((w: string) => w.length > 3);
                if (keywords.some((kw: string) => question.includes(kw))) {
                    relevantEntries.push(`Q: ${entry.question}\nA: ${entry.answer}`);
                }
            }
        }

        if (relevantEntries.length > 0) {
            return `\n\nRelevant Knowledge Base:\n${relevantEntries.slice(0, 3).join("\n\n")}`;
        }
        return "";
    } catch (error) {
        console.log("Knowledge base not found:", error);
        return "";
    }
}

// Generate AI response for a specific responder
async function generateResponse(
    responderName: string,
    responderPersonality: string,
    studentName: string,
    message: string,
    recentHistory: string,
    knowledgeContext: string,
    daysSinceEnrollment: number,
    resourceInjection: { resource: typeof resourceData.resources[0], context: string } | null
): Promise<string> {
    const systemPrompt = `${responderPersonality}

STUDENT INFO:
- Name: ${studentName}
- Day ${daysSinceEnrollment || 1} of certification journey

CONTEXT:
- This is a study pod chat for the AccrediPro Functional Medicine Certification
- Be warm, supportive, and natural
- Keep responses SHORT and casual (2-4 sentences max)
- Use emojis naturally but sparingly
- Never give medical advice
- If they mention Pro Accelerator or upgrading, be encouraging about it
${knowledgeContext}
${resourceInjection ? resourceInjection.context : ""}

RECENT CHAT:
${recentHistory}

Now respond to the student's latest message. Keep it short and natural like a real chat message.${resourceInjection ? " Mention the " + resourceInjection.resource.type + " you are sharing." : ""}`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 256,
            messages: [
                { role: "user", content: message }
            ],
            system: systemPrompt,
        });

        let finalText = "";
        const firstBlock = response.content[0];
        if (firstBlock.type === "text") {
            finalText = firstBlock.text;
        } else {
            finalText = "Welcome! So glad you're here! 💕";
        }

        // Append attachment tag if resource was injected
        if (resourceInjection) {
            finalText += `\n\n<<<ATTACHMENT:${resourceInjection.resource.id}>>>`;
        }

        return response.content[0].type === "text"
            ? finalText
            : "Welcome! So glad you're here! 💕";
    } catch (error) {
        console.error(`[pod-chat] Error generating response for ${responderName}:`, error);
        return `Welcome! We're so happy you joined us! 💕`;
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("[pod-chat] Starting request...");

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            console.log("[pod-chat] Unauthorized - no session");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log("[pod-chat] Session OK, user:", session.user.id);

        const { message, conversationHistory, zombies, daysSinceEnrollment, trigger } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }
        console.log("[pod-chat] Message received:", message.substring(0, 30));

        const isFlagged = checkForFlags(message);
        const isFirst = isFirstMessage(conversationHistory);
        const isCoachResponse = shouldCoachRespond(message, isFirst);

        console.log("[pod-chat] isFirstMessage:", isFirst, "isCoachResponse:", isCoachResponse);

        // Get student info for context
        let studentName = "Student";
        let studentFirstName = "";

        try {
            const student = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    firstName: true,
                    lastName: true,
                }
            });
            studentFirstName = student?.firstName || "";
            studentName = `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "Student";
        } catch (studentErr) {
            console.error("[pod-chat] Error fetching student:", studentErr);
        }

        // Load Coach Sarah's knowledge base
        let knowledgeContext = "";

        try {
            const coachSarah = await prisma.user.findFirst({
                where: { email: "sarah@accredipro-certificate.com" },
                select: { knowledgeBase: true }
            });

            if (coachSarah?.knowledgeBase) {
                knowledgeContext = `\n\nCoach Sarah's Knowledge Base:\n${coachSarah.knowledgeBase}\n\nINSTRUCTION: Use the above knowledge to answer questions. Prioritize this information.`;
            }
        } catch (coachErr) {
            console.error("[pod-chat] Error fetching coach knowledge:", coachErr);
        }

        // Add relevant entries from general knowledge-base.json
        try {
            const generalKnowledge = await loadKnowledgeBase(message);
            if (generalKnowledge) {
                knowledgeContext += generalKnowledge;
            }
        } catch (kbErr) {
            console.error("[pod-chat] Error loading knowledge base:", kbErr);
        }

        // Build conversation context (last 10 messages)
        const recentHistory = (conversationHistory || []).slice(-10).map((msg: { senderName: string; content: string }) =>
            `${msg.senderName}: ${msg.content}`
        ).join("\n");

        // Check for resource match - Only active for Coach Sarah responses
        const resourceMatch = !isFirst ? checkForResourceMatch(message) : null;

        // HANDLE DAILY STANDUP TRIGGER
        if (trigger === "daily_standup") {
            console.log("[pod-chat] Triggering Daily Standup sequence");
            const standupPrompt = `You are Coach Sarah M. It is a new day for ${studentFirstName || "the student"}.
            ACTION: proactively ask them what their ONE BIG GOAL is for today.
            Be short, inspiring, and direct.
            Example: "Good morning ${studentFirstName || ""}! ☀️ Ready to crush it? What is your main focus for today?"
            Do NOT mention "standup" or "trigger". Just ask.`;

            const response = await generateResponse(
                "Coach Sarah M.",
                standupPrompt,
                studentName,
                "What is my goal today?", // Simulate user asking themselves
                recentHistory,
                "",
                daysSinceEnrollment,
                null
            );

            return NextResponse.json({
                success: true,
                response: {
                    id: `standup-${Date.now()}`,
                    senderName: "Coach Sarah M.",
                    senderAvatar: "https://assets.accredipro.academy/fm-certification/Sarah-M.webp",
                    senderType: "coach",
                    content: response,
                    createdAt: new Date().toISOString(),
                    isCoach: true,
                }
            });
        }

        // HANDLE RE-ENGAGEMENT TRIGGER (Student absent > 3 days)
        if (trigger === "re_engagement") {
            const prompt = `You are Coach Sarah M. The student ${studentFirstName} hasn't been active for a few days.
            ACTION: Welcome them back warmly. Acknowledge that life gets busy (no guilt).
            Suggest a small "15 minute win" to get back on track.
            Example: "Hey ${studentFirstName}! Missed you in the pod! 👋 I know life gets crazy. Want to spend just 15 mins on the next video today?"`;

            const response = await generateResponse(
                "Coach Sarah M.",
                prompt,
                studentName,
                "I'm back.",
                recentHistory,
                "",
                daysSinceEnrollment,
                null
            );

            return NextResponse.json({
                success: true,
                response: {
                    id: `reengage-${Date.now()}`,
                    senderName: "Coach Sarah M.",
                    senderAvatar: "https://assets.accredipro.academy/fm-certification/Sarah-M.webp",
                    senderType: "coach",
                    content: response,
                    createdAt: new Date().toISOString(),
                    isCoach: true,
                }
            });
        }

        // If this is the student's FIRST message, trigger welcome sequence
        if (isFirst) {
            console.log("[pod-chat] First message detected - triggering welcome sequence");

            const responses: {
                id: string;
                senderName: string;
                senderAvatar: string;
                senderType: "coach" | "zombie";
                content: string;
                createdAt: string;
                isCoach: boolean;
                delay: number;
            }[] = [];

            // 1. Coach Sarah responds immediately (5-10 sec delay)
            const sarahPersonality = `You are Coach Sarah M., a warm and encouraging functional medicine mentor.
This is ${studentFirstName || "a new student"}'s FIRST message introducing themselves to the pod.
Welcome them warmly BY NAME. Reference something specific they mentioned.
Be personal and excited they're here. Keep it short (2-3 sentences).
Example: "Hey ${studentFirstName || "friend"}! 🌿 So glad you're here! [reference their background/goal]"`;

            const sarahResponse = await generateResponse(
                "Coach Sarah M.",
                sarahPersonality,
                studentName,
                message,
                recentHistory,
                knowledgeContext,
                daysSinceEnrollment,
                null // No resource injection for welcome message
            );

            responses.push({
                id: `response-${Date.now()}-sarah`,
                senderName: "Coach Sarah M.",
                senderAvatar: "https://assets.accredipro.academy/fm-certification/Sarah-M.webp",
                senderType: "coach",
                content: sarahResponse,
                createdAt: new Date().toISOString(),
                isCoach: true,
                delay: 5000 + Math.random() * 5000, // 5-10 sec
            });

            // 2. Pick 2-3 random zombies to welcome (staggered delays)
            const availableZombies = zombies?.slice(0, 5) || [];
            const welcomeZombieCount = Math.min(2 + Math.floor(Math.random() * 2), availableZombies.length); // 2-3 zombies
            const shuffledZombies = [...availableZombies].sort(() => Math.random() - 0.5);
            const welcomeZombies = shuffledZombies.slice(0, welcomeZombieCount);

            for (let i = 0; i < welcomeZombies.length; i++) {
                const zombie = welcomeZombies[i];
                const baseDelay = 30000 + (i * 45000); // 30s, 75s, 120s base
                const randomOffset = Math.random() * 30000; // +0-30s random

                // Personalized prompt per zombie to avoid robotic sameness
                let specificVoice = "";
                if (zombie.name.includes("Gina")) specificVoice = "You are high energy! Use emojis and say 'omg'.";
                else if (zombie.name.includes("Lisa")) specificVoice = "You are shy but sweet. Use all lowercase. No emojis.";
                else if (zombie.name.includes("Amber")) specificVoice = "You are calm and supportive. proper punctuation. warm tone.";
                else if (zombie.name.includes("Cheryl")) specificVoice = "You are curious. Always ask a question.";
                else if (zombie.name.includes("Denise")) specificVoice = "You are excited and motivated! Short punchy sentences.";

                const zombiePersonality = `You are ${zombie.name}, a fellow student in this pod.
A new student named ${studentFirstName || "someone new"} just introduced themselves.
Welcome them briefly.
${specificVoice}
VARIANCE RULE: Do NOT say "so happy you're here" or "welcome to the community". Use your own words.
Keep it very short (1-2 sentences max).`;

                const zombieResponse = await generateResponse(
                    zombie.name,
                    zombiePersonality,
                    studentName,
                    message,
                    recentHistory + `\nCoach Sarah M.: ${sarahResponse}`,
                    "",
                    daysSinceEnrollment,
                    null // No resource injection for zombie welcome
                );

                responses.push({
                    id: `response-${Date.now()}-${zombie.name.replace(/\s+/g, '')}`,
                    senderName: zombie.name,
                    senderAvatar: zombie.avatar || "",
                    senderType: "zombie",
                    content: zombieResponse,
                    createdAt: new Date().toISOString(),
                    isCoach: false,
                    delay: baseDelay + randomOffset,
                });
            }

            // Return multiple responses for welcome sequence
            return NextResponse.json({
                success: true,
                isWelcomeSequence: true,
                responses,
                isFlagged,
            });
        }

        // Normal response flow (not first message)
        let responderName: string;
        let responderPersonality: string;
        let responderAvatar: string;

        // Force Coach Sarah if resource match found
        if (isCoachResponse || resourceMatch) {
            responderName = "Coach Sarah M.";
            responderPersonality = "You are Coach Sarah M., a warm and encouraging functional medicine mentor. You're supportive, knowledgeable, and genuinely care about student success. You use emojis sparingly but naturally. Keep responses conversational and short (2-4 sentences).";
            responderAvatar = "https://assets.accredipro.academy/fm-certification/Sarah-M.webp";
        } else {
            const zombie = zombies?.[Math.floor(Math.random() * (zombies?.length || 1))];
            responderName = zombie?.name || "Fellow Student";
            responderAvatar = zombie?.avatar || "";

            // Zombies act as fellow students sharing experience
            // Zombies act as fellow students sharing experience - STRICT PERSONALITY RULES
            const personalityPrompts: Record<string, string> = {
                leader: `You are ${responderName} (Gina/Amber). You are doing well. confident. 
                If Gina: Use emojis, high energy, say "omg", "totally". 
                If Amber: Calm, supportive, proper punctuation.
                Speak as a peer. Short (2 sentences). VARIANCE: Do NOT repeat previous phrases.`,

                struggler: `You are ${responderName} (Lisa). You struggle but stay positive.
                STYLE: use all lowercase. no emojis. sound a bit unsure but hopeful.
                Say things like "i felt that too" or "took me a while". Short.`,

                questioner: `You are ${responderName} (Cheryl). You are curious.
                STYLE: Always ask a follow up question. "have you tried...?" "what about...?"
                Friendly but inquisitive. Short.`,

                buyer: `You are ${responderName} (Denise). You invested in Pro.
                STYLE: Enthusiastic, decisive. Mention specific modules you loved.
                Short punchy sentences.`,
            };
            responderPersonality = personalityPrompts[zombie?.personalityType || "leader"] || personalityPrompts.leader;
        }

        console.log("[pod-chat] Responder:", responderName);

        const aiResponse = await generateResponse(
            responderName,
            responderPersonality,
            studentName,
            message,
            recentHistory,
            knowledgeContext,
            daysSinceEnrollment,
            isCoachResponse || resourceMatch ? resourceMatch : null // Only Sarah shares resources
        );

        const delay = calculateDelay(aiResponse.length);

        return NextResponse.json({
            success: true,
            response: {
                id: `response-${Date.now()}`,
                senderName: responderName,
                senderAvatar: responderAvatar,
                senderType: isCoachResponse ? "coach" : "zombie",
                content: aiResponse,
                createdAt: new Date().toISOString(),
                isCoach: isCoachResponse,
            },
            delay,
            isFlagged,
        });

    } catch (error: any) {
        console.error("Pod chat API error:", error);
        console.error("Error details:", error?.message, error?.status);
        return NextResponse.json(
            { error: "Failed to generate response", details: error?.message },
            { status: 500 }
        );
    }
}
