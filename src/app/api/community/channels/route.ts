import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/community/channels
 * Returns all community channels grouped by global and category
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");

        // Fetch all channels
        const channels = await prisma.communityChannel.findMany({
            where: categoryId
                ? { OR: [{ isGlobal: true }, { categoryId }] }
                : undefined,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    },
                },
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: [
                { isGlobal: "desc" },
                { sortOrder: "asc" },
            ],
        });

        // Group channels
        const globalChannels = channels.filter((c) => c.isGlobal);

        // Group by category
        const categoryChannelsMap = new Map<string, typeof channels>();
        channels
            .filter((c) => !c.isGlobal && c.category)
            .forEach((c) => {
                const key = c.category!.id;
                if (!categoryChannelsMap.has(key)) {
                    categoryChannelsMap.set(key, []);
                }
                categoryChannelsMap.get(key)!.push(c);
            });

        // Convert to structured response
        const categoryChannels = Array.from(categoryChannelsMap.entries()).map(([catId, chs]) => ({
            category: chs[0].category,
            channels: chs.map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                emoji: c.emoji,
                type: c.type,
                isLocked: c.isLocked,
                adminOnly: c.adminOnly,
                postCount: c._count.posts,
            })),
        }));

        return NextResponse.json({
            success: true,
            data: {
                global: globalChannels.map((c) => ({
                    id: c.id,
                    slug: c.slug,
                    name: c.name,
                    emoji: c.emoji,
                    type: c.type,
                    description: c.description,
                    isLocked: c.isLocked,
                    adminOnly: c.adminOnly,
                    autoPost: c.autoPost,
                    postCount: c._count.posts,
                })),
                categories: categoryChannels,
            },
        });
    } catch (error) {
        console.error("Get channels error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch channels" },
            { status: 500 }
        );
    }
}
