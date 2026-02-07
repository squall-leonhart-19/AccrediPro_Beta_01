import prisma from "@/lib/prisma";
import { getPreCompletionMessage } from "@/data/masterclass-pre-completion";

/**
 * Create a Masterclass Pod for a user who just opted in.
 * This is the PRE-COMPLETION phase - user needs to complete lessons + exam.
 * 
 * Pod starts immediately with welcome messages from Sarah + zombie intro.
 */
export async function createMasterclassPod(
    userId: string,
    nicheCategory: string
): Promise<{ success: boolean; podId?: string; error?: string }> {
    try {
        // Check if pod already exists for this user
        const existingPod = await prisma.masterclassPod.findUnique({
            where: { userId },
        });

        if (existingPod) {
            console.log(`[MASTERCLASS] Pod already exists for user ${userId}`);
            return { success: true, podId: existingPod.id };
        }

        // Select a zombie profile for this pod
        const zombie = await prisma.zombieProfile.findFirst({
            where: {
                isActive: true,
                tier: 1, // Active chatter tier
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!zombie) {
            console.error(`[MASTERCLASS] No active zombie profiles found!`);
            return { success: false, error: "No zombie profiles available" };
        }

        // Get user's first name for personalization
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true },
        });
        const firstName = user?.firstName || "friend";

        const now = new Date();

        // Create the pod - starts in pre-completion phase
        const pod = await prisma.masterclassPod.create({
            data: {
                userId,
                zombieProfileId: zombie.id,
                nicheCategory,
                examScore: 0, // Will be set when exam is passed
                examPassedAt: now, // Required field - repurposed as optedInAt in pre-completion
                status: "pre_completion",
                masterclassDay: 0, // Pre-completion, no masterclass day yet
                startedAt: now,
            },
        });

        console.log(`[MASTERCLASS] Created pod ${pod.id} for user ${userId} with zombie ${zombie.name}`);

        // Add tracking tag
        await prisma.userTag.upsert({
            where: {
                userId_tag: {
                    userId,
                    tag: "masterclass-pod-created",
                },
            },
            update: {},
            create: {
                userId,
                tag: "masterclass-pod-created",
            },
        }).catch(() => { }); // Ignore tag errors

        // Schedule pre-completion welcome messages
        await schedulePreCompletionWelcome(pod.id, firstName, zombie.name, zombie.avatar);

        return { success: true, podId: pod.id };
    } catch (error) {
        console.error(`[MASTERCLASS] Failed to create pod for user ${userId}:`, error);
        return { success: false, error: String(error) };
    }
}

/**
 * Schedule welcome messages for a new pod (pre-completion phase)
 * - Sarah welcome: 2h ago (retroactive)
 * - Zombie intro: 1h ago (retroactive) 
 * - Zombie follow-up: 30min ago (retroactive)
 */
