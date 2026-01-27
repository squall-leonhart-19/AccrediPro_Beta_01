"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    GraduationCap,
    Heart,
    MessageCircle,
    Lock,
    Sparkles,
    Trophy,
    DollarSign,
    Star,
    Send,
    Loader2,
    TrendingUp,
    Users,
    Award,
    MapPin,
    ThumbsUp,
    Flame,
    PartyPopper,
    Target,
    Quote,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GraduatePost {
    id: string;
    postType: string;
    content: string;
    imageUrl?: string | null;
    likes: number;
    comments: { name: string; content: string; createdAt: string }[];
    postedAt: string;
    profile?: {
        name: string;
        avatar?: string | null;
        location?: string | null;
        incomeLevel?: string | null;
    } | null;
    user?: {
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
    } | null;
}

interface GraduatesChannelProps {
    isGraduate: boolean;
    diplomaSlug: string;
    className?: string;
}

const POST_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
    certificate: { icon: GraduationCap, label: "Just Certified", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
    first_client: { icon: Star, label: "First Client 🎉", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
    income_milestone: { icon: DollarSign, label: "Income Milestone", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
    transformation: { icon: Sparkles, label: "Transformation", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
    tip: { icon: MessageCircle, label: "Tips & Advice", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
    gratitude: { icon: Heart, label: "Gratitude", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200" },
    question: { icon: MessageCircle, label: "Question", color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200" },
    win: { icon: Trophy, label: "Big Win!", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
    struggle: { icon: Heart, label: "Real Talk", color: "text-slate-600", bgColor: "bg-slate-50 border-slate-200" },
    advice: { icon: Star, label: "Pro Tip", color: "text-teal-600", bgColor: "bg-teal-50 border-teal-200" },
    mindset: { icon: Sparkles, label: "Mindset Shift", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
    milestone: { icon: Award, label: "Milestone", color: "text-gold-600", bgColor: "bg-gold-50 border-gold-200" },
};

const REACTIONS = [
    { emoji: "❤️", label: "Love" },
    { emoji: "🔥", label: "Fire" },
    { emoji: "🎉", label: "Celebrate" },
    { emoji: "💪", label: "Strong" },
    { emoji: "🙌", label: "Praise" },
];

function PostCard({ post, onLike }: { post: GraduatePost; onLike: (id: string) => void }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
    const [showReactions, setShowReactions] = useState(false);

    const authorName = post.profile?.name || `${post.user?.firstName || ""} ${post.user?.lastName || ""}`.trim() || "Graduate";
    const authorAvatar = post.profile?.avatar || post.user?.avatar;
    const location = post.profile?.location;
    const incomeLevel = post.profile?.incomeLevel;

    const typeConfig = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.tip;
    const TypeIcon = typeConfig.icon;

    const handleReaction = (emoji: string) => {
        if (!selectedReaction) {
            setSelectedReaction(emoji);
            setLikeCount(prev => prev + 1);
            onLike(post.id);
        }
        setShowReactions(false);
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <article className={cn(
            "bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg",
            typeConfig.bgColor
        )}>
            {/* Header with Type Badge */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                                {authorAvatar ? (
                                    <Image
                                        src={authorAvatar}
                                        alt={authorName}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white font-bold text-lg">
                                        {authorName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {incomeLevel && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                    <Trophy className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Author Info */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-gray-900">{authorName}</span>
                                <Badge className={cn("text-[11px] font-semibold px-2.5 py-0.5 h-auto border", typeConfig.color, typeConfig.bgColor)}>
                                    <TypeIcon className="w-3 h-3 mr-1" />
                                    {typeConfig.label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                {location && (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {location}
                                        </span>
                                        <span>•</span>
                                    </>
                                )}
                                <span>{timeAgo(post.postedAt)}</span>
                                {incomeLevel && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                            <DollarSign className="w-3 h-3" />
                                            {incomeLevel}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Content */}
            <div className="px-5 pb-4">
                <div className="bg-white/80 rounded-xl p-4 border border-white/50">
                    <Quote className="w-5 h-5 text-gray-300 mb-2" />
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            </div>

            {/* Image */}
            {post.imageUrl && (
                <div className="px-5 pb-4">
                    <div className="rounded-xl overflow-hidden">
                        <Image
                            src={post.imageUrl}
                            alt="Story image"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Reactions & Comments Bar */}
            <div className="px-5 py-3 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                    {/* Reactions */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowReactions(!showReactions)}
                                onMouseEnter={() => setShowReactions(true)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                    selectedReaction
                                        ? "bg-rose-100 text-rose-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500"
                                )}
                            >
                                {selectedReaction ? (
                                    <span className="text-base">{selectedReaction}</span>
                                ) : (
                                    <Heart className="w-4 h-4" />
                                )}
                                <span>{likeCount}</span>
                            </button>

                            {/* Reaction Picker */}
                            {showReactions && !selectedReaction && (
                                <div
                                    className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-xl border border-gray-200 px-2 py-1.5 flex items-center gap-1 z-10"
                                    onMouseLeave={() => setShowReactions(false)}
                                >
                                    {REACTIONS.map((r) => (
                                        <button
                                            key={r.emoji}
                                            onClick={() => handleReaction(r.emoji)}
                                            className="text-xl hover:scale-125 transition-transform p-1"
                                            title={r.label}
                                        >
                                            {r.emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                        </button>
                    </div>

                    {/* Share inspiration */}
                    <span className="text-xs text-gray-400">Share the inspiration ✨</span>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                                        {comment.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                                        <span className="font-semibold text-sm text-gray-700">{comment.name}</span>
                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-2">No comments yet. Be the first to encourage!</p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

const POSTS_PER_PAGE = 10;

export function GraduatesChannel({ isGraduate, diplomaSlug, className }: GraduatesChannelProps) {
    const [posts, setPosts] = useState<GraduatePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newPost, setNewPost] = useState("");
    const [posting, setPosting] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedPostType, setSelectedPostType] = useState("tip");

    const fetchPosts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
        try {
            if (append) setLoadingMore(true);
            const offset = (pageNum - 1) * POSTS_PER_PAGE;
            const res = await fetch(`/api/mini-diploma/graduates/posts?limit=${POSTS_PER_PAGE}&offset=${offset}`);
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            const newPosts = data.posts || [];

            if (append) {
                setPosts(prev => [...prev, ...newPosts]);
            } else {
                setPosts(newPosts);
            }

            setHasMore(newPosts.length === POSTS_PER_PAGE);
        } catch {
            setError("Failed to load posts");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, true);
    };

    const handleLike = async (postId: string) => {
        try {
            await fetch(`/api/mini-diploma/graduates/posts/${postId}/like`, { method: "POST" });
        } catch {
            // Silently fail
        }
    };

    const handlePost = async () => {
        if (!newPost.trim() || !isGraduate) return;

        setPosting(true);
        try {
            const res = await fetch("/api/mini-diploma/graduates/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newPost.trim(),
                    postType: selectedPostType,
                    diplomaSlug,
                }),
            });
            if (!res.ok) throw new Error("Failed to post");
            setNewPost("");
            fetchPosts();
        } catch {
            setError("Failed to create post");
        } finally {
            setPosting(false);
        }
    };

    const postTypeOptions = [
        { value: "win", label: "🏆 Share a Win", desc: "Celebrate your success" },
        { value: "first_client", label: "⭐ First Client", desc: "Landed your first client!" },
        { value: "income_milestone", label: "💰 Income Milestone", desc: "Hit a money goal" },
        { value: "transformation", label: "✨ Transformation", desc: "Share your journey" },
        { value: "tip", label: "💡 Tip/Advice", desc: "Help fellow graduates" },
        { value: "gratitude", label: "❤️ Gratitude", desc: "Express thankfulness" },
    ];

    return (
        <div className={cn("min-h-screen bg-gray-50", className)}>
            {/* Full-Width Hero Header */}
            <div className="bg-gradient-to-br from-burgundy-800 via-burgundy-900 to-burgundy-950 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Link */}
                    <Link href={`/${diplomaSlug}`} className="inline-flex items-center gap-2 text-burgundy-200 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Course
                    </Link>

                    {/* Main Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-burgundy-900" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">Graduate Stories</h1>
                                    <p className="text-burgundy-200 text-sm">Real journeys. Real results. Real practitioners.</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-3">
                            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[100px]">
                                <Users className="w-5 h-5 mx-auto mb-1 text-gold-400" />
                                <p className="text-xl font-bold">2,847</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Graduates</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[100px]">
                                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                                <p className="text-xl font-bold">$9.2K</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Avg Income</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[100px]">
                                <Award className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                                <p className="text-xl font-bold">94%</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Success</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Locked Banner */}
            {!isGraduate && (
                <div className="bg-amber-50 border-b border-amber-200">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <p className="text-sm text-amber-700">
                            <span className="font-semibold">Complete your certification to share your story</span>
                            <span className="hidden sm:inline"> — You can read and get inspired now!</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Post Composer */}
                {isGraduate && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-8">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold-500" />
                            Share Your Story
                        </h3>

                        {/* Post Type Selector */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {postTypeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedPostType(opt.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                        selectedPostType === opt.value
                                            ? "bg-burgundy-600 text-white border-burgundy-600"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-burgundy-300"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="What's your journey been like? Share your wins, challenges, and advice..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px] resize-none border-gray-200 focus:border-burgundy-300 focus:ring-burgundy-200 rounded-xl"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handlePost}
                                disabled={!newPost.trim() || posting}
                                className="bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-full px-6"
                            >
                                {posting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Share Story
                            </Button>
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-burgundy-500 mb-3" />
                        <p className="text-gray-400">Loading stories...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No stories yet</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to share your journey!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} onLike={handleLike} />
                        ))}

                        {/* Load More Button */}
                        {hasMore && posts.length > 0 && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    variant="outline"
                                    className="rounded-full px-8 border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4 mr-2" />
                                            Load More Stories
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* End Message */}
                        {!hasMore && posts.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">You've read all the stories! 🎉</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
