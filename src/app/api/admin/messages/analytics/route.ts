import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Find Sarah's ID
        const sarah = await prisma.user.findFirst({
            where: { email: "sarah@accredipro-certificate.com" },
            select: { id: true },
        });
        const sarahId = sarah?.id;

        // Get total unique conversations (students who have messaged Sarah)
        const uniqueConversations = await prisma.message.groupBy({
            by: ['senderId'],
            where: {
                receiverId: sarahId,
            },
        });

        // Active today (students who sent messages today)
        const activeToday = await prisma.message.groupBy({
            by: ['senderId'],
            where: {
                receiverId: sarahId,
                createdAt: { gte: today },
            },
        });

        // Awaiting response (>24h without reply from Sarah)
        const awaitingResponse = await prisma.$queryRaw<{ count: bigint }[]>`
      WITH LastMessages AS (
        SELECT 
          CASE WHEN "senderId" = ${sarahId} THEN "receiverId" ELSE "senderId" END as student_id,
          MAX("createdAt") as last_msg_time,
          (SELECT "senderId" FROM "Message" m2 
           WHERE (m2."senderId" = m."senderId" AND m2."receiverId" = m."receiverId")
              OR (m2."senderId" = m."receiverId" AND m2."receiverId" = m."senderId")
           ORDER BY m2."createdAt" DESC LIMIT 1) as last_sender
        FROM "Message" m
        WHERE "senderId" = ${sarahId} OR "receiverId" = ${sarahId}
        GROUP BY student_id
      )
      SELECT COUNT(*)::bigint as count FROM LastMessages 
      WHERE last_sender != ${sarahId} 
      AND last_msg_time < ${twentyFourHoursAgo}
    `;

        // Calculate average response time (sample last 50 conversations)
        // This is approximate: time between student message and Sarah's reply
        const recentReplies = await prisma.$queryRaw<{ avg_ms: number }[]>`
      WITH StudentMessages AS (
        SELECT id, "senderId", "receiverId", "createdAt" as student_time
        FROM "Message"
        WHERE "receiverId" = ${sarahId}
        ORDER BY "createdAt" DESC
        LIMIT 50
      ),
      SarahReplies AS (
        SELECT sm.id as student_msg_id, MIN(m."createdAt") as reply_time
        FROM StudentMessages sm
        JOIN "Message" m ON m."senderId" = ${sarahId} 
          AND m."receiverId" = sm."senderId"
          AND m."createdAt" > sm.student_time
        GROUP BY sm.id
      )
      SELECT AVG(EXTRACT(EPOCH FROM (sr.reply_time - sm.student_time)) * 1000) as avg_ms
      FROM StudentMessages sm
      JOIN SarahReplies sr ON sr.student_msg_id = sm.id
    `;

        const avgMs = recentReplies[0]?.avg_ms || 0;
        const avgResponseTimeHours = Math.round(avgMs / (1000 * 60 * 60));

        return NextResponse.json({
            totalConversations: uniqueConversations.length,
            activeToday: activeToday.length,
            avgResponseTimeHours: avgResponseTimeHours || 1, // Default to 1h if no data
            awaitingResponse: Number(awaitingResponse[0]?.count || 0),
        });
    } catch (error) {
        console.error("[MessagesAnalytics] Error:", error);
        return NextResponse.json({
            totalConversations: 0,
            activeToday: 0,
            avgResponseTimeHours: 0,
            awaitingResponse: 0,
        });
    }
}