async function schedulePreCompletionWelcome(
    podId: string,
    firstName: string,
    zombieName: string,
    zombieAvatar: string | null
): Promise<void> {
    const pod = await prisma.masterclassPod.findUnique({
        where: { id: podId },
    });

    if (!pod) return;

    const now = new Date();
    const welcomeMsg = getPreCompletionMessage("optin");

    if (!welcomeMsg) {
        console.error(`[MASTERCLASS] No pre-completion welcome message found!`);
        return;
    }

    // Sarah's welcome message - 2 hours ago (retroactive)
    const sarahTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const sarahContent = welcomeMsg.sarah
        .replace(/{firstName}/g, firstName)
        .replace(/{cohortNumber}/g, "47");

    await prisma.masterclassMessage.create({
        data: {
            podId,
            dayNumber: 0,
            senderType: "sarah",
            senderName: "Sarah Mitchell",
            senderAvatar: "/coaches/sarah-coach.webp",
            content: sarahContent,
            scheduledFor: sarahTime,
            sentAt: sarahTime, // Already "sent" (retroactive)
        },
    });

    // Zombie messages - retroactive backstory + real-time welcome
    for (let i = 0; i < welcomeMsg.zombies.length; i++) {
        const zombieGroup = welcomeMsg.zombies[i];
        const randomIdx = Math.floor(Math.random() * zombieGroup.options.length);
        const zombieFirstName = zombieName.split(" ")[0];
        const content = zombieGroup.options[randomIdx]
            .replace(/{firstName}/g, firstName)
            .replace(/{zombieName}/g, zombieName)
            .replace(/{zombieFirstName}/g, zombieFirstName);

        // Parse delay: 
        // "retroactive-1h" -> 1 hour ago
        // "retroactive-30min" -> 30 min ago  
        // "now+2min" -> 2 minutes from now (real-time)
        let zombieTime: Date;
        let isRetroactive = false;

        if (zombieGroup.delay.startsWith("retroactive-")) {
            isRetroactive = true;
            const delayPart = zombieGroup.delay.replace("retroactive-", "");
            if (delayPart.endsWith("h")) {
                const hours = parseInt(delayPart.replace("h", ""));
                zombieTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
            } else if (delayPart.endsWith("min")) {
                const mins = parseInt(delayPart.replace("min", ""));
                zombieTime = new Date(now.getTime() - mins * 60 * 1000);
            } else {
                zombieTime = new Date(now.getTime() - (60 - i * 15) * 60 * 1000);
            }
        } else if (zombieGroup.delay.startsWith("now+")) {
            // Real-time message: "now+2min" -> send 2 minutes from now
            const delayPart = zombieGroup.delay.replace("now+", "");
            if (delayPart.endsWith("min")) {
                const mins = parseInt(delayPart.replace("min", ""));
                zombieTime = new Date(now.getTime() + mins * 60 * 1000);
            } else if (delayPart.endsWith("sec")) {
                const secs = parseInt(delayPart.replace("sec", ""));
                zombieTime = new Date(now.getTime() + secs * 1000);
            } else {
                zombieTime = new Date(now.getTime() + 2 * 60 * 1000); // default 2 min
            }
        } else {
            // Default: stagger retroactively (1h, 45min, 30min ago, etc.)
            isRetroactive = true;
            zombieTime = new Date(now.getTime() - (60 - i * 15) * 60 * 1000);
        }

        await prisma.masterclassMessage.create({
            data: {
                podId,
                dayNumber: 0,
                senderType: "zombie",
                senderName: zombieName,
                senderAvatar: zombieAvatar,
                content,
                scheduledFor: zombieTime,
                sentAt: isRetroactive ? zombieTime : null, // Only retroactive messages are "already sent"
            },
        });
    }

    console.log(`[MASTERCLASS] Scheduled ${welcomeMsg.zombies.length + 1} pre-completion welcome messages for pod ${podId}`);
}

/**
 * Trigger milestone message based on lesson completion
 * Called when user completes lesson 3, 5, or 9
 */
export async function triggerMilestoneMessage(
    userId: string,
    lessonNumber: number
): Promise<void> {
    // Only trigger for milestone lessons
    if (![3, 5, 9].includes(lessonNumber)) return;

    const pod = await prisma.masterclassPod.findUnique({
        where: { userId },
        include: { zombieProfile: true },
    });

    if (!pod || pod.status !== "pre_completion") return;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true },
    });
    const firstName = user?.firstName || "friend";

    const milestone = getPreCompletionMessage("lesson_complete", lessonNumber);
    if (!milestone) return;

    const now = new Date();

    // Sarah's milestone message
    await prisma.masterclassMessage.create({
        data: {
            podId: pod.id,
            dayNumber: 0,
            senderType: "sarah",
            senderName: "Sarah Mitchell",
            senderAvatar: "/coaches/sarah-coach.webp",
            content: milestone.sarah.replace(/{firstName}/g, firstName),
            scheduledFor: now,
            sentAt: now,
        },
    });

    // Schedule zombie responses with delays
    for (let i = 0; i < milestone.zombies.length; i++) {
        const zombieGroup = milestone.zombies[i];
        const randomIdx = Math.floor(Math.random() * zombieGroup.options.length);
        const zombieProfileName = pod.zombieProfile?.name || "Jennifer";
        const zombieFirstName = zombieProfileName.split(" ")[0];
        const content = zombieGroup.options[randomIdx]
            .replace(/{firstName}/g, firstName)
            .replace(/{zombieName}/g, zombieProfileName)
            .replace(/{zombieFirstName}/g, zombieFirstName);

        // Parse delay: "2min", "8min", etc.
        let delayMs = 2 * 60 * 1000; // default 2 min
        if (zombieGroup.delay.endsWith("min")) {
            delayMs = parseInt(zombieGroup.delay.replace("min", "")) * 60 * 1000;
        }

        const zombieTime = new Date(now.getTime() + delayMs);

        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "zombie",
                senderName: pod.zombieProfile?.name || "Jennifer",
                senderAvatar: pod.zombieProfile?.avatar,
                content,
                scheduledFor: zombieTime,
                // NOT sent yet - these are future messages
            },
        });
    }

    console.log(`[MASTERCLASS] Triggered milestone ${lessonNumber} messages for user ${userId}`);
}

