import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { PostDetailClient } from "@/components/community/post-detail-client";

async function getPost(postId: string, userId: string) {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          bio: true,
        },
      },
      comments: {
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
          likes: {
            where: { userId },
            select: { id: true },
          },
          reactions: {
            select: {
              emoji: true,
              userId: true,
            },
          },
          replies: {
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
              likes: {
                where: { userId },
                select: { id: true },
              },
              reactions: {
                select: {
                  emoji: true,
                  userId: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        where: { parentId: null }, // Only get top-level comments
        orderBy: { createdAt: "asc" },
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  if (post) {
    // Increment view count
    await prisma.communityPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });
  }

  return post;
}

// Helper to get reaction counts
function getReactionCounts(reactions: { emoji: string; userId: string }[]) {
  const counts: Record<string, number> = {};
  reactions.forEach((r) => {
    counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  });
  return counts;
}

// Helper to get user's reactions
function getUserReactions(reactions: { emoji: string; userId: string }[], userId: string) {
  return reactions.filter((r) => r.userId === userId).map((r) => r.emoji);
}

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const post = await getPost(id, session.user.id);

  if (!post) {
    notFound();
  }

  // Transform the post data for the client
  const postData = {
    id: post.id,
    title: post.title,
    content: post.content,
    isPinned: post.isPinned,
    viewCount: post.viewCount + 1, // Include the current view
    likeCount: post.likeCount,
    createdAt: post.createdAt,
    author: post.author,
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
      author: comment.author,
      likeCount: comment.likeCount,
      isLiked: comment.likes.length > 0,
      reactions: getReactionCounts(comment.reactions),
      userReactions: getUserReactions(comment.reactions, session.user.id),
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        parentId: reply.parentId,
        author: reply.author,
        likeCount: reply.likeCount,
        isLiked: reply.likes.length > 0,
        reactions: getReactionCounts(reply.reactions),
        userReactions: getUserReactions(reply.reactions, session.user.id),
        replies: [] as never[],
      })),
    })),
    isLiked: post.likes.length > 0,
    totalComments: post._count.comments,
  };

  return (
    <PostDetailClient
      post={postData}
      currentUserId={session.user.id}
    />
  );
}
