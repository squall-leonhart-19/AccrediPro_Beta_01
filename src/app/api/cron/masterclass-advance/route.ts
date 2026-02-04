import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { advanceToNextDay } from "@/lib/masterclass-pod";

/**
 * Cron job to advance masterclass pods daily.
 * 
 * Runs every hour (recommended) or daily.
 * 
 * Actions:
 * 1. Activate "waiting" pods that are 24h+ post-exam
 * 2. Advance "active" pods to next day (once per day)
 * 3. Send scheduled messages that are due
 */
export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
        podsActivated: 0,
        podsAdvanced: 0,
        messagesSent: 0,
        errors: [] as string[],
    };

    try {
        const now = new Date();
        // NOTE: Pods now start immediately on opt-in, no waiting period
        // The "waiting" status is no longer used

        // 2. Advance active pods to next day (check if it's time)
        // Each pod should advance once per 24h since their startedAt
        const activePods = await prisma.masterclassPod.findMany({
            where: {
                status: "active",
                masterclassDay: { lt: 30 },
            },
        });

        for (const pod of activePods) {
            if (!pod.startedAt) continue;

            // Calculate which day they should be on
            const hoursSinceStart = (now.getTime() - pod.startedAt.getTime()) / (1000 * 60 * 60);
            const expectedDay = Math.floor(hoursSinceStart / 24) + 1; // Day 1 = first 24h

            // If they're behind, advance them
            if (pod.masterclassDay < expectedDay && expectedDay <= 30) {
                try {
                    const success = await advanceToNextDay(pod.id);
                    if (success) {
                        results.podsAdvanced++;
                        console.log(`[MASTERCLASS CRON] Advanced pod ${pod.id} to day ${pod.masterclassDay + 1}`);
                    }
                } catch (error) {
                    const msg = `Failed to advance pod ${pod.id}: ${error}`;
                    results.errors.push(msg);
                    console.error(`[MASTERCLASS CRON] ${msg}`);
                }
            }
        }

        // 3. Send scheduled messages that are due
        const dueMessages = await prisma.masterclassMessage.findMany({
            where: {
                scheduledFor: { lte: now },
                sentAt: null,
            },
            include: {
                pod: {
                    include: {
                        user: { select: { id: true, firstName: true, email: true } },
                    },
                },
            },
        });

        for (const message of dueMessages) {
            try {
                // Mark as sent
                await prisma.masterclassMessage.update({
                    where: { id: message.id },
                    data: { sentAt: now },
                });

                results.messagesSent++;
                console.log(`[MASTERCLASS CRON] Sent message ${message.id} to user ${message.pod.userId}`);

                // TODO: Send push notification or in-app notification here
                // For now, messages are just marked as "sent" and shown in pod UI
            } catch (error) {
                const msg = `Failed to send message ${message.id}: ${error}`;
                results.errors.push(msg);
                console.error(`[MASTERCLASS CRON] ${msg}`);
            }
        }

        console.log(`[MASTERCLASS CRON] Complete. Activated: ${results.podsActivated}, Advanced: ${results.podsAdvanced}, Messages: ${results.messagesSent}`);

        return NextResponse.json({
            success: true,
            ...results,
        });
    } catch (error) {
        console.error("[MASTERCLASS CRON] Fatal error:", error);
        return NextResponse.json(
            { error: "Cron job failed", details: String(error) },
            { status: 500 }
        );
    }
}
