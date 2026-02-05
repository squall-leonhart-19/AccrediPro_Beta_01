import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all scholarship applications (filtered from SalesChat)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all scholarship chat messages (page contains "scholarship")
    const messages = await prisma.salesChat.findMany({
      where: {
        page: { contains: "scholarship", mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    // Get optins for scholarship visitors
    const visitorIds = [...new Set(messages.map((m) => m.visitorId))];
    const optins = visitorIds.length > 0
      ? await prisma.chatOptin.findMany({
          where: { visitorId: { in: visitorIds } },
        })
      : [];
    const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

    // Group messages by email or visitorId
    // IMPORTANT: Track ALL visitorIds for each group so replies are found
    const applicationsMap = new Map<string, {
      visitorId: string;
      allVisitorIds: string[]; // Track all visitor IDs for this conversation
      visitorName: string | null;
      visitorEmail: string | null;
      page: string;
      messages: typeof messages;
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }>();

    messages.forEach((msg) => {
      const optin = optinMap.get(msg.visitorId);
      const email = optin?.email || msg.visitorEmail;
      const groupKey = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

      if (!applicationsMap.has(groupKey)) {
        applicationsMap.set(groupKey, {
          visitorId: msg.visitorId,
          allVisitorIds: [msg.visitorId],
          visitorName: optin?.name || msg.visitorName,
          visitorEmail: email,
          page: msg.page,
          messages: [],
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        });
      }

      const app = applicationsMap.get(groupKey)!;
      app.messages.push(msg);

      // Track all visitor IDs for this conversation
      if (!app.allVisitorIds.includes(msg.visitorId)) {
        app.allVisitorIds.push(msg.visitorId);
      }

      if (!app.visitorName) {
        app.visitorName = optin?.name || msg.visitorName || null;
      }
      if (!app.visitorEmail && email) {
        app.visitorEmail = email;
      }

      if (msg.isFromVisitor && !msg.isRead) {
        app.unreadCount++;
      }

      // Update visitorId to the one from visitor messages (not admin replies)
      if (msg.isFromVisitor && msg.createdAt > app.lastMessageAt) {
        app.visitorId = msg.visitorId;
      }

      // Track last message
      if (msg.createdAt > app.lastMessageAt) {
        app.lastMessage = msg.message;
        app.lastMessageAt = msg.createdAt;
      }
    });

    // Sort applications by last message time
    const applications = Array.from(applicationsMap.values())
      .map((app) => ({
        ...app,
        messages: app.messages
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((msg) => ({
            ...msg,
            repliedBy: msg.isFromVisitor ? null : (msg.repliedBy || "Sarah M."),
          })),
      }))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    console.log(`[Scholarships] Returning ${applications.length} applications with messages`);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch scholarship applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
