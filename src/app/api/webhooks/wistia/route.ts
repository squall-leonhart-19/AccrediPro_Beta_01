import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { triggerAutoMessage } from "@/lib/auto-messages";

/**
 * Wistia Webhook Handler
 *
 * Tracks video watching milestones and applies tags to users.
 *
 * Setup in Wistia:
 * 1. Go to Account Settings > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/wistia
 * 3. Select event: "media_updated" or use Turnstile for viewer tracking
 *
 * For percent-watched tracking, use Wistia's Turnstile or custom JavaScript
 * that calls this endpoint directly.
 */

// Video milestone percentages to track (all milestones from 10% to 100%)
const MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

interface WistiaPayload {
    // Standard webhook payload
    type?: string;
    media?: {
        hashed_id?: string;
        name?: string;
    };
    // Custom payload for direct tracking
    userId?: string;
    email?: string;
    videoId?: string;
    percentWatched?: number;
    timestamp?: string;
}

export async function POST(request: NextRequest) {
    try {
        const payload: WistiaPayload = await request.json();
        console.log("📹 Wistia webhook received:", JSON.stringify(payload, null, 2));

        // Handle direct tracking from our frontend
        if (payload.userId && payload.percentWatched !== undefined) {
            return await handleDirectTracking(payload);
        }

        // Handle standard Wistia webhook (for future use)
        if (payload.type && payload.media) {
            console.log(`Wistia event: ${payload.type} for media ${payload.media.hashed_id}`);
            // Standard webhooks don't include viewer data, so we'd need Turnstile
            return NextResponse.json({ success: true, message: "Wistia event logged" });
        }

        return NextResponse.json({ success: true, message: "No action taken" });

    } catch (error) {
        console.error("Wistia webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}

async function handleDirectTracking(payload: WistiaPayload) {
    const { userId, percentWatched, videoId } = payload;

    if (!userId || percentWatched === undefined) {
        return NextResponse.json({ error: "Missing userId or percentWatched" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
    });

    if (!user) {
        console.log(`User ${userId} not found for video tracking`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine which milestones have been reached
    const tagsToCreate: string[] = [];

    for (const milestone of MILESTONES) {
        if (percentWatched >= milestone) {
            tagsToCreate.push(`training_video_${milestone}`);
        }
    }

    // Create tags for each milestone
    for (const tag of tagsToCreate) {
        await prisma.userTag.upsert({
            where: { userId_tag: { userId, tag } },
            update: {}, // Don't update if exists
            create: { userId, tag },
        });
    }

    if (tagsToCreate.length > 0) {
        console.log(`🏷️ Video tracking tags for ${user.email}: ${tagsToCreate.join(", ")}`);
    }

    // Check if they completed the video (70%+ is considered "completed" for CRO purposes)
    const isCompleted = percentWatched >= 70;

    // === SEND DM WHEN VIDEO COMPLETED (70%+) ===
    // Only send once - check if they already have the 70% tag before this request
    if (isCompleted) {
        const existingCompletionTag = await prisma.userTag.findUnique({
            where: { userId_tag: { userId, tag: "training_video_dm_sent" } },
        });

        if (!existingCompletionTag) {
            // Mark that we've sent the DM so we don't send it again
            await prisma.userTag.upsert({
                where: { userId_tag: { userId, tag: "training_video_dm_sent" } },
                update: {},
                create: { userId, tag: "training_video_dm_sent" },
            });

            // Random delay between 5-10 minutes (300,000 - 600,000 ms) for hyper-real feel
            const delayMinutes = 5 + Math.random() * 5; // 5 to 10 minutes
            const delayMs = Math.floor(delayMinutes * 60 * 1000);

            console.log(`📨 Training video DM scheduled for ${user.email} in ${delayMinutes.toFixed(1)} minutes`);

            // Fire and forget with delay - send DM from Sarah with voice
            setTimeout(() => {
                triggerAutoMessage({
                    userId,
                    trigger: "training_video_complete",
                }).catch((err) => console.error("Training video DM error:", err));

                console.log(`📨 Training video DM sent to ${user.email} after delay`);
            }, delayMs);
        }
    }

    return NextResponse.json({
        success: true,
        tagsCreated: tagsToCreate,
        isCompleted,
        percentWatched,
    });
}

// GET endpoint to check user's video progress
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const tags = await prisma.userTag.findMany({
        where: {
            userId,
            tag: { startsWith: "training_video_" },
        },
        select: { tag: true, createdAt: true },
    });

    // Find highest milestone reached
    let highestMilestone = 0;
    for (const { tag } of tags) {
        const match = tag.match(/training_video_(\d+)/);
        if (match) {
            const milestone = parseInt(match[1]);
            if (milestone > highestMilestone) {
                highestMilestone = milestone;
            }
        }
    }

    return NextResponse.json({
        success: true,
        tags: tags.map(t => t.tag),
        highestMilestone,
        isCompleted: highestMilestone >= 70,
    });
}
