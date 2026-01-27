import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/mini-diploma/graduates/posts
 * Fetch graduate posts (zombie + real) for the channel
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        const posts = await prisma.graduatePost.findMany({
            where: {
                isActive: true,
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        avatar: true,
                        location: true,
                        incomeLevel: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: [
                { isPinned: "desc" },
                { postedAt: "desc" },
            ],
            take: limit,
            skip: offset,
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Error fetching graduate posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/mini-diploma/graduates/posts
 * Create a new graduate post (real users only, must be graduate)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user is a graduate (completed mini diploma)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                miniDiplomaCompletedAt: true,
                firstName: true,
            },
        });

        if (!user?.miniDiplomaCompletedAt) {
            return NextResponse.json(
                { error: "You must complete your Mini Diploma to post" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { content, postType = "tip", imageUrl } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const post = await prisma.graduatePost.create({
            data: {
                userId,
                postType,
                content: content.trim(),
                imageUrl,
                postedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error creating graduate post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
