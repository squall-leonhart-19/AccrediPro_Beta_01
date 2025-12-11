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
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        parentId: reply.parentId,
        author: reply.author,
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
