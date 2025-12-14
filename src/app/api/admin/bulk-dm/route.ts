import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content, recipientType } = await request.json();

    if (!content || !recipientType) {
      return NextResponse.json(
        { success: false, error: "Content and recipient type are required" },
        { status: 400 }
      );
    }

    // Get recipients based on type (exclude fake profiles)
    let recipientIds: string[] = [];
    const baseFilter = { isFakeProfile: false };

    if (recipientType === "all") {
      const users = await prisma.user.findMany({
        where: { ...baseFilter, isActive: true, role: "STUDENT" },
        select: { id: true },
      });
      recipientIds = users.map((u) => u.id);
    } else if (recipientType === "enrolled") {
      const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE", user: baseFilter },
        select: { userId: true },
        distinct: ["userId"],
      });
      recipientIds = enrollments.map((e) => e.userId);
    } else if (recipientType === "completed") {
      const completions = await prisma.enrollment.findMany({
        where: { status: "COMPLETED", user: baseFilter },
        select: { userId: true },
        distinct: ["userId"],
      });
      recipientIds = completions.map((e) => e.userId);
    }

    // Create bulk DM record
    const bulkDM = await prisma.bulkDM.create({
      data: {
        content,
        recipientType,
        status: "SENDING",
      },
    });

    // Send DMs and create notifications
    let sentCount = 0;
    let failedCount = 0;

    for (const recipientId of recipientIds) {
      try {
        // Create message
        await prisma.message.create({
          data: {
            senderId: session.user.id,
            receiverId: recipientId,
            content,
            messageType: "SYSTEM",
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId: recipientId,
            type: "SYSTEM",
            title: "New Message from AccrediPro",
            message: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            data: { senderId: session.user.id },
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send DM to user ${recipientId}:`, error);
        failedCount++;
      }
    }

    // Update bulk DM record
    await prisma.bulkDM.update({
      where: { id: bulkDM.id },
      data: {
        status: failedCount === recipientIds.length ? "FAILED" : "SENT",
        sentCount,
        failedCount,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
    });
  } catch (error) {
    console.error("Bulk DM error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send bulk DMs" },
      { status: 500 }
    );
  }
}
