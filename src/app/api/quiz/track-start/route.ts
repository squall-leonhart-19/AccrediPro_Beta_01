import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/quiz/track-start
 *
 * Tracks quiz progress: page views + per-question advancement.
 * Uses ChatOptin table with page prefix "quiz-start-" for storage.
 * Deduplicates by visitorId — each unique visitor only counted once.
 *
 * Page format: quiz-start-depth-method?v=A&q=5
 *   - v = variant (A/B test)
 *   - q = highest question answered (0 = just landed, 1-11 = answered Q1-Q11)
 *
 * Body: { visitorId, variant?, page?, questionReached? }
 */
export async function POST(req: NextRequest) {
    try {
        const { visitorId, variant, page, questionReached } = await req.json();

        if (!visitorId) {
            return NextResponse.json({ error: "visitorId required" }, { status: 400 });
        }

        const basePage = `quiz-start-${page || "depth-method"}`;
        const q = questionReached ?? 0;

        // Build page string with params
        const params = new URLSearchParams();
        if (variant) params.set("v", variant);
        params.set("q", String(q));
        const trackingPage = `${basePage}?${params.toString()}`;

        // Upsert — only creates one record per visitorId
        // On update: only advance q (never go backwards)
        const existing = await prisma.chatOptin.findUnique({
            where: { visitorId },
            select: { page: true },
        });

        if (existing) {
            // Parse current q value
            const currentPage = existing.page || "";
            const currentQMatch = currentPage.match(/[?&]q=(\d+)/);
            const currentQ = currentQMatch ? parseInt(currentQMatch[1], 10) : 0;

            // Only update if new q is higher (don't go backwards)
            if (q > currentQ) {
                await prisma.chatOptin.update({
                    where: { visitorId },
                    data: { page: trackingPage },
                });
            }
        } else {
            await prisma.chatOptin.create({
                data: {
                    visitorId,
                    name: "Quiz Visitor",
                    page: trackingPage,
                },
            });
        }

        return NextResponse.json({ tracked: true });
    } catch (error) {
        console.error("[Quiz Track Start] Error:", error);
        return NextResponse.json({ tracked: false }, { status: 500 });
    }
}
