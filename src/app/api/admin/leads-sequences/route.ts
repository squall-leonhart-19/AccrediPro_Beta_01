import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/leads-sequences
 *
 * Email Sequence Analytics for Mini Diploma Leads
 * Returns:
 * - All sequences with aggregate stats
 * - Email-by-email breakdown with open/click/conversion rates
 * - Conversion attribution (which email drove the conversion)
 */
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const sequenceId = searchParams.get("sequenceId");

    // Get only mini diploma related sequences (started + completed triggers)
    const sequences = await prisma.sequence.findMany({
        where: {
            isActive: true,
            triggerType: {
                in: ["MINI_DIPLOMA_STARTED", "MINI_DIPLOMA_COMPLETED"],
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            triggerType: true,
            isActive: true,
            totalEnrolled: true,
            totalCompleted: true,
            totalExited: true,
            createdAt: true,
            emails: {
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    customSubject: true,
                    order: true,
                    delayDays: true,
                    delayHours: true,
                    sentCount: true,
                    openCount: true,
                    clickCount: true,
                    replyCount: true,
                    isActive: true,
                    emailTemplate: {
                        select: {
                            name: true,
                            subject: true,
                        },
                    },
                },
            },
            enrollments: {
                select: {
                    id: true,
                    status: true,
                    emailsReceived: true,
                    emailsOpened: true,
                    emailsClicked: true,
                    exitReason: true,
                    completedAt: true,
                    exitedAt: true,
                    user: {
                        select: {
                            id: true,
                            miniDiplomaOptinAt: true,
                            miniDiplomaCategory: true,
                            enrollments: {
                                where: {
                                    course: {
                                        OR: [
                                            { slug: { contains: "certification" } },
                                            { slug: { contains: "accelerator" } },
                                        ],
                                    },
                                },
                                select: { id: true, enrolledAt: true },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { totalEnrolled: "desc" },
    });

    // Process sequences and calculate additional metrics
    const enrichedSequences = sequences.map((seq) => {
        // Count mini diploma leads in this sequence
        const miniDiplomaEnrollments = seq.enrollments.filter(
            (e) => e.user.miniDiplomaOptinAt
        );

        // Calculate conversion: how many became paid
        const conversions = miniDiplomaEnrollments.filter(
            (e) => e.user.enrollments.length > 0
        );

        // Email-by-email stats
        const emailStats = seq.emails.map((email, idx) => {
            const subject = email.customSubject || email.emailTemplate?.subject || `Email ${idx + 1}`;
            const sent = email.sentCount;
            const opened = email.openCount;
            const clicked = email.clickCount;
            const replied = email.replyCount;

            return {
                id: email.id,
                order: email.order,
                subject,
                delayDays: email.delayDays,
                delayHours: email.delayHours,
                isActive: email.isActive,
                sent,
                opened,
                clicked,
                replied,
                openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
                clickRate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
                replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
                // Click-to-open rate (CTOR)
                ctor: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
            };
        });

        // Funnel analysis: how many people received each email in sequence
        const funnelData = seq.emails.map((email, idx) => {
            // Count enrollments that received at least this email
            const received = miniDiplomaEnrollments.filter(
                (e) => e.emailsReceived > idx
            ).length;
            return {
                emailIndex: idx + 1,
                subject: email.customSubject || email.emailTemplate?.subject || `Email ${idx + 1}`,
                received,
                dropoff: idx === 0 ? 0 :
                    miniDiplomaEnrollments.filter(e => e.emailsReceived === idx).length,
            };
        });

        return {
            id: seq.id,
            name: seq.name,
            slug: seq.slug,
            description: seq.description,
            triggerType: seq.triggerType,
            isActive: seq.isActive,
            totalEnrolled: seq.totalEnrolled,
            totalCompleted: seq.totalCompleted,
            totalExited: seq.totalExited,
            miniDiplomaLeads: miniDiplomaEnrollments.length,
            conversions: conversions.length,
            conversionRate: miniDiplomaEnrollments.length > 0
                ? Math.round((conversions.length / miniDiplomaEnrollments.length) * 100)
                : 0,
            emailCount: seq.emails.length,
            emails: emailStats,
            funnel: funnelData,
            // Aggregate email stats
            totalSent: emailStats.reduce((sum, e) => sum + e.sent, 0),
            totalOpened: emailStats.reduce((sum, e) => sum + e.opened, 0),
            totalClicked: emailStats.reduce((sum, e) => sum + e.clicked, 0),
            avgOpenRate: emailStats.length > 0
                ? Math.round(emailStats.reduce((sum, e) => sum + e.openRate, 0) / emailStats.length)
                : 0,
            avgClickRate: emailStats.length > 0
                ? Math.round(emailStats.reduce((sum, e) => sum + e.clickRate, 0) / emailStats.length)
                : 0,
        };
    });

    // If specific sequence requested, get more detailed data
    let sequenceDetail = null;
    if (sequenceId) {
        const detailedSequence = sequences.find((s) => s.id === sequenceId);
        if (detailedSequence) {
            // Get recent email sends for this sequence
            const recentSends = await prisma.emailSend.findMany({
                where: {
                    sequenceEmail: {
                        sequenceId: sequenceId,
                    },
                },
                select: {
                    id: true,
                    toEmail: true,
                    subject: true,
                    status: true,
                    sentAt: true,
                    openedAt: true,
                    clickedAt: true,
                    openCount: true,
                    clickCount: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            miniDiplomaCategory: true,
                        },
                    },
                    sequenceEmail: {
                        select: {
                            order: true,
                            customSubject: true,
                        },
                    },
                },
                orderBy: { sentAt: "desc" },
                take: 100,
            });

            sequenceDetail = {
                ...enrichedSequences.find((s) => s.id === sequenceId),
                recentSends: recentSends.map((send) => ({
                    id: send.id,
                    email: send.toEmail,
                    userName: `${send.user.firstName || ""} ${send.user.lastName || ""}`.trim() || "Unknown",
                    userId: send.user.id,
                    category: send.user.miniDiplomaCategory,
                    emailOrder: send.sequenceEmail?.order,
                    subject: send.subject,
                    status: send.status,
                    sentAt: send.sentAt?.toISOString(),
                    openedAt: send.openedAt?.toISOString(),
                    clickedAt: send.clickedAt?.toISOString(),
                    opens: send.openCount,
                    clicks: send.clickCount,
                })),
            };
        }
    }

    // Calculate overall stats
    const overallStats = {
        totalSequences: enrichedSequences.length,
        activeSequences: enrichedSequences.filter((s) => s.isActive).length,
        totalEmailsSent: enrichedSequences.reduce((sum, s) => sum + s.totalSent, 0),
        totalOpens: enrichedSequences.reduce((sum, s) => sum + s.totalOpened, 0),
        totalClicks: enrichedSequences.reduce((sum, s) => sum + s.totalClicked, 0),
        avgOpenRate: enrichedSequences.length > 0
            ? Math.round(enrichedSequences.reduce((sum, s) => sum + s.avgOpenRate, 0) / enrichedSequences.length)
            : 0,
        avgClickRate: enrichedSequences.length > 0
            ? Math.round(enrichedSequences.reduce((sum, s) => sum + s.avgClickRate, 0) / enrichedSequences.length)
            : 0,
        totalConversions: enrichedSequences.reduce((sum, s) => sum + s.conversions, 0),
    };

    return NextResponse.json({
        overallStats,
        sequences: enrichedSequences,
        sequenceDetail,
    });
}
