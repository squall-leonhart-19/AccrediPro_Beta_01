"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Eye,
  Trophy,
  HelpCircle,
  Lightbulb,
  Hand,
  ArrowLeft,
  Users,
  Flame,
  Plus,
  Search,
  MoreHorizontal,
  Pin,
  CheckCircle2,
  Award,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// Channel type icons and colors - Skool style
const CHANNEL_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; hoverBg: string; label: string; emoji: string }> = {
  INTRODUCTIONS: { icon: Hand, color: "text-pink-600", bgColor: "bg-pink-500", hoverBg: "hover:bg-pink-50", label: "Introductions", emoji: "👋" },
  WINS: { icon: Trophy, color: "text-amber-600", bgColor: "bg-amber-500", hoverBg: "hover:bg-amber-50", label: "Wins & Celebrations", emoji: "🏆" },
  QUESTIONS: { icon: HelpCircle, color: "text-blue-600", bgColor: "bg-blue-500", hoverBg: "hover:bg-blue-50", label: "Questions & Support", emoji: "❓" },
  TIPS: { icon: Lightbulb, color: "text-emerald-600", bgColor: "bg-emerald-500", hoverBg: "hover:bg-emerald-50", label: "Tips & Resources", emoji: "💡" },
};

interface Channel {
  id: string;
  slug: string;
  name: string;
  type: string;
  emoji: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  channelId: string | null;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  reactions: Record<string, number> | null;
  createdAt: Date;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface CategoryCommunityClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    channels: Channel[];
  };
  posts: Post[];
  stats: {
    totalPosts: number;
    totalMembers: number;
  };
  isAdmin: boolean;
}

function getInitials(firstName: string | null, lastName: string | null) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
}

// Category emoji mapping
const CATEGORY_EMOJIS: Record<string, string> = {
  fm: "🩺",
  tr: "💔",
  mh: "🧠",
  pf: "👨‍👩‍👧",
  se: "✨",
  mb: "🧘",
  pw: "🐾",
  hb: "🌿",
  wh: "💕",
  gw: "💚",
};

function getCategoryEmoji(slug: string) {
  return CATEGORY_EMOJIS[slug] || "🎓";
}

