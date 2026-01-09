import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Mark review as completed
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { platform } = body; // 'trustpilot' or 'google'

        // Update lead onboarding record
        const onboarding = await prisma.leadOnboarding.upsert({
            where: { userId: session.user.id },
            update: {
                leftReview: true,
                leftReviewAt: new Date(),
                reviewPlatform: platform || "trustpilot",
            },
            create: {
                userId: session.user.id,
                leftReview: true,
                leftReviewAt: new Date(),
                reviewPlatform: platform || "trustpilot",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Review marked as completed",
            onboarding,
        });
    } catch (error) {
        console.error("[lead-onboarding/review-complete] Error:", error);
        return NextResponse.json(
            { error: "Failed to update review status" },
            { status: 500 }
        );
    }
}
