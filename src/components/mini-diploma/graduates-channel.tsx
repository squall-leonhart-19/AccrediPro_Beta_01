"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
    Clock,
    Zap,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

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
    certificate: { icon: GraduationCap, label: "Just Certified", color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/30" },
    first_client: { icon: Star, label: "First Client 🎉", color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/30" },
    income_milestone: { icon: DollarSign, label: "Income Milestone", color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/30" },
    transformation: { icon: Sparkles, label: "Transformation", color: "text-purple-400", bgColor: "bg-purple-500/10 border-purple-500/30" },
    tip: { icon: MessageCircle, label: "Tips & Advice", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/30" },
    gratitude: { icon: Heart, label: "Gratitude", color: "text-rose-400", bgColor: "bg-rose-500/10 border-rose-500/30" },
    question: { icon: MessageCircle, label: "Question", color: "text-indigo-400", bgColor: "bg-indigo-500/10 border-indigo-500/30" },
    win: { icon: Trophy, label: "Big Win!", color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/30" },
    struggle: { icon: Heart, label: "Real Talk", color: "text-slate-400", bgColor: "bg-slate-500/10 border-slate-500/30" },
    advice: { icon: Star, label: "Pro Tip", color: "text-teal-400", bgColor: "bg-teal-500/10 border-teal-500/30" },
    mindset: { icon: Sparkles, label: "Mindset Shift", color: "text-violet-400", bgColor: "bg-violet-500/10 border-violet-500/30" },
    milestone: { icon: Award, label: "Milestone", color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/30" },
};

const REACTIONS = [
    { emoji: "❤️", label: "Love" },
    { emoji: "🔥", label: "Fire" },
    { emoji: "🎉", label: "Celebrate" },
    { emoji: "💪", label: "Strong" },
    { emoji: "🙌", label: "Praise" },
];

// Simulated live success feed data
const LIVE_SUCCESS_FEED = [
    { name: "Maria K.", action: "just certified", time: "2h ago", icon: GraduationCap, color: "text-emerald-400" },
    { name: "Jennifer S.", action: "hit $5K month!", time: "3h ago", icon: DollarSign, color: "text-green-400" },
    { name: "Lisa R.", action: "landed 3 clients", time: "5h ago", icon: Star, color: "text-amber-400" },
    { name: "Sarah M.", action: "just certified", time: "6h ago", icon: GraduationCap, color: "text-emerald-400" },
    { name: "Amanda T.", action: "first client!", time: "8h ago", icon: PartyPopper, color: "text-pink-400" },
];

// Income distribution data
const INCOME_DISTRIBUTION = [
    { range: "$2,000-5,000/mo", percent: 34, count: 968 },
    { range: "$5,000-10,000/mo", percent: 28, count: 797 },
    { range: "$10,000+/mo", percent: 21, count: 598 },
    { range: "Replaced Income", percent: 17, count: 484 },
];

// Timeline milestones
const JOURNEY_TIMELINE = [
    { step: "Mini Diploma", time: "Day 1", icon: Target, active: true },
    { step: "Certified Practitioner", time: "Week 4", icon: GraduationCap, active: false },
    { step: "First Client", time: "Week 6-8", icon: Star, active: false },
    { step: "$5/10K+ Monthly", time: "Month 3-6", icon: Trophy, active: false },
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
        <article className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:shadow-gold-500/10"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
            {/* Header with Type Badge */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold-500/30 shadow-md">
                                {authorAvatar ? (
                                    <Image
                                        src={authorAvatar}
                                        alt={authorName}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg" style={{ background: GOLD_GRADIENT }}>
                                        {authorName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {incomeLevel && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-burgundy-900">
                                    <Trophy className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Author Info */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">{authorName}</span>
                                <Badge className={cn("text-[11px] font-semibold px-2.5 py-0.5 h-auto border", typeConfig.color, typeConfig.bgColor)}>
                                    <TypeIcon className="w-3 h-3 mr-1" />
                                    {typeConfig.label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/50 mt-0.5">
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
                                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
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
                <div className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
                    <Quote className="w-5 h-5 text-gold-500/40 mb-2" />
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
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
            <div className="px-5 py-3 border-t" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
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
                                        ? "bg-rose-500/20 text-rose-400"
                                        : "bg-white/5 text-white/60 hover:bg-rose-500/10 hover:text-rose-400"
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
                                    className="absolute bottom-full left-0 mb-2 rounded-full shadow-xl px-2 py-1.5 flex items-center gap-1 z-10"
                                    style={{ background: "rgba(30,15,18,0.95)", border: "1px solid rgba(212,175,55,0.3)" }}
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
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 text-white/60 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                        </button>
                    </div>

                    {/* Share inspiration */}
                    <span className="text-xs text-white/30">Share the inspiration ✨</span>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style={{ background: GOLD_GRADIENT }}>
                                        {comment.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                                        <span className="font-semibold text-sm text-white/80">{comment.name}</span>
                                        <p className="text-sm text-white/60">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/30 text-center py-2">No comments yet. Be the first to encourage!</p>
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
    const [liveIndex, setLiveIndex] = useState(0);

    // Animate live feed
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveIndex(prev => (prev + 1) % LIVE_SUCCESS_FEED.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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

    const currentLiveItem = LIVE_SUCCESS_FEED[liveIndex];
    const LiveIcon = currentLiveItem.icon;

    return (
        <div className={cn("min-h-screen", className)} style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            {/* Premium Gold Header */}
            <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2d1518 0%, #4e1f24 50%, #2d1518 100%)" }}>
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: GOLD_GRADIENT }} />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Link */}
                    <Link href={`/portal/${diplomaSlug}`} className="inline-flex items-center gap-2 text-white/50 hover:text-gold-400 text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Course
                    </Link>

                    {/* Main Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ background: GOLD_GRADIENT }}>
                                    <GraduationCap className="w-7 h-7" style={{ color: "#4e1f24" }} />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">Graduate Stories</h1>
                                    <p className="text-white/50 text-sm">Real journeys. Real results. Real practitioners.</p>
                                </div>
                            </div>

                            {/* Live Success Ticker */}
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-xs text-white/60">LIVE</span>
                                <span className="text-white/40">|</span>
                                <LiveIcon className={cn("w-4 h-4", currentLiveItem.color)} />
                                <span className="text-sm text-white/80">
                                    <span className="font-semibold">{currentLiveItem.name}</span> {currentLiveItem.action}
                                </span>
                                <span className="text-xs text-white/40">{currentLiveItem.time}</span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-3">
                            <div className="rounded-xl px-5 py-3 text-center min-w-[100px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                                <Users className="w-5 h-5 mx-auto mb-1 text-gold-400" />
                                <p className="text-xl font-bold text-white">2,847</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-wide">Graduates</p>
                            </div>
                            <div className="rounded-xl px-5 py-3 text-center min-w-[100px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                                <p className="text-xl font-bold text-white">$9.2K</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-wide">Avg Income</p>
                            </div>
                            <div className="rounded-xl px-5 py-3 text-center min-w-[100px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                                <Award className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                                <p className="text-xl font-bold text-white">94%</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-wide">Success</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income Distribution Board */}
            <div className="border-b" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-white">Graduate Income Board</h3>
                        <span className="text-xs text-white/40 ml-2">Based on 2,847 graduates</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {INCOME_DISTRIBUTION.map((tier, i) => (
                            <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-white/80">{tier.range}</span>
                                    <span className="text-lg font-bold" style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{tier.percent}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${tier.percent}%`, background: GOLD_GRADIENT }} />
                                </div>
                                <p className="text-xs text-white/40 mt-1">{tier.count.toLocaleString()} graduates</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Certification Timeline */}
            <div className="border-b" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h3 className="font-bold text-white">Your Path to Success</h3>
                        <span className="text-xs text-white/40 ml-2">Average timeline</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        {/* Connection line */}
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/10" style={{ zIndex: 0 }} />
                        <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2" style={{ width: "12.5%", background: GOLD_GRADIENT, zIndex: 1 }} />

                        {JOURNEY_TIMELINE.map((step, i) => {
                            const StepIcon = step.icon;
                            return (
                                <div key={i} className="flex flex-col items-center relative z-10">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                        step.active ? "" : "bg-white/10"
                                    )} style={step.active ? { background: GOLD_GRADIENT } : {}}>
                                        <StepIcon className={cn("w-5 h-5", step.active ? "text-burgundy-900" : "text-white/50")} />
                                    </div>
                                    <span className={cn("text-sm font-medium", step.active ? "text-white" : "text-white/50")}>{step.step}</span>
                                    <span className="text-xs text-white/30">{step.time}</span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-center text-sm text-white/40 mt-4">
                        Average time from enrollment to first paying client: <span className="text-emerald-400 font-semibold">5.2 weeks</span>
                    </p>
                </div>
            </div>

            {/* Locked Banner */}
            {!isGraduate && (
                <div style={{ background: "rgba(212,175,55,0.1)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                        <Lock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                        <p className="text-sm text-white/70">
                            <span className="font-semibold text-gold-400">Complete your certification to share your story</span>
                            <span className="hidden sm:inline text-white/50"> — You can read and get inspired now!</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Post Composer */}
                {isGraduate && (
                    <div className="rounded-2xl shadow-sm p-5 mb-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.2)" }}>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold-400" />
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
                                            ? "text-burgundy-900 border-gold-500"
                                            : "bg-white/5 text-white/60 border-white/10 hover:border-gold-500/50"
                                    )}
                                    style={selectedPostType === opt.value ? { background: GOLD_GRADIENT } : {}}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="What's your journey been like? Share your wins, challenges, and advice..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold-500/50 focus:ring-gold-500/20 rounded-xl"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handlePost}
                                disabled={!newPost.trim() || posting}
                                className="rounded-full px-6 font-bold"
                                style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}
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
                        <Loader2 className="w-8 h-8 animate-spin text-gold-400 mb-3" />
                        <p className="text-white/40">Loading stories...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.2)" }}>
                        <GraduationCap className="w-12 h-12 text-gold-400/50 mx-auto mb-4" />
                        <p className="text-white/60 font-medium">No stories yet</p>
                        <p className="text-white/30 text-sm mt-1">Be the first to share your journey!</p>
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
                                    className="rounded-full px-8 border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
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
                                <p className="text-white/30 text-sm">You've read all the stories! 🎉</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
