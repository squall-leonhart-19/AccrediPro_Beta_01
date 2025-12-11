"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  MessageSquare,
  Pin,
  Eye,
  Clock,
  Search,
  TrendingUp,
  Heart,
  Sparkles,
  Trophy,
  HelpCircle,
  Lightbulb,
  Megaphone,
  Hand,
  Building2,
  ChevronRight,
} from "lucide-react";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

// Post categories for filtering within communities
const postCategories = [
  { id: "all", label: "All Posts", icon: MessageSquare, color: "bg-gray-100 text-gray-700" },
  { id: "introductions", label: "Introduce Yourself", icon: Hand, color: "bg-pink-100 text-pink-700" },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700" },
  { id: "tips", label: "Daily Coach Tips", icon: Lightbulb, color: "bg-green-100 text-green-700" },
  { id: "questions", label: "Questions & Help", icon: HelpCircle, color: "bg-orange-100 text-orange-700" },
  { id: "graduates", label: "Graduates", icon: Sparkles, color: "bg-purple-100 text-purple-700" },
];

interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  communityId: string | null;
  communityName?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  isPinned: boolean;
  viewCount: number;
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

interface Stats {
  totalMembers: number;
  totalPosts: number;
  totalComments: number;
  activeToday: number;
}

interface Community {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  memberCount: number;
}

interface CommunityClientProps {
  posts: Post[];
  stats: Stats;
  communities?: Community[];
  isAdmin?: boolean;
}

export function CommunityClient({ posts, stats, communities = [], isAdmin = false }: CommunityClientProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by community
      const matchesCommunity = selectedCommunity === "all" || post.communityId === selectedCommunity;
      // Filter by post category
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      // Filter by search
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCommunity && matchesCategory && matchesSearch;
    });
  }, [posts, selectedCommunity, selectedCategory, searchQuery]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">Admin</Badge>;
      case "INSTRUCTOR":
        return <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Instructor</Badge>;
      case "MENTOR":
        return <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Coach</Badge>;
      default:
        return null;
    }
  };

  const selectedCommunityData = communities.find(c => c.id === selectedCommunity);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 sm:mb-0 sm:hidden">
                <Heart className="w-7 h-7 text-gold-400" />
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Heart className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Community</h1>
                  <p className="text-burgundy-100 text-lg">
                    {selectedCommunityData
                      ? selectedCommunityData.categoryName + " Community"
                      : "Connect and grow together"}
                  </p>
                </div>
              </div>
            </div>
            <CreatePostDialog
                              communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
                              communityName={selectedCommunityData?.name}
                            />
          </div>
        </CardContent>
      </Card>

      {/* Community Selector - Only show if user has multiple communities */}
      {communities.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCommunity("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCommunity === "all"
                ? "bg-burgundy-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            All Communities
          </button>
          {communities.map((community) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunity(community.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCommunity === community.id
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              style={
                selectedCommunity === community.id
                  ? { backgroundColor: community.categoryColor || "#722F37" }
                  : {}
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: community.categoryColor || "#722F37" }}
              />
              {community.categoryName}
            </button>
          ))}
        </div>
      )}

      {/* No communities message for students without enrollments */}
      {communities.length === 0 && !isAdmin && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Join a Community</h3>
            <p className="text-amber-700 mb-4">
              Enroll in a course to gain access to its exclusive community and connect with fellow students!
            </p>
            <Link href="/courses">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Explore Courses
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-burgundy-100 rounded-lg">
              <Users className="w-5 h-5 text-burgundy-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              <p className="text-sm text-gray-500">Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeToday}</p>
              <p className="text-sm text-gray-500">Active Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              <p className="text-sm text-gray-500">Discussions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
              <p className="text-sm text-gray-500">Replies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Post Categories */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-burgundy-600" />
                Topics
              </h3>
              <div className="space-y-1">
                {postCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left text-sm transition-all ${
                      selectedCategory === cat.id
                        ? "bg-burgundy-50 border border-burgundy-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${cat.color}`}>
                      <cat.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={
                        selectedCategory === cat.id
                          ? "font-medium text-burgundy-700"
                          : "text-gray-700"
                      }
                    >
                      {cat.label}
                    </span>
                    {selectedCategory === cat.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-burgundy-500" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4">
              <h3 className="font-semibold text-amber-800 mb-2 text-sm">Community Guidelines</h3>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>Be respectful and supportive</li>
                <li>Celebrate each other&apos;s wins</li>
                <li>No spam or self-promotion</li>
                <li>Keep discussions on-topic</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Posts */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "all" || selectedCommunity !== "all") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Filters:</span>
              {selectedCommunity !== "all" && selectedCommunityData && (
                <Badge
                  className="border-0 text-white"
                  style={{ backgroundColor: selectedCommunityData.categoryColor || "#722F37" }}
                >
                  {selectedCommunityData.categoryName}
                  <button
                    onClick={() => setSelectedCommunity("all")}
                    className="ml-1.5 hover:opacity-80"
                  >
                    &times;
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                  {postCategories.find((c) => c.id === selectedCategory)?.label}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1.5 hover:opacity-80"
                  >
                    &times;
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedCommunity("all");
                }}
                className="text-sm text-burgundy-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="hover:shadow-md hover:border-burgundy-200 transition-all">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-white shadow-sm">
                        <AvatarImage src={post.author.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white">
                          {getInitials(post.author.firstName, post.author.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.isPinned && (
                                <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center gap-1">
                                  <Pin className="w-3 h-3" />
                                  Pinned
                                </Badge>
                              )}
                              {post.categoryName && selectedCommunity === "all" && (
                                <Badge
                                  className="text-white border-0 text-xs"
                                  style={{ backgroundColor: post.categoryColor || "#722F37" }}
                                >
                                  {post.categoryName}
                                </Badge>
                              )}
                              <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-burgundy-700 transition-colors">
                                {post.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <span className="font-medium text-gray-700">
                                {post.author.firstName} {post.author.lastName}
                              </span>
                              {getRoleBadge(post.author.role)}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{post.content}</p>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1.5 text-rose-500">
                            <Heart className="w-4 h-4 fill-rose-500" />
                            <span className="font-medium">{post._count.likes}</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post._count.comments} replies</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount} views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-burgundy-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery || selectedCategory !== "all" || selectedCommunity !== "all"
                      ? "No discussions found"
                      : "No discussions yet"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCategory !== "all" || selectedCommunity !== "all"
                      ? "Try adjusting your filters"
                      : "Be the first to start a conversation!"}
                  </p>
                  <CreatePostDialog
                              communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
                              communityName={selectedCommunityData?.name}
                            />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
