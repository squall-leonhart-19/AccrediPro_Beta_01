import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/mini-diploma/graduates/posts/[id]/like
 * Like a graduate post
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Increment likes (simple approach - no tracking who liked)
        const post = await prisma.graduatePost.update({
            where: { id },
            data: {
                likes: { increment: 1 },
            },
        });

        return NextResponse.json({ likes: post.likes });
    } catch (error) {
        console.error("Error liking post:", error);
        return NextResponse.json(
            { error: "Failed to like post" },
            { status: 500 }
        );
    }
}
