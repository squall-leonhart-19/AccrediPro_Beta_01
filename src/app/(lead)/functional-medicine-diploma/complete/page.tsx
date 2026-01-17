import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompleteClient } from "./complete-client";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        score?: string;
        scholarship?: string;
        skipped?: string;
    }>;
}

async function getCompletionData(userId: string, scoreParam?: string) {
    const [user, completionTags, latestExam] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                miniDiplomaCategory: true,
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "functional-medicine-lesson-complete:" },
            },
        }),
        // Get the most recent exam attempt with scholarship info
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId,
                category: "fm-healthcare",
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // Get current month spots
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const spotRecord = await prisma.scholarshipSpot.findUnique({
        where: {
            month_year_category: {
                month,
                year,
                category: "fm-healthcare",
            },
        },
    });

    const spotsRemaining = spotRecord
        ? spotRecord.totalSpots - spotRecord.usedSpots
        : 3;

    return {
        user,
        completedLessons: completionTags.length,
        latestExam,
        spotsRemaining,
    };
}

export default async function CompletePage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const params = await searchParams;
    const scoreParam = params.score;
    const scholarshipParam = params.scholarship;
    const skippedParam = params.skipped;

    const { user, completedLessons, latestExam, spotsRemaining } = await getCompletionData(
        session.user.id,
        scoreParam
    );
    if (!user) redirect("/login");

    // Check if they have completed enough lessons (at least 8 to access last lesson)
    // Note: They might come here directly from exam without marking lesson 9 complete yet
    const hasAccessToComplete = completedLessons >= 8;

    if (!hasAccessToComplete) {
        redirect("/functional-medicine-diploma");
    }

    // Determine exam score and scholarship status
    const examScore = scoreParam ? parseInt(scoreParam) : latestExam?.score || 0;
    const scholarshipQualified =
        scholarshipParam === "1" || latestExam?.scholarshipQualified || false;
    const skipped = skippedParam === "1";

    // Get coupon info if scholarship qualified
    let couponCode: string | undefined;
    let couponExpiresAt: string | undefined;

    if (scholarshipQualified && latestExam) {
        // Check if the coupon is still valid
        const now = new Date();
        if (
            latestExam.scholarshipCouponCode &&
            latestExam.scholarshipExpiresAt &&
            new Date(latestExam.scholarshipExpiresAt) > now
        ) {
            couponCode = latestExam.scholarshipCouponCode;
            couponExpiresAt = latestExam.scholarshipExpiresAt.toISOString();
        }
    }

    return (
        <CompleteClient
            firstName={user.firstName || "there"}
            diplomaName="Functional Medicine"
            examScore={examScore}
            scholarshipQualified={scholarshipQualified && !!couponCode}
            couponCode={couponCode}
            couponExpiresAt={couponExpiresAt}
            spotsRemaining={spotsRemaining}
            skipped={skipped}
        />
    );
}
