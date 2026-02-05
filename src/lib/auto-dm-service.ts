/**
 * Automated DM Service
 * Sends Sarah intro immediately, coach follow-up after 5 minutes
 * Now with PERSONALIZATION based on qualification tags!
 */

import prisma from "@/lib/prisma";
import { getNicheByTag, getNicheBySlug, COACH_INFO, NicheConfig, getNicheConfig } from "@/config/niches";
import { getSarahIntroDM, getCoachFollowupDM, getPersonalizedCoachFollowup } from "@/lib/dm-templates";

const COACH_FOLLOWUP_DELAY_MS = 5 * 60 * 1000; // 5 minutes

interface SendPurchaseDMsOptions {
    userId: string;
    firstName: string;
    nicheCode?: string;
    purchaseTag?: string;
    courseSlug?: string;
}

// Qualification data from tags
export interface QualificationData {
    motivation: string | null;      // time-with-family, help-others, financial-freedom, career-change, personal-growth
    timeCommitment: string | null;  // few-hours-flexible, part-time-10-20, full-time-30-plus
    incomeGoal: string | null;      // side-income-500-1k, replace-income-3-5k, build-business-10k-plus
}

/**
 * Extract qualification data from user tags
 */
export async function getUserQualificationData(userId: string): Promise<QualificationData> {
    const tags = await prisma.userTag.findMany({
        where: {
            userId,
            OR: [
                { tag: { startsWith: "motivation:" } },
                { tag: { startsWith: "time_commitment:" } },
                { tag: { startsWith: "income_goal:" } },
            ]
        },
        select: { tag: true }
    });

    const tagSet = tags.map(t => t.tag);

    return {
        motivation: tagSet.find(t => t.startsWith("motivation:"))?.replace("motivation:", "") || null,
        timeCommitment: tagSet.find(t => t.startsWith("time_commitment:"))?.replace("time_commitment:", "") || null,
        incomeGoal: tagSet.find(t => t.startsWith("income_goal:"))?.replace("income_goal:", "") || null,
    };
}

/**
 * Send automated DMs on purchase
 * - Sarah intro: immediately
 * - Coach follow-up: after 5 minutes
 */
export async function sendPurchaseDMs(options: SendPurchaseDMsOptions): Promise<boolean> {
    const { userId, firstName, nicheCode, purchaseTag, courseSlug } = options;

    // Determine niche from available info
    let niche: NicheConfig | null = null;
    if (nicheCode) {
        niche = getNicheConfig(nicheCode);
    } else if (purchaseTag) {
        niche = getNicheByTag(purchaseTag);
    } else if (courseSlug) {
        niche = getNicheBySlug(courseSlug);
    }

    if (!niche) {
        console.log(`[AUTO-DM] Could not determine niche for user ${userId}, courseSlug: ${courseSlug}`);
        return false;
    }

    console.log(`[AUTO-DM] Starting DM flow for ${firstName} (niche: ${niche.code})`);

    try {
        // Get coach user ID from database (find Sarah or the assigned coach)
        const coachInfo = COACH_INFO[niche.coach];

        // Find coach for MAIN COURSE purchases - use sarah@accredipro-certificate.com
        // Mini diploma uses sarah@ (handled in auto-messages.ts for wh_* triggers)
        const coachUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: "sarah@accredipro-certificate.com" }, // Main course Sarah
                    { email: coachInfo.email },
                    { role: "ADMIN" }, // Fallback to any admin
                ],
            },
            select: { id: true, email: true },
        });

        if (!coachUser) {
            console.log(`[AUTO-DM] No coach/admin found in database`);
            return false;
        }

        console.log(`[AUTO-DM] Using coach: ${coachUser.email} for main course purchase DMs`);

        // Step 1: Send Sarah intro immediately
        const sarahMessage = getSarahIntroDM(niche, firstName);
        await sendDirectMessage(coachUser.id, userId, sarahMessage, "sarah_intro");
        console.log(`[AUTO-DM] ✅ Sent Sarah intro to ${firstName}`);

        // Step 2: Schedule PERSONALIZED coach follow-up after 5 minutes
        const nicheForClosure = niche; // Capture for closure
        const userIdForClosure = userId;
        setTimeout(async () => {
            try {
                // Fetch qualification data for personalization
                const qualData = await getUserQualificationData(userIdForClosure);
                console.log(`[AUTO-DM] Qualification data for ${firstName}:`, qualData);

                // Use personalized template if we have qualification data
                const coachMessage = qualData.motivation || qualData.incomeGoal
                    ? getPersonalizedCoachFollowup(nicheForClosure, firstName, qualData)
                    : getCoachFollowupDM(nicheForClosure, firstName);

                await sendDirectMessage(coachUser.id, userIdForClosure, coachMessage, "coach_followup_personalized");
                console.log(`[AUTO-DM] ✅ Sent PERSONALIZED coach follow-up to ${firstName} after 5 min`);
            } catch (error) {
                console.error(`[AUTO-DM] Failed to send coach follow-up:`, error);
            }
        }, COACH_FOLLOWUP_DELAY_MS);

        console.log(`[AUTO-DM] Coach follow-up scheduled for ${firstName} in 5 minutes`);
        return true;

    } catch (error) {
        console.error(`[AUTO-DM] Failed to send purchase DMs:`, error);
        return false;
    }
}

/**
 * Send a DM using the Message model
 */
async function sendDirectMessage(
    senderId: string,
    receiverId: string,
    content: string,
    templateKey: string
): Promise<void> {
    await prisma.message.create({
        data: {
            senderId,
            receiverId,
            content,
            messageType: "DIRECT",
            isRead: false,
            // Store template info in the content (we can add a metadata field later)
        },
    });

    console.log(`[AUTO-DM] Message created: ${templateKey} from ${senderId} to ${receiverId}`);
}

/**
 * Check if user has already received welcome DMs
 */
export async function hasReceivedWelcomeDMs(userId: string): Promise<boolean> {
    const welcomeMessage = await prisma.message.findFirst({
        where: {
            receiverId: userId,
            content: {
                contains: "Welcome to the",
            },
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
        },
    });

    return !!welcomeMessage;
}

/**
 * Trigger DM flow for a specific user (can be called manually)
 */
export async function triggerWelcomeDMs(userId: string): Promise<boolean> {
    // Get user info - use select to avoid P2022 errors
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            enrollments: {
                include: { course: true },
                orderBy: { enrolledAt: "desc" },
                take: 1,
            },
        },
    });

    if (!user) {
        console.log(`[AUTO-DM] User ${userId} not found`);
        return false;
    }

    // Check if already received welcome
    if (await hasReceivedWelcomeDMs(userId)) {
        console.log(`[AUTO-DM] User ${userId} already received welcome DMs`);
        return false;
    }

    // Find niche from latest enrollment
    const courseSlug = user.enrollments[0]?.course?.slug;

    if (!courseSlug) {
        console.log(`[AUTO-DM] No course found for user ${userId}`);
        return false;
    }

    return sendPurchaseDMs({
        userId,
        firstName: user.firstName || "there",
        courseSlug,
    });
}
