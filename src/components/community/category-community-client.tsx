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
  Users,
  Flame,
  Plus,
  Search,
  Pin,
  CheckCircle2,
  Award,
  Shield,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Target,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

// Channel type icons and colors
const CHANNEL_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string; emoji: string }> = {
  INTRODUCTIONS: { icon: Hand, color: "text-pink-600", bgColor: "bg-pink-500", label: "Introductions", emoji: "👋" },
  WINS: { icon: Trophy, color: "text-amber-600", bgColor: "bg-amber-500", label: "Wins & Celebrations", emoji: "🏆" },
  GRADUATES: { icon: GraduationCap, color: "text-purple-600", bgColor: "bg-purple-500", label: "Graduates", emoji: "🎓" },
  QUESTIONS: { icon: HelpCircle, color: "text-blue-600", bgColor: "bg-blue-500", label: "Questions & Support", emoji: "❓" },
  TIPS: { icon: Lightbulb, color: "text-emerald-600", bgColor: "bg-emerald-500", label: "Tips & Resources", emoji: "💡" },
  BUSINESS: { icon: Briefcase, color: "text-indigo-600", bgColor: "bg-indigo-500", label: "Business Academy", emoji: "💼" },
  DEGREES: { icon: GraduationCap, color: "text-yellow-600", bgColor: "bg-yellow-500", label: "University Degrees", emoji: "🇨🇭" },
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
    certified: number;
    coaches: number;
    earnings: number;
    goalTarget: number;
    goalProgress: number;
  };
  isAdmin: boolean;
  activeChannelType?: string;
}

function getInitials(firstName: string | null, lastName: string | null) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
}

// Strip HTML tags from content for preview
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function CategoryCommunityClient({
  category,
  posts,
  stats,
  isAdmin,
  activeChannelType,
}: CategoryCommunityClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Get channel config for active channel
  const activeChannelConfig = activeChannelType ? CHANNEL_CONFIG[activeChannelType] : null;

  // Filter posts by search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 border-b border-burgundy-600">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Title & Info */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {activeChannelConfig ? (
                  <span className="flex items-center gap-2">
                    <span>{activeChannelConfig.emoji}</span>
                    <span>{activeChannelConfig.label}</span>
                  </span>
                ) : (
                  category.name
                )}
              </h1>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {stats.totalMembers.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  {stats.totalPosts.toLocaleString()} posts
                </span>
              </div>
            </div>

            {/* Create Post CTA */}
            <CreatePostDialog />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Stats Sidebar */}
          <div className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              {/* Stats Widget */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-3">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">👥 Members</span>
                    <span className="font-bold text-gray-900">{stats.totalMembers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">🎓 Certified</span>
                    <span className="font-bold text-emerald-600">{stats.certified.toLocaleString()}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">👩‍⚕️ Coaches</span>
                    <span className="font-bold text-burgundy-600">{stats.coaches}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">💰 Earned</span>
                    <span className="font-bold text-amber-600">${(stats.earnings / 1000000).toFixed(1)}M+</span>
                  </div>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">🎯 Goal</span>
                  <span className="text-xs font-bold text-burgundy-600">{stats.goalProgress}%</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stats.goalTarget.toLocaleString()} Certified by 2026
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.goalProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="relative">
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

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
                <p className="text-gray-500 text-sm mb-4">Be the first to share something!</p>
                <CreatePostDialog />
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden">
                {filteredPosts.map((post, index) => {
                  const totalReactions = post.reactions
                    ? Object.values(post.reactions).reduce((a, b) => a + b, 0)
                    : post.likeCount;
                  const isLast = index === filteredPosts.length - 1;

                  return (
                    <Link
                      key={post.id}
                      href={`/community/${post.id}`}
                      className={cn(
                        "block hover:bg-gray-50 transition-colors",
                        !isLast && "border-b border-gray-100"
                      )}
                    >
                      <article className="p-4 sm:p-5">
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                            <AvatarImage src={post.author.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white text-xs font-bold">
                              {getInitials(post.author.firstName, post.author.lastName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900 text-sm">
                                {post.author.firstName} {post.author.lastName}
                              </span>
                              {post.author.role === "MENTOR" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                                  <Award className="w-2.5 h-2.5" />
                                  COACH
                                </span>
                              )}
                              {post.isPinned && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                                  <Pin className="w-2.5 h-2.5" />
                                  PINNED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{stripHtml(post.content)}</p>

                        {/* Post Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span className="text-base">❤️</span>
                            {totalReactions}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {post._count.comments}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {post.viewCount}
                          </span>
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
