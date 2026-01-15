import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/ai";

/**
 * AI Ticket Triage Endpoint
 * 
 * Uses Claude Haiku 4.5 to analyze tickets and provide:
 * - Sentiment (frustrated/neutral/happy)
 * - Auto-suggested category
 * - Auto-suggested priority
 * - Resolution prediction
 * - Suggested response type
 */

interface TriageResult {
    sentiment: "frustrated" | "neutral" | "happy";
    sentimentEmoji: string;
    category: string;
    suggestedPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    resolutionPrediction: string;
    resolutionConfidence: number;
    suggestedDepartment: string;
    suggestedAction: string;
    keyIssues: string[];
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ticketId } = await request.json();

        if (!ticketId) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        // Fetch ticket with messages
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                    take: 10, // Last 10 messages for context
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        enrollments: { select: { course: { select: { title: true } } } },
                    },
                },
            },
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Build context for AI
        const conversationHistory = ticket.messages
            .map((m) => `${m.isFromCustomer ? "Customer" : "Agent"}: ${m.content}`)
            .join("\n\n");

        const enrolledCourses = ticket.user?.enrollments
            ?.map((e) => e.course?.title)
            .filter(Boolean)
            .join(", ") || "None";

        const prompt = `You are an AI ticket triage system for AccrediPro Academy, an online learning platform for health certifications.

Analyze this support ticket and provide a structured JSON response.

TICKET INFORMATION:
- Subject: ${ticket.subject}
- Customer: ${ticket.customerName} (${ticket.customerEmail})
- Current Status: ${ticket.status}
- Current Priority: ${ticket.priority}
- Enrolled Courses: ${enrolledCourses}
- Created: ${ticket.createdAt.toISOString()}

CONVERSATION:
${conversationHistory || "No messages yet. Only the subject is available."}

Respond ONLY with a valid JSON object (no markdown, no explanation):

{
  "sentiment": "frustrated" | "neutral" | "happy",
  "category": "REFUND" | "BILLING" | "TECHNICAL" | "ACCESS" | "CERTIFICATES" | "COURSE_CONTENT" | "GENERAL",
  "suggestedPriority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  "resolutionPrediction": "Brief description of likely resolution (e.g., 'Password reset link' or 'Refund processing')",
  "resolutionConfidence": 0-100,
  "suggestedDepartment": "SUPPORT" | "BILLING" | "LEGAL" | "ACADEMIC" | "CREDENTIALING" | "TECHNICAL",
  "suggestedAction": "Brief suggested first action (e.g., 'Send login reset link' or 'Escalate to billing team')",
  "keyIssues": ["array", "of", "key", "issues"]
}`;

        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        const aiResponse = textBlock?.type === "text" ? textBlock.text : "";

        if (!aiResponse) {
            return NextResponse.json({ error: "Failed to analyze ticket" }, { status: 500 });
        }

        // Parse JSON response
        let triage: TriageResult;
        try {
            // Clean up potential markdown wrapping
            const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const parsed = JSON.parse(jsonStr);

            // Add emoji based on sentiment
            const emojiMap = {
                frustrated: "😤",
                neutral: "😐",
                happy: "😊",
            };

            triage = {
                ...parsed,
                sentimentEmoji: emojiMap[parsed.sentiment as keyof typeof emojiMap] || "😐",
            };
        } catch (parseError) {
            console.error("[AI Triage] Parse error:", parseError, "Response:", aiResponse);
            // Return default triage if parsing fails
            triage = {
                sentiment: "neutral",
                sentimentEmoji: "😐",
                category: "GENERAL",
                suggestedPriority: "MEDIUM",
                resolutionPrediction: "Requires manual review",
                resolutionConfidence: 50,
                suggestedDepartment: "SUPPORT",
                suggestedAction: "Review ticket manually",
                keyIssues: ["Unable to auto-analyze"],
            };
        }

        return NextResponse.json({ triage });

    } catch (error) {
        console.error("[AI Triage] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
