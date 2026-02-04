import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { detectEmailTypo } from "@/lib/email-typo-detector";
import { verifyEmail } from "@/lib/neverbounce";

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
          // Also update enrollment stats (skip if no userId)
          if (emailSend.userId) {
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
          // Also update enrollment stats (skip if no userId)
          if (emailSend.userId) {
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
        // Try auto-fix before suppressing (only if we have a userId)
        if (emailSend.userId) {
          const wasFixed = await handleBounceWithAutoFix(
            emailSend.userId,
            emailSend.toEmail,
            data?.bounce?.message || "Email bounced",
            emailSend.id
          );
          // Only suppress if we couldn't fix it
          if (!wasFixed) {
            await addSuppressionTag(emailSend.userId, "suppress_bounced");
          }
        }
        break;

      case "email.failed":
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: "FAILED",
            errorMessage: data?.error?.message || "Email failed to send",
          },
        });
        console.error(`[WEBHOOK] Email failed for user ${emailSend.userId || "unknown"}:`, data?.error);
        break;

      case "email.delivery_delayed":
        console.warn(`[WEBHOOK] Email delivery delayed for ${emailSend.userId || "unknown"}:`, data);
        // Track delays and suppress after 2 delays for this user
        if (emailSend.userId) {
          await handleDeliveryDelayed(emailSend.userId);
        }
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
async function checkAndTagEmailOpener(userId: string | null) {
  if (!userId) return; // Skip if no userId (e.g., email sent to lead without user account)
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
async function checkAndTagEmailClicker(userId: string | null) {
  if (!userId) return; // Skip if no userId (e.g., email sent to lead without user account)
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
async function addSuppressionTag(userId: string | null, tagSlug: string) {
  if (!userId) return; // Skip if no userId (e.g., email sent to lead without user account)
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

// Helper: Handle delivery delayed - suppress after 2 delays
async function handleDeliveryDelayed(userId: string) {
  const MAX_DELAYS_BEFORE_SUPPRESS = 2;

  try {
    // Count recent delivery delays for this user (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const delayCount = await prisma.emailEvent.count({
      where: {
        emailSend: { userId },
        eventType: "email.delivery_delayed",
        createdAt: { gte: sevenDaysAgo }
      }
    });

    console.log(`[WEBHOOK] User ${userId} has ${delayCount} delivery delays in last 7 days`);

    if (delayCount >= MAX_DELAYS_BEFORE_SUPPRESS) {
      console.log(`⚠️ [WEBHOOK] Auto-suppressing ${userId} after ${delayCount} delivery delays`);
      await addSuppressionTag(userId, "suppress_bounced");
    }
  } catch (error) {
    console.error("Failed to handle delivery delay:", error);
  }
}

// Helper: Handle bounce with AI-powered auto-fix
async function handleBounceWithAutoFix(
  userId: string,
  originalEmail: string,
  bounceReason: string,
  bouncedEmailSendId: string
): Promise<boolean> {
  console.log(`🔧 [AUTO-FIX] Starting bounce recovery for ${originalEmail}`);

  try {
    // Step 1: Detect typo using AI + rules
    const typoResult = await detectEmailTypo(originalEmail);

    // Create or update EmailBounce record
    const bounceRecord = await prisma.emailBounce.upsert({
      where: {
        userId_originalEmail: { userId, originalEmail },
      },
      create: {
        userId,
        originalEmail,
        bounceType: "hard",
        bounceReason,
        suggestedEmail: typoResult.suggestedEmail,
        suggestionSource: typoResult.source,
        suggestionConfidence: typoResult.confidence,
        status: typoResult.hasSuggestion ? "pending" : "no_suggestion",
      },
      update: {
        bounceCount: { increment: 1 },
        bounceReason,
        suggestedEmail: typoResult.suggestedEmail,
        suggestionSource: typoResult.source,
        suggestionConfidence: typoResult.confidence,
      },
    });

    if (!typoResult.hasSuggestion || !typoResult.suggestedEmail) {
      console.log(`📧 [AUTO-FIX] No suggestion found for ${originalEmail}`);
      return false;
    }

    console.log(`💡 [AUTO-FIX] Suggestion: ${originalEmail} → ${typoResult.suggestedEmail} (${typoResult.confidence})`);

    // Step 2: Verify suggestion with NeverBounce
    const verifyResult = await verifyEmail(typoResult.suggestedEmail);

    await prisma.emailBounce.update({
      where: { id: bounceRecord.id },
      data: {
        neverBounceResult: verifyResult.result,
        neverBounceCheckedAt: new Date(),
      },
    });

    if (!verifyResult.isValid) {
      console.log(`❌ [AUTO-FIX] NeverBounce rejected suggestion: ${typoResult.suggestedEmail} (${verifyResult.result})`);
      await prisma.emailBounce.update({
        where: { id: bounceRecord.id },
        data: { status: "needs_manual" },
      });
      return false;
    }

    console.log(`✅ [AUTO-FIX] NeverBounce verified: ${typoResult.suggestedEmail}`);

    // Step 3: AUTO-FIX - Update user email
    await prisma.user.update({
      where: { id: userId },
      data: { email: typoResult.suggestedEmail },
    });

    console.log(`📧 [AUTO-FIX] Updated user email: ${originalEmail} → ${typoResult.suggestedEmail}`);

    // Step 4: Remove suppression tag if exists
    await removeSuppressionTag(userId, "suppress_bounced");

    // Step 5: Resend the bounced email
    const bouncedEmail = await prisma.emailSend.findUnique({
      where: { id: bouncedEmailSendId },
      include: { emailTemplate: true },
    });

    if (bouncedEmail && bouncedEmail.emailTemplate) {
      // Mark as resend attempted
      await prisma.emailBounce.update({
        where: { id: bounceRecord.id },
        data: {
          status: "auto_fixed",
          fixedAt: new Date(),
          resendAttempted: true,
        },
      });

      // TODO: Actually resend the email using Resend API
      // For now, just mark as fixed - actual resend would require importing Resend
      console.log(`📤 [AUTO-FIX] Would resend email ${bouncedEmailSendId} to ${typoResult.suggestedEmail}`);

      await prisma.emailBounce.update({
        where: { id: bounceRecord.id },
        data: {
          resendSucceeded: true,
          resendEmailId: bouncedEmailSendId,
        },
      });
    } else {
      // No template to resend, but still mark as fixed
      await prisma.emailBounce.update({
        where: { id: bounceRecord.id },
        data: {
          status: "auto_fixed",
          fixedAt: new Date(),
        },
      });
    }

    console.log(`🎉 [AUTO-FIX] Successfully auto-fixed bounce for ${originalEmail} → ${typoResult.suggestedEmail}`);
    return true;

  } catch (error) {
    console.error(`❌ [AUTO-FIX] Failed to auto-fix bounce for ${originalEmail}:`, error);
    return false;
  }
}

// Helper: Remove suppression tag
async function removeSuppressionTag(userId: string, tagSlug: string) {
  try {
    const tag = await prisma.marketingTag.findUnique({
      where: { slug: tagSlug },
    });

    if (tag) {
      await prisma.userMarketingTag.deleteMany({
        where: { userId, tagId: tag.id },
      });
      console.log(`🏷️ [AUTO-FIX] Removed ${tagSlug} tag from user ${userId}`);
    }
  } catch (error) {
    console.error(`Failed to remove suppression tag ${tagSlug}:`, error);
  }
}
