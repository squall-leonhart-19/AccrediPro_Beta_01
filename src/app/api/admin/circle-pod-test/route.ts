import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import {
    buildSarahPrompt,
    buildZombiePrompt,
    calculateSarahDelay,
    calculateZombieDelay,
} from "@/data/circle-pod-knowledge";

/**
 * POST /api/admin/circle-pod-test
 * Test Circle Pod AI responses without creating real messages
 */
export async function POST(request: NextRequest) {
    try {
        // Check login (no admin required for testing)
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized - please login" }, { status: 401 });
        }

        // Skip admin check for now - just need to test

        const body = await request.json();
        const {
            userMessage,
            userName = "Jenna",
            zombieName = "Amber L.",
            conversationHistory = "",
        } = body;

        if (!userMessage) {
            return NextResponse.json({ error: "userMessage required" }, { status: 400 });
        }

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const zombieFirstName = zombieName.split(" ")[0];

        // Build user context
        const userContext = {
            firstName: userName,
            email: "test@example.com",
            certificationProgress: 15,
            daysInPod: 3,
            hasEngaged: true,
            lessonsCompleted: 4,
            unlockedResources: ["income-calculator"],
        };

        // Build zombie context
        const zombieContext = {
            name: zombieName,
            firstName: zombieFirstName,
            avatar: "/avatars/zombie-1.webp",
            age: 48,
            background: "Former ER nurse from Ohio, excited but nervous about this journey",
            goal: "Create genuine peer bond. Be the accountability partner who makes them feel less alone.",
            personality: ["Authentic and relatable", "Encouraging peer", "Slightly nervous but excited"],
            voice: "Casual, supportive peer. Uses contractions, casual language, emojis.",
            doList: [],
            dontList: [],
        };

        // Calculate delays
        const sarahDelayMinutes = Math.round(calculateSarahDelay());
        const zombieDelayMinutes = Math.round(calculateZombieDelay());

        // Generate Sarah response
        const sarahPrompt = buildSarahPrompt(userContext, zombieContext, conversationHistory, userMessage);
        let sarahResponse = "That's a great question! Let's explore that together 💛";
        try {
            const sarahAI = await anthropic.messages.create({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 200,
                system: sarahPrompt,
                messages: [{ role: "user", content: userMessage }],
            });
            if (sarahAI.content[0]?.type === "text") {
                sarahResponse = sarahAI.content[0].text;
            }
        } catch (e) {
            console.error("[TEST] Sarah AI error:", e);
        }

        // Generate Zombie response
        const zombiePrompt = buildZombiePrompt(userContext, zombieContext, conversationHistory, userMessage, sarahResponse);
        let zombieResponse = `Totally agree with Sarah! You got this ${userName}! 💪`;
        try {
            const zombieAI = await anthropic.messages.create({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 150,
                system: zombiePrompt,
                messages: [{ role: "user", content: userMessage }],
            });
            if (zombieAI.content[0]?.type === "text") {
                zombieResponse = zombieAI.content[0].text;
            }
        } catch (e) {
            console.error("[TEST] Zombie AI error:", e);
        }

        return NextResponse.json({
            sarah: {
                response: sarahResponse,
                delayMinutes: sarahDelayMinutes,
                prompt: sarahPrompt,
            },
            zombie: {
                response: zombieResponse,
                delayMinutes: zombieDelayMinutes,
                prompt: zombiePrompt,
            },
        });
    } catch (error) {
        console.error("[TEST] Error:", error);
        return NextResponse.json(
            { error: "Failed to generate responses" },
            { status: 500 }
        );
    }
}
