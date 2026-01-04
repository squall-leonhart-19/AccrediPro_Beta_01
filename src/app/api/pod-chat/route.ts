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
function shouldCoachRespond(message: string): boolean {
    const questionWords = ["how", "what", "why", "when", "where", "can", "should", "?"];
    const helpWords = ["help", "stuck", "confused", "don't understand", "struggling", "difficult"];
    const lowerMsg = message.toLowerCase();

    if (questionWords.some(w => lowerMsg.includes(w))) return true;
    if (helpWords.some(w => lowerMsg.includes(w))) return true;

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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message, conversationHistory, zombies, daysSinceEnrollment } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        const isFlagged = checkForFlags(message);
        const isCoachResponse = shouldCoachRespond(message);

        // Get student info for context
        const student = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                enrollments: {
                    include: {
                        course: { select: { title: true } }
                    }
                },
                streak: true,
            }
        });

        const studentContext = {
            name: `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "Student",
            enrolledCourses: student?.enrollments?.map(e => ({
                title: e.course.title,
                progress: Number(e.progress),
                status: e.status,
            })) || [],
            currentStreak: student?.streak?.currentStreak || 0,
        };

        // Load Coach Sarah's knowledge base
        let knowledgeContext = "";

        // 1. Try Coach Sarah's personal knowledge base from DB
        const coachSarah = await prisma.user.findFirst({
            where: { email: "sarah@accredipro-certificate.com" },
            select: { knowledgeBase: true }
        });

        if (coachSarah?.knowledgeBase) {
            knowledgeContext = `\n\nCoach Sarah's Knowledge Base:\n${coachSarah.knowledgeBase}\n\nINSTRUCTION: Use the above knowledge to answer questions. Prioritize this information.`;
        }

        // 2. Add relevant entries from general knowledge-base.json
        const generalKnowledge = await loadKnowledgeBase(message);
        if (generalKnowledge) {
            knowledgeContext += generalKnowledge;
        }

        // Determine responder
        let responderName: string;
        let responderPersonality: string;
        let responderAvatar: string;

        if (isCoachResponse) {
            responderName = "Coach Sarah M.";
            responderPersonality = "You are Coach Sarah M., a warm and encouraging functional medicine mentor. You're supportive, knowledgeable, and genuinely care about student success. You use emojis sparingly but naturally.";
            responderAvatar = "https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp";
        } else {
            const zombie = zombies?.[Math.floor(Math.random() * (zombies?.length || 1))];
            responderName = zombie?.name || "Fellow Student";
            responderAvatar = zombie?.avatar || "";

            // Zombies get SAME KNOWLEDGE but act as fellow students sharing experience
            const personalityPrompts: Record<string, string> = {
                leader: `You are ${responderName}, a fellow student who is doing well in the course. You share your experience and what worked for you. Speak as a peer who has done the modules, not as a coach. Say things like "I found that..." or "When I did Module X..." Be encouraging and helpful.`,
                struggler: `You are ${responderName}, a fellow student who sometimes struggles but stays positive. You relate to challenges and share how you overcame them. Say things like "I felt the same way!" or "What helped me was..." Be supportive and relatable.`,
                questioner: `You are ${responderName}, a curious fellow student who loves learning. You ask follow-up questions and engage thoughtfully. Say things like "That's interesting! Have you tried..." Be inquisitive and helpful.`,
                buyer: `You are ${responderName}, a motivated fellow student who invested in the Pro Accelerator and loves it. You naturally mention how valuable the investment was. Say things like "I upgraded to Pro and it was so worth it!" Be enthusiastic about the value.`,
            };
            responderPersonality = personalityPrompts[zombie?.personalityType || "leader"] || personalityPrompts.leader;
        }

        // Build conversation context (last 10 messages)
        const recentHistory = (conversationHistory || []).slice(-10).map((msg: { senderName: string; content: string }) =>
            `${msg.senderName}: ${msg.content}`
        ).join("\n");

        const systemPrompt = `${responderPersonality}

STUDENT INFO:
- Name: ${studentContext.name}
- Enrolled Courses: ${studentContext.enrolledCourses.map(c => `${c.title} (${c.progress}% complete)`).join(", ") || "Getting started"}
- Current Streak: ${studentContext.currentStreak} days
- Day ${daysSinceEnrollment || 1} of certification journey

CONTEXT:
- This is a study pod chat for the AccrediPro Functional Medicine Certification
- Be warm, supportive, and natural
- Use emojis if appropriate
- Never give medical advice - you're a coach, not a doctor
- If they mention Pro Accelerator or upgrading, be encouraging about it
${knowledgeContext}

RECENT CHAT:
${recentHistory}

Now respond to the student's latest message. Use your knowledge base when relevant.`;

        // Call Anthropic Claude Haiku
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4000, // Allow full complete responses
            messages: [
                { role: "user", content: message }
            ],
            system: systemPrompt,
        });

        const aiResponse = response.content[0].type === "text"
            ? response.content[0].text
            : "Keep going, you've got this! 💪";

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

    } catch (error) {
        console.error("Pod chat API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
