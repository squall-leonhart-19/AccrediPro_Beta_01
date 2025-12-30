import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET - Fetch all chat leads (optins) with conversion status
 * POST - Cleanup: remove optins without email
 */

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all optins
        const optins = await prisma.chatOptin.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Get all unique emails from optins
        const emails = optins
            .filter(o => o.email)
            .map(o => o.email!.toLowerCase());

        // Check which emails exist in User table (converted)
        const convertedUsers = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true, createdAt: true }
        });

        const convertedMap = new Map(
            convertedUsers.map(u => [u.email?.toLowerCase(), u.createdAt])
        );

        // Build response with conversion status
        const leadsWithStatus = optins.map(optin => ({
            id: optin.id,
            visitorId: optin.visitorId,
            name: optin.name,
            email: optin.email,
            page: optin.page,
            createdAt: optin.createdAt,
            converted: optin.email ? convertedMap.has(optin.email.toLowerCase()) : false,
            convertedAt: optin.email ? convertedMap.get(optin.email.toLowerCase()) : null,
        }));

        // Stats
        const total = optins.length;
        const withEmail = optins.filter(o => o.email).length;
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
        // Delete optins without email
        const deleteResult = await prisma.chatOptin.deleteMany({
            where: {
                OR: [
                    { email: null },
                    { email: "" }
                ]
            }
        });

        console.log(`[CHAT-LEADS] Deleted ${deleteResult.count} optins without email`);

        return NextResponse.json({
            success: true,
            deleted: deleteResult.count,
            message: `Removed ${deleteResult.count} leads without email`
        });
    } catch (error) {
        console.error("[CHAT-LEADS] Cleanup error:", error);
        return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
    }
}
