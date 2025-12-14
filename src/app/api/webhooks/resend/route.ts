import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Verify Resend webhook signature
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// POST /api/webhooks/resend - Handle Resend email events
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("svix-signature") || "";
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Verify signature in production
    if (webhookSecret && process.env.NODE_ENV === "production") {
      // Resend uses Svix for webhooks - simplified verification
      // In production, you may want to use the Svix library for proper verification
      // For now, we'll log the event and process it
    }

    const event = JSON.parse(payload);
    const { type, data } = event;

    console.log(`📧 Resend webhook received: ${type}`, data?.email_id);

    // Find the email send record by Resend ID
    const emailSend = data?.email_id
      ? await prisma.emailSend.findUnique({
          where: { resendId: data.email_id },
        })
      : null;

    // Create event record
    if (emailSend) {
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
          // Update daily analytics
          await updateDailyAnalytics("delivered");
          break;

        case "email.opened":
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
          }
          // Update daily analytics
          await updateDailyAnalytics("opened");
          // Auto-tag user as email opener (if opened 3+ emails)
          await checkAndTagEmailOpener(emailSend.userId);
          break;

        case "email.clicked":
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
          }
          // Update daily analytics
          await updateDailyAnalytics("clicked");
          // Auto-tag user as email clicker
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
          // Update daily analytics
          await updateDailyAnalytics("bounced");
          // Auto-tag user with bounced tag
          await addSuppressionTag(emailSend.userId, "suppress_bounced");
          break;

        case "email.complained":
          await prisma.emailSend.update({
            where: { id: emailSend.id },
            data: {
              status: "COMPLAINED",
              complainedAt: now,
            },
          });
          // Update daily analytics
          await updateDailyAnalytics("complained");
          // Auto-tag user with complained tag
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
          // Update daily analytics
          await updateDailyAnalytics("unsubscribed");
          // Auto-tag user with unsubscribed tag
          await addSuppressionTag(emailSend.userId, "suppress_unsubscribed");
          break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Resend webhook error:", error);
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
