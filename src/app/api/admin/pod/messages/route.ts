import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/pod/messages - Get all user messages for admin viewing
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "14");
        const userId = searchParams.get("userId");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const since = new Date();
        since.setDate(since.getDate() - days);

        // Build where clause
        const where: any = {
            createdAt: { gte: since },
        };

        if (userId) {
            where.userId = userId;
        }

        if (search) {
            where.content = { contains: search, mode: "insensitive" };
        }

        // Get total count
        const total = await prisma.podUserMessage.count({ where });

        // Get messages with user info
        const messages = await prisma.podUserMessage.findMany({
            where,
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
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Get summary stats
        const uniqueUsers = await prisma.podUserMessage.groupBy({
            by: ["userId"],
            where: { createdAt: { gte: since } },
        });

        // Get messages per day distribution
        const dayDistribution = await prisma.podUserMessage.groupBy({
            by: ["daysSinceEnrollment"],
            where: { createdAt: { gte: since } },
            _count: true,
            orderBy: { daysSinceEnrollment: "asc" },
        });

        // Format response
        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            daysSinceEnrollment: msg.daysSinceEnrollment,
            aiResponderName: msg.aiResponderName,
            aiResponse: msg.aiResponse,
            createdAt: msg.createdAt,
            user: {
                id: msg.user.id,
                name: `${msg.user.firstName || ""} ${msg.user.lastName || ""}`.trim() || "Unknown",
                email: msg.user.email,
                enrolledAt: msg.user.createdAt,
            },
        }));

        return NextResponse.json({
            messages: formattedMessages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            summary: {
                totalMessages: total,
                uniqueUsers: uniqueUsers.length,
                period: `Last ${days} days`,
            },
            dayDistribution: dayDistribution.map((d) => ({
                day: d.daysSinceEnrollment,
                count: d._count,
            })),
        });
    } catch (error) {
        console.error("[Admin Pod Messages] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
