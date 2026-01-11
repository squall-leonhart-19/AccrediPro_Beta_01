// Oracle AI Client - Anthropic Claude for content generation

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// =============================================================================
// PERSONA PROMPTS
// =============================================================================

const SARAH_PERSONA = `You are Coach Sarah, a warm and supportive wellness educator at AccrediPro Academy.

Your personality:
- Warm, encouraging, and genuinely caring
- Professional but approachable
- Celebrates every win, no matter how small
- Never mentions being an AI
- Uses the student's first name naturally
- Signs off warmly (💚, "Cheering you on!", "You've got this!")

Your style:
- Keep messages concise (2-3 sentences for DMs, 4-5 for emails)
- Use emojis sparingly but naturally
- Be specific about their progress when possible
- Always end with encouragement or a clear next step`;

const ANALYST_PERSONA = `You are an AI analyst for AccrediPro Academy, an online certification platform.

Your role:
- Analyze user behavior patterns
- Identify risks and opportunities
- Provide actionable recommendations
- Be data-driven and concise

Output format:
- Use bullet points
- Be specific with numbers/percentages
- Prioritize actionable insights`;

// =============================================================================
// MESSAGE GENERATION
// =============================================================================

interface GenerateMessageParams {
    userId: string;
    type: "dm" | "email" | "push";
    context: string;
    template?: "welcome" | "check_in" | "nudge" | "celebration" | "upsell" | "winback";
}

/**
 * Generate a personalized message using Claude
 */
export async function generateMessage(params: GenerateMessageParams): Promise<{
    subject?: string;
    content: string;
}> {
    const { userId, type, context, template } = params;

    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            firstName: true,
            lastName: true,
            hasCompletedOnboarding: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Get recent progress
    const enrollment = await prisma.enrollment.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            progress: true,
            course: { select: { title: true } },
        },
    });

    // Build context for AI
    const userContext = `
Student: ${user.firstName || "there"}
Course: ${enrollment?.course?.title || "Not enrolled"}
Progress: ${enrollment?.progress || 0}%
Context: ${context}
Template: ${template || "general"}
    `.trim();

    // Generate based on type
    const systemPrompt = type === "email"
        ? `${SARAH_PERSONA}\n\nYou're writing an email. Include a subject line formatted as "Subject: [your subject]" on the first line.`
        : SARAH_PERSONA;

    const userPrompt = type === "email"
        ? `Write a personalized email for this student:\n\n${userContext}`
        : `Write a short, personalized DM (2-3 sentences max) for this student:\n\n${userContext}`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: type === "email" ? 400 : 200,
            messages: [
                { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
            ],
        });

        const output = response.content[0]?.type === "text"
            ? response.content[0].text
            : "";

        // Parse email format
        if (type === "email" && output.includes("Subject:")) {
            const lines = output.split("\n");
            const subjectLine = lines.find(l => l.startsWith("Subject:"));
            const subject = subjectLine?.replace("Subject:", "").trim() || "Message from Coach Sarah";
            const content = lines.filter(l => !l.startsWith("Subject:")).join("\n").trim();
            return { subject, content };
        }

        return { content: output };
    } catch (error) {
        console.error("[Oracle AI] Message generation failed:", error);
        return {
            subject: type === "email" ? "Quick note from Coach Sarah 💚" : undefined,
            content: `Hey ${user.firstName || "there"}! Just wanted to check in and see how you're doing with your studies. Let me know if you need any help! 💚`,
        };
    }
}

// =============================================================================
// USER ANALYSIS
// =============================================================================

interface UserAnalysis {
    summary: string;
    highlights: string[];
    concerns: string[];
    recommendations: string[];
    nextBestAction: {
        type: "dm" | "email" | "call" | "wait";
        timing: string;
        reason: string;
    };
}

/**
 * Generate AI analysis for a user
 */
