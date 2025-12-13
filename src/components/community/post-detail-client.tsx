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
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Trophy,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  Hand,
  Award,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Users,
  Star,
  Zap,
  PartyPopper,
  Quote,
} from "lucide-react";

// Banned keywords for client-side moderation warning
const BANNED_KEYWORDS = [
  "refund", "scam", "fraud", "lawsuit", "sue", "money back",
  "rip off", "ripoff", "waste of money", "pyramid scheme", "mlm",
];

function containsBannedContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Category styling
const CATEGORY_STYLES: Record<string, { icon: typeof Rocket; color: string; bgColor: string; gradient: string; label: string }> = {
  introductions: { icon: Hand, color: "text-pink-700", bgColor: "bg-pink-100", gradient: "from-pink-500 via-rose-500 to-pink-600", label: "Introduce Yourself" },
  momentum: { icon: Rocket, color: "text-purple-700", bgColor: "bg-purple-100", gradient: "from-purple-500 via-violet-500 to-purple-600", label: "Practice Momentum" },
  wins: { icon: Trophy, color: "text-amber-700", bgColor: "bg-amber-100", gradient: "from-amber-500 via-yellow-500 to-amber-600", label: "Share Your Wins" },
  questions: { icon: HelpCircle, color: "text-blue-700", bgColor: "bg-blue-100", gradient: "from-blue-500 via-sky-500 to-blue-600", label: "Questions & Help" },
  tips: { icon: Lightbulb, color: "text-green-700", bgColor: "bg-green-100", gradient: "from-green-500 via-emerald-500 to-green-600", label: "Daily Coach Tips" },
  graduates: { icon: GraduationCap, color: "text-emerald-700", bgColor: "bg-emerald-100", gradient: "from-emerald-500 via-teal-500 to-emerald-600", label: "Graduates" },
};

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
  category?: string | null;
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
  const [commentWarning, setCommentWarning] = useState("");
  const [replyWarning, setReplyWarning] = useState("");
  const [commentError, setCommentError] = useState("");

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    if (containsBannedContent(value)) {
      setCommentWarning("Your comment contains restricted content. Please review community guidelines.");
    } else {
      setCommentWarning("");
    }
  };

  const handleReplyChange = (value: string) => {
    setReplyContent(value);
    if (containsBannedContent(value)) {
      setReplyWarning("Your reply contains restricted content. Please review community guidelines.");
    } else {
      setReplyWarning("");
    }
  };

  // Get category style
  const getCategoryStyle = () => {
    if (!post.category || !CATEGORY_STYLES[post.category]) {
      return { icon: MessageSquare, color: "text-gray-700", bgColor: "bg-gray-100", gradient: "from-burgundy-500 via-burgundy-600 to-burgundy-700", label: "Discussion" };
    }
    return CATEGORY_STYLES[post.category];
  };

  const categoryStyle = getCategoryStyle();
  const CategoryIcon = categoryStyle.icon;

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

  const getRoleBadge = (role: string, size: "sm" | "md" = "md") => {
    const baseClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
    switch (role) {
      case "ADMIN":
        return (
          <Badge className={`bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white border-0 font-semibold ${baseClass}`}>
            <Sparkles className={size === "sm" ? "w-2.5 h-2.5 mr-0.5" : "w-3 h-3 mr-1"} />
            Admin
          </Badge>
        );
      case "INSTRUCTOR":
        return (
          <Badge className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-semibold ${baseClass}`}>
            Instructor
          </Badge>
        );
      case "MENTOR":
        return (
          <Badge className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold ${baseClass}`}>
            <Award className={size === "sm" ? "w-2.5 h-2.5 mr-0.5" : "w-3 h-3 mr-1"} />
            Coach
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAvatarGradient = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-gradient-to-br from-burgundy-500 to-burgundy-700";
      case "MENTOR":
        return "bg-gradient-to-br from-amber-400 to-orange-500";
      case "INSTRUCTOR":
        return "bg-gradient-to-br from-purple-500 to-purple-700";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-bold text-gray-900 text-lg mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Bold text inline
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-2">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-gray-900">{part.replace(/\*\*/g, '')}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <div className="w-2 h-2 rounded-full bg-burgundy-500 mt-2 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{line.substring(2)}</span>
          </div>
        );
      }
      // Checkmark items
      if (line.includes('✅') || line.includes('✓')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{line.replace(/✅|✓/g, '').trim()}</span>
          </div>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        const text = line.replace(/^\d+\.\s*/, '');
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <span className="w-6 h-6 rounded-full bg-burgundy-100 text-burgundy-700 text-sm font-semibold flex items-center justify-center flex-shrink-0">{num}</span>
            <span className="text-gray-700 leading-relaxed">{text}</span>
          </div>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
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

    // Check for banned content
    if (containsBannedContent(newComment)) {
      setCommentError("Your comment contains content that violates community guidelines.");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: newComment }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        setCommentWarning("");
        router.refresh();
      } else {
        setCommentError(data.error || "Failed to post comment");
      }
    } catch {
      setCommentError("An error occurred. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || commentLoading) return;

    // Check for banned content
    if (containsBannedContent(replyContent)) {
      setReplyWarning("Your reply contains content that violates community guidelines.");
      return;
    }

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
        setReplyWarning("");
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="text-gray-600 hover:text-burgundy-600 hover:bg-burgundy-50 -ml-2 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      {/* Main Post Card */}
      <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
        {/* Category Banner */}
        <div className={`bg-gradient-to-r ${categoryStyle.gradient} px-6 py-4 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Posted in</p>
                <p className="text-white font-bold text-lg">{categoryStyle.label}</p>
              </div>
            </div>
            {post.isPinned && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold px-3 py-1.5">
                <Pin className="w-3.5 h-3.5 mr-1.5" />
                Pinned Post
              </Badge>
            )}
          </div>
        </div>

        {/* Author Section */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback className={`${getAvatarGradient(post.author.role)} text-white font-bold text-xl`}>
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-gray-900 text-xl">
                  {post.author.firstName} {post.author.lastName}
                </span>
                {getRoleBadge(post.author.role)}
              </div>
              {post.author.bio && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{post.author.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5" />
                  {post.viewCount.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Content with rich formatting */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
              {renderContent(post.content)}
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={likeLoading}
                className={cn(
                  "gap-2 rounded-xl px-5 py-2.5 h-auto transition-all font-semibold",
                  liked
                    ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 hover:from-rose-100 hover:to-pink-100 border border-rose-200"
                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-200"
                )}
              >
                <Heart className={cn("w-5 h-5 transition-all", liked && "fill-current")} />
                <span>{likeCount}</span>
              </Button>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <MessageCircle className="w-5 h-5 text-burgundy-600" />
                <span className="font-semibold text-gray-700">{post.totalComments}</span>
                <span className="text-gray-500 text-sm">comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="gap-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button variant="ghost" className="gap-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        {/* Comment Header */}
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {post.totalComments} {post.totalComments === 1 ? "Comment" : "Comments"}
              </h3>
              <p className="text-burgundy-200 text-sm">Join the conversation</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-8">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-white shadow-md flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white font-bold">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {/* Warning/Error Messages */}
                {commentWarning && (
                  <div className="mb-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 text-sm">Content Warning</p>
                      <p className="text-sm text-amber-700">{commentWarning}</p>
                    </div>
                  </div>
                )}
                {commentError && (
                  <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{commentError}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-burgundy-500 focus-within:ring-4 focus-within:ring-burgundy-500/10 transition-all overflow-hidden">
                  <textarea
                    value={newComment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    placeholder="Share your thoughts, ask a question, or celebrate someone's win..."
                    className="w-full min-h-[120px] bg-transparent px-4 py-4 text-base placeholder:text-gray-400 focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100/50 border-t border-gray-200">
                    <p className="text-xs text-gray-400">Be supportive and constructive</p>
                    <Button
                      type="submit"
                      disabled={commentLoading || !newComment.trim() || !!commentWarning}
                      className="bg-burgundy-600 hover:bg-burgundy-700 rounded-xl px-6 shadow-lg shadow-burgundy-200"
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
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment, idx) => (
                <div key={comment.id} className="group">
                  {/* Divider between comments */}
                  {idx > 0 && <div className="border-t border-gray-100 mb-6" />}

                  {/* Main Comment */}
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-md flex-shrink-0">
                      <AvatarImage src={comment.author.avatar || undefined} />
                      <AvatarFallback className={`font-bold ${getAvatarGradient(comment.author.role)} text-white`}>
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "rounded-2xl overflow-hidden transition-all",
                        comment.author.role !== "STUDENT"
                          ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 shadow-md shadow-amber-100"
                          : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                      )}>
                        {/* Comment Header */}
                        <div className={cn(
                          "px-4 py-3 border-b",
                          comment.author.role !== "STUDENT"
                            ? "bg-gradient-to-r from-amber-100/50 to-orange-100/50 border-amber-200"
                            : "bg-gray-100/50 border-gray-200"
                        )}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900">
                              {comment.author.firstName} {comment.author.lastName}
                            </span>
                            {getRoleBadge(comment.author.role, "sm")}
                            <span className="text-xs text-gray-400 ml-auto">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                        {/* Comment Content */}
                        <div className="px-4 py-4">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-3 ml-2">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-burgundy-600 transition-colors font-medium"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 transition-colors font-medium">
                          <ThumbsUp className="w-4 h-4" />
                          Like
                        </button>
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1.5 text-sm text-burgundy-600 hover:text-burgundy-700 font-semibold transition-colors"
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
                        <div className="mt-4 ml-4 pl-4 border-l-3 border-burgundy-300">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white text-sm font-bold">
                                You
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {/* Reply Warning */}
                              {replyWarning && (
                                <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-amber-700">{replyWarning}</p>
                                </div>
                              )}
                              <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-burgundy-500 focus-within:ring-2 focus-within:ring-burgundy-500/10 transition-all overflow-hidden">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => handleReplyChange(e.target.value)}
                                  placeholder={`Reply to ${comment.author.firstName}...`}
                                  className="w-full min-h-[80px] bg-transparent px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50 border-t border-gray-100">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyContent("");
                                      setReplyWarning("");
                                    }}
                                    className="rounded-lg text-gray-500"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReply(comment.id)}
                                    disabled={commentLoading || !replyContent.trim() || !!replyWarning}
                                    className="bg-burgundy-600 hover:bg-burgundy-700 rounded-lg"
                                  >
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                    Reply
                                  </Button>
                                </div>
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
                              <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm flex-shrink-0">
                                <AvatarImage src={reply.author.avatar || undefined} />
                                <AvatarFallback className={`text-sm font-bold ${getAvatarGradient(reply.author.role)} text-white`}>
                                  {getInitials(reply.author.firstName, reply.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className={cn(
                                  "rounded-xl overflow-hidden",
                                  reply.author.role !== "STUDENT"
                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                                    : "bg-gray-50 border border-gray-200"
                                )}>
                                  <div className={cn(
                                    "px-3 py-2 border-b",
                                    reply.author.role !== "STUDENT"
                                      ? "bg-amber-100/50 border-amber-200"
                                      : "bg-gray-100/50 border-gray-200"
                                  )}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-gray-900 text-sm">
                                        {reply.author.firstName} {reply.author.lastName}
                                      </span>
                                      {getRoleBadge(reply.author.role, "sm")}
                                      <span className="text-xs text-gray-400 ml-auto">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3">
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                      {reply.content}
                                    </p>
                                  </div>
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
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-burgundy-100">
                <MessageSquare className="w-12 h-12 text-burgundy-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-500 mb-2">Be the first to share your thoughts!</p>
              <p className="text-sm text-gray-400">Your comment could help others or start a great discussion.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
