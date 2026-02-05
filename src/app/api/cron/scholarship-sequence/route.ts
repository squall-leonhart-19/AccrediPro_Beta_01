import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailWrapper } from "@/lib/email";

/**
 * 24-Hour Scholarship Expiration Sequence
 * 
 * 7-Touch Follow-up Sequence:
 * 0h (Immediate)  - Email: "Your scholarship application is being reviewed..."
 * 15min           - SMS: "Sarah here! I just approved your scholarship 💜"
 * 6h              - Email: "Your scholarship is confirmed - just one step left..."
 * 12h             - SMS: "12 hours left on your scholarship!"
 * 20h             - Email: "⏰ Only 4 hours left..."
 * 23h             - SMS: "FINAL HOUR. Link expires soon!"
 * 24h (Expired)   - Email: "Your scholarship has expired 😔"
 * 
 * This cron runs every 5 minutes to check for pending follow-ups.
 */

// Sequence step definitions
interface SequenceStep {
  step: number;
  triggerAfterMinutes: number;
  channel: "email" | "sms";
  subject?: string;
  getMessage: (name: string, paymentLink: string, hoursLeft: number) => string;
}

const SEQUENCE_STEPS: SequenceStep[] = [
  {
    step: 0,
    triggerAfterMinutes: 0,
    channel: "email",
    subject: "Your scholarship application is being reviewed 📋",
    getMessage: (name) => `
      <h2 style="color: #722F37; margin-bottom: 20px;">Hi ${name}! 👋</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        I just received your scholarship application for the Functional Medicine Certification.
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        I'm reviewing your information now and will get back to you shortly with your scholarship amount.
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        In the meantime, feel free to reply to this email if you have any questions!
      </p>
      <p style="color: #722F37; font-weight: bold; margin-top: 30px;">— Sarah Mitchell<br/>Clinical Director, AccrediPro Academy</p>
    `,
  },
  {
    step: 1,
    triggerAfterMinutes: 15,
    channel: "sms",
    getMessage: (name) =>
      `Sarah here from AccrediPro! 💜 Great news - I just approved your scholarship! Check your email for the details. Can't wait to have you in the program!`,
  },
  {
    step: 2,
    triggerAfterMinutes: 360, // 6 hours
    channel: "email",
    subject: "Your scholarship is confirmed ✅",
    getMessage: (name, paymentLink) => `
      <h2 style="color: #722F37; margin-bottom: 20px;">Great news, ${name}! 🎉</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        Your scholarship has been <strong>approved</strong>! You're one step away from starting your Functional Medicine journey.
      </p>
      <div style="background: #f0f9f0; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #22c55e;">
        <p style="margin: 0; font-size: 16px; color: #15803d;">
          ✅ Full FM Certification access<br/>
          ✅ 9 Clinical Certifications included<br/>
          ✅ Lifetime access + mentorship<br/>
          ✅ Your scholarship rate is locked in
        </p>
      </div>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        <strong>⏰ Important:</strong> Your scholarship is only valid for 24 hours. After that, I'll need to offer your spot to another applicant.
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${paymentLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Lock In My Scholarship →</a>
      </p>
      <p style="color: #999; font-size: 13px;">— Sarah</p>
    `,
  },
  {
    step: 3,
    triggerAfterMinutes: 720, // 12 hours
    channel: "sms",
    getMessage: (name, paymentLink, hoursLeft) =>
      `Hey ${name}! Just a friendly reminder - you have ${hoursLeft} hours left on your scholarship. Don't miss out! 💜 ${paymentLink}`,
  },
  {
    step: 4,
    triggerAfterMinutes: 1200, // 20 hours
    channel: "email",
    subject: "⏰ Only 4 hours left on your scholarship",
    getMessage: (name, paymentLink) => `
      <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${name},</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        I wanted to give you a heads up...
      </p>
      <div style="background: #fff7ed; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f97316;">
        <p style="margin: 0; font-size: 18px; color: #c2410c; font-weight: bold;">
          ⏰ Your scholarship expires in 4 hours
        </p>
      </div>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        After that, I'll have to release your spot to the next person on our waitlist. I really don't want you to miss this opportunity!
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        If budget is a concern, just reply and let me know. I might be able to work something out.
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${paymentLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Claim My Scholarship →</a>
      </p>
      <p style="color: #999; font-size: 13px;">— Sarah</p>
    `,
  },
  {
    step: 5,
    triggerAfterMinutes: 1380, // 23 hours
    channel: "sms",
    getMessage: (name, paymentLink) =>
      `${name} - FINAL HOUR! ⏰ Your scholarship expires in 60 minutes. This is genuinely the last chance: ${paymentLink} 💜 Sarah`,
  },
  {
    step: 6,
    triggerAfterMinutes: 1440, // 24 hours - expired
    channel: "email",
    subject: "Your scholarship has expired 😔",
    getMessage: (name) => `
      <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${name},</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        I'm sorry to say that your scholarship has expired.
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        The 24-hour window has passed, and we've had to release your spot to another applicant.
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        I understand that life gets busy and the timing might not have been right. If you're still interested in pursuing your Functional Medicine Certification, you're welcome to reapply for a new scholarship.
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #333;">
        Just reply to this email and I'll see what I can do. 💜
      </p>
      <p style="color: #722F37; font-weight: bold; margin-top: 30px;">— Sarah Mitchell<br/>Clinical Director</p>
    `,
  },
];

