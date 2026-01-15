import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper, personalEmailWrapper } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { subject, content, recipientType, templateStyle, singleUserId } = await request.json();

    if (!subject || !content || !recipientType) {
      return NextResponse.json(
        { success: false, error: "Subject, content, and recipient type are required" },
        { status: 400 }
      );
    }

    // Get recipients based on type
    let recipients: { id: string; email: string; firstName: string | null; lastName: string | null }[] = [];

    // Base filter: exclude fake profiles and users without email
    const baseFilter = { isFakeProfile: false, email: { not: null } };

    if (recipientType === "single" && singleUserId) {
      // Single student test
      const student = await prisma.user.findUnique({
        where: { id: singleUserId },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
      if (student && student.email) {
        recipients = [student as { id: string; email: string; firstName: string | null; lastName: string | null }];
      }
    } else if (recipientType === "all") {
      recipients = await prisma.user.findMany({
        where: { ...baseFilter, isActive: true, role: "STUDENT" },
        select: { id: true, email: true, firstName: true, lastName: true },
      }) as { id: string; email: string; firstName: string | null; lastName: string | null }[];
    } else if (recipientType === "enrolled") {
      const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE", user: baseFilter },
        select: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        distinct: ["userId"],
      });
      recipients = enrollments.map((e) => e.user) as { id: string; email: string; firstName: string | null; lastName: string | null }[];
    } else if (recipientType === "completed") {
      const completions = await prisma.enrollment.findMany({
        where: { status: "COMPLETED", user: baseFilter },
        select: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        distinct: ["userId"],
      });
      recipients = completions.map((e) => e.user) as { id: string; email: string; firstName: string | null; lastName: string | null }[];
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No recipients found" },
        { status: 400 }
      );
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
        // Replace placeholders in content - handle various bracket styles
        const personalizedContent = content
          .replace(/\{firstName\}/gi, recipient.firstName || "there")
          .replace(/\{lastName\}/gi, recipient.lastName || "")
          .replace(/\{email\}/gi, recipient.email || "")
          .replace(/\{\{firstName\}\}/gi, recipient.firstName || "there")
          .replace(/\{\{lastName\}\}/gi, recipient.lastName || "")
          .replace(/\{\{email\}\}/gi, recipient.email || "");

        // Convert newlines to <br> for HTML
        const htmlContent = personalizedContent.replace(/\n/g, "<br>");

        // Apply template style
        let html: string;
        if (templateStyle === "personal") {
          // Personal style - plain text look, no images
          html = personalEmailWrapper(htmlContent);
        } else {
          // Branded style - full AccrediPro branding
          html = emailWrapper(htmlContent);
        }

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
