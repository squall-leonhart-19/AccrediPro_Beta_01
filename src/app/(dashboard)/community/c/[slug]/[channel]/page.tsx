import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryCommunityClient } from "@/components/community/category-community-client";
import { BusinessAcademyTeaser } from "@/components/community/business-academy-teaser";
import { UniversityDegreesTeaser } from "@/components/community/university-degrees-teaser";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string; channel: string }>;
}

// Map URL channel slugs to channel types
const CHANNEL_MAP: Record<string, string> = {
    introductions: "INTRODUCTIONS",
    wins: "WINS",
    graduates: "GRADUATES",
    questions: "QUESTIONS",
    tips: "TIPS",
    business: "BUSINESS",
    degrees: "DEGREES",
};

// Get posts for a specific category/channel
async function getCategoryPosts(categorySlug: string, channelType?: string) {
    const category = await prisma.category.findFirst({
        where: { slug: categorySlug },
        include: {
            channels: { orderBy: { sortOrder: 'asc' } },
            community: true,
        },
    });

    if (!category) return null;

    // Build channel filter
    let channelIds: string[] | undefined;
    let categoryIdFilter: string | undefined;

    if (channelType && category.channels.length > 0) {
        const matchingChannel = category.channels.find(c => c.type === channelType);
        if (matchingChannel) {
            channelIds = [matchingChannel.id];
        }
        // Also match by categoryId for posts that use that pattern
        categoryIdFilter = channelType.toLowerCase();
    } else {
        // Get all channel IDs for this category
        channelIds = category.channels.map(c => c.id);
    }

    // Get posts - either from channels or by categoryId matching common patterns
    const posts = await prisma.communityPost.findMany({
        where: {
            OR: [
                // Posts in category's channels
                ...(channelIds && channelIds.length > 0 ? [{ channelId: { in: channelIds } }] : []),
                // Posts with categoryId matching channel type patterns (introductions, wins, etc.)
                ...(categoryIdFilter ? [{ categoryId: categoryIdFilter }] : []),
            ],
        },
        include: {
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    comments: { where: { parentId: null } },
                    likes: true,
                },
            },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 50,
    });

    return { category, posts };
}

export default async function ChannelCommunityPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { slug, channel } = await params;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MENTOR";

    // Map URL channel to type
    const channelType = CHANNEL_MAP[channel];
    if (!channelType) {
        notFound();
    }

    // Business Academy - show teaser page instead of posts
    if (channelType === "BUSINESS") {
        const category = await prisma.category.findFirst({
            where: { slug: slug },
            select: { name: true, slug: true }
        });
        return (
            <BusinessAcademyTeaser
                categoryName={category?.name || "Functional Medicine"}
                categorySlug={slug}
            />
        );
    }

    // University Degrees - show premium teaser page
    if (channelType === "DEGREES") {
        const category = await prisma.category.findFirst({
            where: { slug: slug },
            select: { name: true }
        });
        return (
            <UniversityDegreesTeaser
                categoryName={category?.name || "Functional Medicine"}
            />
        );
    }

    const data = await getCategoryPosts(slug, channelType);

    if (!data || !data.category) {
        notFound();
    }

    const { category, posts } = data;

    // Transform posts for client
    const postsData = posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.categoryId || "general",
        channelId: post.channelId,
        isPinned: post.isPinned,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        reactions: post.reactions as Record<string, number> | null,
        createdAt: post.createdAt,
        author: post.author,
        _count: post._count,
    }));

    // Calculate dynamic stats
    const realUserCount = await prisma.user.count({
        where: { isFakeProfile: false }
    });

    // Stats formulas (approved)
    const membersBase = 2200;
    const totalMembers = membersBase + realUserCount;
    const certified = Math.floor(totalMembers * 0.85);

    // Coaches: deterministic daily number 17-30
    const today = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash = hash & hash;
    }
    const coaches = 17 + (Math.abs(hash) % 14);

    // Earnings: $25K per certified
    const earnings = certified * 25000;

    // Goal progress
    const goalTarget = 10000;
    const goalProgress = Math.min(100, Math.floor((certified / goalTarget) * 100));

    const stats = {
        totalPosts: posts.length,
        totalMembers,
        certified,
        coaches,
        earnings,
        goalTarget,
        goalProgress,
    };

    return (
        <CategoryCommunityClient
            category={{
                id: category.id,
                name: category.name,
                slug: category.slug,
                color: category.color,
                channels: category.channels.map(ch => ({
                    id: ch.id,
                    slug: ch.slug,
                    name: ch.name,
                    type: ch.type,
                    emoji: ch.emoji,
                })),
            }}
            posts={postsData}
            stats={stats}
            isAdmin={isAdmin}
            activeChannelType={channelType}
        />
    );
}
