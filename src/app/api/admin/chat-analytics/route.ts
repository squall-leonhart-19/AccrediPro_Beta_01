import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Chat analytics for admins
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only allow admin
        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get total messages
        const totalMessages = await prisma.message.count();

        // Get messages today
        const messagesToday = await prisma.message.count({
            where: { createdAt: { gte: today } },
        });

        // Get messages this week
        const messagesThisWeek = await prisma.message.count({
            where: { createdAt: { gte: thisWeek } },
        });

        // Get messages this month
        const messagesThisMonth = await prisma.message.count({
            where: { createdAt: { gte: thisMonth } },
        });

        // Get active conversations (unique sender-receiver pairs)
        const activeConversations = await prisma.message.groupBy({
            by: ["senderId", "receiverId"],
            where: { createdAt: { gte: thisWeek } },
        });

        // Get average response time (time between consecutive messages)
        const recentMessages = await prisma.message.findMany({
            where: { createdAt: { gte: thisWeek } },
            orderBy: { createdAt: "asc" },
            select: {
                senderId: true,
                receiverId: true,
                createdAt: true,
            },
        });

        // Calculate response times
        let totalResponseTime = 0;
        let responseCount = 0;
        const conversationMessages: Record<string, Date[]> = {};

        for (const msg of recentMessages) {
            const conversationKey = [msg.senderId, msg.receiverId].sort().join("-");
            if (!conversationMessages[conversationKey]) {
                conversationMessages[conversationKey] = [];
            }
            conversationMessages[conversationKey].push(msg.createdAt);
        }

        for (const key in conversationMessages) {
            const times = conversationMessages[key].sort((a, b) => a.getTime() - b.getTime());
            for (let i = 1; i < times.length; i++) {
                const diff = times[i].getTime() - times[i - 1].getTime();
                // Only count responses within 24 hours
                if (diff < 24 * 60 * 60 * 1000) {
                    totalResponseTime += diff;
                    responseCount++;
                }
            }
        }

        const avgResponseTimeMinutes = responseCount > 0
            ? Math.round(totalResponseTime / responseCount / 60000)
            : 0;

        // Get top coaches by messages
        const topCoaches = await prisma.message.groupBy({
            by: ["senderId"],
            _count: { id: true },
            where: {
                createdAt: { gte: thisMonth },
                sender: {
                    role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
                },
            },
            orderBy: { _count: { id: "desc" } },
            take: 5,
        });

        // Get coach details
        const coachIds = topCoaches.map((c) => c.senderId);
        const coaches = await prisma.user.findMany({
            where: { id: { in: coachIds } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
            },
        });

        const topCoachesWithDetails = topCoaches.map((tc) => ({
            ...coaches.find((c) => c.id === tc.senderId),
            messageCount: tc._count.id,
        }));

        // Get unread messages count
        const unreadMessages = await prisma.message.count({
            where: { isRead: false },
        });

        // Get voice messages count
        const voiceMessages = await prisma.message.count({
            where: { attachmentType: "voice" },
        });

        // Get AI-generated messages count
        const aiMessages = await prisma.message.count({
            where: { isAiVoice: true },
        });

        return NextResponse.json({
            success: true,
            data: {
                totalMessages,
                messagesToday,
                messagesThisWeek,
                messagesThisMonth,
                activeConversations: activeConversations.length,
                avgResponseTimeMinutes,
                topCoaches: topCoachesWithDetails,
                unreadMessages,
                voiceMessages,
                aiMessages,
            },
        });
    } catch (error) {
        console.error("Chat analytics error:", error);
        return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 });
    }
}
