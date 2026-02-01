import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/track/open/[emailSendId]
 * Track email opens via 1x1 transparent pixel
 * Returns a 1x1 transparent GIF
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { emailSendId: string } }
) {
    const { emailSendId } = params;

    // Update open tracking in background (don't block response)
    if (emailSendId && emailSendId !== "preview") {
        // Fire and forget - don't await
        prisma.emailSend
            .update({
                where: { id: emailSendId },
                data: {
                    openedAt: new Date(),
                    openCount: { increment: 1 },
                },
            })
            .catch((err) => {
                console.error(`[Email Track] Open tracking failed for ${emailSendId}:`, err);
            });
    }

    // Return 1x1 transparent GIF
    const transparentGif = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
    );

    return new NextResponse(transparentGif, {
        status: 200,
        headers: {
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });
}
