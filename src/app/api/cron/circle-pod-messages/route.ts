import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * CRON: Process scheduled Circle Pod messages
 * 
 * Runs every 1-5 minutes via Vercel cron
 * Checks for messages where:
 *   - scheduledFor <= now
 *   - sentAt is null
 * 
 * Sets sentAt = scheduledFor to "send" the message
 */

export async function GET(request: NextRequest) {
    // Verify cron secret in production
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow in development
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const now = new Date();

        // Find messages ready to be sent
        const pendingMessages = await prisma.masterclassMessage.findMany({
            where: {
                sentAt: null,
                scheduledFor: { lte: now },
            },
            include: {
                pod: {
                    include: { user: true },
                },
            },
        });

        if (pendingMessages.length === 0) {
            return NextResponse.json({
                ok: true,
                processed: 0,
                message: "No pending messages",
            });
        }

        // Mark each message as sent
        const results = [];
        for (const msg of pendingMessages) {
            await prisma.masterclassMessage.update({
                where: { id: msg.id },
                data: { sentAt: msg.scheduledFor }, // Use scheduled time as sent time
            });

            results.push({
                id: msg.id,
                podId: msg.podId,
                user: msg.pod.user.email,
                senderType: msg.senderType,
                senderName: msg.senderName,
                scheduledFor: msg.scheduledFor,
            });

            console.log(`📨 Sent message to ${msg.pod.user.firstName}: "${msg.content.slice(0, 50)}..."`);
        }

        return NextResponse.json({
            ok: true,
            processed: results.length,
            messages: results,
        });
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ error: "Failed to process messages" }, { status: 500 });
    }
}

// Vercel cron config
export const dynamic = "force-dynamic";
export const maxDuration = 30;
