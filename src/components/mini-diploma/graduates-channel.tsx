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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const POST_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    certificate: { icon: GraduationCap, label: "Just Certified", color: "text-emerald-600 bg-emerald-50" },
    first_client: { icon: Star, label: "First Client", color: "text-amber-600 bg-amber-50" },
    income_milestone: { icon: DollarSign, label: "Income Milestone", color: "text-green-600 bg-green-50" },
    transformation: { icon: Sparkles, label: "Transformation", color: "text-purple-600 bg-purple-50" },
    tip: { icon: MessageCircle, label: "Tips & Advice", color: "text-blue-600 bg-blue-50" },
    gratitude: { icon: Heart, label: "Gratitude", color: "text-rose-600 bg-rose-50" },
    question: { icon: MessageCircle, label: "Question", color: "text-indigo-600 bg-indigo-50" },
    win: { icon: Trophy, label: "Win!", color: "text-amber-600 bg-amber-50" },
    struggle: { icon: Heart, label: "Real Talk", color: "text-slate-600 bg-slate-50" },
    advice: { icon: Star, label: "Pro Tip", color: "text-teal-600 bg-teal-50" },
    mindset: { icon: Sparkles, label: "Mindset", color: "text-violet-600 bg-violet-50" },
    milestone: { icon: Award, label: "Milestone", color: "text-gold-600 bg-gold-50" },
};

function PostCard({ post, onLike }: { post: GraduatePost; onLike: (id: string) => void }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);

    const authorName = post.profile?.name || `${post.user?.firstName || ""} ${post.user?.lastName || ""}`.trim() || "Graduate";
    const authorAvatar = post.profile?.avatar || post.user?.avatar;
    const location = post.profile?.location;
    const incomeLevel = post.profile?.incomeLevel;

    const typeConfig = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.tip;
    const TypeIcon = typeConfig.icon;

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            setLikeCount(prev => prev + 1);
            onLike(post.id);
        }
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
        <div className="bg-white py-5 px-4 md:px-6 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-burgundy-100 to-gold-100">
                        {authorAvatar ? (
                            <Image
                                src={authorAvatar}
                                alt={authorName}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white font-semibold">
                                {authorName.charAt(0)}
                            </div>
                        )}
                    </div>
                    {incomeLevel && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <Trophy className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Author Line */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm">{authorName}</span>
                        {location && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {location}
                            </span>
                        )}
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">{timeAgo(post.postedAt)}</span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-[10px] font-medium px-2 py-0 h-5 border-0", typeConfig.color)}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeConfig.label}
                        </Badge>
                        {incomeLevel && (
                            <Badge className="text-[10px] font-medium px-2 py-0 h-5 border-0 bg-emerald-50 text-emerald-600">
                                <DollarSign className="w-3 h-3 mr-0.5" />
                                {incomeLevel}
                            </Badge>
                        )}
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                        {post.content}
                    </p>

                    {/* Image */}
                    {post.imageUrl && (
                        <div className="mb-3 rounded-xl overflow-hidden max-w-md">
                            <Image
                                src={post.imageUrl}
                                alt="Post image"
                                width={400}
                                height={250}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-5">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-all",
                                liked ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                            <span>{likeCount}</span>
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-burgundy-600 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                        </button>
                    </div>

                    {/* Comments */}
                    {showComments && post.comments && post.comments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                            {post.comments.map((comment, i) => (
                                <div key={i} className="text-sm">
                                    <span className="font-medium text-gray-700">{comment.name}</span>
                                    <span className="text-gray-500 ml-2">{comment.content}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
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
                    postType: "tip",
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

    return (
        <div className={cn("-mx-4 lg:-mx-8 -mt-4 lg:-mt-8", className)}>
            {/* Hero Header - Full Width */}
            <div className="bg-gradient-to-r from-burgundy-700 via-burgundy-800 to-burgundy-900 px-4 md:px-8 py-6 text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Graduate Stories</h1>
                            <p className="text-burgundy-200 text-xs">Real wins from real practitioners</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                            <Users className="w-4 h-4 mx-auto mb-1 text-gold-400" />
                            <p className="text-base font-bold">2,847</p>
                            <p className="text-[9px] text-burgundy-300 uppercase tracking-wide">Graduates</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                            <p className="text-base font-bold">$9.2K</p>
                            <p className="text-[9px] text-burgundy-300 uppercase tracking-wide">Avg Income</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                            <Award className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                            <p className="text-base font-bold">94%</p>
                            <p className="text-[9px] text-burgundy-300 uppercase tracking-wide">Success Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Locked Banner */}
            {!isGraduate && (
                <div className="bg-amber-50 px-4 md:px-8 py-3 flex items-center gap-3 border-b border-amber-100">
                    <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                        <span className="font-medium">Complete your certification to post</span>
                        <span className="hidden sm:inline"> — You can read stories now!</span>
                    </p>
                </div>
            )}

            {/* Post Composer */}
            {isGraduate && (
                <div className="bg-white px-4 md:px-8 py-4 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center text-white flex-shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Share your win with the community..."
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    className="min-h-[70px] resize-none border-gray-200 focus:border-burgundy-300 focus:ring-burgundy-200 text-sm"
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={handlePost}
                                        disabled={!newPost.trim() || posting}
                                        size="sm"
                                        className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                                    >
                                        {posting ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                        ) : (
                                            <Send className="w-4 h-4 mr-1" />
                                        )}
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Feed */}
            <div className="bg-white">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-burgundy-500 mb-2" />
                        <p className="text-gray-400 text-sm">Loading stories...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No stories yet</p>
                        <p className="text-gray-400 text-xs">Be the first to share your win!</p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} onLike={handleLike} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && posts.length > 0 && (
                            <div className="py-6 flex justify-center border-t border-gray-100">
                                <Button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    variant="outline"
                                    className="px-8 border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50 hover:text-burgundy-700"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More Stories"
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* End of feed message */}
                        {!hasMore && posts.length > 0 && (
                            <div className="py-6 text-center border-t border-gray-100">
                                <p className="text-gray-400 text-sm">You've reached the end! 🎉</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
