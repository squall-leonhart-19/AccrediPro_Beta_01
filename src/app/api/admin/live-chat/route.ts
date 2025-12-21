import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sarah.accredipro.academy",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // Get all sales chat messages grouped by visitor
    const messages = await prisma.salesChat.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        repliedByUser: {
          select: { name: true },
        },
      },
    });

    // Get all optins for visitor names/emails
    const optins = await prisma.chatOptin.findMany();
    const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

    // Group messages by visitorId
    const conversationsMap = new Map<string, {
      visitorId: string;
      visitorName: string | null;
      visitorEmail: string | null;
      page: string;
      messages: typeof messages;
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }>();

    messages.forEach((msg) => {
      // Try to get optin data for this visitor
      const optin = optinMap.get(msg.visitorId);

      if (!conversationsMap.has(msg.visitorId)) {
        conversationsMap.set(msg.visitorId, {
          visitorId: msg.visitorId,
          visitorName: optin?.name || msg.visitorName,
          visitorEmail: optin?.email || msg.visitorEmail,
          page: msg.page,
          messages: [],
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        });
      }

      const conv = conversationsMap.get(msg.visitorId)!;
      conv.messages.push(msg);

      // Update visitor info if we have it (from optin or message)
      if (!conv.visitorName) {
        conv.visitorName = optin?.name || msg.visitorName || null;
      }
      if (!conv.visitorEmail) {
        conv.visitorEmail = optin?.email || msg.visitorEmail || null;
      }

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
        messages: conv.messages
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((msg) => ({
            ...msg,
            // Format repliedBy to show user name instead of ID
            repliedBy: msg.isFromVisitor
              ? null
              : (msg as unknown as { repliedByUser?: { name: string | null } }).repliedByUser?.name || "Sarah (AI)",
          })),
      }))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return NextResponse.json({ conversations }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to fetch live chat:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500, headers: corsHeaders });
  }
}
