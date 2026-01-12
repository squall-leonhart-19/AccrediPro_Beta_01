import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET - Generate daily report
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const report = await generateDailyReport();
        return NextResponse.json(report);
    } catch (error) {
        console.error("Daily report error:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}

// POST - Send daily report to email
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email } = body;

        const report = await generateDailyReport();

        // Create email record
        await prisma.emailSend.create({
            data: {
                to: email || session.user.email || "admin@accredipro.academy",
                subject: `🧠 Oracle Daily Report - ${new Date().toLocaleDateString()}`,
                content: formatReportAsEmail(report),
                status: "pending",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Daily report queued for sending",
            report
        });
    } catch (error) {
        console.error("Send report error:", error);
        return NextResponse.json(
            { error: "Failed to send report" },
            { status: 500 }
        );
    }
}

async function generateDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    // Gather metrics
    const [
        totalUsers,
        newToday,
        newYesterday,
        activeToday,
        activeThisWeek,
        completionsThisWeek,
        totalEnrollments,
        messagesYesterday,
    ] = await Promise.all([
        prisma.user.count({ where: { isFakeProfile: false } }),
        prisma.user.count({ where: { createdAt: { gte: today }, isFakeProfile: false } }),
        prisma.user.count({ where: { createdAt: { gte: yesterday, lt: today }, isFakeProfile: false } }),
        prisma.user.count({ where: { lastLoginAt: { gte: today }, isFakeProfile: false } }),
        prisma.user.count({ where: { lastLoginAt: { gte: thisWeek }, isFakeProfile: false } }),
        prisma.enrollment.count({ where: { status: "COMPLETED", updatedAt: { gte: thisWeek } } }),
        prisma.enrollment.count(),
        prisma.message.count({ where: { createdAt: { gte: yesterday } } }),
    ]);

    // Get at-risk users (inactive 7+ days)
    const inactiveThreshold = new Date();
    inactiveThreshold.setDate(inactiveThreshold.getDate() - 7);

    const atRiskUsers = await prisma.user.findMany({
        where: {
            isFakeProfile: false,
            lastLoginAt: { lt: inactiveThreshold },
            enrollments: { some: { status: "ACTIVE" } },
        },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            lastLoginAt: true,
        },
        take: 10,
        orderBy: { lastLoginAt: "asc" },
    });

    // Calculate trends
    const userGrowth = newYesterday > 0 ? ((newToday - newYesterday) / newYesterday * 100).toFixed(1) : "N/A";
    const engagementRate = totalUsers > 0 ? ((activeThisWeek / totalUsers) * 100).toFixed(1) : "0";

    // Generate AI insights
    let aiInsights = "";
    try {
        const insightResponse = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 300,
            messages: [{
                role: "user",
                content: `You are an AI business analyst. Based on these metrics for an online certification academy:

- Total Users: ${totalUsers}
- New Today: ${newToday}
- New Yesterday: ${newYesterday}
- Active Today: ${activeToday}
- Active This Week: ${activeThisWeek}
- Engagement Rate: ${engagementRate}%
- Completions This Week: ${completionsThisWeek}
- At-Risk Users: ${atRiskUsers.length}

Provide 3 brief, actionable insights for the CEO. Be specific and data-driven. Format as bullet points.`
            }],
        });

        aiInsights = insightResponse.content[0]?.type === "text"
            ? insightResponse.content[0].text
            : "";
    } catch (e) {
        aiInsights = "AI insights unavailable";
    }

    return {
        date: new Date().toISOString(),
        metrics: {
            totalUsers,
            newToday,
            newYesterday,
            activeToday,
            activeThisWeek,
            completionsThisWeek,
            totalEnrollments,
            messagesYesterday,
            userGrowth: `${userGrowth}%`,
            engagementRate: `${engagementRate}%`,
        },
        atRiskUsers: atRiskUsers.map(u => ({
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            lastLogin: u.lastLoginAt,
        })),
        aiInsights,
    };
}

function formatReportAsEmail(report: any): string {
    return `
📊 ORACLE DAILY REPORT
${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 KEY METRICS

Total Users: ${report.metrics.totalUsers.toLocaleString()}
New Today: ${report.metrics.newToday} (${report.metrics.userGrowth} vs yesterday)
Active Today: ${report.metrics.activeToday}
Active This Week: ${report.metrics.activeThisWeek}
Engagement Rate: ${report.metrics.engagementRate}
Completions This Week: ${report.metrics.completionsThisWeek}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AT-RISK USERS (${report.atRiskUsers.length})

${report.atRiskUsers.map((u: any) => `• ${u.name} - ${u.email}`).join('\n') || 'No at-risk users today!'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 AI INSIGHTS

${report.aiInsights}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View full dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/admin/oracle

— Oracle AI Commander
`;
}
