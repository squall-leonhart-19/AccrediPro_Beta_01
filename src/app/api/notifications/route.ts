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

    // Get unread certificate notifications count
    // Includes CERTIFICATE_ISSUED (final course certs) and MODULE_COMPLETE (main certification module certs)
    // Mini diploma module completions don't create notifications, so MODULE_COMPLETE is only for main cert
    const unreadCertificates = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
        type: { in: ["CERTIFICATE_ISSUED", "MODULE_COMPLETE"] },
      },
    });

    // Get total unread count
    const totalUnread = unreadMessages + unreadCertificates;

    return NextResponse.json({
      success: true,
      data: {
        messages: unreadMessages,
        certificates: unreadCertificates,
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
