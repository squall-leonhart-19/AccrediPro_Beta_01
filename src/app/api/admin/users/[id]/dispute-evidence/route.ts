import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/users/[id]/dispute-evidence
// Generates comprehensive evidence package for chargeback disputes
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "MENTOR"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    try {
        // Fetch user with all evidence data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
                // TOS Acceptance Evidence
                tosAcceptedAt: true,
                tosVersion: true,
                refundPolicyAcceptedAt: true,
                refundPolicyVersion: true,
                // Registration Device Evidence
                registrationIp: true,
                registrationUserAgent: true,
                registrationDevice: true,
                registrationBrowser: true,
                // Login Activity Evidence
                firstLoginAt: true,
                lastLoginAt: true,
                loginCount: true,
                // Account Status
                isActive: true,
                leadSource: true,
                leadSourceDetail: true,
                // Enrollments
                enrollments: {
                    select: {
                        id: true,
                        status: true,
                        progress: true,
                        enrolledAt: true,
                        completedAt: true,
                        lastAccessedAt: true,
                        course: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
                // Certificates Earned
                certificates: {
                    select: {
                        id: true,
                        issuedAt: true,
                        course: {
                            select: { title: true },
                        },
                    },
                },
                // Tags (includes dispute_filed if present)
                tags: {
                    select: {
                        tag: true,
                        value: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch lesson progress with timestamps
        const lessonProgress = await prisma.lessonProgress.findMany({
            where: { userId },
            select: {
                isCompleted: true,
                completedAt: true,
                watchTime: true,
                lesson: {
                    select: {
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
            orderBy: { completedAt: "asc" },
        });

        // Fetch activity log (last 100 activities)
        const activityLog = await prisma.userActivity.findMany({
            where: { userId },
            select: {
                action: true,
                metadata: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Fetch payments
        const payments = await prisma.payment.findMany({
            where: { userId },
            select: {
                id: true,
                amount: true,
                status: true,
                provider: true,
                transactionId: true,
                createdAt: true,
                course: {
                    select: { title: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate engagement metrics
        const totalLessonsStarted = lessonProgress.length;
        const totalLessonsCompleted = lessonProgress.filter(lp => lp.isCompleted).length;
        const totalWatchTimeMinutes = lessonProgress.reduce((acc, lp) => acc + (lp.watchTime || 0), 0) / 60;
        const firstLessonDate = lessonProgress.length > 0
            ? lessonProgress.reduce((earliest, lp) =>
                lp.completedAt && (!earliest || lp.completedAt < earliest) ? lp.completedAt : earliest,
                null as Date | null
            )
            : null;

        // Build evidence package
        const evidence = {
            generatedAt: new Date().toISOString(),
            generatedBy: session.user.email,

            // Customer Identification
            customer: {
                userId: user.id,
                email: user.email,
                fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                phone: user.phone,
                accountCreatedAt: user.createdAt?.toISOString(),
            },

            // Legal Agreement Proof
            legalAcceptance: {
                termsOfServiceAcceptedAt: user.tosAcceptedAt?.toISOString(),
                termsOfServiceVersion: user.tosVersion,
                refundPolicyAcceptedAt: user.refundPolicyAcceptedAt?.toISOString(),
                refundPolicyVersion: user.refundPolicyVersion,
                acceptanceNote: user.tosAcceptedAt
                    ? "Customer accepted Terms of Service and Refund Policy at time of purchase via ClickFunnels checkout."
                    : "TOS acceptance not recorded (legacy account).",
            },

            // Device & IP Evidence
            deviceEvidence: {
                registrationIp: user.registrationIp,
                registrationUserAgent: user.registrationUserAgent,
                registrationDevice: user.registrationDevice,
                registrationBrowser: user.registrationBrowser,
                note: "Device information captured at account creation/purchase.",
            },

            // Login & Access Evidence
            accessEvidence: {
                firstLoginAt: user.firstLoginAt?.toISOString(),
                lastLoginAt: user.lastLoginAt?.toISOString(),
                totalLogins: user.loginCount,
                accessNote: user.loginCount && user.loginCount > 0
                    ? `Customer logged in ${user.loginCount} times. First: ${user.firstLoginAt?.toISOString() || "N/A"}, Last: ${user.lastLoginAt?.toISOString() || "N/A"}`
                    : "No login activity recorded.",
            },

            // Course Enrollment Proof
            enrollmentEvidence: {
                totalEnrollments: user.enrollments.length,
                enrollments: user.enrollments.map(e => ({
                    course: e.course.title,
                    enrolledAt: e.enrolledAt?.toISOString(),
                    progress: `${Math.round(e.progress || 0)}%`,
                    status: e.status,
                    lastAccessed: e.lastAccessedAt?.toISOString(),
                    completedAt: e.completedAt?.toISOString(),
                })),
            },

            // Content Consumption Proof
            engagementEvidence: {
                lessonsStarted: totalLessonsStarted,
                lessonsCompleted: totalLessonsCompleted,
                estimatedWatchTime: `${Math.round(totalWatchTimeMinutes)} minutes`,
                firstContentAccess: firstLessonDate?.toISOString(),
                certificatesEarned: user.certificates.length,
                certificates: user.certificates.map(c => ({
                    course: c.course.title,
                    issuedAt: c.issuedAt?.toISOString(),
                })),
                engagementNote: totalLessonsStarted > 0
                    ? `Customer accessed ${totalLessonsStarted} lessons, completed ${totalLessonsCompleted}. This demonstrates active use of the digital product.`
                    : "No lesson engagement recorded.",
            },

            // Payment History
            paymentHistory: {
                totalPayments: payments.length,
                payments: payments.map(p => ({
                    amount: `$${(p.amount / 100).toFixed(2)}`,
                    status: p.status,
                    provider: p.provider,
                    transactionId: p.transactionId,
                    course: p.course?.title,
                    date: p.createdAt?.toISOString(),
                })),
            },

            // Activity Timeline (last 50)
            activityTimeline: activityLog.slice(0, 50).map(a => ({
                action: a.action,
                timestamp: a.createdAt?.toISOString(),
                ip: a.ipAddress,
                details: typeof a.metadata === "object" ? a.metadata : null,
            })),

            // Dispute Status
            disputeStatus: {
                hasDisputeTag: user.tags.some(t => t.tag === "dispute_filed"),
                disputeFiledAt: user.tags.find(t => t.tag === "dispute_filed")?.createdAt?.toISOString(),
            },

            // Summary for Card Company
            executiveSummary: `
Customer ${user.firstName} ${user.lastName} (${user.email}) purchased digital course access on ${user.createdAt?.toISOString()?.split('T')[0] || 'N/A'}.

LEGAL ACCEPTANCE:
- Terms of Service accepted: ${user.tosAcceptedAt ? "YES (" + user.tosAcceptedAt.toISOString() + ")" : "Not recorded (legacy)"}
- Refund Policy accepted: ${user.refundPolicyAcceptedAt ? "YES (" + user.refundPolicyAcceptedAt.toISOString() + ")" : "Not recorded (legacy)"}

PRODUCT ACCESS:
- Total logins: ${user.loginCount || 0}
- Courses enrolled: ${user.enrollments.length}
- Lessons accessed: ${totalLessonsStarted}
- Lessons completed: ${totalLessonsCompleted}
- Watch time: ~${Math.round(totalWatchTimeMinutes)} minutes
- Certificates earned: ${user.certificates.length}

CONCLUSION:
The customer ${totalLessonsStarted > 0 ? "ACCESSED AND USED" : "DID NOT ACCESS"} the digital product after purchase. ${user.tosAcceptedAt ? "Terms and refund policy were accepted at checkout." : ""} Full activity log and device evidence attached.
      `.trim(),
        };

        return NextResponse.json(evidence);
    } catch (error) {
        console.error("Error generating dispute evidence:", error);
        return NextResponse.json(
            { error: "Failed to generate evidence" },
            { status: 500 }
        );
    }
}
