import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";

// POST /api/admin/marketing/sequences/[id]/enroll - Manually enroll a user
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
    const { userId, email, sendImmediately = true } = body; // Default: send first email immediately

    // Find user by ID or email
    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the sequence
    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        emails: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        triggerTag: true,
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    if (!sequence.isActive) {
      return NextResponse.json({ error: "Sequence is not active" }, { status: 400 });
    }

    if (sequence.emails.length === 0) {
      return NextResponse.json({ error: "Sequence has no emails" }, { status: 400 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.sequenceEnrollment.findUnique({
      where: {
        userId_sequenceId: {
          userId: user.id,
          sequenceId: sequence.id,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === "ACTIVE") {
        return NextResponse.json({ error: "User is already enrolled in this sequence" }, { status: 400 });
      }

      // Re-enroll if previously exited/completed
      const firstEmail = sequence.emails[0];
      const nextSendAt = calculateNextSendTime(firstEmail.delayDays, firstEmail.delayHours);

      const enrollment = await prisma.sequenceEnrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: "ACTIVE",
          currentEmailIndex: 0,
          nextSendAt,
          enrolledAt: new Date(),
          completedAt: null,
          exitedAt: null,
          exitReason: null,
          emailsReceived: 0,
          emailsOpened: 0,
          emailsClicked: 0,
        },
      });

      // Update sequence stats
      await prisma.sequence.update({
        where: { id: sequenceId },
        data: { totalEnrolled: { increment: 1 } },
      });

      // Send first email immediately for re-enrollment
      let firstEmailSent = false;
      let firstEmailError = null;

      if (sendImmediately || (firstEmail.delayDays === 0 && firstEmail.delayHours === 0)) {
        try {
          const firstName = user.firstName || 'there';
          const lastName = user.lastName || '';
          const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || firstName;
          const baseUrl = process.env.NEXTAUTH_URL || 'https://accredipro.com';

          const htmlContent = (firstEmail.customContent || '')
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\{\{lastName\}\}/g, lastName)
            .replace(/\{\{email\}\}/g, user.email)
            .replace(/\{\{fullName\}\}/g, fullName)
            // URL replacements
            .replace(/\{\{MINI_DIPLOMA_URL\}\}/g, `${baseUrl}/my-mini-diploma`)
            .replace(/\{\{GRADUATE_TRAINING_URL\}\}/g, `${baseUrl}/training`)
            .replace(/\{\{CERTIFICATION_URL\}\}/g, `${baseUrl}/courses/functional-medicine-certification`)
            .replace(/\{\{DASHBOARD_URL\}\}/g, `${baseUrl}/dashboard`)
            .replace(/\{\{ROADMAP_URL\}\}/g, `${baseUrl}/roadmap`)
            // Convert markdown bold/italic to HTML
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Convert line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

          // Remove any [TEST] prefix from subject if present and replace firstName
          let subject = (firstEmail.customSubject || 'Welcome!')
            .replace(/^\[TEST\]\s*/i, '')
            .replace(/\{\{firstName\}\}/g, firstName);

          const result = await sendEmail({
            to: user.email,
            subject,
            html: brandedEmailWrapper(htmlContent),
            type: 'marketing',
          });

          if (result.success) {
            firstEmailSent = true;

            // Create EmailSend record for tracking opens/clicks via webhook
            const resendId = result.data?.id;
            if (resendId) {
              await prisma.emailSend.create({
                data: {
                  userId: user.id,
                  sequenceEmailId: firstEmail.id,
                  resendId,
                  toEmail: user.email,
                  subject,
                  status: "SENT",
                  sentAt: new Date(),
                },
              });
            }

            await prisma.sequenceEnrollment.update({
              where: { id: enrollment.id },
              data: {
                emailsReceived: 1,
                currentEmailIndex: 1,
                nextSendAt: sequence.emails[1]
                  ? new Date(Date.now() + (sequence.emails[1].delayDays * 24 * 60 * 60 * 1000) + (sequence.emails[1].delayHours * 60 * 60 * 1000))
                  : null,
              },
            });
            await prisma.sequenceEmail.update({
              where: { id: firstEmail.id },
              data: { sentCount: { increment: 1 } },
            });
          } else {
            firstEmailError = 'Failed to send first email';
          }
        } catch (error) {
          console.error('Error sending first email on re-enrollment:', error);
          firstEmailError = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      return NextResponse.json({
        enrollment,
        message: firstEmailSent ? "User re-enrolled and first email sent!" : "User re-enrolled in sequence",
        firstEmailSent,
        firstEmailError,
      });
    }

    // Create new enrollment
    const firstEmail = sequence.emails[0];
    const nextSendAt = calculateNextSendTime(firstEmail.delayDays, firstEmail.delayHours);

    const enrollment = await prisma.sequenceEnrollment.create({
      data: {
        userId: user.id,
        sequenceId: sequence.id,
        status: "ACTIVE",
        currentEmailIndex: 0,
        nextSendAt,
      },
    });

    // Update sequence stats
    await prisma.sequence.update({
      where: { id: sequenceId },
      data: { totalEnrolled: { increment: 1 } },
    });

    // Also add the trigger tag to the user if specified
    if (sequence.triggerTagId) {
      await prisma.userMarketingTag.upsert({
        where: {
          userId_tagId: {
            userId: user.id,
            tagId: sequence.triggerTagId,
          },
        },
        create: {
          userId: user.id,
          tagId: sequence.triggerTagId,
          source: "sequence_enrollment",
        },
        update: {},
      });
    }

    // Send first email immediately if sendImmediately is true OR delay is 0
    let firstEmailSent = false;
    let firstEmailError = null;

    if (sendImmediately || (firstEmail.delayDays === 0 && firstEmail.delayHours === 0)) {
      try {
        // Replace placeholders
        const firstName = user.firstName || 'there';
        const lastName = user.lastName || '';
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || firstName;
        const baseUrl = process.env.NEXTAUTH_URL || 'https://accredipro.com';

        const htmlContent = (firstEmail.customContent || '')
          .replace(/\{\{firstName\}\}/g, firstName)
          .replace(/\{\{lastName\}\}/g, lastName)
          .replace(/\{\{email\}\}/g, user.email)
          .replace(/\{\{fullName\}\}/g, fullName)
          // URL replacements
          .replace(/\{\{MINI_DIPLOMA_URL\}\}/g, `${baseUrl}/my-mini-diploma`)
          .replace(/\{\{GRADUATE_TRAINING_URL\}\}/g, `${baseUrl}/training`)
          .replace(/\{\{CERTIFICATION_URL\}\}/g, `${baseUrl}/courses/functional-medicine-certification`)
          .replace(/\{\{DASHBOARD_URL\}\}/g, `${baseUrl}/dashboard`)
          .replace(/\{\{ROADMAP_URL\}\}/g, `${baseUrl}/roadmap`)
          // Convert markdown bold/italic to HTML
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          // Convert line breaks
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>');

        // Remove any [TEST] prefix from subject if present and replace firstName
        let subject = (firstEmail.customSubject || 'Welcome!')
          .replace(/^\[TEST\]\s*/i, '')
          .replace(/\{\{firstName\}\}/g, firstName);

        const result = await sendEmail({
          to: user.email,
          subject,
          html: brandedEmailWrapper(htmlContent),
          type: 'marketing',
        });

        if (result.success) {
          firstEmailSent = true;

          // Create EmailSend record for tracking opens/clicks via webhook
          const resendId = result.data?.id;
          if (resendId) {
            await prisma.emailSend.create({
              data: {
                userId: user.id,
                sequenceEmailId: firstEmail.id,
                resendId,
                toEmail: user.email,
                subject,
                status: "SENT",
                sentAt: new Date(),
              },
            });
          }

          // Update enrollment with first email sent
          await prisma.sequenceEnrollment.update({
            where: { id: enrollment.id },
            data: {
              emailsReceived: 1,
              currentEmailIndex: 1,
              // Set next send time for second email if exists
              nextSendAt: sequence.emails[1]
                ? new Date(Date.now() + (sequence.emails[1].delayDays * 24 * 60 * 60 * 1000) + (sequence.emails[1].delayHours * 60 * 60 * 1000))
                : null,
            },
          });

          // Update email stats
          await prisma.sequenceEmail.update({
            where: { id: firstEmail.id },
            data: { sentCount: { increment: 1 } },
          });
        } else {
          firstEmailError = 'Failed to send first email';
        }
      } catch (error) {
        console.error('Error sending first email:', error);
        firstEmailError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      enrollment,
      message: firstEmailSent
        ? "User enrolled and first email sent!"
        : "User enrolled in sequence",
      nextSendAt,
      firstEmailSent,
      firstEmailError,
    }, { status: 201 });
  } catch (error) {
    console.error("Error enrolling user:", error);
    return NextResponse.json(
      { error: "Failed to enroll user" },
      { status: 500 }
    );
  }
}

function calculateNextSendTime(delayDays: number, delayHours: number): Date {
  const now = new Date();
  const delayMs = (delayDays * 24 * 60 * 60 * 1000) + (delayHours * 60 * 60 * 1000);

  // If immediate (no delay), send in 1 minute to allow for processing
  if (delayMs === 0) {
    return new Date(now.getTime() + 60 * 1000);
  }

  return new Date(now.getTime() + delayMs);
}
