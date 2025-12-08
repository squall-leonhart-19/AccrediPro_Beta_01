import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { subject, content, recipientType } = await request.json();

    if (!subject || !content || !recipientType) {
      return NextResponse.json(
        { success: false, error: "Subject, content, and recipient type are required" },
        { status: 400 }
      );
    }

    // Get recipients based on type
    let recipients: { id: string; email: string; firstName: string | null }[] = [];

    if (recipientType === "all") {
      recipients = await prisma.user.findMany({
        where: { isActive: true, role: "STUDENT" },
        select: { id: true, email: true, firstName: true },
      });
    } else if (recipientType === "enrolled") {
      const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE" },
        select: {
          user: {
            select: { id: true, email: true, firstName: true },
          },
        },
        distinct: ["userId"],
      });
      recipients = enrollments.map((e) => e.user);
    } else if (recipientType === "completed") {
      const completions = await prisma.enrollment.findMany({
        where: { status: "COMPLETED" },
        select: {
          user: {
            select: { id: true, email: true, firstName: true },
          },
        },
        distinct: ["userId"],
      });
      recipients = completions.map((e) => e.user);
    }

    // Create bulk email record
    const bulkEmail = await prisma.bulkEmail.create({
      data: {
        subject,
        content,
        recipientType,
        status: "SENDING",
      },
    });

    // Send emails
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        // Replace placeholders in content
        const personalizedContent = content.replace(
          /{firstName}/g,
          recipient.firstName || "there"
        );

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #722F37; margin: 0;">AccrediPro</h1>
                <p style="color: #666; margin: 5px 0;">Educational Excellence</p>
              </div>

              <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                ${personalizedContent.replace(/\n/g, "<br>")}
              </div>

              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>AccrediPro - Veritas Et Excellentia</p>
              </div>
            </body>
          </html>
        `;

        await sendEmail({
          to: recipient.email,
          subject,
          html,
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        failedCount++;
      }
    }

    // Update bulk email record
    await prisma.bulkEmail.update({
      where: { id: bulkEmail.id },
      data: {
        status: failedCount === recipients.length ? "FAILED" : "SENT",
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
    console.error("Bulk email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send bulk emails" },
      { status: 500 }
    );
  }
}
