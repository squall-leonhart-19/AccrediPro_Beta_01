import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";

// POST /api/admin/marketing/sequences/[id]/test - Send test sequence to an email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const body = await request.json();
    const { testEmail, sendFirstEmail } = body;

    if (!testEmail) {
      return NextResponse.json({ error: "Test email is required" }, { status: 400 });
    }

    // Get the sequence with all emails
    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        emails: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        triggerTag: true,
        exitTag: true,
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    if (sequence.emails.length === 0) {
      return NextResponse.json({ error: "Sequence has no emails" }, { status: 400 });
    }

    // Build the sequence preview
    const sequencePreview = {
      id: sequence.id,
      name: sequence.name,
      description: sequence.description,
      triggerType: sequence.triggerType,
      triggerTag: sequence.triggerTag,
      exitTag: sequence.exitTag,
      exitOnReply: sequence.exitOnReply,
      exitOnClick: sequence.exitOnClick,
      totalEmails: sequence.emails.length,
      emails: sequence.emails.map((email) => {
        // delayDays represents "days from sequence start" (absolute), not cumulative between emails
        const totalDelayMinutes = (email.delayDays * 24 * 60) + (email.delayHours * 60);

        return {
          id: email.id,
          order: email.order,
          subject: email.customSubject || "Untitled",
          delayDays: email.delayDays,
          delayHours: email.delayHours,
          totalDelayMinutes,
          totalDelayFormatted: formatDelay(totalDelayMinutes),
          contentPreview: email.customContent?.substring(0, 200) || "",
          sentCount: email.sentCount,
          openCount: email.openCount,
          clickCount: email.clickCount,
        };
      }),
    };

    // If sendFirstEmail is true, send the first email to the test address
    let emailSent = false;
    let emailError = null;

    if (sendFirstEmail && sequence.emails.length > 0) {
      const firstEmail = sequence.emails[0];

      // Replace placeholders with test data
      const htmlContent = replaceEmailPlaceholders(
        firstEmail.customContent || "<p>No content</p>",
        {
          firstName: "Test",
          lastName: "User",
          email: testEmail,
        }
      );

      try {
        // Replace {{firstName}} in subject line too
        const subject = (firstEmail.customSubject || "Test Email")
          .replace(/\{\{firstName\}\}/g, "Test");

        // Send as marketing type for proper FROM name and delivery
        const result = await sendEmail({
          to: testEmail,
          subject: subject, // No [TEST] prefix - looks like spam
          html: brandedEmailWrapper(htmlContent),
          type: 'marketing', // MUST be marketing for "Sarah <email>" FROM
        });

        emailSent = result.success;
        if (!result.success) {
          emailError = "Failed to send email";
        }
      } catch (error) {
        emailError = error instanceof Error ? error.message : "Unknown error";
      }
    }

    return NextResponse.json({
      sequence: sequencePreview,
      testEmailSent: emailSent,
      testEmailError: emailError,
      testEmail: sendFirstEmail ? testEmail : null,
    });
  } catch (error) {
    console.error("Error testing sequence:", error);
    return NextResponse.json(
      { error: "Failed to test sequence" },
      { status: 500 }
    );
  }
}

function formatDelay(totalMinutes: number): string {
  if (totalMinutes === 0) return "Immediate";

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ") || "Immediate";
}

function replaceEmailPlaceholders(
  content: string,
  data: { firstName?: string; lastName?: string; email?: string }
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://accredipro.com";

  return content
    .replace(/\{\{firstName\}\}/g, data.firstName || "Friend")
    .replace(/\{\{lastName\}\}/g, data.lastName || "")
    .replace(/\{\{email\}\}/g, data.email || "")
    .replace(/\{\{fullName\}\}/g, `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Friend")
    // URL replacements
    .replace(/\{\{MINI_DIPLOMA_URL\}\}/g, `${baseUrl}/my-mini-diploma`)
    .replace(/\{\{GRADUATE_TRAINING_URL\}\}/g, `${baseUrl}/training`)
    .replace(/\{\{CERTIFICATION_URL\}\}/g, `${baseUrl}/courses/functional-medicine-certification`)
    .replace(/\{\{DASHBOARD_URL\}\}/g, `${baseUrl}/dashboard`)
    .replace(/\{\{ROADMAP_URL\}\}/g, `${baseUrl}/roadmap`)
    // Convert markdown bold to HTML
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Convert markdown italic to HTML
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Convert line breaks to <br> for HTML
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

