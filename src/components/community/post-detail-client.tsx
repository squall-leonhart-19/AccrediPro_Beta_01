"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Eye,
  Pin,
  Heart,
  Share2,
  Reply,
  Send,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface Author {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string;
  bio?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: Author;
  replies: Comment[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  author: Author;
  comments: Comment[];
  isLiked: boolean;
  totalComments: number;
}

interface PostDetailClientProps {
  post: Post;
  currentUserId: string;
}

export function PostDetailClient({ post, currentUserId }: PostDetailClientProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white border-0 text-xs font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "INSTRUCTOR":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-xs font-medium">
            Instructor
          </Badge>
        );
      case "MENTOR":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Coach
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const response = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setLiked(liked);
        setLikeCount(likeCount);
      }
    } catch {
      // Revert on error
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentLoading) return;

    setCommentLoading(true);

    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: newComment }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        router.refresh();
      }
    } catch {
      // Handle error silently
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || commentLoading) return;

    setCommentLoading(true);

    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: replyContent, parentId }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyContent("");
        setReplyingTo(null);
        router.refresh();
      }
    } catch {
      // Handle error silently
    } finally {
      setCommentLoading(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="text-gray-600 hover:text-burgundy-600 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      {/* Main Post Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Author Header */}
        <div className="bg-gradient-to-r from-burgundy-50 via-white to-gold-50 p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white shadow-md">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white font-bold text-lg">
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-lg">
                  {post.author.firstName} {post.author.lastName}
                </span>
                {getRoleBadge(post.author.role)}
              </div>
              {post.author.bio && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{post.author.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {post.viewCount.toLocaleString()} views
                </span>
              </div>
            </div>
            {post.isPinned && (
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 border-0 font-medium">
                <Pin className="w-3.5 h-3.5 mr-1" />
                Pinned
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base md:text-lg">
              {post.content}
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={likeLoading}
                className={cn(
                  "gap-2 rounded-full px-4 transition-all",
                  liked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                )}
              >
                <Heart className={cn("w-5 h-5 transition-all", liked && "fill-current")} />
                <span className="font-medium">{likeCount}</span>
              </Button>
              <Button variant="ghost" className="gap-2 rounded-full px-4 text-gray-600 hover:text-burgundy-600 hover:bg-burgundy-50">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">{post.totalComments}</span>
              </Button>
            </div>
            <Button variant="ghost" className="gap-2 rounded-full text-gray-500 hover:text-gray-700">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-burgundy-600" />
              {post.totalComments} {post.totalComments === 1 ? "Comment" : "Comments"}
            </h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-8">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-medium">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[100px] rounded-xl border-2 border-gray-200 px-4 py-3 text-base placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-4 focus:ring-burgundy-500/10 resize-none transition-all"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="bg-burgundy-600 hover:bg-burgundy-700 rounded-full px-6"
                  >
                    {commentLoading ? (
                      "Posting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="group">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                      <AvatarImage src={comment.author.avatar || undefined} />
                      <AvatarFallback className={cn(
                        "font-medium text-sm",
                        comment.author.role !== "STUDENT"
                          ? "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900"
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "rounded-2xl p-4 transition-all",
                        comment.author.role !== "STUDENT"
                          ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      )}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          {getRoleBadge(comment.author.role)}
                          <span className="text-xs text-gray-400 ml-auto">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-2 ml-2">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-burgundy-600 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1.5 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium transition-colors"
                          >
                            {expandedReplies.has(comment.id) ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Hide {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                View {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-burgundy-200">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm flex-shrink-0">
                              <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-xs font-medium">
                                You
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${comment.author.firstName}...`}
                                className="w-full min-h-[80px] rounded-xl border-2 border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-4 focus:ring-burgundy-500/10 resize-none transition-all"
                                autoFocus
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                  }}
                                  className="rounded-full"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReply(comment.id)}
                                  disabled={commentLoading || !replyContent.trim()}
                                  className="bg-burgundy-600 hover:bg-burgundy-700 rounded-full"
                                >
                                  <Send className="w-3.5 h-3.5 mr-1.5" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm flex-shrink-0">
                                <AvatarImage src={reply.author.avatar || undefined} />
                                <AvatarFallback className={cn(
                                  "text-xs font-medium",
                                  reply.author.role !== "STUDENT"
                                    ? "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900"
                                    : "bg-gray-100 text-gray-600"
                                )}>
                                  {getInitials(reply.author.firstName, reply.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className={cn(
                                  "rounded-xl p-3",
                                  reply.author.role !== "STUDENT"
                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
                                    : "bg-gray-50"
                                )}>
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="font-semibold text-gray-900 text-sm">
                                      {reply.author.firstName} {reply.author.lastName}
                                    </span>
                                    {getRoleBadge(reply.author.role)}
                                    <span className="text-xs text-gray-400 ml-auto">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
