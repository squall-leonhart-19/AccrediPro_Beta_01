import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";

/**
 * CRON: Process chat leads for sequence enrollment
 * 
 * Runs every hour via Vercel Cron
 * 
 * Logic:
 * 1. Find chat optins with email that are NOT customers
 * 2. Check if they were created 2+ hours ago (give time to convert)
 * 3. Enroll them in chat-conversion sequence
 * 4. Send first email immediately (Day 0)
 */

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            console.warn("[CRON-CHAT-ENROLL] Unauthorized cron request");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[CRON-CHAT-ENROLL] Starting chat lead enrollment processing...");

        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        const results = {
            processed: 0,
            enrolled: 0,
            skipped: 0,
            errors: 0,
            details: [] as string[],
        };

        // Find the chat-conversion sequence
        const chatSequence = await prisma.sequence.findFirst({
            where: {
                slug: "chat-conversion",
                isActive: true
            },
            include: {
                emails: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                }
            }
        });

        if (!chatSequence) {
            return NextResponse.json({
                success: true,
                message: "Chat-conversion sequence not found or not active",
                ...results
            });
        }

        // Find chat optins with email, created 2+ hours ago
        const eligibleOptins = await prisma.chatOptin.findMany({
            where: {
                email: { not: null },
                createdAt: { lte: twoHoursAgo },
            },
            take: 50, // Process max 50 per run
        });

        console.log(`[CRON-CHAT-ENROLL] Found ${eligibleOptins.length} optins to check`);

        for (const optin of eligibleOptins) {
            if (!optin.email) continue;
            results.processed++;

            try {
                // Check if already a customer
                const existingUser = await prisma.user.findUnique({
                    where: { email: optin.email.toLowerCase() }
                });

                if (existingUser) {
                    // Check if already enrolled in this sequence
                    const existingEnrollment = await prisma.sequenceEnrollment.findFirst({
                        where: {
                            userId: existingUser.id,
                            sequenceId: chatSequence.id,
                        }
                    });

                    if (existingEnrollment) {
                        results.skipped++;
                        results.details.push(`${optin.email}: Already enrolled or is customer`);
                        continue;
                    }

                    // Enroll the user in the sequence
                    const firstEmail = chatSequence.emails[0];
                    const nextSendAt = firstEmail
                        ? new Date(now.getTime() + (firstEmail.delayHours || 0) * 60 * 60 * 1000)
                        : now;

                    await prisma.sequenceEnrollment.create({
                        data: {
                            userId: existingUser.id,
                            sequenceId: chatSequence.id,
                            status: "ACTIVE",
                            currentEmailIndex: 0,
                            nextSendAt,
                            source: "chat_optin",
                        }
                    });

                    // Update sequence stats
                    await prisma.sequence.update({
                        where: { id: chatSequence.id },
                        data: { totalEnrolled: { increment: 1 } }
                    });

                    results.enrolled++;
                    results.details.push(`${optin.email}: Enrolled in chat-conversion sequence`);
                    console.log(`[CRON-CHAT-ENROLL] ✅ Enrolled ${optin.email}`);
                } else {
                    // No User record yet - can't enroll in sequence
                    // This lead will be picked up if they ever create an account
                    results.skipped++;
                    results.details.push(`${optin.email}: No user account yet`);
                }
            } catch (error) {
                results.errors++;
                const errMsg = error instanceof Error ? error.message : "Unknown error";
                results.details.push(`${optin.email}: Error - ${errMsg}`);
                console.error(`[CRON-CHAT-ENROLL] Error for ${optin.email}:`, error);
            }
        }

        console.log("[CRON-CHAT-ENROLL] Complete:", {
            processed: results.processed,
            enrolled: results.enrolled,
            skipped: results.skipped,
            errors: results.errors,
        });

        return NextResponse.json({
            success: true,
            ...results,
            timestamp: now.toISOString(),
        });

    } catch (error) {
        console.error("[CRON-CHAT-ENROLL] Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat enrollments" },
            { status: 500 }
        );
    }
}

// POST for manual testing
export async function POST(request: NextRequest) {
    return GET(request);
}
