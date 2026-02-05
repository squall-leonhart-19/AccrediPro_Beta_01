import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List all masterclass pods with messages
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // waiting, active, completed, converted
    const niche = searchParams.get("niche");

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (niche) where.nicheCategory = niche;

    const pods = await prisma.masterclassPod.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                },
            },
            zombieProfile: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 50, // Last 50 messages
                select: {
                    id: true,
                    dayNumber: true,
                    senderType: true,
                    senderName: true,
                    senderAvatar: true,
                    content: true,
                    audioUrl: true,
                    isSystem: true,
                    readAt: true,
                    sentAt: true,
                    createdAt: true,
                },
            },
            _count: {
                select: { messages: true },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    // Format response
    const formatted = pods.map(pod => {
        // Find user messages (replies needing attention)
        const userMessages = pod.messages.filter(m => m.senderType === "user");
        const unreadUserMessages = userMessages.filter(m => !m.readAt);
        const lastActivity = pod.messages[0]?.createdAt || pod.updatedAt;

        return {
            id: pod.id,
            user: {
                id: pod.user.id,
                name: `${pod.user.firstName} ${pod.user.lastName}`.trim(),
                email: pod.user.email,
                avatar: pod.user.avatar,
            },
            zombie: pod.zombieProfile ? {
                id: pod.zombieProfile.id,
                name: pod.zombieProfile.name,
                avatar: pod.zombieProfile.avatarUrl,
            } : null,
            nicheCategory: pod.nicheCategory,
            status: pod.status,
            masterclassDay: pod.masterclassDay,
            startedAt: pod.startedAt,
            scholarshipUsed: pod.scholarshipUsed,
            convertedAt: pod.convertedAt,
            createdAt: pod.createdAt,
            lastActivity,
            messageCount: pod._count.messages,
            unreadCount: unreadUserMessages.length,
            messages: pod.messages.reverse(), // Chronological order
        };
    });

    return NextResponse.json({
        pods: formatted,
        total: formatted.length,
    });
}
