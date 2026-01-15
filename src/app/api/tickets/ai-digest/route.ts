import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// GET: Fetch latest digest (for support dashboard widget)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all open tickets for quick stats
        const tickets = await prisma.supportTicket.findMany({
            where: {
                status: { in: ["NEW", "OPEN", "PENDING"] },
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        // Calculate stats
        const now = new Date();
        const stats = {
            new: tickets.filter(t => t.status === "NEW").length,
            open: tickets.filter(t => t.status === "OPEN").length,
            pending: tickets.filter(t => t.status === "PENDING").length,
            urgent: tickets.filter(t => t.priority === "URGENT" || t.priority === "HIGH").length,
            total: tickets.length,
        };

        // Find tickets waiting > 24h for response
        const overdue24h = tickets.filter(t => {
            const lastMsg = t.messages[0];
            if (!lastMsg) return false;
            const hours = (now.getTime() - new Date(lastMsg.createdAt).getTime()) / (1000 * 60 * 60);
            return lastMsg.isFromCustomer && hours > 24;
        });

        // Find tickets waiting > 4h
        const overdue4h = tickets.filter(t => {
            const lastMsg = t.messages[0];
            if (!lastMsg) return false;
            const hours = (now.getTime() - new Date(lastMsg.createdAt).getTime()) / (1000 * 60 * 60);
            return lastMsg.isFromCustomer && hours > 4 && hours <= 24;
        });

        // Count by category (simple detection)
        const categories: Record<string, number> = {};
        tickets.forEach(t => {
            const s = t.subject.toLowerCase();
            let cat = "General";
            if (s.includes("refund") || s.includes("cancel") || s.includes("money back")) cat = "Refund";
            else if (s.includes("access") || s.includes("login")) cat = "Access";
            else if (s.includes("certificate")) cat = "Certificate";
            else if (s.includes("billing") || s.includes("payment")) cat = "Billing";
            else if (s.includes("course") || s.includes("lesson") || s.includes("video")) cat = "Course Content";

            categories[cat] = (categories[cat] || 0) + 1;
        });

        // Sort categories by count
        const topCategories = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        return NextResponse.json({
            success: true,
            generatedAt: now.toISOString(),
            stats,
            overdue24h: overdue24h.map(t => ({
                id: t.id,
                ticketNumber: t.ticketNumber,
                customerName: t.customerName,
                subject: t.subject,
            })),
            overdue4h: overdue4h.map(t => ({
                id: t.id,
                ticketNumber: t.ticketNumber,
                customerName: t.customerName,
                subject: t.subject,
            })),
            topCategories,
        });
    } catch (error) {
        console.error("[GET /api/tickets/ai-digest] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: Generate AI analysis (manual trigger or cron)
export async function POST(request: NextRequest) {
    try {
        // Check for cron secret or admin auth
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (authHeader !== `Bearer ${cronSecret}`) {
            const session = await getServerSession(authOptions);
            if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // Fetch all open tickets with full details
        const tickets = await prisma.supportTicket.findMany({
            where: {
                status: { in: ["NEW", "OPEN", "PENDING"] },
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (tickets.length === 0) {
            return NextResponse.json({
                success: true,
                analysis: "No open tickets to analyze.",
                suggestions: [],
            });
        }

        // Prepare ticket summary for AI
        const ticketSummary = tickets.map(t => ({
            id: t.id,
            ticketNumber: t.ticketNumber,
            status: t.status,
            priority: t.priority,
            subject: t.subject,
            customer: t.customerName,
            messageCount: t.messages.length,
            lastMessage: t.messages[t.messages.length - 1]?.content.slice(0, 200),
            waitingHours: t.messages.length > 0
                ? Math.round((Date.now() - new Date(t.messages[t.messages.length - 1].createdAt).getTime()) / (1000 * 60 * 60))
                : 0,
            isAwaitingAgent: t.messages[t.messages.length - 1]?.isFromCustomer || false,
        }));

        // Call Claude for analysis
        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: `You are an AI support manager. Analyze these ${tickets.length} open support tickets and provide:

1. PRIORITY ALERTS: Tickets needing immediate attention (waiting >24h, frustrated customers, urgent issues)
2. PATTERN RECOGNITION: Common issues that could be addressed with FAQ updates
3. SUGGESTED ACTIONS: Specific recommendations for the support team
4. SENTIMENT SUMMARY: Overall customer sentiment across tickets

Keep your response concise and actionable. Use emoji for visual scanning.

TICKETS:
${JSON.stringify(ticketSummary, null, 2)}

Respond in JSON format:
{
    "priorityAlerts": [{ "ticketNumber": "...", "reason": "...", "action": "..." }],
    "patterns": [{ "issue": "...", "count": N, "suggestion": "..." }],
    "actions": ["..."],
    "sentimentSummary": "...",
    "overallHealth": "good|warning|critical"
}`
                }
            ],
        });

        const textContent = response.content[0];
        let analysis = null;

        if (textContent.type === "text") {
            try {
                // Extract JSON from response
                const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[0]);
                }
            } catch {
                analysis = { raw: textContent.text };
            }
        }

        return NextResponse.json({
            success: true,
            generatedAt: new Date().toISOString(),
            ticketCount: tickets.length,
            analysis,
        });
    } catch (error) {
        console.error("[POST /api/tickets/ai-digest] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
