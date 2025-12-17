import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommunityClient } from "@/components/community/community-client";

// Get user's enrolled communities based on their course enrollments
async function getUserCommunities(userId: string) {
  // Get user's enrollments with course categories
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: {
            include: {
              community: true,
            },
          },
        },
      },
    },
  });

  // Extract unique communities from enrollments
  const communityIds = new Set<string>();
  const communities: Array<{
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    categoryColor: string | null;
    memberCount: number;
  }> = [];

  for (const enrollment of enrollments) {
    const community = enrollment.course.category?.community;
    if (community && !communityIds.has(community.id)) {
      communityIds.add(community.id);
      communities.push({
        id: community.id,
        name: community.name,
        categoryId: enrollment.course.category!.id,
        categoryName: enrollment.course.category!.name,
        categoryColor: enrollment.course.category!.color,
        memberCount: community.memberCount,
      });
    }
  }

  return communities;
}

// Get all posts - community is open to everyone
async function getPosts() {
  return prisma.communityPost.findMany({
    where: {},
    select: {
      id: true,
      title: true,
      content: true,
      isPinned: true,
      isLocked: true,
      viewCount: true,
      likeCount: true,
      reactions: true, // Get stored reactions
      categoryId: true,
      communityId: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
        },
      },
      community: {
        include: {
          category: true,
        },
      },
      _count: {
        select: {
          comments: { where: { parentId: null } }, // Only count top-level comments
          likes: true
        },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
}

async function getStats() {
  // Get community stats - everyone sees the same stats
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

// Get all communities for admins
async function getAllCommunities() {
  return prisma.categoryCommunity.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "MENTOR";

  // Get user's communities based on enrollments
  let communities = await getUserCommunities(session.user.id);

  // Admins see all communities
  if (isAdmin) {
    const allCommunities = await getAllCommunities();
    communities = allCommunities.map(c => ({
      id: c.id,
      name: c.name,
      categoryId: c.categoryId,
      categoryName: c.category.name,
      categoryColor: c.category.color,
      memberCount: c.memberCount,
    }));
  }

  const [posts, stats] = await Promise.all([
    getPosts(),
    getStats(),
  ]);

  // Transform posts for client component
  const postsData = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.categoryId || "general",
    communityId: post.communityId,
    communityName: post.community?.name,
    categoryName: post.community?.category?.name,
    categoryColor: post.community?.category?.color,
    isPinned: post.isPinned,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    reactions: post.reactions as Record<string, number> | null, // Pass stored reactions
    createdAt: post.createdAt,
    author: post.author,
    _count: post._count,
  }));

  return (
    <CommunityClient
      posts={postsData}
      stats={stats}
      communities={communities}
      isAdmin={isAdmin}
    />
  );
}
