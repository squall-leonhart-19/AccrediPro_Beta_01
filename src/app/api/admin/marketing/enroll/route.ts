import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate branded HTML email - same template as inbox-test
function generateBrandedHtml(content: string, firstName: string): string {
  // Replace placeholders
  let personalizedContent = content
    .replace(/\{\{firstName\}\}/g, firstName);

  // Format content into paragraphs
  const formattedContent = personalizedContent
    .split('\n\n')
    .map(p => `<p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if mso]>
    <style type="text/css">
      body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Welcome to AccrediPro Academy - Your functional medicine journey starts here...</div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          ${formattedContent}
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
          <p style="margin: 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182</p>
          <p style="margin: 0; color: #999; font-size: 11px;">New York, NY 10020</p>
          <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
          <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia - Truth and Excellence in Education</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #bbb; font-size: 10px;">
              This email is from AccrediPro Academy.<br/>
              You're receiving this because of your account activity.
            </p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://app.accredipro.academy/unsubscribe" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, sequenceId } = await req.json();

    if (!email || !sequenceId) {
      return NextResponse.json({ error: "Email and sequence ID are required" }, { status: 400 });
    }

    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create a basic user record for the email
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          firstName: email.split("@")[0],
          lastName: "",
          role: "STUDENT",
        },
      });
    }

    // Generate slug from sequenceId
    const slug = sequenceId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "");

    // Find or create the sequence tag (for tracking)
    let sequenceTag = await prisma.marketingTag.findFirst({
      where: {
        OR: [
          { name: sequenceId },
          { slug }
        ]
      },
    });

    if (!sequenceTag) {
      sequenceTag = await prisma.marketingTag.create({
        data: {
          name: sequenceId,
          slug,
          category: "STAGE",
          description: `Auto-created tag for sequence: ${sequenceId}`,
          color: "#722F37",
        },
      });
    }

    // Check if user already has this tag
    const existingTagging = await prisma.userMarketingTag.findUnique({
      where: {
        userId_tagId: {
          userId: user.id,
          tagId: sequenceTag.id,
        },
      },
    });

    if (existingTagging) {
      return NextResponse.json({
        success: false,
        error: "User is already enrolled in this sequence"
      });
    }

    // Add the sequence tag to the user
    await prisma.userMarketingTag.create({
      data: {
        userId: user.id,
        tagId: sequenceTag.id,
      },
    });

    // Update the tag's userCount
    await prisma.marketingTag.update({
      where: { id: sequenceTag.id },
      data: { userCount: { increment: 1 } },
    });

    // Find the actual email Sequence
    const sequence = await prisma.sequence.findFirst({
      where: {
        OR: [
          { slug },
          { name: { contains: "nurture", mode: "insensitive" } },
          { slug: { contains: "nurture", mode: "insensitive" } },
        ]
      },
      include: {
        emails: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    let firstEmailSent = false;
    let firstEmailError = null;
    let enrollmentId = null;

    if (sequence && sequence.emails.length > 0) {
      // Check for existing enrollment
      const existingEnrollment = await prisma.sequenceEnrollment.findUnique({
        where: {
          userId_sequenceId: {
            userId: user.id,
            sequenceId: sequence.id,
          },
        },
      });

      if (!existingEnrollment) {
        // Create sequence enrollment
        const firstEmail = sequence.emails[0];
        const delayMs = (firstEmail.delayDays * 24 * 60 * 60 * 1000) + (firstEmail.delayHours * 60 * 60 * 1000);
        const nextSendAt = delayMs === 0
          ? new Date(Date.now() + 60 * 1000)
          : new Date(Date.now() + delayMs);

        const enrollment = await prisma.sequenceEnrollment.create({
          data: {
            userId: user.id,
            sequenceId: sequence.id,
            status: "ACTIVE",
            currentEmailIndex: 0,
            nextSendAt,
          },
        });
        enrollmentId = enrollment.id;

        // Update sequence stats
        await prisma.sequence.update({
          where: { id: sequence.id },
          data: { totalEnrolled: { increment: 1 } },
        });

        // Send first email immediately using the branded template
        try {
          const firstName = user.firstName || 'there';

          // Get email content and subject
          const emailContent = firstEmail.customContent || '';
          let subject = (firstEmail.customSubject || 'Welcome!')
            .replace(/^\[TEST\]\s*/i, '')
            .replace(/\{\{firstName\}\}/g, firstName);

          // Generate branded HTML (same as inbox-test)
          const htmlContent = generateBrandedHtml(emailContent, firstName);

          // Plain text version
          const textContent = emailContent
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1');

          // Send via Resend directly (same as inbox-test)
          const { data, error } = await resend.emails.send({
            from: "Sarah <info@accredipro-certificate.com>",
            to: user.email,
            subject,
            html: htmlContent,
            text: textContent,
            replyTo: "info@accredipro-certificate.com",
          });

          if (error) {
            firstEmailError = error.message || 'Failed to send email';
            console.error(`[Marketing] Failed to send email to ${email}:`, error);
          } else {
            firstEmailSent = true;

            // Create EmailSend record for tracking
            if (data?.id) {
              await prisma.emailSend.create({
                data: {
                  userId: user.id,
                  sequenceEmailId: firstEmail.id,
                  resendId: data.id,
                  toEmail: user.email,
                  subject,
                  status: "SENT",
                  sentAt: new Date(),
                },
              });
            }

            // Update enrollment
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

            // Update email stats
            await prisma.sequenceEmail.update({
              where: { id: firstEmail.id },
              data: { sentCount: { increment: 1 } },
            });

            console.log(`[Marketing] First email sent to ${email} (Resend ID: ${data?.id})`);
          }
        } catch (error) {
          console.error('Error sending first email:', error);
          firstEmailError = error instanceof Error ? error.message : 'Unknown error';
        }
      }
    } else {
      console.log(`[Marketing] No sequence found for ${sequenceId}, user tagged only`);
    }

    // Log the enrollment
    console.log(`[Marketing] Enrolled ${email} in sequence: ${sequenceId}`);

    return NextResponse.json({
      success: true,
      message: firstEmailSent
        ? `Successfully enrolled ${email} and sent first email!`
        : `Successfully enrolled ${email} in the nurture sequence`,
      userId: user.id,
      sequenceId,
      enrollmentId,
      firstEmailSent,
      firstEmailError,
    });
  } catch (error) {
    console.error("Error enrolling user:", error);
    return NextResponse.json(
      { error: "Failed to enroll user" },
      { status: 500 }
    );
  }
}
