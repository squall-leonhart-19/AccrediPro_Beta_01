import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { assessCountryMismatch } from "@/lib/ip-geolocation";

// GET - Fetch complete user activity for dispute resolution
export const dynamic = "force-dynamic";
// OPTIMIZED: Reduced query complexity for faster loading
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // OPTIMIZED: Fetch data with minimal fields and reduced limits
        const [
            user,
            loginHistory,
            firstLoginRecord,
            enrollments,
            lessonProgressCount,
            recentLessonProgress,
            certificates,
            activityLogsCount,
            payments,
            resourceDownloads,
            quizAttempts,
            emailSends,
            supportTickets,
            privateMessageCount,
            communityMessageCount,
            podMembership,
            activityTimestamps, // NEW: For session time calculation
        ] = await Promise.all([
            // User info - includes NEW dispute evidence fields
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    firstLoginAt: true,
                    lastLoginAt: true,
                    loginCount: true,
                    emailVerified: true,
                    // NEW: Registration evidence
                    registrationIp: true,
                    registrationUserAgent: true,
                    registrationDevice: true,
                    registrationBrowser: true,
                    // NEW: Legal acceptance timestamps
                    tosAcceptedAt: true,
                    tosVersion: true,
                    refundPolicyAcceptedAt: true,
                    refundPolicyVersion: true,
                },
            }),

            // Login history - reduced to 50 most recent
            prisma.loginHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 50,
                select: {
                    id: true,
                    createdAt: true,
                    ipAddress: true,
                    userAgent: true,
                    device: true,
                    browser: true,
                    location: true,
                    country: true,
                    countryCode: true,
                    loginMethod: true,
                    isFirstLogin: true,
                },
            }),

            // Fallback for Registration Evidence (Get oldest login)
            prisma.loginHistory.findFirst({
                where: { userId },
                orderBy: { createdAt: "asc" },
                select: {
                    ipAddress: true,
                    userAgent: true,
                    device: true,
                    browser: true,
                }
            }),

            // Enrollments - minimal fields, no deep nesting
            prisma.enrollment.findMany({
                where: { userId },
                select: {
                    id: true,
                    status: true,
                    progress: true,
                    enrolledAt: true,
                    completedAt: true,
                    lastAccessedAt: true,
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            }),

            // OPTIMIZED: Just count completed lessons instead of fetching all
            prisma.lessonProgress.count({
                where: { userId, isCompleted: true },
            }),

            // OPTIMIZED: Only fetch 30 most recent for display
            prisma.lessonProgress.findMany({
                where: { userId },
                select: {
                    id: true,
                    isCompleted: true,
                    watchTime: true,
                    timeSpent: true,
                    visitCount: true,
                    completedAt: true,
                    updatedAt: true,
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            module: {
                                select: {
                                    title: true,
                                    course: {
                                        select: { title: true },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: 30,
            }),

            // Certificates - with certificate number for evidence
            prisma.certificate.findMany({
                where: { userId },
                select: {
                    id: true,
                    certificateNumber: true,
                    issuedAt: true,
                    type: true,
                    score: true,
                    course: {
                        select: { title: true },
                    },
                    module: {
                        select: { title: true },
                    },
                },
                orderBy: { issuedAt: "desc" },
            }),

            // Count activity logs
            prisma.userActivity.count({
                where: { userId },
            }),

            // NEW: Payment records for dispute evidence
            prisma.payment.findMany({
                where: { userId },
                select: {
                    id: true,
                    amount: true,
                    currency: true,
                    transactionId: true,
                    processorRef: true,
                    paymentMethod: true,
                    cardLast4: true,
                    cardBrand: true,
                    billingEmail: true,
                    billingName: true,
                    billingAddress: true,
                    billingCity: true,
                    billingState: true,
                    billingZip: true,
                    billingCountry: true,
                    ipAddress: true,
                    productName: true,
                    productSku: true,
                    status: true,
                    refundedAt: true,
                    refundAmount: true,
                    chargebackAt: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),

            // NEW: Resource downloads for evidence
            prisma.resourceDownload.findMany({
                where: { userId },
                select: {
                    id: true,
                    ipAddress: true,
                    userAgent: true,
                    createdAt: true,
                    resource: {
                        select: {
                            title: true,
                            type: true,
                            url: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 50,
            }),

            // NEW: Quiz attempts for engagement evidence
            prisma.quizAttempt.findMany({
                where: { userId },
                select: {
                    id: true,
                    score: true,
                    passed: true,
                    timeSpent: true,
                    startedAt: true,
                    completedAt: true,
                    quiz: {
                        select: {
                            title: true,
                            module: {
                                select: { title: true },
                            },
                        },
                    },
                },
                orderBy: { completedAt: "desc" },
                take: 20,
            }),

            // NEW: Email sends for communication evidence
            prisma.emailSend.findMany({
                where: { userId },
                select: {
                    id: true,
                    toEmail: true,
                    subject: true,
                    status: true,
                    sentAt: true,
                    deliveredAt: true,
                    openedAt: true,
                    clickedAt: true,
                    bouncedAt: true,
                },
                orderBy: { sentAt: "desc" },
                take: 50,
            }),

            // NEW: Support tickets for communication evidence
            prisma.supportTicket.findMany({
                where: { userId },
                select: {
                    id: true,
                    ticketNumber: true,
                    subject: true,
                    status: true,
                    category: true,
                    createdAt: true,
                    resolvedAt: true,
                    closedAt: true,
                    messages: {
                        select: {
                            content: true,
                            isFromCustomer: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),

            // NEW: Mentorship Messages (Private)
            prisma.message.count({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            }),

            // NEW: Community Messages (Pod)
            /*
            prisma.podMessage.count({
                where: { senderId: userId }
            }),
            */
            0, // Fallback to 0

            // NEW: Pod Membership
            /*
            prisma.podMember.findFirst({
                where: { userId },
                include: {
                    pod: { select: { name: true } }
                }
            })
            */
            null, // Fallback to null

            // NEW: Activity timestamps for session time calculation
            prisma.userActivity.findMany({
                where: { userId },
                select: { createdAt: true },
                orderBy: { createdAt: "asc" }
            })
        ]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate stats including new data
        const totalWatchTime = recentLessonProgress.reduce((acc, lp) => acc + (lp.watchTime || 0), 0);
        const totalTimeSpent = recentLessonProgress.reduce((acc, lp) => acc + (lp.timeSpent || 0), 0);
        const totalPayments = payments.reduce((acc, p) => acc + Number(p.amount), 0);

        // NEW: Calculate session-based platform time
        // Group activities into sessions (gap > 30 min = new session)
        let totalPlatformTime = 0;
        const SESSION_GAP_MS = 30 * 60 * 1000; // 30 minutes
        const timestamps = [
            ...(loginHistory || []).map(l => new Date(l.createdAt).getTime()),
            ...(activityTimestamps || []).map((a: { createdAt: Date }) => new Date(a.createdAt).getTime())
        ].sort((a, b) => a - b);

        if (timestamps.length > 0) {
            let sessionStart = timestamps[0];
            let lastActivity = timestamps[0];

            for (let i = 1; i < timestamps.length; i++) {
                const gap = timestamps[i] - lastActivity;
                if (gap > SESSION_GAP_MS) {
                    // End current session, start new one
                    totalPlatformTime += lastActivity - sessionStart;
                    sessionStart = timestamps[i];
                }
                lastActivity = timestamps[i];
            }
            // Add final session (assume 5 min minimum if only 1 activity)
            const finalSessionDuration = lastActivity - sessionStart;
            totalPlatformTime += finalSessionDuration > 0 ? finalSessionDuration : 5 * 60 * 1000;
        }

        const stats = {
            totalLogins: user.loginCount,
            firstLogin: user.firstLoginAt,
            lastLogin: user.lastLoginAt,
            accountCreated: user.createdAt,
            emailVerified: user.emailVerified,
            totalEnrollments: enrollments.length,
            completedCourses: enrollments.filter(e => e.status === "COMPLETED").length,
            lessonsCompleted: lessonProgressCount,
            totalWatchTime,
            totalTimeSpent: Math.round(totalPlatformTime / 1000), // Session-based platform time in seconds
            certificatesEarned: certificates.length,
            totalActivityLogs: activityLogsCount,
            // NEW stats
            mentorshipMessages: privateMessageCount,
            communityMessages: communityMessageCount,
            podName: podMembership?.pod?.name || null,
            // NEW stats
            totalPayments,
            paymentCount: payments.length,
            downloadCount: resourceDownloads.length,
            quizAttemptCount: quizAttempts.length,
            quizzesPassed: quizAttempts.filter(q => q.passed).length,
        };

        // NEW: Registration evidence section
        const registrationEvidence = {
            ip: user.registrationIp || firstLoginRecord?.ipAddress || null,
            userAgent: user.registrationUserAgent || firstLoginRecord?.userAgent || null,
            device: user.registrationDevice || firstLoginRecord?.device || "Unknown",
            browser: user.registrationBrowser || firstLoginRecord?.browser || "Unknown",
            timestamp: user.createdAt,
        };

        // NEW: Legal acceptance section
        const legalAcceptance = {
            tosAcceptedAt: user.tosAcceptedAt,
            tosVersion: user.tosVersion,
            refundPolicyAcceptedAt: user.refundPolicyAcceptedAt,
            refundPolicyVersion: user.refundPolicyVersion,
        };

        // NEW: Fraud risk assessment - compare login country with billing country
        const latestPayment = payments[0];
        const latestLogin = loginHistory[0];
        const fraudRisk = assessCountryMismatch(
            latestLogin?.countryCode || null,
            latestPayment?.billingCountry || null
        );

        return NextResponse.json({
            user,
            stats,
            registrationEvidence,
            legalAcceptance,
            fraudRisk, // NEW: Include fraud risk assessment
            loginHistory,
            firstLoginRecord,
            enrollments,
            lessonProgress: recentLessonProgress,
            certificates,
            payments,
            resourceDownloads,
            quizAttempts,
            emailSends,
            supportTickets,
            activityLogs: [], // Don't fetch full logs - just show count in stats
        });
    } catch (error) {
        console.error("Get user activity error:", error);
        return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 });
    }
}