export function CategoryCommunityClient({
  category,
  posts,
  stats,
  isAdmin,
}: CategoryCommunityClientProps) {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts by active channel and search
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by channel
    if (activeChannel) {
      const channel = category.channels.find(c => c.id === activeChannel);
      if (channel) {
        filtered = filtered.filter(post => {
          if (post.channelId === activeChannel) return true;
          const categoryMatch = post.category.toLowerCase();
          const channelType = channel.type.toLowerCase();
          return categoryMatch === channelType || categoryMatch.includes(channelType.replace('s', ''));
        });
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, activeChannel, category.channels, searchQuery]);

  // Get posts count per channel
  const channelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    category.channels.forEach(channel => {
      counts[channel.id] = posts.filter(post => {
        if (post.channelId === channel.id) return true;
        const categoryMatch = post.category.toLowerCase();
        const channelType = channel.type.toLowerCase();
        return categoryMatch === channelType || categoryMatch.includes(channelType.replace('s', ''));
      }).length;
    });
    return counts;
  }, [posts, category.channels]);

  const activeChannelConfig = activeChannel
    ? CHANNEL_CONFIG[category.channels.find(c => c.id === activeChannel)?.type || "TIPS"]
    : null;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ASI Branded Hero Header - Solid Burgundy */}
      <div className="relative overflow-hidden bg-[#722f37]">
        {/* Subtle metallic accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

        {/* Trust Bar */}
        <div className="relative bg-white/10 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-white">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">AccrediPro Standards Institute™</span>
              </span>
              <span className="hidden sm:block text-white/50">•</span>
              <span className="hidden sm:flex items-center gap-1.5 text-white">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>CPD Certified Community</span>
              </span>
              <span className="hidden md:block text-white/50">•</span>
              <span className="hidden md:flex items-center gap-1.5 text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>20,000+ Certified Practitioners</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Top Nav with Logo */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/community')}
              className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Community</span>
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo-accredipro-white.png"
                alt="AccrediPro"
                className="h-7 sm:h-8 opacity-90"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Category Info */}
          <div className="px-4 sm:px-6 pb-8 pt-2">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {/* Glassmorphism Category Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border border-white/20 ring-1 ring-white/10">
                  {getCategoryEmoji(category.slug)}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                    {category.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Member Count */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <Users className="w-4 h-4 text-amber-300" />
                      <span className="text-white/90 text-sm">
                        <span className="font-semibold text-white">{stats.totalMembers.toLocaleString()}</span> members
                      </span>
                    </div>
                    {/* Post Count */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <MessageSquare className="w-4 h-4 text-amber-300" />
                      <span className="text-white/90 text-sm">
                        <span className="font-semibold text-white">{stats.totalPosts.toLocaleString()}</span> posts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Create Post Button - Gold Accent */}
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg font-semibold gap-2 px-6 border border-amber-400/30"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Sidebar - Channels */}
          <div className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Channels</h3>
              </div>

              <div className="p-2">
                {/* All Posts */}
                <button
                  onClick={() => setActiveChannel(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    activeChannel === null
                      ? "bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white shadow-md"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                    activeChannel === null ? "bg-white/20" : "bg-gray-100"
                  )}>
                    🔥
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-sm">All Posts</span>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    activeChannel === null ? "bg-white/20" : "bg-gray-100 text-gray-600"
                  )}>
                    {posts.length}
                  </span>
                </button>

                <div className="my-2 mx-3 h-px bg-gray-100" />

                {/* Channel buttons */}
                {category.channels.map((channel) => {
                  const config = CHANNEL_CONFIG[channel.type] || CHANNEL_CONFIG.TIPS;
                  const count = channelCounts[channel.id] || 0;
                  const isActive = activeChannel === channel.id;

                  return (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-1",
                        isActive
                          ? `bg-gradient-to-r ${config.bgColor} to-${config.bgColor}/80 text-white shadow-md`
                          : `${config.hoverBg} text-gray-700`
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                        isActive ? "bg-white/20" : "bg-gray-100"
                      )}>
                        {config.emoji}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-sm">{config.label}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        isActive ? "bg-white/20" : "bg-gray-100 text-gray-600"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-burgundy-200 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Active Channel Banner */}
            {activeChannelConfig && (
              <div className={cn(
                "rounded-2xl p-5 mb-4 border",
                activeChannel && category.channels.find(c => c.id === activeChannel)?.type === "WINS"
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
                  : activeChannel && category.channels.find(c => c.id === activeChannel)?.type === "INTRODUCTIONS"
                    ? "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200"
                    : activeChannel && category.channels.find(c => c.id === activeChannel)?.type === "QUESTIONS"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                    {activeChannelConfig.emoji}
                  </div>
                  <div>
                    <h2 className={cn("font-bold text-lg", activeChannelConfig.color)}>
                      {activeChannelConfig.label}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {category.channels.find(c => c.id === activeChannel)?.type === 'INTRODUCTIONS' && 'Welcome new members! Introduce yourself to the community.'}
                      {category.channels.find(c => c.id === activeChannel)?.type === 'WINS' && 'Celebrate your achievements and inspire others!'}
                      {category.channels.find(c => c.id === activeChannel)?.type === 'QUESTIONS' && 'Ask questions and get help from the community.'}
                      {category.channels.find(c => c.id === activeChannel)?.type === 'TIPS' && 'Share valuable tips, resources, and insights.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
                <p className="text-gray-500 text-sm mb-4">Be the first to share something!</p>
                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden">
                {filteredPosts.map((post, index) => {
                  const totalReactions = post.reactions
                    ? Object.values(post.reactions).reduce((a, b) => a + b, 0)
                    : post.likeCount;
                  const isLast = index === filteredPosts.length - 1;

                  return (
                    <Link key={post.id} href={`/community/${post.id}`}>
                      <article className={cn(
                        "px-5 py-5 hover:bg-gray-50/70 transition-colors group",
                        !isLast && "border-b border-gray-100"
                      )}>
                        {/* Author Row */}
                        <div className="flex items-start gap-3 mb-3">
                          {/* Author Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white text-sm font-medium">
                              {post.author.avatar ? (
                                <img
                                  src={post.author.avatar}
                                  alt={`${post.author.firstName} ${post.author.lastName}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : null}
                              <span className={post.author.avatar ? "hidden" : ""}>
                                {getInitials(post.author.firstName, post.author.lastName)}
                              </span>
                            </div>
                            {(post.author.role === "ADMIN" || post.author.role === "MENTOR") && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-burgundy-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Author Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900 text-sm">
                                {post.author.firstName} {post.author.lastName}
                              </span>
                              {(post.author.role === "ADMIN" || post.author.role === "MENTOR") && (
                                <span className="text-xs bg-burgundy-100 text-burgundy-700 px-1.5 py-0.5 rounded font-medium">
                                  Coach
                                </span>
                              )}
                              <span className="text-gray-400 text-sm">·</span>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                              {post.isPinned && (
                                <>
                                  <span className="text-gray-400 text-sm">·</span>
                                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                    <Pin className="w-2.5 h-2.5" />
                                    Pinned
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Post Title */}
                        <h3 className="font-bold text-gray-900 text-[17px] mb-2 group-hover:text-burgundy-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Post Content Preview */}
                        <p className="text-gray-600 line-clamp-2 text-[15px] leading-relaxed mb-4">
                          {post.content.replace(/<[^>]*>/g, '').substring(0, 180)}
                          {post.content.length > 180 && '...'}
                        </p>

                        {/* Engagement Row - Clean, no background */}
                        <div className="flex items-center gap-5 text-sm">
                          {/* Reactions */}
                          {post.reactions && Object.keys(post.reactions).length > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {Object.entries(post.reactions).slice(0, 4).map(([emoji]) => (
                                  <span key={emoji} className="text-base">
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                              <span className="text-gray-600 font-medium">
                                {totalReactions.toLocaleString()}
                              </span>
                            </div>
                          )}

                          {/* Comments */}
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{post._count.comments}</span>
                          </div>

                          {/* Views */}
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