// Check if we should skip SMS (SMS service not configured)
const sendSMS = async (phone: string, message: string) => {
  // TODO: Integrate with Twilio or SMS service
  console.log(`[SCHOLARSHIP-SMS] Would send to ${phone}: ${message}`);
  // For now, we'll log but not actually send
  // When SMS is configured, uncomment:
  // await twilioClient.messages.create({ to: phone, from: process.env.TWILIO_PHONE, body: message });
};

export async function GET() {
  try {
    const now = new Date();
    const results: { sent: number; checked: number; errors: string[] } = {
      sent: 0,
      checked: 0,
      errors: [],
    };

    // Get all chat optins with scholarship info that haven't completed the sequence
    // We'll use the ChatOptin model and filter by page containing "scholarship"
    const scholarshipOptins = await prisma.chatOptin.findMany({
      where: {
        page: { contains: "scholarship", mode: "insensitive" },
        emailsSent: { lt: 7 }, // Max 7 steps (0-6)
      },
    });

    for (const optin of scholarshipOptins) {
      results.checked++;

      try {
        // Calculate minutes since optin
        const minutesSinceOptin = Math.floor(
          (now.getTime() - optin.createdAt.getTime()) / (1000 * 60)
        );

        // Find the next step that should be triggered
        const currentStep = optin.emailsSent;
        const nextStep = SEQUENCE_STEPS.find(s => s.step === currentStep);

        if (!nextStep) continue;

        // Check if it's time to send this step
        if (minutesSinceOptin < nextStep.triggerAfterMinutes) continue;

        // Check for rate limiting (don't send if last email was < 5 min ago)
        if (optin.lastEmailSentAt) {
          const minutesSinceLastEmail = Math.floor(
            (now.getTime() - optin.lastEmailSentAt.getTime()) / (1000 * 60)
          );
          if (minutesSinceLastEmail < 5) continue;
        }

        // Link back to chat to finalize with Sarah
        // Dynamic based on their original results page
        const resultsPage = optin.page || "healthcare";
        const paymentLink = `https://learn.accredipro.academy/quiz/depth-method/results/${resultsPage}?resumeChat=true`;

        // Calculate hours left
        const hoursLeft = Math.max(0, Math.floor((1440 - minutesSinceOptin) / 60));

        const name = optin.name || "there";
        const messageContent = nextStep.getMessage(name, paymentLink, hoursLeft);

        if (nextStep.channel === "email" && optin.email) {
          // Check suppression
          const suppressed = await prisma.user.findFirst({
            where: {
              email: optin.email.toLowerCase(),
              marketingTags: {
                some: {
                  tag: {
                    slug: {
                      in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"],
                    },
                  },
                },
              },
            },
            select: { id: true },
          });

          if (!suppressed) {
            await sendEmail({
              to: optin.email,
              subject: nextStep.subject || "AccrediPro Scholarship Update",
              html: emailWrapper(messageContent, nextStep.subject || "Scholarship Update"),
              replyTo: "sarah@accredipro-certificate.com",
            });
            console.log(`[SCHOLARSHIP-SEQ] ✅ Step ${nextStep.step} EMAIL sent to ${optin.email}`);
            results.sent++;
          }
        } else if (nextStep.channel === "sms") {
          // SMS - log for now
          // In production: await sendSMS(optin.phone, messageContent);
          console.log(`[SCHOLARSHIP-SEQ] 📱 Step ${nextStep.step} SMS would be sent: ${messageContent.substring(0, 50)}...`);
          results.sent++;
        }

        // Update the optin record
        await prisma.chatOptin.update({
          where: { id: optin.id },
          data: {
            emailsSent: currentStep + 1,
            lastEmailSentAt: now,
          },
        });

      } catch (stepError) {
        const errorMsg = `Error processing ${optin.email}: ${stepError}`;
        console.error(`[SCHOLARSHIP-SEQ] ❌ ${errorMsg}`);
        results.errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });

  } catch (error) {
    console.error("[SCHOLARSHIP-SEQ] Failed:", error);
    return NextResponse.json(
      { error: "Scholarship sequence check failed", details: String(error) },
      { status: 500 }
    );
  }
}
