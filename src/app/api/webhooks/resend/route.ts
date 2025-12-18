import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/webhooks/resend - Handle Resend email events
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();

    console.log(`📧 [RESEND WEBHOOK] Received raw payload length: ${payload.length}`);

    const event = JSON.parse(payload);
    const { type, data } = event;

    console.log(`📧 [RESEND WEBHOOK] Event type: ${type}`);
    console.log(`📧 [RESEND WEBHOOK] Email ID: ${data?.email_id}`);

    // Find the email send record by Resend ID
    const emailSend = data?.email_id
      ? await prisma.emailSend.findUnique({
        where: { resendId: data.email_id },
      })
      : null;

    if (!emailSend) {
      console.log(`⚠️ [RESEND WEBHOOK] No EmailSend record found for resendId: ${data?.email_id}`);
      // Still return 200 to acknowledge receipt (otherwise Resend will retry)
      return NextResponse.json({ received: true, matched: false });
    }

    console.log(`✅ [RESEND WEBHOOK] Found EmailSend record: ${emailSend.id} for user: ${emailSend.userId}`);

    // Create event record
    await prisma.emailEvent.create({
      data: {
        emailSendId: emailSend.id,
        eventType: type,
        eventData: data,
      },
    });

    // Update email send status based on event type
    const now = new Date();

    switch (type) {
      case "email.sent":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "SENT",
            sentAt: now,
          },
        });
        break;

      case "email.delivered":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "DELIVERED",
            deliveredAt: now,
          },
        });
        await updateDailyAnalytics("delivered");
        break;

      case "email.opened":
        console.log(`👁️ [RESEND WEBHOOK] Processing OPEN event for email ${emailSend.id}`);
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "OPENED",
            openedAt: emailSend.openedAt || now,
            openCount: { increment: 1 },
          },
        });
        // Update template stats
        if (emailSend.emailTemplateId) {
          await prisma.emailTemplate.update({
            where: { id: emailSend.emailTemplateId },
            data: { openCount: { increment: 1 } },
          });
        }
        // Update sequence email stats
        if (emailSend.sequenceEmailId) {
          await prisma.sequenceEmail.update({
            where: { id: emailSend.sequenceEmailId },
            data: { openCount: { increment: 1 } },
          });
          // Also update enrollment stats
          const enrollment = await prisma.sequenceEnrollment.findFirst({
            where: {
              userId: emailSend.userId,
              sequence: {
                emails: { some: { id: emailSend.sequenceEmailId } }
              }
            }
          });
          if (enrollment) {
            await prisma.sequenceEnrollment.update({
              where: { id: enrollment.id },
              data: { emailsOpened: { increment: 1 } },
            });
            console.log(`✅ [RESEND WEBHOOK] Updated enrollment ${enrollment.id} opened count`);
          }
        }
        await updateDailyAnalytics("opened");
        await checkAndTagEmailOpener(emailSend.userId);
        break;

      case "email.clicked":
        console.log(`🖱️ [RESEND WEBHOOK] Processing CLICK event for email ${emailSend.id}`);
        const clickedUrl = data?.click?.link || "";
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "CLICKED",
            clickedAt: emailSend.clickedAt || now,
            clickCount: { increment: 1 },
            clickedLinks: {
              push: clickedUrl,
            },
          },
        });
        // Update template stats
        if (emailSend.emailTemplateId) {
          await prisma.emailTemplate.update({
            where: { id: emailSend.emailTemplateId },
            data: { clickCount: { increment: 1 } },
          });
        }
        // Update sequence email stats
        if (emailSend.sequenceEmailId) {
          await prisma.sequenceEmail.update({
            where: { id: emailSend.sequenceEmailId },
            data: { clickCount: { increment: 1 } },
          });
          // Also update enrollment stats
          const enrollment = await prisma.sequenceEnrollment.findFirst({
            where: {
              userId: emailSend.userId,
              sequence: {
                emails: { some: { id: emailSend.sequenceEmailId } }
              }
            }
          });
          if (enrollment) {
            await prisma.sequenceEnrollment.update({
              where: { id: enrollment.id },
              data: { emailsClicked: { increment: 1 } },
            });
            console.log(`✅ [RESEND WEBHOOK] Updated enrollment ${enrollment.id} clicked count`);
          }
        }
        await updateDailyAnalytics("clicked");
        await checkAndTagEmailClicker(emailSend.userId);
        break;

      case "email.bounced":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "BOUNCED",
            bouncedAt: now,
            errorMessage: data?.bounce?.message || "Email bounced",
          },
        });
        await updateDailyAnalytics("bounced");
        await addSuppressionTag(emailSend.userId, "suppress_bounced");
        break;

      case "email.failed":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "FAILED",
            errorMessage: data?.error?.message || "Email failed to send",
          },
        });
        console.error(`[WEBHOOK] Email failed for user ${emailSend.userId}:`, data?.error);
        break;

      case "email.delivery_delayed":
        console.warn(`[WEBHOOK] Email delivery delayed for ${emailSend.userId}:`, data);
        break;

      case "email.complained":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "COMPLAINED",
            complainedAt: now,
          },
        });
        await updateDailyAnalytics("complained");
        await addSuppressionTag(emailSend.userId, "suppress_complained");
        break;

      case "email.unsubscribed":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "UNSUBSCRIBED",
            unsubscribedAt: now,
          },
        });
        await updateDailyAnalytics("unsubscribed");
        await addSuppressionTag(emailSend.userId, "suppress_unsubscribed");
        break;
    }

    return NextResponse.json({ received: true, matched: true });
  } catch (error) {
    console.error("❌ [RESEND WEBHOOK] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Helper: Update daily analytics
async function updateDailyAnalytics(metric: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.emailAnalytics.upsert({
      where: { date: today },
      create: {
        date: today,
        [metric]: 1,
      },
      update: {
        [metric]: { increment: 1 },
      },
    });
  } catch (error) {
    console.error("Failed to update daily analytics:", error);
  }
}

// Helper: Check and tag email opener (opens 3+ emails)
async function checkAndTagEmailOpener(userId: string) {
  try {
    const openCount = await prisma.emailSend.count({
      where: {
        userId,
        openedAt: { not: null },
      },
    });

    if (openCount >= 3) {
      const tag = await prisma.marketingTag.findUnique({
        where: { slug: "behavior_email_opener" },
      });

      if (tag) {
        await prisma.userMarketingTag.upsert({
          where: { userId_tagId: { userId, tagId: tag.id } },
          create: { userId, tagId: tag.id, source: "automation" },
          update: {},
        });
      }
    }
  } catch (error) {
    console.error("Failed to tag email opener:", error);
  }
}

// Helper: Check and tag email clicker
async function checkAndTagEmailClicker(userId: string) {
  try {
    const clickCount = await prisma.emailSend.count({
      where: {
        userId,
        clickedAt: { not: null },
      },
    });

    if (clickCount >= 2) {
      const tag = await prisma.marketingTag.findUnique({
        where: { slug: "behavior_email_clicker" },
      });

      if (tag) {
        await prisma.userMarketingTag.upsert({
          where: { userId_tagId: { userId, tagId: tag.id } },
          create: { userId, tagId: tag.id, source: "automation" },
          update: {},
        });
      }
    }
  } catch (error) {
    console.error("Failed to tag email clicker:", error);
  }
}

// Helper: Add suppression tag
async function addSuppressionTag(userId: string, tagSlug: string) {
  try {
    const tag = await prisma.marketingTag.findUnique({
      where: { slug: tagSlug },
    });

    if (tag) {
      await prisma.userMarketingTag.upsert({
        where: { userId_tagId: { userId, tagId: tag.id } },
        create: { userId, tagId: tag.id, source: "automation" },
        update: {},
      });
    }
  } catch (error) {
    console.error(`Failed to add suppression tag ${tagSlug}:`, error);
  }
}
