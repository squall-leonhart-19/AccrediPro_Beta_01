import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push-notifications";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin/superuser/mentor access - SUPPORT cannot send bulk DMs
    if (!["ADMIN", "SUPERUSER", "MENTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content, recipientType, senderId, singleUserId } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!senderId) {
      return NextResponse.json({ error: "Sender is required" }, { status: 400 });
    }

    // Get recipients based on type
    let recipients: { id: string; firstName: string | null; lastName: string | null; email: string | null }[] = [];

    if (recipientType === "single" && singleUserId) {
      // Single student test
      const student = await prisma.user.findUnique({
        where: { id: singleUserId },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      if (student) {
        recipients = [student];
      }
    } else if (recipientType === "all") {
      recipients = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          isActive: true,
          isFakeProfile: false,
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    } else if (recipientType === "enrolled") {
      const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE" },
        select: { userId: true },
        distinct: ["userId"],
      });
      const userIds = enrollments.map((e) => e.userId);
      recipients = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          isActive: true,
          isFakeProfile: false,
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    } else if (recipientType === "completed") {
      const completedEnrollments = await prisma.enrollment.findMany({
        where: { status: "COMPLETED" },
        select: { userId: true },
        distinct: ["userId"],
      });
      const userIds = completedEnrollments.map((e) => e.userId);
      recipients = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          isActive: true,
          isFakeProfile: false,
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 });
    }

    // Create DM messages for each recipient
    let sentCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Personalize message - handle various bracket styles
        let personalizedContent = content
          // Standard brackets
          .replace(/\{firstName\}/gi, recipient.firstName || "there")
          .replace(/\{lastName\}/gi, recipient.lastName || "")
          .replace(/\{email\}/gi, recipient.email || "")
          // Double brackets (if used)
          .replace(/\{\{firstName\}\}/gi, recipient.firstName || "there")
          .replace(/\{\{lastName\}\}/gi, recipient.lastName || "")
          .replace(/\{\{email\}\}/gi, recipient.email || "");


        // Create message directly (using senderId as sender, recipient as receiver)
        await prisma.message.create({
          data: {
            senderId: senderId,
            receiverId: recipient.id,
            content: personalizedContent.trim(),
          },
        });

        // Send push notification (non-blocking)
        sendPushToUser(recipient.id, {
          title: "New Message from Coach",
          body: personalizedContent.length > 80
            ? personalizedContent.substring(0, 80) + "..."
            : personalizedContent,
          tag: "new-message",
          data: { url: "/messages", type: "message" },
        }, "messages").catch((err) => {
          console.error(`Push notification failed for ${recipient.id}:`, err);
        });

        sentCount++;
      } catch (err) {
        console.error(`Failed to send DM to user ${recipient.id}:`, err);
        errors.push(recipient.id);
      }
    }

    // Log the bulk DM
    await prisma.bulkDM.create({
      data: {
        senderId: session.user.id,
        content: content.substring(0, 500),
        recipientType: recipientType === "single" ? "SINGLE" : recipientType.toUpperCase(),
        sentCount,
        status: "SENT",
      },
    });

    return NextResponse.json({
      success: true,
      sentCount,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("Bulk DM error:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
