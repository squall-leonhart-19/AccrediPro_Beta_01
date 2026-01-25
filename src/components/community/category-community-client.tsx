"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Eye,
  Clock,
  Heart,
  Trophy,
  HelpCircle,
  Lightbulb,
  Hand,
  ArrowLeft,
  Users,
  FileText,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

// Channel type icons and colors
const CHANNEL_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  INTRODUCTIONS: { icon: Hand, color: "text-pink-600", bgColor: "bg-pink-100", label: "Introductions" },
  WINS: { icon: Trophy, color: "text-amber-600", bgColor: "bg-amber-100", label: "Wins & Celebrations" },
  QUESTIONS: { icon: HelpCircle, color: "text-blue-600", bgColor: "bg-blue-100", label: "Questions & Support" },
  TIPS: { icon: Lightbulb, color: "text-green-600", bgColor: "bg-green-100", label: "Tips & Resources" },
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

export function CategoryCommunityClient({
  category,
  posts,
  stats,
  isAdmin,
}: CategoryCommunityClientProps) {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  // Filter posts by active channel
  const filteredPosts = useMemo(() => {
    if (!activeChannel) return posts;

    // Find the channel
    const channel = category.channels.find(c => c.id === activeChannel);
    if (!channel) return posts;

    // Filter by channelId or by categoryId matching channel type
    return posts.filter(post => {
      if (post.channelId === activeChannel) return true;
      // Also match by categoryId pattern (e.g., "introductions", "wins")
      const categoryMatch = post.category.toLowerCase();
      const channelType = channel.type.toLowerCase();
      return categoryMatch === channelType || categoryMatch.includes(channelType.replace('s', ''));
    });
  }, [posts, activeChannel, category.channels]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/community')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: category.color || '#6B7280' }}
              >
                {category.name[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {stats.totalMembers} members
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {stats.totalPosts} posts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Channel Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border shadow-sm sticky top-24">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Channels</h3>
              </div>
              <div className="p-2">
                {/* All Posts */}
                <button
                  onClick={() => setActiveChannel(null)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    activeChannel === null
                      ? 'bg-burgundy-50 text-burgundy-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Flame className={`w-4 h-4 ${activeChannel === null ? 'text-burgundy-600' : 'text-gray-400'}`} />
                    <span className="font-medium">All Posts</span>
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {posts.length}
                  </Badge>
                </button>

                <div className="my-2 mx-3 h-px bg-gray-100" />

                {/* Channel buttons */}
                {category.channels.map((channel) => {
                  const config = CHANNEL_CONFIG[channel.type] || CHANNEL_CONFIG.TIPS;
                  const Icon = config.icon;
                  const count = channelCounts[channel.id] || 0;
                  const isActive = activeChannel === channel.id;

                  return (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? `${config.bgColor} ${config.color}`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? config.color : 'text-gray-400'}`} />
                        <span className="font-medium text-sm">{config.label}</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${isActive ? config.bgColor : ''}`}
                      >
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1">
            {/* Channel Header */}
            {activeChannel && (
              <div className="mb-4">
                {(() => {
                  const channel = category.channels.find(c => c.id === activeChannel);
                  if (!channel) return null;
                  const config = CHANNEL_CONFIG[channel.type] || CHANNEL_CONFIG.TIPS;
                  const Icon = config.icon;
                  return (
                    <div className={`p-4 rounded-xl ${config.bgColor} border`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <h2 className={`font-bold ${config.color}`}>{config.label}</h2>
                          <p className="text-sm text-gray-600">
                            {channel.type === 'INTRODUCTIONS' && 'Introduce yourself to the community!'}
                            {channel.type === 'WINS' && 'Celebrate your achievements and milestones!'}
                            {channel.type === 'QUESTIONS' && 'Ask questions and get support from peers.'}
                            {channel.type === 'TIPS' && 'Share valuable tips and resources.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No posts in this channel yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share something!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => {
                  const totalReactions = post.reactions
                    ? Object.values(post.reactions).reduce((a, b) => a + b, 0)
                    : post.likeCount;

                  return (
                    <Link key={post.id} href={`/community/${post.id}`}>
                      <Card className="hover:shadow-md transition-all cursor-pointer border-gray-200 hover:border-burgundy-200">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Author Avatar */}
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={post.author.avatar || undefined} />
                              <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm">
                                {getInitials(post.author.firstName, post.author.lastName)}
                              </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                                    {post.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {post.author.firstName} {post.author.lastName}
                                    <span className="mx-1.5">·</span>
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                                {post.isPinned && (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                                    Pinned
                                  </Badge>
                                )}
                              </div>

                              {/* Preview */}
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                              </p>

                              {/* Stats */}
                              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                {post.reactions && Object.keys(post.reactions).length > 0 && (
                                  <span className="flex items-center gap-1">
                                    {Object.entries(post.reactions).slice(0, 3).map(([emoji]) => (
                                      <span key={emoji}>{emoji}</span>
                                    ))}
                                    <span className="ml-1">{totalReactions}</span>
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  {post._count.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {post.viewCount}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 self-center" />
                          </div>
                        </CardContent>
                      </Card>
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
