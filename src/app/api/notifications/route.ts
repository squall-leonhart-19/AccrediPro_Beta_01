import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get unread message count
    const unreadMessages = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    // Get total unread count (can add announcements later)
    const totalUnread = unreadMessages;

    return NextResponse.json({
      success: true,
      data: {
        messages: unreadMessages,
        announcements: 0,
        total: totalUnread,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
