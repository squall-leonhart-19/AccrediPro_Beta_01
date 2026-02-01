import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/reports/daily - Get daily reports
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "30");

        const reports = await prisma.dailyReport.findMany({
            orderBy: { reportDate: "desc" },
            take: limit,
        });

        return NextResponse.json({
            reports: reports.map(r => ({
                id: r.id,
                reportDate: r.reportDate.toISOString(),
                newStudentsToday: r.newStudentsToday,
                newLeadsToday: r.newLeadsToday,
                totalStudents: r.totalStudents,
                totalLeads: r.totalLeads,
                newEnrollmentsToday: r.newEnrollmentsToday,
                courseBreakdown: r.courseBreakdown,
                ticketsOpenedToday: r.ticketsOpenedToday,
                ticketsResolvedToday: r.ticketsResolvedToday,
                ticketsPending: r.ticketsPending,
                messagesReceivedToday: r.messagesReceivedToday,
                messagesSentToday: r.messagesSentToday,
                miniDiplomasStarted: r.miniDiplomasStarted,
                miniDiplomasCompleted: r.miniDiplomasCompleted,
                sequenceEnrollmentsToday: r.sequenceEnrollmentsToday,
                emailsSentToday: r.emailsSentToday,
                createdAt: r.createdAt.toISOString(),
            }))
        });
    } catch (error) {
        console.error("Error fetching daily reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch daily reports" },
            { status: 500 }
        );
    }
}

// POST /api/admin/reports/daily - Manually trigger report generation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Trigger the cron endpoint directly
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/cron/daily-report`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.CRON_SECRET || "dev-secret"}`
            }
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error triggering daily report:", error);
        return NextResponse.json(
            { error: "Failed to trigger daily report" },
            { status: 500 }
        );
    }
}
