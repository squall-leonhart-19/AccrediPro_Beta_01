import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSarahVoice } from "@/lib/elevenlabs";

/**
 * POST /api/cron/process-scheduled-messages
 * 
 * Processes pending scheduled voice messages.
 * Should be called by a cron job every minute.
 * 
 * For Vercel: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-scheduled-messages",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function POST(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In production, require secret. In dev, allow without.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();

        // Find messages that are due to be sent
        const pendingMessages = await prisma.scheduledVoiceMessage.findMany({
            where: {
                status: "PENDING",
                scheduledFor: { lte: now },
            },
            take: 10, // Process max 10 at a time
            orderBy: { scheduledFor: "asc" },
            include: {
                sender: { select: { id: true, firstName: true } },
                receiver: { select: { id: true, email: true, firstName: true } },
            },
        });

        if (pendingMessages.length === 0) {
            return NextResponse.json({
                success: true,
                processed: 0,
                message: "No pending messages"
            });
        }

        console.log(`🔄 Processing ${pendingMessages.length} scheduled voice messages...`);

        const results = [];

        for (const scheduled of pendingMessages) {
            try {
                // Mark as processing
                await prisma.scheduledVoiceMessage.update({
                    where: { id: scheduled.id },
                    data: { status: "PROCESSING", attempts: { increment: 1 } },
                });

                // Generate voice
                let voiceUrl: string | null = null;
                let voiceDuration: number | null = null;

                const voiceResult = await generateSarahVoice(scheduled.voiceText);

                if (voiceResult.success && voiceResult.audioBase64) {
                    voiceUrl = `data:audio/mp3;base64,${voiceResult.audioBase64}`;
                    voiceDuration = voiceResult.duration || null;
                    console.log(`🎙️ Generated voice for ${scheduled.receiver.email} (${voiceDuration}s)`);
                } else {
                    console.error(`Voice generation failed for ${scheduled.receiver.email}:`, voiceResult.error);
                }

                // Create the message
                await prisma.message.create({
                    data: {
                        senderId: scheduled.senderId,
                        receiverId: scheduled.receiverId,
                        content: scheduled.textContent,
                        messageType: "DIRECT",
                        attachmentUrl: voiceUrl,
                        attachmentType: voiceUrl ? "voice" : null,
                        voiceDuration,
                        isAiVoice: !!voiceUrl,
                    },
                });

                // Mark as sent
                await prisma.scheduledVoiceMessage.update({
                    where: { id: scheduled.id },
                    data: { status: "SENT", sentAt: new Date() },
                });

                console.log(`✅ Sent voice message to ${scheduled.receiver.email}`);
                results.push({ id: scheduled.id, status: "SENT", email: scheduled.receiver.email });

            } catch (error) {
                console.error(`Failed to process scheduled message ${scheduled.id}:`, error);

                // Mark as failed
                await prisma.scheduledVoiceMessage.update({
                    where: { id: scheduled.id },
                    data: {
                        status: scheduled.attempts >= 3 ? "FAILED" : "PENDING", // Retry up to 3 times
                        lastError: error instanceof Error ? error.message : "Unknown error",
                    },
                });

                results.push({ id: scheduled.id, status: "ERROR", error: String(error) });
            }
        }

        return NextResponse.json({
            success: true,
            processed: pendingMessages.length,
            results,
        });

    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            { error: "Failed to process scheduled messages" },
            { status: 500 }
        );
    }
}

// Also allow GET for manual testing
export async function GET(request: NextRequest) {
    return POST(request);
}
