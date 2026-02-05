import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Send reply to scholarship applicant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[Scholarship Reply] Session:", session?.user?.email, session?.user?.role);

    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      console.log("[Scholarship Reply] Unauthorized - role:", session?.user?.role);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { visitorId, message } = await request.json();
    console.log("[Scholarship Reply] Request:", { visitorId, messageLength: message?.length });

    if (!visitorId || !message?.trim()) {
      console.log("[Scholarship Reply] Missing fields:", { visitorId: !!visitorId, message: !!message?.trim() });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the original conversation to get page info
    const existingMessage = await prisma.salesChat.findFirst({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
    });

    console.log("[Scholarship Reply] Found existing message:", !!existingMessage, existingMessage?.page);

    if (!existingMessage) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Create the reply message
    // Note: repliedBy is a foreign key to User, so we use the session user's ID
    // The display name "Sarah M." is shown on the frontend
    const reply = await prisma.salesChat.create({
      data: {
        visitorId,
        page: existingMessage.page,
        message: message.trim(),
        isFromVisitor: false,
        isRead: true,
        visitorName: existingMessage.visitorName,
        visitorEmail: existingMessage.visitorEmail,
        repliedBy: session.user.id, // Use actual user ID for foreign key
      },
    });

    // Mark all visitor messages as read
    await prisma.salesChat.updateMany({
      where: {
        visitorId,
        isFromVisitor: true,
        isRead: false,
      },
      data: { isRead: true },
    });

    console.log(`[Scholarships] Reply sent to ${visitorId}: ${message.substring(0, 50)}...`);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Failed to send scholarship reply:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
