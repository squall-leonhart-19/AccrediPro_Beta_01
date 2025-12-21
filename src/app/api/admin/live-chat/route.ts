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

    // Get all sales chat messages grouped by visitor
    const messages = await prisma.salesChat.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    // Group messages by visitorId
    const conversationsMap = new Map<string, {
      visitorId: string;
      page: string;
      messages: typeof messages;
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }>();

    messages.forEach((msg) => {
      if (!conversationsMap.has(msg.visitorId)) {
        conversationsMap.set(msg.visitorId, {
          visitorId: msg.visitorId,
          page: msg.page,
          messages: [],
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        });
      }

      const conv = conversationsMap.get(msg.visitorId)!;
      conv.messages.push(msg);

      if (msg.isFromVisitor && !msg.isRead) {
        conv.unreadCount++;
      }

      if (msg.createdAt > conv.lastMessageAt) {
        conv.lastMessage = msg.message;
        conv.lastMessageAt = msg.createdAt;
      }
    });

    // Sort conversations by last message time
    const conversations = Array.from(conversationsMap.values())
      .map((conv) => ({
        ...conv,
        messages: conv.messages.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      }))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to fetch live chat:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
