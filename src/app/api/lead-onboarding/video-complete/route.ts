import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Mark welcome video as watched
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get niche from request body (optional)
        let niche: string | undefined;
        try {
            const body = await request.json();
            niche = body.niche;
        } catch {
            // No body or invalid JSON - use default behavior
        }

        // If niche is provided, use niche-specific tag instead of shared LeadOnboarding
        if (niche) {
            const tag = `${niche}-video-watched`;
            await prisma.userTag.upsert({
                where: {
                    userId_tag: {
                        userId: session.user.id,
                        tag,
                    },
                },
                update: {},
                create: {
                    userId: session.user.id,
                    tag,
                },
            });

            return NextResponse.json({
                success: true,
                message: "Video marked as watched",
                tag,
            });
        }

        // Fallback: Upsert shared lead onboarding record (for backward compatibility)
        const onboarding = await prisma.leadOnboarding.upsert({
            where: { userId: session.user.id },
            update: {
                watchedVideo: true,
                watchedVideoAt: new Date(),
            },
            create: {
                userId: session.user.id,
                watchedVideo: true,
                watchedVideoAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Video marked as watched",
            onboarding,
        });
    } catch (error) {
        console.error("[lead-onboarding/video-complete] Error:", error);
        return NextResponse.json(
            { error: "Failed to update video status" },
            { status: 500 }
        );
    }
}
