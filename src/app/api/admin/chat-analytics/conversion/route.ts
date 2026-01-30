import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !["ADMIN", "INSTRUCTOR", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all chat optins (unique emails who chatted)
        const chatOptins = await prisma.chatOptin.findMany({
            select: {
                visitorId: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        const chatEmailsMap = new Map(
            chatOptins
                .filter((o) => o.email)
                .map((o) => [o.email!.toLowerCase(), { name: o.name, createdAt: o.createdAt, visitorId: o.visitorId }])
        );

        // Get users who have ACTUALLY purchased (have enrollments or payments)
        const usersWithPurchases = await prisma.user.findMany({
            where: {
                email: { in: Array.from(chatEmailsMap.keys()) },
                OR: [
                    { enrollments: { some: {} } },
                    { payments: { some: { status: "COMPLETED" } } },
                ],
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                enrollments: { select: { courseId: true }, take: 1 },
                payments: {
                    select: { amount: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
            },
        });

        const purchaserEmailsSet = new Set(
            usersWithPurchases.filter(u => u.email).map((u) => u.email!.toLowerCase())
        );

        // Find converted leads (chatted AND bought)
        const convertedEmails = Array.from(chatEmailsMap.keys()).filter((email) =>
            purchaserEmailsSet.has(email)
        );

        // Build converted leads details for UI
        const convertedLeads = usersWithPurchases
            .filter(u => u.email && chatEmailsMap.has(u.email.toLowerCase()))
            .map(u => ({
                email: u.email,
                name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : chatEmailsMap.get(u.email!.toLowerCase())?.name || 'Unknown',
                convertedAt: u.payments[0]?.createdAt || u.createdAt,
                value: u.payments[0]?.amount ? Number(u.payments[0].amount) : null,
            }));

        // Get messages from last 7 days only for pending calculation
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentMessages = await prisma.salesChat.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            orderBy: { createdAt: "desc" },
        });

        // Group by visitor/email and check if LAST visitor message is unreplied
        const conversationsMap = new Map<string, {
            lastVisitorMsgTime: Date | null;
            lastAdminMsgTime: Date | null;
        }>();

        recentMessages.forEach((msg) => {
            const optin = chatOptins.find((o) => o.visitorId === msg.visitorId);
            const email = optin?.email || msg.visitorEmail;
            const key = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, { lastVisitorMsgTime: null, lastAdminMsgTime: null });
            }

            const conv = conversationsMap.get(key)!;

            if (msg.isFromVisitor) {
                if (!conv.lastVisitorMsgTime || msg.createdAt > conv.lastVisitorMsgTime) {
                    conv.lastVisitorMsgTime = msg.createdAt;
                }
            } else {
                if (!conv.lastAdminMsgTime || msg.createdAt > conv.lastAdminMsgTime) {
                    conv.lastAdminMsgTime = msg.createdAt;
                }
            }
        });

        // Pending = conversations where last visitor message is AFTER last admin message (or no admin reply)
        const pendingReplies = Array.from(conversationsMap.values()).filter((c) => {
            if (!c.lastVisitorMsgTime) return false; // No visitor messages, not pending
            if (!c.lastAdminMsgTime) return true; // Never replied
            return c.lastVisitorMsgTime > c.lastAdminMsgTime; // Visitor sent after last reply
        }).length;

        // Calculate avg response time (time from visitor msg to next admin reply)
        const responseTimes: number[] = [];
        const conversationsByKey = new Map<string, typeof recentMessages>();

        recentMessages.forEach((msg) => {
            const optin = chatOptins.find((o) => o.visitorId === msg.visitorId);
            const email = optin?.email || msg.visitorEmail;
            const key = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

            if (!conversationsByKey.has(key)) {
                conversationsByKey.set(key, []);
            }
            conversationsByKey.get(key)!.push(msg);
        });

        conversationsByKey.forEach((msgs) => {
            const sortedMsgs = msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            const firstVisitorMsg = sortedMsgs.find((m) => m.isFromVisitor);
            const firstAdminMsg = sortedMsgs.find((m) => !m.isFromVisitor);

            if (firstVisitorMsg && firstAdminMsg) {
                const responseTime = firstAdminMsg.createdAt.getTime() - firstVisitorMsg.createdAt.getTime();
                if (responseTime > 0) {
                    responseTimes.push(responseTime);
                }
            }
        });

        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        // Get today's new chats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayChats = chatOptins.filter((o) => o.createdAt >= today).length;

        // Leads with email (unique emails)
        const leadsWithEmail = chatEmailsMap.size;
        // Leads without email (optins where email is null/empty)
        const leadsWithoutEmail = chatOptins.filter(o => !o.email || o.email.trim() === "").length;
        // Total leads = those with email + those without
        const totalLeads = leadsWithEmail + leadsWithoutEmail;
        // Converted (from those with email who actually purchased)
        const converted = convertedEmails.length;
        // Conversion rate = converted / leads with email (only count trackable leads)
        const conversionRate = leadsWithEmail > 0 ? (converted / leadsWithEmail) * 100 : 0;

        return NextResponse.json({
            totalLeads,
            leadsWithEmail,
            leadsWithoutEmail,
            converted,
            conversionRate: parseFloat(conversionRate.toFixed(1)),
            pendingReplies,
            avgResponseTimeMs: Math.round(avgResponseTime),
            avgResponseTimeMin: Math.round(avgResponseTime / 60000),
            todayChats,
            convertedEmails,
            convertedLeads, // NEW: Full details for UI
        });
    } catch (error) {
        console.error("Failed to fetch chat analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
