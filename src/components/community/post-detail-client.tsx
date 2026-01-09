"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft, MessageCircle, MoreHorizontal, CheckCircle2,
  ThumbsUp, Trash2, AlertTriangle
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

// Note: Post reactions are now stored in the database and passed from the server
// The generatePostReactions function is no longer needed - reactions come from DB

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

  // Post State - use stored reactions from database
  const [postReactions, setPostReactions] = useState<Record<string, number>>(
    (post.reactions as Record<string, number>) || {}
  );
  const [userPostReaction, setUserPostReaction] = useState<string | null>(post.isLiked ? "❤️" : null);
  const [showPostReactionPicker, setShowPostReactionPicker] = useState(false);

  // Comments State - initialize with reactions
  const [comments, setComments] = useState(() =>
    initializeCommentsWithReactions(post.comments || [])
  );
  const [newComment, setNewComment] = useState("");

  // Load more comments pagination
  const [hasMoreComments, setHasMoreComments] = useState(post.totalComments > 20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedCommentIds] = useState(() => new Set((post.comments || []).map((c: any) => c.id)));

  // Reply state
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);

  // Load more comments function
  const loadMoreComments = async () => {
    if (isLoadingMore || !hasMoreComments) return;

    setIsLoadingMore(true);
    try {
      const lastComment = comments[comments.length - 1];
      const cursor = lastComment?.createdAt ? new Date(lastComment.createdAt).toISOString() : "";

      const response = await fetch(`/api/community/comments?postId=${post.id}&cursor=${cursor}&limit=20`);
      const data = await response.json();

      if (data.success && data.data) {
        // Filter out any comments we already have
        const newComments = data.data.filter((c: any) => !loadedCommentIds.has(c.id));
        newComments.forEach((c: any) => loadedCommentIds.add(c.id));

        // Initialize with reactions and append
        const commentsWithReactions = initializeCommentsWithReactions(newComments);
        setComments(prev => [...prev, ...commentsWithReactions]);
        setHasMoreComments(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
    <div className="min-h-screen bg-white font-sans pb-20">

      {/* Minimal Top Navbar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 h-14 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/community')} className="hover:bg-gray-100 rounded-full shrink-0">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="font-bold text-sm sm:text-lg text-gray-900 truncate flex-1">
          {post.title}
        </h1>
      </div>

      {/* TRUE Full-Width Layout */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-4 space-y-4">

        {/* Main Post Content */}
        <main className="max-w-5xl mx-auto space-y-4">
          <div className="bg-white">

            {/* Author Header */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <Avatar className="w-10 h-10">
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

            {/* Title & Body - Clean, no boxes */}
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h2>

              {/* Clean prose - no wrapper box */}
              <div
                className="prose prose-gray max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-burgundy-600 prose-strong:text-gray-900 prose-p:leading-relaxed prose-p:mb-3 prose-ul:mb-3 prose-li:mb-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Reaction Counts - Minimal */}
            <div className="px-4 sm:px-6 py-2 flex items-center gap-2 flex-wrap">
              {Object.entries(postReactions)
                .sort(([a], [b]) => {
                  if (a === "❤️") return -1;
                  if (b === "❤️") return 1;
                  return 0;
                })
                .map(([emoji, count]) => count > 0 && (
                  <span
                    key={emoji}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100"
                  >
                    <span>{emoji}</span> {count}
                  </span>
                ))}            </div>

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
          </div>

          {/* Comment Input - Clean */}
          <div className="p-4 bg-white rounded-lg flex gap-3 items-start">
            <Avatar className="w-9 h-9">
              <AvatarImage src={currentUserImage || undefined} />
              <AvatarFallback>{currentUserFirstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                className="w-full bg-gray-50 rounded-lg border border-gray-200 resize-none p-3 text-sm focus:ring-1 focus:ring-burgundy-200 focus:border-burgundy-300 focus:bg-white transition-all min-h-[44px]"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || isPostingComment}
                  className="bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-medium h-8 px-4 rounded-lg"
                >
                  {isPostingComment ? "..." : "Post"}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List - Flat */}
          <div className="space-y-0 divide-y divide-gray-100">
            <div className="py-2">
              <h3 className="font-semibold text-gray-900">Comments ({comments.length})</h3>
            </div>

            {comments.map((comment: any) => (
              <div key={comment.id} className="py-4">
                <div className="flex gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
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

                    {/* Reaction Pills - No borders */}
                    <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                      {comment.reactions && Object.entries(comment.reactions).map(([emoji, count]: [string, any]) => count > 0 && (
                        <button
                          key={emoji}
                          onClick={() => handleCommentReaction(comment.id, emoji)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors",
                            comment.userReaction === emoji
                              ? "bg-burgundy-100 text-burgundy-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}

                      {/* Add Reaction Button */}
                      <div className="relative group">
                        <button className="inline-flex items-center px-2 py-1 rounded-full text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                          <span>+</span>
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
              </div>
            ))}

            {/* Load More Comments Button */}
            {hasMoreComments && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={loadMoreComments}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-2 rounded-xl shadow-sm"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="animate-pulse">Loading...</span>
                    </>
                  ) : (
                    <>Load More Comments ({post.totalComments - comments.length} more)</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </main>
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
