import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/marketing/evergreen-stats
 * 
 * Returns stats for the evergreen buyer email sequences
 * by counting user tags that mark emails as sent
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get all email-related user tags for counting
        const allTags = await prisma.userTag.groupBy({
            by: ["tag"],
            _count: { userId: true },
            where: {
                tag: {
                    in: [
                        // Sprint sequence
                        "sprint_sprint_0h_sent",
                        "sprint_sprint_2h_sent",
                        "sprint_sprint_day1_sent",
                        "sprint_sprint_day2_sent",
                        "sprint_sprint_day3_sent",
                        "sprint_sprint_day5_sent",
                        // Recovery sequence
                        "recovery_3d_sent",
                        "recovery_5d_sent",
                        "recovery_7d_sent",
                        "recovery_14d_sent",
                        "recovery_30d_sent",
                        // Stalled sequence
                        "stalled_3d_sent",
                        "stalled_5d_sent",
                        "stalled_7d_sent",
                        "stalled_14d_sent",
                        // Milestone emails
                        "milestone_module1_sent",
                        "milestone_25_sent",
                        "milestone_50_sent",
                        "milestone_90_sent",
                        "milestone_complete_sent",
                        // Re-engagement
                        "reengagement_7d_sent",
                    ]
                }
            }
        });

        const tagCounts = Object.fromEntries(allTags.map(t => [t.tag, t._count.userId]));

        // Aggregate by sequence
        const sprintSent =
            (tagCounts["sprint_sprint_0h_sent"] || 0) +
            (tagCounts["sprint_sprint_2h_sent"] || 0) +
            (tagCounts["sprint_sprint_day1_sent"] || 0) +
            (tagCounts["sprint_sprint_day2_sent"] || 0) +
            (tagCounts["sprint_sprint_day3_sent"] || 0) +
            (tagCounts["sprint_sprint_day5_sent"] || 0);

        const recoverySent =
            (tagCounts["recovery_3d_sent"] || 0) +
            (tagCounts["recovery_5d_sent"] || 0) +
            (tagCounts["recovery_7d_sent"] || 0) +
            (tagCounts["recovery_14d_sent"] || 0) +
            (tagCounts["recovery_30d_sent"] || 0);

        const stalledSent =
            (tagCounts["stalled_3d_sent"] || 0) +
            (tagCounts["stalled_5d_sent"] || 0) +
            (tagCounts["stalled_7d_sent"] || 0) +
            (tagCounts["stalled_14d_sent"] || 0);

        const milestoneSent =
            (tagCounts["milestone_module1_sent"] || 0) +
            (tagCounts["milestone_25_sent"] || 0) +
            (tagCounts["milestone_50_sent"] || 0) +
            (tagCounts["milestone_90_sent"] || 0) +
            (tagCounts["milestone_complete_sent"] || 0);

        const reengagementSent = tagCounts["reengagement_7d_sent"] || 0;

        const totalSent = sprintSent + recoverySent + stalledSent + milestoneSent + reengagementSent;

        // Get total buyers (students)
        const totalBuyers = await prisma.user.count({
            where: { userType: "STUDENT", isFakeProfile: false }
        });

        // Get buyers who never logged in
        const neverLoggedIn = await prisma.user.count({
            where: { userType: "STUDENT", isFakeProfile: false, firstLoginAt: null }
        });

        // Get buyers with some progress
        const withProgress = await prisma.enrollment.count({
            where: {
                progress: { gt: 0 },
                user: { userType: "STUDENT", isFakeProfile: false }
            }
        });

        return NextResponse.json({
            sequences: {
                sprint: {
                    name: "Sprint Sequence",
                    emails: 6,
                    sent: sprintSent,
                    description: "Days 0-5 after purchase",
                },
                recovery: {
                    name: "Recovery Sequence",
                    emails: 5,
                    sent: recoverySent,
                    description: "Never logged in",
                },
                stalled: {
                    name: "Stalled Sequence",
                    emails: 4,
                    sent: stalledSent,
                    description: "Logged in, no progress",
                },
                milestone: {
                    name: "Milestone Emails",
                    emails: 5,
                    sent: milestoneSent,
                    description: "Progress achievements",
                },
                reengagement: {
                    name: "Re-engagement",
                    emails: 1,
                    sent: reengagementSent,
                    description: "Welcome back",
                },
            },
            totals: {
                totalBuyers,
                neverLoggedIn,
                withProgress,
                totalSent,
            },
            emailBreakdown: tagCounts,
        });

    } catch (error) {
        console.error("[evergreen-stats] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
