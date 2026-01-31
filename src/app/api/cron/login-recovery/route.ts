import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, personalEmailWrapper } from "@/lib/email";

/**
 * CRON: Login Recovery Email Sequence
 *
 * Runs every 15 minutes via Vercel Cron
 *
 * Sends reminder emails to users who signed up but haven't logged in:
 * - 3 hours after signup (if no login)
 * - 24 hours after signup (if no login)
 * - 72 hours after signup (if no login)
 * - 7 days after signup (if no login)
 *
 * Goal: Kill refunds by getting users to engage immediately
 */

const BASE_URL = process.env.SITE_URL || "https://learn.accredipro.academy";

// Email templates for each recovery stage
const recoveryEmails = {
  "3h": {
    subject: "Your account is ready - quick question",
    getBody: (firstName: string) => `
      <p>Hi ${firstName},</p>
      <p>I noticed you just signed up but haven't logged in yet. Just wanted to make sure everything is working okay on your end!</p>
      <p>If you're having any trouble accessing your account, just reply to this email and I'll help you personally.</p>
      <p>Here's your login link:</p>
      <p><a href="${BASE_URL}/login">${BASE_URL}/login</a></p>
      <p>Looking forward to seeing you inside!</p>
      <p>Sarah<br/>Student Success Team</p>
    `,
  },
  "24h": {
    subject: "Still waiting for you inside",
    getBody: (firstName: string) => `
      <p>Hey ${firstName},</p>
      <p>It's been a day since you signed up, and I haven't seen you log in yet. I know life gets busy!</p>
      <p>But I wanted to remind you that the sooner you start, the sooner you'll see results. Even 10 minutes today can make a difference.</p>
      <p>Your account is all set up and waiting:</p>
      <p><a href="${BASE_URL}/login">Click here to log in now</a></p>
      <p>Is there anything holding you back? Just reply to this email - I read every message.</p>
      <p>Sarah</p>
    `,
  },
  "72h": {
    subject: "Did something go wrong?",
    getBody: (firstName: string) => `
      <p>${firstName},</p>
      <p>It's been 3 days and I'm getting a little worried. You signed up but haven't logged in yet.</p>
      <p>I'm reaching out personally because I want to make sure nothing went wrong:</p>
      <p>- Having trouble with your password? I can reset it for you<br/>
      - Not sure where to start? I'll send you a quick-start guide<br/>
      - Changed your mind? Let me know what's going on</p>
      <p>Your login: <a href="${BASE_URL}/login">${BASE_URL}/login</a></p>
      <p>Please just reply to this email and let me know how I can help.</p>
      <p>Sarah<br/>Student Success</p>
    `,
  },
  "7d": {
    subject: "Last check-in from me",
    getBody: (firstName: string) => `
      <p>Hi ${firstName},</p>
      <p>This is my last email about your account access. It's been a week since you signed up, and I haven't seen any activity.</p>
      <p>I'm not sure what happened, but I wanted you to know:</p>
      <p>1. Your account is still active and waiting for you<br/>
      2. All your course materials are ready to access<br/>
      3. I'm here if you need any help at all</p>
      <p><a href="${BASE_URL}/login">Log in here when you're ready</a></p>
      <p>If you've decided this isn't for you, I understand. But if there's ANYTHING I can do to help you get started, please let me know.</p>
      <p>Wishing you the best,<br/>Sarah</p>
    `,
  },
};

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-LOGIN-RECOVERY] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-LOGIN-RECOVERY] Starting login recovery check...");

    const now = new Date();
    const results = {
      checked: 0,
      sent3h: 0,
      sent24h: 0,
      sent72h: 0,
      sent7d: 0,
      errors: 0,
    };

    // Time thresholds
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find users who:
    // - Have never logged in (firstLoginAt is null)
    // - Created within the last 7 days
    // - Are not fake profiles
    // - Have an email address
    // - Are STUDENT type (paid users, not leads)
    const usersToCheck = await prisma.user.findMany({
      where: {
        firstLoginAt: null, // Never logged in
        createdAt: { gte: sevenDaysAgo }, // Created within last 7 days
        isFakeProfile: false,
        email: { not: null },
        userType: "STUDENT", // Only paid users, not leads
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        createdAt: true,
        loginRecovery3hSentAt: true,
        loginRecovery24hSentAt: true,
        loginRecovery72hSentAt: true,
        loginRecovery7dSentAt: true,
      },
    });

    console.log(`[CRON-LOGIN-RECOVERY] Found ${usersToCheck.length} users who haven't logged in`);
    results.checked = usersToCheck.length;

    for (const user of usersToCheck) {
      if (!user.email) continue;

      const firstName = user.firstName || "there";
      const createdAt = new Date(user.createdAt);

      try {
        // Check 7-day email (highest priority - check first)
        if (
          createdAt <= sevenDaysAgo &&
          !user.loginRecovery7dSentAt
        ) {
          await sendRecoveryEmail(user.id, user.email, firstName, "7d");
          results.sent7d++;
          continue; // Only send one email per user per run
        }

        // Check 72-hour email
        if (
          createdAt <= seventyTwoHoursAgo &&
          !user.loginRecovery72hSentAt
        ) {
          await sendRecoveryEmail(user.id, user.email, firstName, "72h");
          results.sent72h++;
          continue;
        }

        // Check 24-hour email
        if (
          createdAt <= twentyFourHoursAgo &&
          !user.loginRecovery24hSentAt
        ) {
          await sendRecoveryEmail(user.id, user.email, firstName, "24h");
          results.sent24h++;
          continue;
        }

        // Check 3-hour email
        if (
          createdAt <= threeHoursAgo &&
          !user.loginRecovery3hSentAt
        ) {
          await sendRecoveryEmail(user.id, user.email, firstName, "3h");
          results.sent3h++;
          continue;
        }
      } catch (error) {
        console.error(`[CRON-LOGIN-RECOVERY] Error processing user ${user.id}:`, error);
        results.errors++;
      }
    }

    const totalSent = results.sent3h + results.sent24h + results.sent72h + results.sent7d;
    console.log(
      `[CRON-LOGIN-RECOVERY] Completed. Sent: ${totalSent} (3h: ${results.sent3h}, 24h: ${results.sent24h}, 72h: ${results.sent72h}, 7d: ${results.sent7d}), Errors: ${results.errors}`
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${results.checked} users, sent ${totalSent} recovery emails`,
      results,
    });
  } catch (error) {
    console.error("[CRON-LOGIN-RECOVERY] Fatal error:", error);
    return NextResponse.json(
      { error: "Failed to process login recovery", details: String(error) },
      { status: 500 }
    );
  }
}

async function sendRecoveryEmail(
  userId: string,
  email: string,
  firstName: string,
  stage: "3h" | "24h" | "72h" | "7d"
) {
  const emailConfig = recoveryEmails[stage];

  console.log(`[CRON-LOGIN-RECOVERY] Sending ${stage} recovery email to ${email}`);

  // Send the email
  await sendEmail({
    to: email,
    subject: emailConfig.subject,
    html: personalEmailWrapper(emailConfig.getBody(firstName)),
    type: "transactional", // Changed from marketing to transactional
  });

  // Update the user record to mark this email as sent
  const updateField = {
    "3h": "loginRecovery3hSentAt",
    "24h": "loginRecovery24hSentAt",
    "72h": "loginRecovery72hSentAt",
    "7d": "loginRecovery7dSentAt",
  }[stage];

  await prisma.user.update({
    where: { id: userId },
    data: {
      [updateField]: new Date(),
    },
  });

  console.log(`[CRON-LOGIN-RECOVERY] Marked ${updateField} for user ${userId}`);
}

// Also allow POST for manual triggers from admin
export async function POST(request: NextRequest) {
  return GET(request);
}
