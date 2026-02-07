import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Only these emails can reset exams (dev/testing)
const ALLOWED_RESET_EMAILS = ["at.seed019@gmail.com"];

/**
 * POST /api/mini-diploma/exam/reset
 *
 * Reset exam results for testing. Only allowed for specific test emails.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get user email
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (!user || !ALLOWED_RESET_EMAILS.includes(user.email)) {
            return NextResponse.json({ error: "Not allowed" }, { status: 403 });
        }

        const body = await request.json();
        const { category } = body;

        if (!category) {
            return NextResponse.json({ error: "Missing category" }, { status: 400 });
        }

        // Delete all exam records for this user + category
        const deleted = await prisma.miniDiplomaExam.deleteMany({
            where: { userId, category },
        });

        // Also remove exam-related tags
        await prisma.userTag.deleteMany({
            where: {
                userId,
                tag: {
                    in: [
                        `exam_passed:${category}`,
                        `scholarship_qualified:${category}`,
                    ],
                },
            },
        }).catch(() => {});

        // Remove exam-passed-at tags
        await prisma.userTag.deleteMany({
            where: {
                userId,
                tag: { startsWith: "exam-passed-at:" },
            },
        }).catch(() => {});

        console.log(`[EXAM RESET] ${user.email} reset ${deleted.count} exam records for category: ${category}`);

        return NextResponse.json({
            success: true,
            deletedCount: deleted.count,
        });
    } catch (error) {
        console.error("[EXAM RESET] Error:", error);
        return NextResponse.json({ error: "Reset failed" }, { status: 500 });
    }
}
