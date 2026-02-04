import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CIRCLE_RESOURCES } from "@/data/circle-resources";

// Cron job to unlock resources and send Sarah gift messages
// Runs every 5 minutes via Vercel cron
export async function GET(request: NextRequest) {
    // Verify cron secret in production
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const now = new Date();
        let unlocked = 0;
        let messagesScheduled = 0;

        // Get all active pods
        const pods = await prisma.masterclassPod.findMany({
            where: {
                status: { in: ["waiting", "active"] },
            },
            include: {
                user: {
                    select: { firstName: true },
                },
            },
        });

        for (const pod of pods) {
            const minutesSinceCreated = Math.floor(
                (now.getTime() - new Date(pod.createdAt).getTime()) / (1000 * 60)
            );

            const currentUnlocked = (pod.unlockedResources as string[]) || [];
            const newlyUnlocked: string[] = [];

            // Check each resource
            for (const resource of CIRCLE_RESOURCES) {
                // Skip if already unlocked
                if (currentUnlocked.includes(resource.id)) continue;

                // Check if unlock time has passed
                if (minutesSinceCreated >= resource.unlockAfterMinutes) {
                    newlyUnlocked.push(resource.id);

                    // Schedule Sarah's gift message
                    const firstName = pod.user.firstName || "friend";
                    const giftMessage = resource.sarahGiftMessage.replace(/{firstName}/g, firstName);

                    await prisma.masterclassMessage.create({
                        data: {
                            podId: pod.id,
                            dayNumber: 0,
                            senderType: "sarah",
                            senderName: "Sarah M.",
                            senderAvatar: "/coaches/sarah-coach.webp",
                            content: giftMessage,
                            scheduledFor: now,
                            sentAt: now, // Send immediately
                        },
                    });

                    messagesScheduled++;
                    console.log(`🎁 Unlocked ${resource.id} for pod ${pod.id}`);
                }
            }

            // Update pod with newly unlocked resources
            if (newlyUnlocked.length > 0) {
                await prisma.masterclassPod.update({
                    where: { id: pod.id },
                    data: {
                        unlockedResources: [...currentUnlocked, ...newlyUnlocked],
                    },
                });
                unlocked += newlyUnlocked.length;
            }
        }

        return NextResponse.json({
            ok: true,
            podsChecked: pods.length,
            resourcesUnlocked: unlocked,
            messagesScheduled,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error("Resource unlock cron error:", error);
        return NextResponse.json({ error: "Failed to process" }, { status: 500 });
    }
}
