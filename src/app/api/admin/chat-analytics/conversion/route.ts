import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
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
                .map((o) => [o.email!.toLowerCase(), { name: o.name, createdAt: o.createdAt }])
        );

        // Get all users (purchasers)
        const users = await prisma.user.findMany({
            select: {
                email: true,
                createdAt: true,
            },
        });

        const userEmailsSet = new Set(users.filter(u => u.email).map((u) => u.email!.toLowerCase()));

        // Find converted leads (chatted AND bought)
        const convertedEmails = Array.from(chatEmailsMap.keys()).filter((email) =>
            userEmailsSet.has(email)
        );

        // Get pending conversations (unreplied messages)
        const allMessages = await prisma.salesChat.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Group by visitor/email and find unreplied
        const conversationsMap = new Map<string, { hasReply: boolean; lastMessageTime: Date }>();

        allMessages.forEach((msg) => {
            const optin = chatOptins.find((o) => o.visitorId === msg.visitorId);
            const email = optin?.email || msg.visitorEmail;
            const key = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, { hasReply: false, lastMessageTime: msg.createdAt });
            }

            const conv = conversationsMap.get(key)!;

            // If there's any message from admin/staff, conversation has reply
            if (!msg.isFromVisitor) {
                conv.hasReply = true;
            }

            // Track most recent message time
            if (msg.createdAt > conv.lastMessageTime) {
                conv.lastMessageTime = msg.createdAt;
            }
        });

        const pendingReplies = Array.from(conversationsMap.values()).filter((c) => !c.hasReply).length;

        // Calculate avg response time (simplified - time from first visitor msg to first admin reply)
        const responseTimes: number[] = [];
        const conversationsByKey = new Map<string, typeof allMessages>();

        allMessages.forEach((msg) => {
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
                responseTimes.push(responseTime);
            }
        });

        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        // Get today's new chats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayChats = chatOptins.filter((o) => o.createdAt >= today).length;

        // Total optins (unique visitors)
        const totalLeads = chatOptins.length;
        // Leads with email
        const leadsWithEmail = chatEmailsMap.size;
        // Leads without email
        const leadsWithoutEmail = totalLeads - leadsWithEmail;
        // Converted (from those with email)
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
        });
    } catch (error) {
        console.error("Failed to fetch chat analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
