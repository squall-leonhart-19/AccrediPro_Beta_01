import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/track/click/[emailSendId]
 * Track email link clicks and redirect to target URL
 * Query param: url (required) - the destination URL
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { emailSendId: string } }
) {
    const { emailSendId } = params;
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Decode the URL
    const targetUrl = decodeURIComponent(url);

    // Update click tracking in background (don't block redirect)
    if (emailSendId && emailSendId !== "preview") {
        prisma.emailSend
            .update({
                where: { id: emailSendId },
                data: {
                    clickedAt: new Date(),
                    clickCount: { increment: 1 },
                    clickedLinks: { push: targetUrl },
                },
            })
            .catch((err) => {
                console.error(`[Email Track] Click tracking failed for ${emailSendId}:`, err);
            });
    }

    // Redirect to target URL
    return NextResponse.redirect(targetUrl);
}
