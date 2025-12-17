import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/debug/sequence-check
 * Check why sequence emails aren't being sent
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (for security)
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();

        // Get all sequence enrollments
        const enrollments = await prisma.sequenceEnrollment.findMany({
            where: { status: "ACTIVE" },
            include: {
                user: { select: { email: true, firstName: true } },
                sequence: {
                    select: {
                        name: true,
                        isActive: true,
                        emails: {
                            select: { id: true, customSubject: true, isActive: true, order: true },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
            take: 50,
        });

        const analysis = enrollments.map((e) => {
            const currentEmail = e.sequence.emails[e.currentEmailIndex];
            const nextSendDate = e.nextSendAt ? new Date(e.nextSendAt) : null;
            const isReadyToSend = nextSendDate ? nextSendDate <= now : false;
            const minutesUntilSend = nextSendDate
                ? Math.round((nextSendDate.getTime() - now.getTime()) / (1000 * 60))
                : null;

            return {
                email: e.user.email,
                firstName: e.user.firstName,
                sequenceName: e.sequence.name,
                sequenceActive: e.sequence.isActive,
                currentEmailIndex: e.currentEmailIndex,
                totalEmails: e.sequence.emails.length,
                currentEmailSubject: currentEmail?.customSubject || "N/A",
                currentEmailActive: currentEmail?.isActive ?? "N/A",
                nextSendAt: e.nextSendAt?.toISOString() || null,
                isReadyToSend,
                minutesUntilSend,
                enrolledAt: e.enrolledAt?.toISOString() || "N/A",
                emailsReceived: e.emailsReceived,
            };
        });

        // Summarize issues
        const issues = [];
        const readyToSend = analysis.filter((a) => a.isReadyToSend);
        const inactiveSequences = analysis.filter((a) => !a.sequenceActive);
        const inactiveEmails = analysis.filter((a) => a.currentEmailActive === false);
        const futureEmails = analysis.filter((a) => !a.isReadyToSend && a.minutesUntilSend !== null);

        if (readyToSend.length === 0) {
            issues.push("No enrollments ready to send (all nextSendAt in future)");
        }
        if (inactiveSequences.length > 0) {
            issues.push(`${inactiveSequences.length} enrollments in inactive sequences`);
        }
        if (inactiveEmails.length > 0) {
            issues.push(`${inactiveEmails.length} enrollments at inactive email step`);
        }

        return NextResponse.json({
            timestamp: now.toISOString(),
            totalEnrollments: enrollments.length,
            readyToSend: readyToSend.length,
            issues,
            summary: {
                waitingForTime: futureEmails.length,
                inactiveSequence: inactiveSequences.length,
                inactiveEmail: inactiveEmails.length,
            },
            enrollments: analysis.slice(0, 20),
        });
    } catch (error) {
        console.error("Debug error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
