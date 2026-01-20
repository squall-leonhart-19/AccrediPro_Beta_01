import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/export/users - Export users to CSV
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only ADMIN/SUPERUSER can export data
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "csv";
        const includeEnrollments = searchParams.get("includeEnrollments") === "true";
        const includeTags = searchParams.get("includeTags") === "true";
        const roleFilter = searchParams.get("role");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");

        // Build where clause
        const where: Record<string, unknown> = {
            isFakeProfile: false,
            email: { not: null },
        };

        if (roleFilter && roleFilter !== "ALL") {
            where.role = roleFilter;
        }

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
            if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
        }

        // Fetch users with related data
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                lastLoginAt: true,
                leadSource: true,
                leadSourceDetail: true,
                hasCompletedOnboarding: true,
                learningGoal: true,
                experienceLevel: true,
                miniDiplomaCategory: true,
                miniDiplomaOptinAt: true,
                miniDiplomaCompletedAt: true,
                ...(includeEnrollments && {
                    enrollments: {
                        select: {
                            progress: true,
                            status: true,
                            enrolledAt: true,
                            completedAt: true,
                            course: {
                                select: { title: true, slug: true },
                            },
                        },
                    },
                }),
                ...(includeTags && {
                    tags: {
                        select: { tag: true, value: true, createdAt: true },
                    },
                }),
                _count: {
                    select: {
                        certificates: true,
                        enrollments: true,
                        payments: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Log the export
        const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
        audit(AuditAction.DATA_EXPORT, "users", undefined, {
            count: users.length,
            format,
            filters: { roleFilter, dateFrom, dateTo, includeEnrollments, includeTags },
        });

        if (format === "json") {
            return NextResponse.json({ users, count: users.length });
        }

        // Generate CSV
        const headers = [
            "ID",
            "Email",
            "First Name",
            "Last Name",
            "Phone",
            "Role",
            "Active",
            "Created At",
            "Last Login",
            "Lead Source",
            "Lead Source Detail",
            "Onboarding Complete",
            "Learning Goal",
            "Experience Level",
            "Mini Diploma Category",
            "Mini Diploma Opt-in",
            "Mini Diploma Completed",
            "Certificates",
            "Enrollments",
            "Payments",
        ];

        if (includeEnrollments) {
            headers.push("Enrolled Courses");
        }
        if (includeTags) {
            headers.push("Tags");
        }

        const rows = users.map((user) => {
            const row = [
                user.id,
                user.email || "",
                user.firstName || "",
                user.lastName || "",
                user.phone || "",
                user.role,
                user.isActive ? "Yes" : "No",
                user.createdAt.toISOString(),
                user.lastLoginAt?.toISOString() || "",
                user.leadSource || "",
                user.leadSourceDetail || "",
                user.hasCompletedOnboarding ? "Yes" : "No",
                user.learningGoal || "",
                user.experienceLevel || "",
                user.miniDiplomaCategory || "",
                user.miniDiplomaOptinAt?.toISOString() || "",
                user.miniDiplomaCompletedAt?.toISOString() || "",
                user._count.certificates.toString(),
                user._count.enrollments.toString(),
                user._count.payments.toString(),
            ];

            if (includeEnrollments && "enrollments" in user) {
                const enrollments = (user.enrollments as Array<{ course: { title: string }; progress: number; status: string }>)
                    .map((e) => `${e.course.title} (${e.progress}% - ${e.status})`)
                    .join("; ");
                row.push(enrollments);
            }

            if (includeTags && "tags" in user) {
                const tags = (user.tags as Array<{ tag: string; value: string | null }>)
                    .map((t) => t.value ? `${t.tag}:${t.value}` : t.tag)
                    .join("; ");
                row.push(tags);
            }

            return row;
        });

        // Escape CSV values
        const escapeCSV = (value: string) => {
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };

        const csv = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => escapeCSV(cell)).join(",")),
        ].join("\n");

        const filename = `users-export-${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error exporting users:", error);
        return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
    }
}
