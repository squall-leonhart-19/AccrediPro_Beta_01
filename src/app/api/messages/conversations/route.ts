import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const isAdmin = ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string);

    try {
        // Optimized query: Get conversations with last message
        const conversationData = await prisma.$queryRaw<Array<{
            odpartnerId: string;
            odpartnerFirstName: string | null;
            odpartnerLastName: string | null;
            partnerEmail: string;
            partnerAvatar: string | null;
            partnerRole: string;
            lastMessageId: string;
            lastMessageContent: string;
            lastMessageSenderId: string;
            lastMessageCreatedAt: Date;
            lastMessageIsRead: boolean;
            unreadCount: number;
        }>>`
      WITH conversation_partners AS (
        SELECT DISTINCT
          CASE WHEN "senderId" = ${userId} THEN "receiverId" ELSE "senderId" END as partner_id
        FROM "Message"
        WHERE "senderId" = ${userId} OR "receiverId" = ${userId}
      ),
      last_messages AS (
        SELECT DISTINCT ON (partner_id)
          cp.partner_id,
          m.id as message_id,
          m.content,
          m."senderId",
          m."createdAt",
          m."isRead"
        FROM conversation_partners cp
        JOIN "Message" m ON (
          (m."senderId" = ${userId} AND m."receiverId" = cp.partner_id) OR
          (m."senderId" = cp.partner_id AND m."receiverId" = ${userId})
        )
        ORDER BY cp.partner_id, m."createdAt" DESC
      ),
      unread_counts AS (
        SELECT "senderId" as partner_id, COUNT(*)::integer as unread_count
        FROM "Message"
        WHERE "receiverId" = ${userId} AND "isRead" = false
        GROUP BY "senderId"
      )
      SELECT
        u.id as "odpartnerId",
        u."firstName" as "odpartnerFirstName",
        u."lastName" as "odpartnerLastName",
        u.email as "partnerEmail",
        u.avatar as "partnerAvatar",
        u.role as "partnerRole",
        lm.message_id as "lastMessageId",
        lm.content as "lastMessageContent",
        lm."senderId" as "lastMessageSenderId",
        lm."createdAt" as "lastMessageCreatedAt",
        lm."isRead" as "lastMessageIsRead",
        COALESCE(uc.unread_count, 0)::integer as "unreadCount"
      FROM last_messages lm
      JOIN "User" u ON u.id = lm.partner_id
      LEFT JOIN unread_counts uc ON uc.partner_id = lm.partner_id
      ORDER BY
        CASE WHEN ${isAdmin} AND lm."senderId" != ${userId} THEN 0 ELSE 1 END,
        lm."createdAt" DESC
      LIMIT 50
    `;

        // Map to simpler format
        const conversations = conversationData.map((conv) => ({
            user: {
                id: conv.odpartnerId,
                firstName: conv.odpartnerFirstName,
                lastName: conv.odpartnerLastName,
                email: conv.partnerEmail,
                avatar: conv.partnerAvatar,
                role: conv.partnerRole,
            },
            lastMessage: {
                id: conv.lastMessageId,
                content: conv.lastMessageContent,
                senderId: conv.lastMessageSenderId,
                createdAt: conv.lastMessageCreatedAt,
                isRead: conv.lastMessageIsRead,
            },
            unreadCount: conv.unreadCount,
        }));

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error("Failed to fetch conversations:", error);
        return NextResponse.json({ error: "Failed to fetch", conversations: [] }, { status: 500 });
    }
}
