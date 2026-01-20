import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/export/analytics - Export analytics data
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only ADMIN/SUPERUSER can export data
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "summary";
        const days = parseInt(searchParams.get("days") || "30");

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        let data: Record<string, unknown> = {};
        let csv = "";
        let filename = "";

        switch (type) {
            case "enrollments": {
                // Daily enrollment data
                const enrollments = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
                    SELECT DATE("enrolledAt") as date, COUNT(*) as count
                    FROM "Enrollment"
                    WHERE "enrolledAt" >= ${startDate}
                    GROUP BY DATE("enrolledAt")
                    ORDER BY date ASC
                `;

                data = { enrollments: enrollments.map(e => ({ date: e.date, count: Number(e.count) })) };

                csv = [
                    "Date,Enrollments",
                    ...enrollments.map(e => `${new Date(e.date).toISOString().split("T")[0]},${Number(e.count)}`),
                ].join("\n");

                filename = `enrollments-${days}days-${new Date().toISOString().split("T")[0]}.csv`;
                break;
            }

            case "users": {
                // Daily user registration data
                const users = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
                    SELECT DATE("createdAt") as date, COUNT(*) as count
                    FROM "User"
                    WHERE "createdAt" >= ${startDate}
                    AND email IS NOT NULL
                    AND "isFakeProfile" = false
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC
                `;

                data = { users: users.map(u => ({ date: u.date, count: Number(u.count) })) };

                csv = [
                    "Date,New Users",
                    ...users.map(u => `${new Date(u.date).toISOString().split("T")[0]},${Number(u.count)}`),
                ].join("\n");

                filename = `user-registrations-${days}days-${new Date().toISOString().split("T")[0]}.csv`;
                break;
            }

            case "revenue": {
                // Daily revenue data
                const revenue = await prisma.$queryRaw<{ date: Date; total: number; count: bigint }[]>`
                    SELECT
                        DATE("createdAt") as date,
                        SUM(amount) as total,
                        COUNT(*) as count
                    FROM "Payment"
                    WHERE "createdAt" >= ${startDate} AND status = 'COMPLETED'
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC
                `;

                data = { revenue: revenue.map(r => ({ date: r.date, total: Number(r.total), count: Number(r.count) })) };

                csv = [
                    "Date,Revenue,Transactions",
                    ...revenue.map(r => `${new Date(r.date).toISOString().split("T")[0]},${Number(r.total).toFixed(2)},${Number(r.count)}`),
                ].join("\n");

                filename = `revenue-${days}days-${new Date().toISOString().split("T")[0]}.csv`;
                break;
            }

            case "courses": {
                // Course performance data
                const courses = await prisma.course.findMany({
                    where: { isPublished: true },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        certificateType: true,
                        _count: {
                            select: {
                                enrollments: true,
                                certificates: true,
                            },
                        },
                        enrollments: {
                            where: { status: "COMPLETED" },
                            select: { id: true },
                        },
                    },
                });

                const courseData = courses.map(c => ({
                    title: c.title,
                    slug: c.slug,
                    type: c.certificateType,
                    enrollments: c._count.enrollments,
                    completions: c.enrollments.length,
                    certificates: c._count.certificates,
                    completionRate: c._count.enrollments > 0
                        ? Math.round((c.enrollments.length / c._count.enrollments) * 100)
                        : 0,
                }));

                data = { courses: courseData };

                csv = [
                    "Course,Slug,Type,Enrollments,Completions,Certificates,Completion Rate",
                    ...courseData.map(c =>
                        `"${c.title}",${c.slug},${c.type},${c.enrollments},${c.completions},${c.certificates},${c.completionRate}%`
                    ),
                ].join("\n");

                filename = `course-performance-${new Date().toISOString().split("T")[0]}.csv`;
                break;
            }

            case "summary":
            default: {
                // Overall summary statistics
                const [
                    totalUsers,
                    activeUsers,
                    totalEnrollments,
                    completedEnrollments,
                    totalCertificates,
                    totalRevenue,
                    miniDiplomaLeads,
                    miniDiplomaCompleted,
                ] = await Promise.all([
                    prisma.user.count({ where: { email: { not: null }, isFakeProfile: false } }),
                    prisma.user.count({ where: { lastLoginAt: { gte: startDate }, isFakeProfile: false } }),
                    prisma.enrollment.count(),
                    prisma.enrollment.count({ where: { status: "COMPLETED" } }),
                    prisma.certificate.count(),
                    prisma.payment.aggregate({
                        where: { status: "COMPLETED" },
                        _sum: { amount: true },
                    }),
                    prisma.user.count({ where: { miniDiplomaOptinAt: { not: null } } }),
                    prisma.user.count({ where: { miniDiplomaCompletedAt: { not: null } } }),
                ]);

                data = {
                    period: `${days} days`,
                    totalUsers,
                    activeUsers,
                    totalEnrollments,
                    completedEnrollments,
                    completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
                    totalCertificates,
                    totalRevenue: Number(totalRevenue._sum.amount || 0),
                    miniDiplomaLeads,
                    miniDiplomaCompleted,
                    miniDiplomaConversionRate: miniDiplomaLeads > 0 ? Math.round((miniDiplomaCompleted / miniDiplomaLeads) * 100) : 0,
                };

                csv = [
                    "Metric,Value",
                    `Period,${days} days`,
                    `Total Users,${totalUsers}`,
                    `Active Users (last ${days} days),${activeUsers}`,
                    `Total Enrollments,${totalEnrollments}`,
                    `Completed Enrollments,${completedEnrollments}`,
                    `Completion Rate,${data.completionRate}%`,
                    `Total Certificates,${totalCertificates}`,
                    `Total Revenue,$${Number(totalRevenue._sum.amount || 0).toFixed(2)}`,
                    `Mini Diploma Leads,${miniDiplomaLeads}`,
                    `Mini Diploma Completed,${miniDiplomaCompleted}`,
                    `Mini Diploma Conversion Rate,${data.miniDiplomaConversionRate}%`,
                ].join("\n");

                filename = `analytics-summary-${new Date().toISOString().split("T")[0]}.csv`;
                break;
            }
        }

        // Log the export
        const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
        audit(AuditAction.DATA_EXPORT, "analytics", undefined, {
            type,
            days,
        });

        const format = searchParams.get("format") || "csv";

        if (format === "json") {
            return NextResponse.json(data);
        }

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error exporting analytics:", error);
        return NextResponse.json({ error: "Failed to export analytics" }, { status: 500 });
    }
}
