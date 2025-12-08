import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Eye,
  Pin,
  Heart,
  Share2,
  Flag,
  MoreHorizontal,
} from "lucide-react";
import { CommentForm } from "@/components/community/comment-form";

async function getPost(postId: string) {
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
        },
        orderBy: { createdAt: "asc" },
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

  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="text-gray-600 hover:text-burgundy-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      {/* Post */}
      <Card className="card-premium">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-14 w-14 ring-2 ring-burgundy-100">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white font-semibold">
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </span>
                {post.author.role !== "STUDENT" && (
                  <Badge className="bg-gold-100 text-gold-700 border-gold-200 text-xs">
                    {post.author.role}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.viewCount} views
                </span>
              </div>
            </div>
            {post.isPinned && (
              <Badge className="bg-gold-100 text-gold-700 border-gold-200">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Content */}
          <div className="prose prose-gray max-w-none mb-6">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
            <Button variant="ghost" className="text-gray-500 hover:text-burgundy-600">
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button variant="ghost" className="text-gray-500 hover:text-burgundy-600">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700 ml-auto">
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="card-premium">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-burgundy-600" />
            {post.comments.length} {post.comments.length === 1 ? "Reply" : "Replies"}
          </h3>

          {/* Comment Form */}
          <CommentForm postId={post.id} />

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="mt-8 space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={comment.author.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm">
                      {getInitials(comment.author.firstName, comment.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        {comment.author.role !== "STUDENT" && (
                          <Badge variant="outline" className="text-xs">
                            {comment.author.role}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mt-6 border-t border-gray-100">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No replies yet. Be the first to respond!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
