import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Vercel Cron: Run at midnight Alaska time (09:00 UTC)
// Configure in vercel.json: "crons": [{ "path": "/api/cron/daily-report", "schedule": "0 9 * * *" }]

export async function GET(request: Request) {
    // Verify cron secret (Vercel sends this header)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow in dev mode without auth, require in production
    if (process.env.NODE_ENV === "production" && cronSecret) {
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // Get Alaska midnight (UTC-9) as the report date
        // When this runs at 09:00 UTC, it's 00:00 Alaska time
        const now = new Date();
        const reportDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        // Check if report already exists for this date
        const existing = await prisma.dailyReport.findUnique({
            where: { reportDate }
        });

        if (existing) {
            return NextResponse.json({
                message: "Report already exists for this date",
                reportDate: reportDate.toISOString()
            });
        }

        // Calculate date range for "yesterday" in Alaska time
        // Since we run at 09:00 UTC (midnight Alaska), yesterday is the previous day
        const yesterdayStart = new Date(reportDate);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = reportDate;

        // Find Sarah's ID for message filtering
        const sarah = await prisma.user.findFirst({
            where: { email: "sarah@accredipro-certificate.com" },
            select: { id: true }
        });
        const sarahId = sarah?.id;

        // ==================== GATHER STATS ====================

        // New Users
        const [newStudents, newLeads, totalStudents, totalLeads] = await Promise.all([
            prisma.user.count({
                where: {
                    userType: "STUDENT",
                    isFakeProfile: false,
                    createdAt: { gte: yesterdayStart, lt: yesterdayEnd }
                }
            }),
            prisma.user.count({
                where: {
                    userType: "LEAD",
                    isFakeProfile: false,
                    createdAt: { gte: yesterdayStart, lt: yesterdayEnd }
                }
            }),
            prisma.user.count({
                where: { userType: "STUDENT", isFakeProfile: false }
            }),
            prisma.user.count({
                where: { userType: "LEAD", isFakeProfile: false }
            })
        ]);

        // Enrollments
        const newEnrollments = await prisma.enrollment.count({
            where: { createdAt: { gte: yesterdayStart, lt: yesterdayEnd } }
        });

        // Course breakdown
        const courseEnrollments = await prisma.enrollment.groupBy({
            by: ["courseId"],
            where: { createdAt: { gte: yesterdayStart, lt: yesterdayEnd } },
            _count: { courseId: true }
        });

        const courseIds = courseEnrollments.map(c => c.courseId);
        const courses = await prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, slug: true, title: true }
        });

        const courseBreakdown: Record<string, { title: string; count: number }> = {};
        for (const ce of courseEnrollments) {
            const course = courses.find(c => c.id === ce.courseId);
            if (course) {
                courseBreakdown[course.slug] = {
                    title: course.title,
                    count: ce._count.courseId
                };
            }
        }

        // Tickets
        const [ticketsOpened, ticketsResolved, ticketsPending] = await Promise.all([
            prisma.supportTicket.count({
                where: { createdAt: { gte: yesterdayStart, lt: yesterdayEnd } }
            }),
            prisma.supportTicket.count({
                where: {
                    status: "RESOLVED",
                    resolvedAt: { gte: yesterdayStart, lt: yesterdayEnd }
                }
            }),
            prisma.supportTicket.count({
                where: { status: { in: ["NEW", "OPEN", "PENDING"] } }
            })
        ]);

        // Messages
        const [messagesReceived, messagesSent] = await Promise.all([
            sarahId ? prisma.message.count({
                where: {
                    createdAt: { gte: yesterdayStart, lt: yesterdayEnd },
                    senderId: { not: sarahId }
                }
            }) : 0,
            sarahId ? prisma.message.count({
                where: {
                    createdAt: { gte: yesterdayStart, lt: yesterdayEnd },
                    senderId: sarahId
                }
            }) : 0
        ]);

        // Mini Diplomas
        const [miniStarted, miniCompleted] = await Promise.all([
            prisma.user.count({
                where: {
                    miniDiplomaOptinAt: { gte: yesterdayStart, lt: yesterdayEnd },
                    isFakeProfile: false
                }
            }),
            prisma.user.count({
                where: {
                    miniDiplomaCompletedAt: { gte: yesterdayStart, lt: yesterdayEnd },
                    isFakeProfile: false
                }
            })
        ]);

        // Sequence Stats
        const [sequenceEnrollments, emailsSent] = await Promise.all([
            prisma.sequenceEnrollment.count({
                where: { enrolledAt: { gte: yesterdayStart, lt: yesterdayEnd } }
            }),
            prisma.sequenceEmailLog.count({
                where: { sentAt: { gte: yesterdayStart, lt: yesterdayEnd } }
            })
        ]);

        // ==================== CREATE REPORT ====================

        const report = await prisma.dailyReport.create({
            data: {
                reportDate,
                newStudentsToday: newStudents,
                newLeadsToday: newLeads,
                totalStudents,
                totalLeads,
                newEnrollmentsToday: newEnrollments,
                courseBreakdown: Object.keys(courseBreakdown).length > 0 ? courseBreakdown : null,
                ticketsOpenedToday: ticketsOpened,
                ticketsResolvedToday: ticketsResolved,
                ticketsPending,
                messagesReceivedToday: messagesReceived,
                messagesSentToday: messagesSent,
                miniDiplomasStarted: miniStarted,
                miniDiplomasCompleted: miniCompleted,
                sequenceEnrollmentsToday: sequenceEnrollments,
                emailsSentToday: emailsSent,
                rawData: {
                    generatedAt: new Date().toISOString(),
                    dateRange: {
                        start: yesterdayStart.toISOString(),
                        end: yesterdayEnd.toISOString()
                    },
                    courseBreakdown
                }
            }
        });

        console.log(`[DailyReport] Generated report for ${reportDate.toISOString()}`);

        return NextResponse.json({
            success: true,
            reportId: report.id,
            reportDate: reportDate.toISOString(),
            summary: {
                newStudents,
                newLeads,
                newEnrollments,
                ticketsOpened,
                ticketsResolved,
                messagesReceived,
                miniDiplomasStarted,
                miniDiplomasCompleted
            }
        });
    } catch (error) {
        console.error("[DailyReport] Error generating report:", error);
        return NextResponse.json(
            { error: "Failed to generate daily report" },
            { status: 500 }
        );
    }
}
