import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Whitelist of test emails that can reset their progress
const TEST_ACCOUNTS = [
    "tortolialessio1997@gmail.com",
    "alessio@accredipro.academy"
];

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only allow whitelisted test accounts
        if (!TEST_ACCOUNTS.includes(session.user.email.toLowerCase())) {
            return NextResponse.json({ error: "Not authorized for this action" }, { status: 403 });
        }

        const body = await req.json();
        const { niche } = body;

        if (!niche) {
            return NextResponse.json({ error: "Niche is required" }, { status: 400 });
        }

        const userId = session.user.id;

        // 1. Delete exam results for this niche
        const deletedExams = await prisma.miniDiplomaExam.deleteMany({
            where: {
                userId: userId,
                category: niche
            }
        });

        // 2. Delete lesson completion tags for this niche
        const deletedTags = await prisma.userTag.deleteMany({
            where: {
                userId: userId,
                tag: {
                    contains: niche
                }
            }
        });

        console.log(`[RESET PROGRESS] User ${session.user.email} reset progress for ${niche}:`, {
            deletedExams: deletedExams.count,
            deletedTags: deletedTags.count
        });

        return NextResponse.json({
            success: true,
            message: `Progress reset for ${niche}`,
            deletedExams: deletedExams.count,
            deletedTags: deletedTags.count
        });

    } catch (error) {
        console.error("[RESET PROGRESS ERROR]", error);
        return NextResponse.json({ error: "Failed to reset progress" }, { status: 500 });
    }
}
