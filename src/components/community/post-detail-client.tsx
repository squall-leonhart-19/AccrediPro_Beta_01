"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft, MessageCircle, MoreHorizontal, Users, Flame, CheckCircle2,
  ThumbsUp, Heart, Trash2, AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface PostDetailClientProps {
  post: any;
  currentUserId: string;
  currentUserImage?: string | null;
  currentUserFirstName?: string | null;
  currentUserLastName?: string | null;
  currentUserRole?: string | null;
}

const REACTIONS = [
  { emoji: "❤️", label: "Love", color: "bg-red-100 text-red-600 border-red-200" },
  { emoji: "🔥", label: "Fire", color: "bg-orange-100 text-orange-600 border-orange-200" },
  { emoji: "👏", label: "Clap", color: "bg-blue-100 text-blue-600 border-blue-200" },
  { emoji: "🎉", label: "Party", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
  { emoji: "💪", label: "Strong", color: "bg-slate-100 text-slate-600 border-slate-200" },
];

// Generate unique reactions for each post based on post ID (deterministic) - must match community-client.tsx
function generatePostReactions(postId: string, category: string | null, isPinned: boolean): Record<string, number> {
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  let baseMultiplier = 1;
  if (isPinned) {
    baseMultiplier = 3;
  } else if (category === "wins") {
    baseMultiplier = 2.5;
  } else if (category === "tips") {
    baseMultiplier = 2;
  } else if (category === "introductions") {
    baseMultiplier = 1.8;
  } else if (category === "graduates") {
    baseMultiplier = 2.2;
  } else if (category === "questions") {
    baseMultiplier = 1.2;
  }

  const seed1 = (hash % 100) + 50;
  const seed2 = ((hash >> 4) % 80) + 30;
  const seed3 = ((hash >> 8) % 60) + 20;
  const seed4 = ((hash >> 12) % 50) + 15;
  const seed5 = ((hash >> 16) % 40) + 10;
  const seed6 = ((hash >> 20) % 30) + 8;
  const seed7 = ((hash >> 24) % 20) + 5;
  const seed8 = ((hash >> 28) % 15) + 3;

  return {
    "❤️": Math.round(seed1 * baseMultiplier),
    "🔥": Math.round(seed2 * baseMultiplier),
    "👏": Math.round(seed3 * baseMultiplier),
    "💯": Math.round(seed4 * baseMultiplier),
    "🎉": Math.round(seed5 * baseMultiplier),
    "💪": Math.round(seed6 * baseMultiplier),
    "⭐": Math.round(seed7 * baseMultiplier),
    "🙌": Math.round(seed8 * baseMultiplier),
  };
}

// Generate random reactions for comments (deterministic based on comment ID)
function generateCommentReactions(commentId: string): Record<string, number> {
  let hash = 0;
  for (let i = 0; i < commentId.length; i++) {
    const char = commentId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  // Random selection of 2-4 emojis with counts between 10-100
  const emojis = ["❤️", "🔥", "👏", "💯"];
  const numEmojis = 2 + (hash % 3); // 2-4 emojis
  const reactions: Record<string, number> = {};

  for (let i = 0; i < numEmojis; i++) {
    const emojiIndex = (hash + i * 7) % emojis.length;
    const count = 10 + ((hash >> (i * 4)) % 91); // 10-100
    reactions[emojis[emojiIndex]] = count;
  }

  return reactions;
}

// Initialize comments with reactions if they don't have any
function initializeCommentsWithReactions(comments: any[]): any[] {
  return comments.map(comment => ({
    ...comment,
    reactions: comment.reactions && Object.keys(comment.reactions).length > 0
      ? comment.reactions
      : generateCommentReactions(comment.id),
    replies: comment.replies ? comment.replies.map((reply: any) => ({
      ...reply,
      reactions: reply.reactions && Object.keys(reply.reactions).length > 0
        ? reply.reactions
        : generateCommentReactions(reply.id),
    })) : [],
  }));
}

export default function PostDetailClient({
  post,
  currentUserImage,
  currentUserFirstName,
  currentUserLastName,
  currentUserRole
}: PostDetailClientProps) {
  const router = useRouter();
  const isAdminOrMentor = currentUserRole === "ADMIN" || currentUserRole === "MENTOR";

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete comment state
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Dynamic Live Activity
  const [activeUsers, setActiveUsers] = useState(142);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 15) - 7; // Larger fluctuation
        return Math.max(142, Math.min(497, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Post State - use generatePostReactions for consistent values between card and post detail
  const [postReactions, setPostReactions] = useState<Record<string, number>>(
    post.reactions || generatePostReactions(post.id, post.category, post.isPinned)
  );
  const [userPostReaction, setUserPostReaction] = useState<string | null>(post.isLiked ? "❤️" : null);
  const [showPostReactionPicker, setShowPostReactionPicker] = useState(false);

  // Comments State - initialize with reactions
  const [comments, setComments] = useState(() =>
    initializeCommentsWithReactions(post.comments || [])
  );
  const [newComment, setNewComment] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);

  const handlePostReaction = (emoji: string) => {
    setPostReactions(prev => {
      const next = { ...prev };
      // If switching or adding
      if (userPostReaction === emoji) {
        // Toggle off
        next[emoji] = Math.max(0, next[emoji] - 1);
        setUserPostReaction(null);
      } else {
        // Remove old if exists
        if (userPostReaction) {
          next[userPostReaction] = Math.max(0, next[userPostReaction] - 1);
        }
        // Add new
        next[emoji] = (next[emoji] || 0) + 1;
        setUserPostReaction(emoji);
      }
      return next;
    });
    setShowPostReactionPicker(false);
  };

  const handleCommentReaction = (commentId: string, emoji: string) => {
    setComments((prevComments: any[]) => prevComments.map((c: any) => {
      if (c.id === commentId) {
        const currentReactions = c.reactions || {};
        const userReaction = c.userReaction;

        const nextReactions = { ...currentReactions };
        let nextUserReaction = userReaction;

        if (userReaction === emoji) {
          // Toggle off
          nextReactions[emoji] = Math.max(0, (nextReactions[emoji] || 1) - 1);
          nextUserReaction = null;
        } else {
          if (userReaction) {
            nextReactions[userReaction] = Math.max(0, (nextReactions[userReaction] || 1) - 1);
          }
          nextReactions[emoji] = (nextReactions[emoji] || 0) + 1;
          nextUserReaction = emoji;
        }

        return { ...c, reactions: nextReactions, userReaction: nextUserReaction };
      }
      return c;
    }));
  };

  const [isPostingComment, setIsPostingComment] = useState(false);

  const handlePostComment = async () => {
    if (!newComment.trim() || isPostingComment) return;

    // All posts now save to database
    setIsPostingComment(true);
    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: newComment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new comment from DB response to local state
        const newCommentObj = {
          ...data.data,
          reactions: {},
          replies: []
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Post comment error:", error);
      alert("Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim() || isPostingReply || !replyingTo) return;

    setIsPostingReply(true);
    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: replyContent,
          parentId: replyingTo.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the reply to the parent comment's replies array
        setComments((prevComments: any[]) => prevComments.map((c: any) => {
          if (c.id === replyingTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), { ...data.data, reactions: {} }]
            };
          }
          return c;
        }));
        setReplyContent("");
        setReplyingTo(null);
      } else {
        alert(data.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Post reply error:", error);
      alert("Failed to post reply");
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/community", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/community");
        router.refresh();
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;

    setIsDeletingComment(true);
    try {
      // All comments now stored in database
      const response = await fetch("/api/community/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: deleteCommentId }),
      });

      const data = await response.json();

      if (data.success) {
        setComments((prev: any[]) => prev.filter((c: any) => c.id !== deleteCommentId));
      } else {
        alert(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      alert("Failed to delete comment");
    } finally {
      setIsDeletingComment(false);
      setDeleteCommentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans pb-20">

      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/community')} className="hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div className="flex items-center gap-3">
            <img src="/accredipro-logo-full.png" alt="AccrediPro" className="h-8 w-auto object-contain" />
            <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
            <h1 className="font-bold text-lg text-gray-900 truncate max-w-[150px] md:max-w-xs hidden md:block">
              {post.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-[#8B2332] hover:bg-[#721c28] text-white font-bold rounded-lg px-4 shadow-sm transition-all hover:scale-105 border border-[#721c28]">
            <MessageCircle className="w-4 h-4 mr-2" />
            Join Discussion
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 lg:p-8">

        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {/* Dynamic Live Activity */}
          <Card className="p-5 border-0 shadow-sm bg-white rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Users className="w-24 h-24 text-burgundy-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-lg relative z-10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Activity
            </h3>
            <p className="text-sm text-gray-500 mb-4 relative z-10 transition-all duration-500">
              <span className="font-bold text-burgundy-700">You</span> and <span className="font-bold text-gray-900">{activeUsers}</span> others active on the community right now!
            </p>

          </Card>




          {/* Dynamic Trending Sidebar */}
          <TrendingWidget />
        </aside>

        {/* Main Feed Content */}
        <main className="col-span-1 lg:col-span-6 space-y-6">
          <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden animate-fade-in relative">

            {/* Author Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-burgundy-50">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  {post.author.role === "MENTOR" && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white" title="Verified Mentor">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base hover:underline cursor-pointer">
                      {post.author.firstName} {post.author.lastName}
                    </h3>
                    {post.author.role === "MENTOR" && (
                      <span className="bg-burgundy-100 text-burgundy-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Mentor
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • posted in <span className="text-burgundy-600 font-bold">{post.category}</span>
                  </p>
                </div>
              </div>
              {isAdminOrMentor ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Title & Body */}
            <div className="px-6 py-5">
              <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{post.title}</h2>

              {/* Rich Text Content */}
              <div className="bg-[#FCFBF8] rounded-xl p-6 border border-stone-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burgundy-500/20 to-transparent"></div>
                <div
                  className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-burgundy-600 prose-strong:text-burgundy-900 prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {/* Reaction Counts Display */}
            <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {Object.entries(postReactions).map(([emoji, count]) => count > 0 && (
                <span key={emoji} className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm font-bold text-gray-700 border border-gray-100 shadow-sm">
                  <span>{emoji}</span> {count}
                </span>
              ))}
            </div>

            {/* Interaction Bar */}
            <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-2 gap-2 relative">
              {/* ... Interaction Bar Content same as before ... */}
              <div className="relative">
                <AnimatePresence>
                  {showPostReactionPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -60, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-xl border border-gray-200 p-2 flex gap-2 z-50"
                    >
                      {REACTIONS.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => handlePostReaction(r.emoji)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-125 text-2xl"
                          title={r.label}
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setShowPostReactionPicker(!showPostReactionPicker)}
                  className={cn(
                    "w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-95 group",
                    userPostReaction ? "bg-burgundy-50 text-burgundy-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {userPostReaction ? (
                    <span className="text-xl">{userPostReaction}</span>
                  ) : (
                    <ThumbsUp className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                  )}
                  <span>{userPostReaction ? "Reacted" : "React"}</span>
                </button>
              </div>

              <button className="py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length} Comments</span>
              </button>
            </div>
          </Card>

          {/* Comment Input */}
          <Card className="p-4 border-0 shadow-sm rounded-2xl bg-white flex gap-4 items-start">
            <Avatar className="w-10 h-10 mt-1">
              <AvatarImage src={currentUserImage || undefined} />
              <AvatarFallback>{currentUserFirstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <textarea
                className="w-full bg-gray-50 rounded-xl border-none resize-none p-3 text-sm focus:ring-2 focus:ring-burgundy-100 focus:bg-white transition-all min-h-[50px]"
                placeholder="Write a thoughtful comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400 font-medium">Press <span className="bg-gray-100 px-1 py-0.5 rounded text-gray-500">Enter</span> to post</p>
                <Button
                  size="sm"
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || isPostingComment}
                  className="rounded-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold h-8 px-4"
                >
                  {isPostingComment ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-gray-900 text-lg">Comments ({comments.length})</h3>
            </div>

            {comments.map((comment: any) => (
              <Card key={comment.id} className="p-5 border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow duration-300">
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-50">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold">
                      {(comment.author.firstName || comment.author.name || "S")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{comment.author.firstName ? `${comment.author.firstName} ${comment.author.lastName || ''}` : comment.author.name}</h4>
                        {comment.author.role === "MENTOR" && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 rounded-full">Mentor</span>
                        )}
                      </div>
                      {/* Admin Delete Button */}
                      {isAdminOrMentor && (
                        <button
                          onClick={() => setDeleteCommentId(comment.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Reaction Pills - Combined display with counts and add button */}
                    <div className="flex items-center gap-2 pt-3 flex-wrap">
                      {/* Display existing reactions with counts */}
                      {comment.reactions && Object.entries(comment.reactions).map(([emoji, count]: [string, any]) => count > 0 && (
                        <button
                          key={emoji}
                          onClick={() => handleCommentReaction(comment.id, emoji)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 shadow-sm",
                            comment.userReaction === emoji
                              ? "bg-burgundy-100 text-burgundy-700 border-burgundy-300 ring-2 ring-burgundy-200"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                          )}
                        >
                          <span className="text-base">{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}

                      {/* Add Reaction Button - Dropdown style */}
                      <div className="relative group">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-white border-2 border-dashed border-gray-200 text-gray-400 hover:border-burgundy-300 hover:text-burgundy-600 transition-all"
                        >
                          <span className="text-base">+</span>
                        </button>
                        {/* Reaction picker on hover */}
                        <div className="absolute left-0 bottom-full mb-2 bg-white rounded-full shadow-xl border border-gray-200 p-1.5 hidden group-hover:flex gap-1 z-50">
                          {["❤️", "🔥", "👏", "💯"].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleCommentReaction(comment.id, emoji)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-125 text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <span className="w-px h-5 bg-gray-200 mx-1"></span>
                      <button
                        onClick={() => setReplyingTo({
                          id: comment.id,
                          authorName: comment.author.firstName ? `${comment.author.firstName} ${comment.author.lastName || ''}` : comment.author.name
                        })}
                        className="text-xs font-bold text-gray-400 hover:text-burgundy-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo?.id === comment.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">Replying to</span>
                          <span className="text-xs font-semibold text-burgundy-600">{replyingTo.authorName}</span>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handlePostReply();
                              }
                            }}
                            placeholder="Write your reply..."
                            className="flex-1 px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-burgundy-100 focus:border-burgundy-300 outline-none"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={handlePostReply}
                            disabled={!replyContent.trim() || isPostingReply}
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold px-4 rounded-lg"
                          >
                            {isPostingReply ? "..." : "Reply"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>{(reply.author.firstName || reply.author.name || "S")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-gray-900">{reply.author.firstName ? `${reply.author.firstName} ${reply.author.lastName || ''}` : reply.author.name}</span>
                                {reply.author.role === "MENTOR" && (
                                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                )}
                              </div>
                              <p className="text-gray-600 text-xs mt-0.5">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        <aside className="hidden lg:block lg:col-span-3 space-y-6">

          {/* Quick Actions */}
          <Card className="p-5 border-0 shadow-sm bg-white rounded-2xl space-y-3">
            <Button onClick={() => router.push('/courses')} className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold h-12 rounded-xl shadow-sm transition-all hover:scale-[1.02] flex items-center justify-between px-5 group">
              <span>Go to My Courses</span>
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" onClick={() => router.push('/messages')} className="w-full border-2 border-gray-100 hover:bg-gray-50 text-gray-700 font-bold h-12 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-between px-5 group">
              <span>Talk to your Coach</span>
              <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
            </Button>
          </Card>
        </aside>

      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
              All comments and reactions will also be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingComment}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={isDeletingComment}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingComment ? "Deleting..." : "Delete Comment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TrendingWidget() {
  // Static for "Trending Today" (Daily update concept)
  const currentGroup = {
    label: "Trending Today",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
    items: [
      { title: "I finally treated my first patient!", comments: 45, time: "2h ago" },
      { title: "Best insurance for new practitioners?", comments: 32, time: "5h ago" },
      { title: "Alumni Meetup: London 🇬🇧", comments: 128, time: "1d ago" }
    ]
  };

  const router = useRouter();

  const Icon = currentGroup.icon;

  return (
    <Card className="p-5 border-0 shadow-sm bg-white rounded-2xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-5">
        <div className={cn("p-2 rounded-lg", currentGroup.bg)}>
          <Icon className={cn("w-5 h-5", currentGroup.color)} />
        </div>
        <h3 className="font-bold text-gray-900 leading-tight">
          {currentGroup.label}
        </h3>
      </div>

      <ul className="space-y-5">
        {currentGroup.items.map((item, i) => (
          <li key={i} className="group cursor-pointer" onClick={() => router.push("/community")}>
            <p className="text-sm font-bold text-gray-800 group-hover:text-burgundy-600 transition-colors line-clamp-2 mb-1">
              "{item.title}"
            </p>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
              <span>{item.time}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{item.comments} comments</span>
            </p>
          </li>
        ))}
      </ul>

      <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-gray-500 hover:text-burgundy-600">
        View All Trending
      </Button>
    </Card>
  );
}
