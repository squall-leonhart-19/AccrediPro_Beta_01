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

// Calculate realistic delay based on response length
function calculateDelay(responseLength: number): number {
    if (responseLength < 30) {
        return 3000 + Math.random() * 2000; // 3-5 sec
    } else if (responseLength < 80) {
        return 8000 + Math.random() * 7000; // 8-15 sec
    } else {
        return 15000 + Math.random() * 10000; // 15-25 sec
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
    daysSinceEnrollment: number
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

RECENT CHAT:
${recentHistory}

Now respond to the student's latest message. Keep it short and natural like a real chat message.`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 256,
            messages: [
                { role: "user", content: message }
            ],
            system: systemPrompt,
        });

        return response.content[0].type === "text"
            ? response.content[0].text
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

        const { message, conversationHistory, zombies, daysSinceEnrollment } = await req.json();

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
                daysSinceEnrollment
            );

            responses.push({
                id: `response-${Date.now()}-sarah`,
                senderName: "Coach Sarah M.",
                senderAvatar: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp",
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

                const zombiePersonality = `You are ${zombie.name}, a fellow student in this pod.
A new student named ${studentFirstName || "someone new"} just introduced themselves.
Welcome them briefly and warmly as a peer (NOT as a coach).
Be casual and friendly. Keep it very short (1-2 sentences max).
Examples:
- "welcome ${studentFirstName || ""}!! so happy you're here 💕"
- "hey ${studentFirstName || ""}! excited to have you in the pod!"
- "welcome!! you're gonna love it here 🎉"`;

                const zombieResponse = await generateResponse(
                    zombie.name,
                    zombiePersonality,
                    studentName,
                    message,
                    recentHistory + `\nCoach Sarah M.: ${sarahResponse}`,
                    "",
                    daysSinceEnrollment
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

        if (isCoachResponse) {
            responderName = "Coach Sarah M.";
            responderPersonality = "You are Coach Sarah M., a warm and encouraging functional medicine mentor. You're supportive, knowledgeable, and genuinely care about student success. You use emojis sparingly but naturally. Keep responses conversational and short (2-4 sentences).";
            responderAvatar = "https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp";
        } else {
            const zombie = zombies?.[Math.floor(Math.random() * (zombies?.length || 1))];
            responderName = zombie?.name || "Fellow Student";
            responderAvatar = zombie?.avatar || "";

            // Zombies act as fellow students sharing experience
            const personalityPrompts: Record<string, string> = {
                leader: `You are ${responderName}, a fellow student who is doing well in the course. You share your experience and what worked for you. Speak as a peer who has done the modules, not as a coach. Say things like "I found that..." or "When I did Module X..." Be encouraging and helpful. Keep it short (2-3 sentences).`,
                struggler: `You are ${responderName}, a fellow student who sometimes struggles but stays positive. You relate to challenges and share how you overcame them. Say things like "I felt the same way!" or "What helped me was..." Be supportive and relatable. Keep it short (2-3 sentences).`,
                questioner: `You are ${responderName}, a curious fellow student who loves learning. You ask follow-up questions and engage thoughtfully. Say things like "That's interesting! Have you tried..." Be inquisitive and helpful. Keep it short (2-3 sentences).`,
                buyer: `You are ${responderName}, a motivated fellow student who invested in the Pro Accelerator and loves it. You naturally mention how valuable the investment was. Say things like "I upgraded to Pro and it was so worth it!" Be enthusiastic about the value. Keep it short (2-3 sentences).`,
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
            daysSinceEnrollment
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
