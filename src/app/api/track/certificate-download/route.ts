import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/track/certificate-download
 * Track when a user downloads a certificate
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { certificateId, certificateType, diplomaTitle } = await request.json();

        // Log the download
        console.log(`[CERTIFICATE DOWNLOAD] User ${session.user.id} (${session.user.email}) downloaded ${certificateType}: ${diplomaTitle} (${certificateId})`);

        // Create tag entry for tracking
        const downloadTag = `certificate_downloaded:${certificateType}:${new Date().toISOString().split("T")[0]}`;
        await prisma.userTag.upsert({
            where: {
                userId_tag: {
                    userId: session.user.id,
                    tag: downloadTag,
                },
            },
            create: {
                userId: session.user.id,
                tag: downloadTag,
                value: JSON.stringify({
                    certificateId,
                    certificateType,
                    diplomaTitle,
                    downloadedAt: new Date().toISOString(),
                }),
            },
            update: {},
        });

        // Update user's last activity
        await prisma.user.update({
            where: { id: session.user.id },
            data: { lastLoginAt: new Date() },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking certificate download:", error);
        // Don't return error to client - we don't want to block downloads
        return NextResponse.json({ success: true });
    }
}
