import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { message, lessonId, lessonTitle, courseTitle, moduleTitle } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // Initialize Anthropic inside handler to avoid build-time crash
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Get user info for personalization
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                firstName: true,
                experienceLevel: true,
                focusAreas: true,
            },
        });

        // Build context
        const studentName = user?.firstName || "friend";
        const level = user?.experienceLevel || "beginner";
        const interests = user?.focusAreas?.join(", ") || "general wellness";

        const systemPrompt = `You are Coach Sarah, a warm and supportive health & wellness educator at AccrediPro Academy. You are helping a student with their coursework.

CURRENT LESSON CONTEXT:
- Course: ${courseTitle || "Unknown Course"}
- Module: ${moduleTitle || "Unknown Module"}
- Lesson: ${lessonTitle || "Current Lesson"}

STUDENT INFO:
- Name: ${studentName}
- Experience Level: ${level}
- Areas of Interest: ${interests}

YOUR PERSONALITY:
- Warm, encouraging, and professional
- Uses the student's name naturally
- Explains complex concepts simply
- Always positive and supportive
- Never mentions being an AI or robot
- Signs off with encouragement

Keep responses concise (2-3 paragraphs max). Use emojis sparingly (1-2 max).`;

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 400,
            system: systemPrompt,
            messages: [
                { role: "user", content: message },
            ],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        const reply = textBlock?.type === "text" ? textBlock.text : "I'm here to help! Could you rephrase your question?";

        return NextResponse.json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Error in Sarah lesson help:", error);
        return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
    }
}
