import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Update typing status
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, isTyping } = await req.json();

    if (!receiverId) {
      return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
    }

    // Upsert typing status
    await prisma.typingStatus.upsert({
      where: {
        senderId_receiverId: {
          senderId: session.user.id,
          receiverId,
        },
      },
      update: {
        isTyping: isTyping ?? true,
        updatedAt: new Date(),
      },
      create: {
        senderId: session.user.id,
        receiverId,
        isTyping: isTyping ?? true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Typing status error:", error);
    return NextResponse.json(
      { error: "Failed to update typing status" },
      { status: 500 }
    );
  }
}

// Get typing status for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("senderId");

    // Clean up old typing statuses (older than 10 seconds)
    const tenSecondsAgo = new Date(Date.now() - 10000);
    await prisma.typingStatus.deleteMany({
      where: {
        updatedAt: { lt: tenSecondsAgo },
      },
    });

    // Get active typing status
    const where = senderId
      ? {
          senderId,
          receiverId: session.user.id,
          isTyping: true,
          updatedAt: { gte: tenSecondsAgo },
        }
      : {
          receiverId: session.user.id,
          isTyping: true,
          updatedAt: { gte: tenSecondsAgo },
        };

    const typingUsers = await prisma.typingStatus.findMany({
      where,
      select: { senderId: true },
    });

    return NextResponse.json({
      success: true,
      typingUsers: typingUsers.map((t) => t.senderId),
    });
  } catch (error) {
    console.error("Get typing status error:", error);
    return NextResponse.json(
      { error: "Failed to get typing status" },
      { status: 500 }
    );
  }
}
