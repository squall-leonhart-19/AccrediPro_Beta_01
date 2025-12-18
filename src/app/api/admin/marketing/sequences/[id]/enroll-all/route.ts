import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";

// Helper function to calculate next send time
function calculateNextSendTime(delayDays: number, delayHours: number): Date {
    const now = new Date();
    now.setDate(now.getDate() + delayDays);
    now.setHours(now.getHours() + delayHours);
    return now;
}

// POST /api/admin/marketing/sequences/[id]/enroll-all - Enroll all subscribers or filtered list
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sequenceId } = await params;
        const body = await request.json();
        const {
            userIds, // Optional: specific user IDs to enroll
            filter, // Optional: 'all', 'not-purchased', 'mini-diploma-completed'
            excludeAlreadyEnrolled = true,
            sendFirstEmail = false, // Default: don't send immediately for bulk
            batchSize = 50, // Process in batches
        } = body;

        // Get the sequence
        const sequence = await prisma.sequence.findUnique({
            where: { id: sequenceId },
            include: {
                emails: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!sequence) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
        }

        if (!sequence.isActive) {
            return NextResponse.json({ error: "Sequence is not active. Activate it first." }, { status: 400 });
        }

        if (sequence.emails.length === 0) {
            return NextResponse.json({ error: "Sequence has no emails" }, { status: 400 });
        }

        // Build the user query - type with email as possibly null to handle prisma types
        let usersToEnroll: { id: string; email: string | null; firstName: string | null }[] = [];

        if (userIds && userIds.length > 0) {
            // Specific users
            usersToEnroll = await prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, email: true, firstName: true },
            });
        } else {
            // Filter-based - MUST match subscribers API filters!
            // Excludes: zombies (no emailVerified), bounced, complained, unsubscribed
            const whereClause: any = {
                role: "USER",
                email: { not: null },
                emailVerified: { not: null }, // Exclude zombies
                // Exclude users with suppression tags
                marketingTags: {
                    none: {
                        tag: {
                            slug: {
                                in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed"]
                            }
                        }
                    }
                },
            };

            // Apply filter
            if (filter === "not-purchased") {
                whereClause.courseEnrollments = {
                    none: { isPaid: true },
                };
            } else if (filter === "mini-diploma-completed") {
                whereClause.userProgress = {
                    some: {
                        course: { slug: { contains: "mini-diploma" } },
                    },
                };
            }
            // 'all' filter uses no additional conditions

            usersToEnroll = await prisma.user.findMany({
                where: whereClause,
                select: { id: true, email: true, firstName: true },
            });
        }

        // Filter out users without emails
        usersToEnroll = usersToEnroll.filter(u => u.email);

        if (usersToEnroll.length === 0) {
            return NextResponse.json({ error: "No users match the criteria" }, { status: 400 });
        }

        // Exclude users already enrolled in this sequence (if option enabled)
        if (excludeAlreadyEnrolled) {
            const existingEnrollments = await prisma.sequenceEnrollment.findMany({
                where: {
                    sequenceId,
                    userId: { in: usersToEnroll.map(u => u.id) },
                    status: "ACTIVE",
                },
                select: { userId: true },
            });

            const enrolledUserIds = new Set(existingEnrollments.map(e => e.userId));
            usersToEnroll = usersToEnroll.filter(u => !enrolledUserIds.has(u.id));
        }

        if (usersToEnroll.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All matching users are already enrolled in this sequence",
                enrolled: 0,
            });
        }

        // Enroll in batches
        let totalEnrolled = 0;
        let totalEmailsSent = 0;
        const errors: string[] = [];
        const firstEmail = sequence.emails[0];

        for (let i = 0; i < usersToEnroll.length; i += batchSize) {
            const batch = usersToEnroll.slice(i, i + batchSize);

            for (const user of batch) {
                if (!user.email) continue; // Skip users without email

                try {
                    // Calculate next send time
                    const nextSendAt = sendFirstEmail
                        ? new Date() // Now
                        : calculateNextSendTime(firstEmail.delayDays, firstEmail.delayHours);

                    // Create enrollment
                    await prisma.sequenceEnrollment.upsert({
                        where: {
                            userId_sequenceId: {
                                userId: user.id,
                                sequenceId,
                            },
                        },
                        create: {
                            userId: user.id,
                            sequenceId,
                            status: "ACTIVE",
                            currentEmailIndex: 0,
                            nextSendAt,
                        },
                        update: {
                            status: "ACTIVE",
                            currentEmailIndex: 0,
                            nextSendAt,
                            completedAt: null,
                            exitedAt: null,
                            exitReason: null,
                            emailsReceived: 0,
                            emailsOpened: 0,
                            emailsClicked: 0,
                        },
                    });

                    totalEnrolled++;

                    // Send first email immediately if requested
                    if (sendFirstEmail) {
                        try {
                            const firstName = user.firstName || user.email.split("@")[0];
                            const subject = (firstEmail.customSubject || "Email from AccrediPro")
                                .replace(/\{\{firstName\}\}/g, firstName);
                            const content = (firstEmail.customContent || "")
                                .replace(/\{\{firstName\}\}/g, firstName);

                            const htmlContent = brandedEmailWrapper(content);

                            const emailResult = await sendEmail({
                                to: user.email,
                                subject,
                                html: htmlContent,
                            });

                            if (emailResult?.data?.id) {
                                // Record the email send
                                await prisma.emailSend.create({
                                    data: {
                                        userId: user.id,
                                        sequenceEmailId: firstEmail.id,
                                        resendId: emailResult.data.id,
                                        toEmail: user.email,
                                        status: "SENT",
                                        subject,
                                        sentAt: new Date(),
                                    },
                                });

                                // Update enrollment
                                await prisma.sequenceEnrollment.update({
                                    where: {
                                        userId_sequenceId: { userId: user.id, sequenceId },
                                    },
                                    data: {
                                        emailsReceived: { increment: 1 },
                                        currentEmailIndex: 1,
                                        nextSendAt: sequence.emails[1]
                                            ? calculateNextSendTime(sequence.emails[1].delayDays, sequence.emails[1].delayHours)
                                            : null,
                                    },
                                });

                                totalEmailsSent++;
                            }
                        } catch (emailError) {
                            console.error(`Failed to send email to ${user.email}:`, emailError);
                            errors.push(`Email failed for ${user.email}`);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to enroll ${user.id}:`, error);
                    errors.push(`Failed to enroll ${user.email}`);
                }
            }

            // Small delay between batches to avoid rate limits
            if (i + batchSize < usersToEnroll.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Update sequence stats
        await prisma.sequence.update({
            where: { id: sequenceId },
            data: { totalEnrolled: { increment: totalEnrolled } },
        });

        return NextResponse.json({
            success: true,
            enrolled: totalEnrolled,
            emailsSent: totalEmailsSent,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully enrolled ${totalEnrolled} users${totalEmailsSent > 0 ? ` and sent ${totalEmailsSent} emails` : ""}`,
        });
    } catch (error) {
        console.error("Error in bulk enroll:", error);
        return NextResponse.json({ error: "Failed to enroll users" }, { status: 500 });
    }
}
