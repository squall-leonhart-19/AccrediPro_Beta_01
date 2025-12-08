import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommunityClient } from "@/components/community/community-client";

async function getPosts() {
  return prisma.communityPost.findMany({
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
        select: { comments: true },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 30,
  });
}

async function getStats() {
  const [totalMembers, totalPosts, totalComments, activeToday] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.communityPost.count(),
    prisma.postComment.count(),
    prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return { totalMembers, totalPosts, totalComments, activeToday };
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [posts, stats] = await Promise.all([getPosts(), getStats()]);

  // Transform posts for client component
  const postsData = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.categoryId || "general",
    isPinned: post.isPinned,
    viewCount: post.viewCount,
    createdAt: post.createdAt,
    author: post.author,
    _count: post._count,
  }));

  return <CommunityClient posts={postsData} stats={stats} />;
}
