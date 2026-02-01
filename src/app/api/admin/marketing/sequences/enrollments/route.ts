import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences/enrollments - Get all enrollments across sequences
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const status = searchParams.get("status");
        const sequenceId = searchParams.get("sequenceId");
        const search = searchParams.get("search");

        // Build where clause
        const where: Record<string, unknown> = {};

        if (status) {
            where.status = status;
        }

        if (sequenceId) {
            where.sequenceId = sequenceId;
        }

        if (search) {
            where.user = {
                OR: [
                    { email: { contains: search, mode: "insensitive" } },
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                ],
            };
        }

        // Get total count
        const total = await prisma.sequenceEnrollment.count({ where });

        // Get enrollments with pagination
        const enrollments = await prisma.sequenceEnrollment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                sequence: {
                    select: {
                        id: true,
                        name: true,
                        emails: {
                            select: {
                                id: true,
                                order: true,
                                customSubject: true,
                            },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
            orderBy: { enrolledAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        // Transform for UI
        const transformedEnrollments = enrollments.map((e) => ({
            id: e.id,
            userId: e.userId,
            sequenceId: e.sequenceId,
            status: e.status,
            currentEmailIndex: e.currentEmailIndex,
            nextSendAt: e.nextSendAt?.toISOString() || null,
            enrolledAt: e.enrolledAt.toISOString(),
            completedAt: e.completedAt?.toISOString() || null,
            exitedAt: e.exitedAt?.toISOString() || null,
            exitReason: e.exitReason,
            emailsReceived: e.emailsReceived,
            emailsOpened: e.emailsOpened,
            emailsClicked: e.emailsClicked,
            user: {
                id: e.user.id,
                email: e.user.email,
                name: [e.user.firstName, e.user.lastName].filter(Boolean).join(" ") || null,
            },
            sequence: {
                id: e.sequence.id,
                name: e.sequence.name,
                emails: e.sequence.emails,
            },
        }));

        return NextResponse.json({
            enrollments: transformedEnrollments,
            total,
            page,
            pageSize,
        });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrollments" },
            { status: 500 }
        );
    }
}