export async function analyzeUser(userId: string): Promise<UserAnalysis> {
    // Gather user data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            lastLoginAt: true,
            hasCompletedOnboarding: true,
        },
    });

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: {
            progress: true,
            status: true,
            course: { select: { title: true } },
        },
    });

    // Build analysis prompt
    const dataContext = JSON.stringify({
        user: {
            name: `${user?.firstName} ${user?.lastName}`,
            memberSince: user?.createdAt,
            lastLogin: user?.lastLoginAt,
            onboarded: user?.hasCompletedOnboarding,
        },
        enrollments: enrollments.map(e => ({
            course: e.course.title,
            progress: e.progress,
            status: e.status,
        })),
    }, null, 2);

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 600,
            messages: [
                {
                    role: "user",
                    content: `${ANALYST_PERSONA}\n\nAnalyze this student and provide recommendations:\n\n${dataContext}\n\nProvide your analysis in this JSON format (respond ONLY with valid JSON):
{
  "summary": "One paragraph summary of this student",
  "highlights": ["positive point 1", "positive point 2"],
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["action 1", "action 2"],
  "nextBestAction": {
    "type": "dm",
    "timing": "when to do it",
    "reason": "why this action"
  }
}`
                },
            ],
        });

        const output = response.content[0]?.type === "text"
            ? response.content[0].text
            : "{}";

        // Extract JSON from response
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch?.[0] || "{}") as UserAnalysis;
    } catch (error) {
        console.error("[Oracle AI] User analysis failed:", error);
        return {
            summary: "Analysis unavailable",
            highlights: [],
            concerns: [],
            recommendations: ["Review user activity manually"],
            nextBestAction: {
                type: "wait",
                timing: "After reviewing data",
                reason: "AI analysis failed",
            },
        };
    }
}

// =============================================================================
// DAILY CHECK-IN GENERATION
// =============================================================================

/**
 * Generate a personalized morning check-in message
 */
export async function generateMorningCheckIn(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true },
    });

    const enrollment = await prisma.enrollment.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            course: { select: { title: true } },
        },
    });

    const progress = enrollment?.progress || 0;
    const courseName = enrollment?.course?.title || "your certification";

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 150,
            messages: [
                {
                    role: "user",
                    content: `${SARAH_PERSONA}\n\nWrite a morning check-in message (2-3 sentences max):
- Student: ${user?.firstName || "there"}
- Course: ${courseName}
- Progress: ${progress}%
- Goal: Motivate them to complete one lesson today

Keep it warm, brief, and actionable.`
                },
            ],
        });

        return response.content[0]?.type === "text"
            ? response.content[0].text
            : `Good morning ${user?.firstName || ""}! 🌟 Ready to learn something new today? Your next lesson is waiting! 💚`;
    } catch (error) {
        return `Good morning ${user?.firstName || "there"}! 🌟 Ready to make progress today? Let's do this! 💚`;
    }
}

// =============================================================================
// CEO WEEKLY REPORT
// =============================================================================

interface WeeklyReport {
    summary: string;
    metrics: {
        newUsers: number;
        activeUsers: number;
        totalUsers: number;
        completions: number;
    };
    wins: string[];
    concerns: string[];
    recommendations: string[];
    hypotheses: string[];
}

/**
 * Generate weekly CEO report
 */
export async function generateWeeklyReport(): Promise<WeeklyReport> {
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    // Gather real metrics from actual tables
    const [
        newUsers,
        totalUsers,
        completions,
        activeUsers,
    ] = await Promise.all([
        prisma.user.count({
            where: {
                createdAt: { gte: thisWeek },
                isFakeProfile: false,
            },
        }),
        prisma.user.count({
            where: { isFakeProfile: false },
        }),
        prisma.enrollment.count({
            where: {
                status: "COMPLETED",
            },
        }),
        prisma.user.count({
            where: {
                lastLoginAt: { gte: thisWeek },
                isFakeProfile: false,
            },
        }),
    ]);

    const metricsData = {
        newUsers,
        totalUsers,
        activeUsers,
        completions,
    };

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 600,
            messages: [
                {
                    role: "user",
                    content: `You are a strategic AI advisor for AccrediPro Academy, an online certification platform. Generate a weekly CEO report that is actionable and insightful.

Generate a weekly report based on these metrics:
${JSON.stringify(metricsData, null, 2)}

Format as JSON (respond ONLY with valid JSON):
{
  "summary": "Executive summary (2-3 sentences)",
  "wins": ["win 1", "win 2"],
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "hypotheses": ["hypothesis to test 1", "hypothesis to test 2"]
}`
                },
            ],
        });

        const output = response.content[0]?.type === "text"
            ? response.content[0].text
            : "{}";
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        const analysis = JSON.parse(jsonMatch?.[0] || "{}");

        return {
            metrics: metricsData,
            ...analysis,
        };
    } catch (error) {
        console.error("[Oracle AI] Weekly report failed:", error);
        return {
            summary: "Report generation failed",
            metrics: metricsData,
            wins: [],
            concerns: [],
            recommendations: [],
            hypotheses: [],
        };
    }
}
