import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryCommunityClient } from "@/components/community/category-community-client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
  if (channelType && category.channels.length > 0) {
    const matchingChannel = category.channels.find(c => c.type === channelType);
    if (matchingChannel) {
      channelIds = [matchingChannel.id];
    }
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
        ...(channelType ? [{ categoryId: channelType.toLowerCase() }] : []),
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

export default async function CategoryCommunityPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { slug } = await params;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "MENTOR";

  const data = await getCategoryPosts(slug);

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

  // Get category stats
  const stats = {
    totalPosts: posts.length,
    totalMembers: category.community?.memberCount || 0,
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
    />
  );
}
