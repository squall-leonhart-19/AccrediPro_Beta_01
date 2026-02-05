/**
 * Scholarship Email System
 * 
 * All plain text emails for maximum inbox delivery.
 * Sent via Resend from Sarah's personal sender.
 * 
 * Email triggers:
 * 1. Quiz submit (immediate)
 * 2. Amount detected (immediate) 
 * 3. Cart abandoned 1hr (cron)
 * 4. Final warning 23hr (cron)
 * 5. Purchase confirmed (immediate)
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sarah's personal sender for inbox placement
const FROM_EMAIL = "Sarah M. <sarah@accredipro.academy>";

export interface ScholarshipEmailData {
    to: string;
    firstName: string;
    amount?: number;
    finalAmount?: number;
    couponCode?: string;
    savings?: number;
}

/**
 * Email #1: Quiz Submit - Scholarship Qualification
 * Sent immediately when user completes scholarship quiz
 * PLAIN TEXT ONLY - no HTML
 */
export async function sendScholarshipQualificationEmail(data: ScholarshipEmailData) {
    const { to, firstName } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${firstName}, your scholarship is ready`,
            text: `Hey ${firstName},

Just saw your quiz responses. You qualify!

Here's how it works:
→ You tell me what you can invest
→ The Institute covers THE REST
→ You get FULL FM Certification (9 specializations)
→ ONE-TIME payment, not monthly

There's no "right" amount. Whatever works for you.

I'm waiting in the chat right now. Go back to your results page and let's talk about your personalized rate.

— Sarah M.
Scholarship Director
Accredipro Specialists Institute

P.S. I'm online for the next few hours — don't miss this!`,
        });

        console.log(`[Scholarship Email] Sent qualification email to ${to}`);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("[Scholarship Email] Qualification email failed:", error);
        return { success: false, error };
    }
}

/**
 * Email #2: Amount Detected - Scholarship Approved
 * Sent immediately when user types an amount in chat
 * Contains: their amount, coupon code, checkout link
 */
export async function sendScholarshipApprovedEmail(data: ScholarshipEmailData) {
    const { to, firstName, amount, finalAmount, couponCode, savings } = data;

    if (!amount || !finalAmount || !couponCode) {
        console.error("[Scholarship Email] Missing required fields for approved email");
        return { success: false, error: "Missing required fields" };
    }

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `APPROVED: Your $${finalAmount} scholarship`,
            text: `Hey ${firstName},

GREAT NEWS — I just got approval from the Institute!

Your scholarship details:
→ You offered: $${amount}
→ Institute covered: $${amount - finalAmount}
→ YOUR PRICE: $${finalAmount}
→ You save: $${savings}!

Apply this code at checkout:
${couponCode}

Complete your enrollment here:
https://sarah.accredipro.academy/checkout-fm-certification-program

This scholarship expires in 24 hours.

Don't wait — grab your spot!

— Sarah

P.S. This is a ONE-TIME payment. No monthly fees. Lifetime access.`,
        });

        console.log(`[Scholarship Email] Sent approval email to ${to} - $${finalAmount}`);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("[Scholarship Email] Approval email failed:", error);
        return { success: false, error };
    }
}

/**
 * Email #3: Cart Abandoned (1 hour)
 * Sent by cron 1 hour after approval, if no purchase
 */
export async function sendScholarshipReminder1hrEmail(data: ScholarshipEmailData) {
    const { to, firstName, finalAmount, couponCode } = data;

    if (!finalAmount || !couponCode) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${firstName}, I held your spot`,
            text: `Hey ${firstName},

Just checking in — I noticed you haven't completed your enrollment yet.

No pressure, but I wanted to let you know I'm still holding your $${finalAmount} scholarship rate.

Your code: ${couponCode}

Here's the link again:
https://sarah.accredipro.academy/checkout-fm-certification-program

Is there anything holding you back? Just reply to this email and I'll help.

— Sarah`,
        });

        console.log(`[Scholarship Email] Sent 1hr reminder to ${to}`);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("[Scholarship Email] 1hr reminder failed:", error);
        return { success: false, error };
    }
}

/**
 * Email #4: Final Warning (23 hours)
 * Last chance before scholarship expires
 */
export async function sendScholarshipFinalWarningEmail(data: ScholarshipEmailData) {
    const { to, firstName, finalAmount, couponCode } = data;

    if (!finalAmount || !couponCode) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Last call, ${firstName} — scholarship expires in 1 hour`,
            text: `${firstName},

This is my last email about your scholarship.

Your $${finalAmount} rate expires in 1 hour.

After that, the price goes back to full.

I really don't want you to miss this opportunity. 

If you're ready:
Code: ${couponCode}
Link: https://sarah.accredipro.academy/checkout-fm-certification-program

If timing isn't right, I totally understand. Just know this specific rate won't be available again.

Wishing you the best either way.

— Sarah`,
        });

        console.log(`[Scholarship Email] Sent final warning to ${to}`);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("[Scholarship Email] Final warning failed:", error);
        return { success: false, error };
    }
}

/**
 * Email #5: Purchase Confirmed
 * Sent when user says "paid" / "done" in chat
 */
export async function sendScholarshipWelcomeEmail(data: ScholarshipEmailData) {
    const { to, firstName } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Welcome to the family, ${firstName}! 🎉`,
            text: `${firstName}!

I AM SO EXCITED FOR YOU! 

You just made a decision that's going to change your life.

Here's what happens next:

1. Check your email in the next 5 minutes — you'll get your login credentials
2. Log into your portal at learn.accredipro.academy
3. Start with Module 1 — it's already unlocked for you
4. Join our private community — links are inside your portal

I'll personally check in on you in 24 hours to see how you're doing.

Congratulations on investing in yourself. You're going to do amazing things.

So proud of you!

— Sarah 💜

P.S. If you have ANY questions, just reply to this email. I'm here for you.`,
        });

        console.log(`[Scholarship Email] Sent welcome email to ${to}`);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("[Scholarship Email] Welcome email failed:", error);
        return { success: false, error };
    }
}

/**
 * Update user tags when scholarship is approved
 * Called from auto-reply when amount is detected
 */
export async function saveScholarshipApproval(
    userId: string,
    amount: number,
    finalAmount: number,
    couponCode: string
) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const tags = [
        { tag: "scholarship_offered_amount", value: String(amount) },
        { tag: "scholarship_final_amount", value: String(finalAmount) },
        { tag: "scholarship_coupon_code", value: couponCode },
        { tag: "scholarship_approved_at", value: new Date().toISOString() },
        { tag: "scholarship_status", value: "approved" },
    ];

    for (const t of tags) {
        await prisma.userTag.upsert({
            where: { userId_tag: { userId, tag: t.tag } },
            update: { value: t.value },
            create: { userId, tag: t.tag, value: t.value },
        });
    }

    await prisma.$disconnect();
    console.log(`[Scholarship] Saved approval tags for user ${userId}`);
}
