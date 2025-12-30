import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET - Fetch unique chat leads (people who actually chatted) with conversion status
 * POST - Cleanup: remove orphaned optins (no matching chats or no email)
 * 
 * Source of truth: SalesChat messages (unique visitors who actually chatted)
 */

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get all unique visitors who actually sent messages (from SalesChat)
        const allChats = await prisma.salesChat.findMany({
            where: { isFromVisitor: true },
            select: {
                visitorId: true,
                visitorName: true,
                visitorEmail: true,
                page: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" }
        });

        // Group by visitorId to get unique visitors
        const visitorMap = new Map<string, {
            visitorId: string;
            name: string | null;
            email: string | null;
            page: string;
            firstChat: Date;
            messageCount: number;
        }>();

        for (const chat of allChats) {
            if (!visitorMap.has(chat.visitorId)) {
                visitorMap.set(chat.visitorId, {
                    visitorId: chat.visitorId,
                    name: chat.visitorName,
                    email: chat.visitorEmail,
                    page: chat.page,
                    firstChat: chat.createdAt,
                    messageCount: 1
                });
            } else {
                const existing = visitorMap.get(chat.visitorId)!;
                existing.messageCount++;
                // Update name/email if we have newer info
                if (chat.visitorName && !existing.name) existing.name = chat.visitorName;
                if (chat.visitorEmail && !existing.email) existing.email = chat.visitorEmail;
            }
        }

        const uniqueVisitors = Array.from(visitorMap.values());

        // Get all unique emails from chatters
        const emails = uniqueVisitors
            .filter(v => v.email)
            .map(v => v.email!.toLowerCase());

        // Check which emails exist in User table (converted)
        const convertedUsers = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true, createdAt: true }
        });

        const convertedMap = new Map(
            convertedUsers.filter(u => u.email).map(u => [u.email!.toLowerCase(), u.createdAt])
        );

        // Build response with conversion status
        const leadsWithStatus = uniqueVisitors.map(visitor => ({
            visitorId: visitor.visitorId,
            name: visitor.name,
            email: visitor.email,
            page: visitor.page,
            firstChat: visitor.firstChat,
            messageCount: visitor.messageCount,
            converted: visitor.email ? convertedMap.has(visitor.email.toLowerCase()) : false,
            convertedAt: visitor.email ? convertedMap.get(visitor.email.toLowerCase()) : null,
        }));

        // Stats
        const total = uniqueVisitors.length;
        const withEmail = uniqueVisitors.filter(v => v.email).length;
        const withoutEmail = total - withEmail;
        const converted = leadsWithStatus.filter(l => l.converted).length;

        return NextResponse.json({
            success: true,
            leads: leadsWithStatus,
            stats: {
                total,
                withEmail,
                withoutEmail,
                converted,
                conversionRate: withEmail > 0 ? Math.round((converted / withEmail) * 100) : 0
            }
        });
    } catch (error) {
        console.error("[CHAT-LEADS] Error:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get all unique visitor IDs from SalesChat
        const chatVisitors = await prisma.salesChat.findMany({
            select: { visitorId: true },
            distinct: ['visitorId']
        });
        const chatVisitorIds = new Set(chatVisitors.map(c => c.visitorId));

        // Delete optins that:
        // 1. Have no email, OR
        // 2. Have no matching chat messages (orphaned optins)
        const optinsToDelete = await prisma.chatOptin.findMany({
            where: {
                OR: [
                    { email: null },
                    { email: "" },
                    { visitorId: { notIn: Array.from(chatVisitorIds) } }
                ]
            }
        });

        const deleteResult = await prisma.chatOptin.deleteMany({
            where: {
                id: { in: optinsToDelete.map(o => o.id) }
            }
        });

        console.log(`[CHAT-LEADS] Deleted ${deleteResult.count} orphaned/invalid optins`);

        return NextResponse.json({
            success: true,
            deleted: deleteResult.count,
            message: `Removed ${deleteResult.count} orphaned or invalid leads`
        });
    } catch (error) {
        console.error("[CHAT-LEADS] Cleanup error:", error);
        return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
    }
}
