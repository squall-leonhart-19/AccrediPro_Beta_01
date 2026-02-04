import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/circle-pods
 * Get all circle pods with their messages
 */
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["admin", "support"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
        const whereClause = status === "all" ? {} : { status };

        const pods = await prisma.masterclassPod.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        createdAt: true,
                    },
                },
                zombieProfile: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
                _count: {
                    select: {
                        messages: true,
                        dayProgress: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        const stats = await prisma.masterclassPod.groupBy({
            by: ["status"],
            _count: true,
        });

        return NextResponse.json({
            pods,
            stats: stats.reduce((acc, s) => {
                acc[s.status] = s._count;
                return acc;
            }, {} as Record<string, number>),
            total: pods.length,
        });
    } catch (error) {
        console.error("[ADMIN] Circle pods error:", error);
        return NextResponse.json(
            { error: "Failed to fetch pods", details: String(error) },
            { status: 500 }
        );
    }
}
