import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { triggerAutoMessage } from "@/lib/auto-messages";
import { sendMiniDiplomaCompleteEvent } from "@/lib/meta-capi";
import { sendMilestoneToGHL } from "@/lib/ghl-webhook";

const categoryLabels: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "fm-healthcare": "Functional Medicine",
    "gut-health": "Gut Health",
    "womens-health": "Women's Health & Hormones",
    "hormone-health": "Hormone Health",
    "holistic-nutrition": "Holistic Nutrition",
    "nurse-coach": "Nurse Life Coach",
    "health-coach": "Health Coach",
    "autism": "Autism & Neurodevelopment",
    "hormones": "Women's Hormones",
};

/**
 * POST /api/mini-diploma/complete
 * 
 * Called when user finishes their mini diploma.
 * - Sets completion timestamp
 * - Starts 3-day graduate offer countdown  
 * - Sends congratulations VOICE DM from Sarah (using OpenAI TTS)
 * - Sends congratulations EMAIL
 * - Creates notification
 * - Awards badge
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                email: true,
                miniDiplomaCategory: true,
                miniDiplomaCompletedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Already completed? Just return success
        if (user.miniDiplomaCompletedAt) {
            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                completedAt: user.miniDiplomaCompletedAt,
            });
        }

        const now = new Date();
        const graduateDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

        // Update user with completion data
        await prisma.user.update({
            where: { id: userId },
            data: {
                miniDiplomaCompletedAt: now,
                graduateOfferDeadline: graduateDeadline,
                hasCertificateBadge: true,
            },
        });

        // === TAG TRACKING ===
        const categorySlug = user.miniDiplomaCategory || "unknown";
        const tagsToCreate = [
            `mini_diploma_completed`,
            `mini_diploma_${categorySlug}_completed`,
            `graduate_${categorySlug}`,
        ];

        for (const tag of tagsToCreate) {
            await prisma.userTag.upsert({
                where: { userId_tag: { userId, tag } },
                update: {},
                create: { userId, tag },
            });
        }
        console.log(`🏷️ Created tags for ${user.email}: ${tagsToCreate.join(", ")}`);

        // === SEND TO GHL FOR SMS AUTOMATION ===
        await sendMilestoneToGHL(user.email, "mini_diploma_graduate", {
            first_name: user.firstName || "",
            category: categorySlug,
        });
        console.log(`📱 GHL milestone sent: ${user.email} - mini_diploma_graduate`);

        // Find Sarah coach for functional medicine
        const sarahCoach = await prisma.user.findFirst({
            where: {
                email: { contains: "sarah", mode: "insensitive" },
                role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
            },
        });

        const categoryName = categoryLabels[user.miniDiplomaCategory || ""] || user.miniDiplomaCategory;
        const userName = user.firstName || "there";

        // === SCHEDULE VOICE MESSAGE FROM SARAH (with 3-5 min delay) ===
        if (sarahCoach) {
            // Text with natural pauses using punctuation (... for longer pauses, , for short ones)
            const voiceMessageText = `Hey ${userName}... It's Sarah here!

I just saw that you completed your ${categoryName} Mini Diploma... and I had to send you a quick message!

I am SO incredibly proud of you. Seriously... this is such a huge first step.

You now understand the foundations... that most people never learn. That's AMAZING.

If you ever want to take it further... and become fully certified, where you can actually start working with clients... and building your own practice... I'm here to guide you every step of the way.

Just reply to this message... and we can chat about what path makes the most sense for you.

You've got this!`;

            const textContent = `🎙️ Hey ${userName}! 

It's Sarah here! I just saw that you completed your ${categoryName} Mini Diploma and I had to send you a quick message!

🎉 I am SO incredibly proud of you! Seriously, this is such a huge first step.

You now understand the foundations that most people never learn. That's AMAZING.

If you ever want to take it further and become fully certified – where you can actually start working with clients and building your own practice – I'm here to guide you every step of the way.

Just reply to this message and we can chat about what path makes the most sense for you.

You've got this! 💛

– Sarah`;

            // Random delay between 3-5 minutes
            const delayMinutes = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 minutes
            const scheduledFor = new Date(now.getTime() + delayMinutes * 60 * 1000);

            await prisma.scheduledVoiceMessage.create({
                data: {
                    senderId: sarahCoach.id,
                    receiverId: userId,
                    voiceText: voiceMessageText,
                    textContent,
                    scheduledFor,
                    status: "PENDING",
                },
            });

            console.log(`⏰ Scheduled Sarah's voice message for ${user.email} in ${delayMinutes} minutes (${scheduledFor.toISOString()})`);
        }

        // === NOTIFICATIONS ===
        await prisma.notification.create({
            data: {
                userId,
                type: "SYSTEM",
                title: "🎓 Mini Diploma Complete!",
                message: `Congratulations! You've earned your ${categoryName} Mini Diploma! Check messages for a special gift from Coach Sarah.`,
            },
        });

        await prisma.notification.create({
            data: {
                userId,
                type: "SYSTEM",
                title: "🏅 Badge Unlocked!",
                message: `You've earned the "${categoryName} Graduate" badge! It's now visible on your profile.`,
            },
        });
        console.log(`🔔 Created notifications for ${user.email}`);

        // === SEND CONGRATULATIONS EMAIL ===
        try {
            // Map category to diploma slug for the correct completion URL
            const diplomaSlugs: Record<string, string> = {
                "functional-medicine": "functional-medicine-diploma",
                "fm-healthcare": "functional-medicine-diploma",
                "gut-health": "gut-health-diploma",
                "womens-health": "womens-health-diploma",
                "hormone-health": "hormone-health-diploma",
                "holistic-nutrition": "holistic-nutrition-diploma",
                "nurse-coach": "nurse-coach-diploma",
                "health-coach": "health-coach-diploma",
            };
            const diplomaSlug = diplomaSlugs[user.miniDiplomaCategory || "functional-medicine"] || "functional-medicine-diploma";
            const completionUrl = `https://learn.accredipro.academy/${diplomaSlug}/complete`;

            console.log(`📧 Attempting to send email to ${user.email}...`);

            const emailResult = await sendEmail({
                to: user.email,
                subject: `${userName}, you did it! Your ${categoryName} Mini Diploma Certificate is ready`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">You Did It, ${userName}!</h1>
                                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your ${categoryName} Mini Diploma is complete</p>
                            </div>

                            <div style="padding: 40px 30px;">
                                <p style="font-size: 16px; color: #555;">Hey ${userName},</p>

                                <p style="color: #555; font-size: 16px;">I'm SO proud of you! You've completed all 9 lessons of your <strong style="color: #722F37;">${categoryName} Mini Diploma</strong>!</p>

                                <p style="color: #555; font-size: 16px;">Your ASI-verified Foundation Certificate is ready to download. This is your first official credential in ${categoryName}!</p>

                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${completionUrl}" style="background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #722F37; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Download Your Certificate</a>
                                </div>

                                <p style="color: #555; font-size: 16px;">I've also sent you a personal voice message in the portal - check your messages when you log in!</p>

                                <p style="color: #555; font-size: 16px; margin-top: 25px;">
                                    Talk soon,<br/>
                                    <strong>Sarah</strong>
                                </p>
                            </div>

                            <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                                <p style="margin: 0; color: #999; font-size: 12px;">ASI Standards Institute | AccrediPro Academy</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });

            // Log email result
            console.log(`📧 Email attempt for ${user.email}:`, emailResult);

            if (emailResult?.success) {
                console.log(`✅ Completion email sent successfully to ${user.email}`);
            } else {
                console.error(`❌ Email failed for ${user.email}:`, emailResult?.error);
            }
        } catch (emailError) {
            console.error("❌ Failed to send completion email:", emailError);
        }

        console.log(`🎉 Mini diploma completed for ${user.email}`);

        // === SERVER-SIDE META TRACKING ===
        // Send CompleteMiniDiploma event to Meta CAPI
        sendMiniDiplomaCompleteEvent({
            email: user.email,
            firstName: user.firstName || undefined,
            contentName: `Mini Diploma - ${categoryName}`,
        }).catch((err) => {
            console.error(`[META] Failed to send CompleteMiniDiploma event:`, err);
        });

        // Also trigger the auto-message system for backup DM with pre-recorded voice
        triggerAutoMessage({
            userId: user.id,
            trigger: "mini_diploma_complete",
        }).catch(console.error);

        return NextResponse.json({
            success: true,
            completedAt: now,
            graduateOfferDeadline: graduateDeadline,
            message: "Mini diploma completed! Congratulations!",
        });

    } catch (error) {
        console.error("Mini diploma completion error:", error);
        return NextResponse.json(
            { error: "Failed to process completion" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/mini-diploma/complete
 * Check completion status and graduate offer info
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                miniDiplomaCategory: true,
                miniDiplomaCompletedAt: true,
                graduateOfferDeadline: true,
                hasCertificateBadge: true,
            },
        });

        if (!user?.miniDiplomaCategory) {
            return NextResponse.json({ error: "No mini diploma found" }, { status: 404 });
        }

        const now = new Date();
        const offerExpired = user.graduateOfferDeadline
            ? now > user.graduateOfferDeadline
            : true;

        return NextResponse.json({
            category: user.miniDiplomaCategory,
            isCompleted: !!user.miniDiplomaCompletedAt,
            completedAt: user.miniDiplomaCompletedAt,
            graduateOfferDeadline: user.graduateOfferDeadline,
            offerExpired,
            hasBadge: user.hasCertificateBadge,
        });

    } catch (error) {
        console.error("Error getting completion status:", error);
        return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
    }
}
