import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// CORS headers for cross-origin requests
const allowedOrigins = [
  "https://sarah.accredipro.academy",
  "http://localhost:3000",
  "https://accredipro.academy", // Main domain
  "https://learn.accredipro.academy", // Admin/LMS domain
];

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get("origin");
  const isAllowed = origin && allowedOrigins.some(o => origin.startsWith(o));

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[LiveChat] Session:", session?.user?.email, session?.user?.role);

    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: getCorsHeaders(request) });
    }

    // Get all sales chat messages grouped by visitor
    const messages = await prisma.salesChat.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    // Get all optins for visitor names/emails
    const optins = await prisma.chatOptin.findMany();
    const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

    // Group messages by email (preferred) or visitorId (fallback)
    // This merges conversations from the same email even if they have different visitorIds
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
      const email = optin?.email || msg.visitorEmail;

      // Use email as key if available, otherwise use visitorId
      // This ensures same email from different sessions is grouped together
      const groupKey = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

      if (!conversationsMap.has(groupKey)) {
        conversationsMap.set(groupKey, {
          visitorId: msg.visitorId,
          visitorName: optin?.name || msg.visitorName,
          visitorEmail: email,
          page: msg.page,
          messages: [],
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        });
      }

      const conv = conversationsMap.get(groupKey)!;
      conv.messages.push(msg);

      // Update visitor info if we have it (from optin or message)
      if (!conv.visitorName) {
        conv.visitorName = optin?.name || msg.visitorName || null;
      }
      if (!conv.visitorEmail && email) {
        conv.visitorEmail = email;
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
            repliedBy: msg.isFromVisitor ? null : (msg.repliedBy || "Sarah M."),
          })),
      }))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    console.log(`[LiveChat] Returning ${conversations.length} conversations`);
    return NextResponse.json({ conversations }, { headers: getCorsHeaders(request) });
  } catch (error) {
    console.error("Failed to fetch live chat:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500, headers: getCorsHeaders(request) });
  }
}