/**
 * Trigger exam passed celebration messages + schedule 24h scholarship conversion
 */
export async function triggerExamPassedMessages(
    userId: string
): Promise<void> {
    const pod = await prisma.masterclassPod.findUnique({
        where: { userId },
        include: { zombieProfile: true },
    });

    if (!pod) return;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true },
    });
    const firstName = user?.firstName || "friend";
    const zombieProfileName = pod.zombieProfile?.name || "Jennifer";
    const zombieFirstName = zombieProfileName.split(" ")[0];

    const examPassed = getPreCompletionMessage("exam_passed");
    if (!examPassed) return;

    const now = new Date();

    // Sarah's celebration message
    await prisma.masterclassMessage.create({
        data: {
            podId: pod.id,
            dayNumber: 0,
            senderType: "sarah",
            senderName: "Sarah Mitchell",
            senderAvatar: "/coaches/sarah-coach.webp",
            content: examPassed.sarah.replace(/{firstName}/g, firstName),
            scheduledFor: now,
            sentAt: now,
        },
    });

    // Zombie celebration with delays
    for (let i = 0; i < examPassed.zombies.length; i++) {
        const zombieGroup = examPassed.zombies[i];
        const randomIdx = Math.floor(Math.random() * zombieGroup.options.length);
        const content = zombieGroup.options[randomIdx]
            .replace(/{firstName}/g, firstName)
            .replace(/{zombieName}/g, zombieProfileName)
            .replace(/{zombieFirstName}/g, zombieFirstName);

        // Parse delay
        let delayMs = 30 * 1000; // default 30 sec
        if (zombieGroup.delay.endsWith("min")) {
            delayMs = parseInt(zombieGroup.delay.replace("min", "")) * 60 * 1000;
        } else if (zombieGroup.delay.endsWith("sec")) {
            delayMs = parseInt(zombieGroup.delay.replace("sec", "")) * 1000;
        }

        const zombieTime = new Date(now.getTime() + delayMs);

        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "zombie",
                senderName: zombieProfileName,
                senderAvatar: pod.zombieProfile?.avatar,
                content,
                scheduledFor: zombieTime,
            },
        });
    }

    // ========================================================
    // SCHEDULE POST-EXAM SCHOLARSHIP CONVERSION (24h delayed)
    // ========================================================
    const scholarship = getPreCompletionMessage("post_exam_scholarship");
    if (scholarship) {
        // Sarah's scholarship announcement at +24h
        const sarahScholarshipTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah Mitchell",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: scholarship.sarah
                    .replace(/{firstName}/g, firstName)
                    .replace(/{zombieFirstName}/g, zombieFirstName)
                    .replace(/{zombieName}/g, zombieProfileName),
                scheduledFor: sarahScholarshipTime,
                offerMention: "certification-scholarship",
            },
        });

        // Zombie messages with complex delays (3h, 24h+15min, etc.)
        for (let i = 0; i < scholarship.zombies.length; i++) {
            const zombieGroup = scholarship.zombies[i];
            const randomIdx = Math.floor(Math.random() * zombieGroup.options.length);
            const content = zombieGroup.options[randomIdx]
                .replace(/{firstName}/g, firstName)
                .replace(/{zombieName}/g, zombieProfileName)
                .replace(/{zombieFirstName}/g, zombieFirstName);

            const delayMs = parseScholarshipDelay(zombieGroup.delay);
            const zombieTime = new Date(now.getTime() + delayMs);

            await prisma.masterclassMessage.create({
                data: {
                    podId: pod.id,
                    dayNumber: 0,
                    senderType: "zombie",
                    senderName: zombieProfileName,
                    senderAvatar: pod.zombieProfile?.avatar,
                    content,
                    scheduledFor: zombieTime,
                },
            });
        }

        // Sarah's intermediate responses in the PWYW arc
        // +24h+25min: Sarah "calling the institute"
        const sarahCallingTime = new Date(now.getTime() + (24 * 60 + 25) * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah Mitchell",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `${zombieFirstName}, $500 is MORE than enough. Don't ever feel like it's not enough. 💛\n\nLet me call the Institute right now and get this approved for you. Give me 10 minutes...\n\n📞 Calling now...`,
                scheduledFor: sarahCallingTime,
            },
        });

        // +24h+35min: Sarah confirms APPROVED + sends link
        const checkoutUrl = pod.nicheCategory === "functional-medicine"
            ? "https://sarah.accredipro.academy/checkout-fm-certification-program"
            : "https://sarah.accredipro.academy/checkout-asi-practictioner-path";
        const sarahApprovedTime = new Date(now.getTime() + (24 * 60 + 35) * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah Mitchell",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `✅ APPROVED! ${zombieFirstName}, the Institute said YES!\n\nThey're covering $1,497 of your tuition. Your contribution: $500.\n\nHere's your personal enrollment link:\n🔗 ${checkoutUrl}\n\nUse code: SCHOLARSHIP500\n\nThis link is valid for 48 hours. After that the scholarship spot goes to someone else.\n\nI'm so excited for you! 🎉`,
                scheduledFor: sarahApprovedTime,
                offerMention: "certification-scholarship-approved",
            },
        });

        // +24h+50min: Sarah turns to the real student
        const sarahOfferTime = new Date(now.getTime() + (24 * 60 + 50) * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah Mitchell",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `${firstName}... I meant what I said earlier. This scholarship is for BOTH of you. 💛\n\n${zombieFirstName} just went for it and I couldn't be more proud.\n\nIf you feel like this is the right path for you — just tell me what amount feels comfortable. $200, $300, $500, whatever it is. There's no wrong answer.\n\nThe Institute covers the rest. Same program. Same certification. Same mentorship.\n\nNo pressure at all. But if you want this... now is the time.\n\nWhat do you think? 💛`,
                scheduledFor: sarahOfferTime,
                offerMention: "certification-scholarship-student-offer",
            },
        });

        console.log(`[MASTERCLASS] Scheduled post-exam scholarship conversion sequence for user ${userId}`);
    }

    // Update pod to post_completion and start Day 1 of masterclass
    await prisma.masterclassPod.update({
        where: { id: pod.id },
        data: {
            status: "post_completion",
            masterclassDay: 1,
        },
    });

    console.log(`[MASTERCLASS] Triggered exam passed celebration for user ${userId}, transitioning to post_completion`);
}

/**
 * Parse complex delay strings like "3h", "24h+15min", "24h+42min"
 * Returns delay in milliseconds
 */
function parseScholarshipDelay(delay: string): number {
    // Handle compound delays like "24h+15min"
    if (delay.includes("+")) {
        const parts = delay.split("+");
        return parts.reduce((total, part) => total + parseSingleDelay(part.trim()), 0);
    }
    return parseSingleDelay(delay);
}

function parseSingleDelay(delay: string): number {
    if (delay.endsWith("h")) {
        return parseInt(delay.replace("h", "")) * 60 * 60 * 1000;
    } else if (delay.endsWith("min")) {
        return parseInt(delay.replace("min", "")) * 60 * 1000;
    } else if (delay.endsWith("sec")) {
        return parseInt(delay.replace("sec", "")) * 1000;
    }
    return 30 * 1000; // default 30 sec
}

/**
 * Advance a pod to the next day
 * Called by cron job to progress pods daily
 */
export async function advanceToNextDay(podId: string): Promise<boolean> {
    try {
        const pod = await prisma.masterclassPod.findUnique({
            where: { id: podId },
        });

        if (!pod || pod.masterclassDay >= 30) {
            return false;
        }

        await prisma.masterclassPod.update({
            where: { id: podId },
            data: {
                masterclassDay: pod.masterclassDay + 1,
            },
        });

        console.log(`[MASTERCLASS] Advanced pod ${podId} from day ${pod.masterclassDay} to day ${pod.masterclassDay + 1}`);
        return true;
    } catch (error) {
        console.error(`[MASTERCLASS] Failed to advance pod ${podId}:`, error);
        return false;
    }
}
