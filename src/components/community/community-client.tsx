"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
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
  GraduationCap,
  Shield,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Award,
  Flame,
  BadgeCheck,
  Headphones,
  ChevronDown,
  Trash2,
  MoreVertical,
  AlertTriangle,
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
import { useRouter } from "next/navigation";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

// Sort options
const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "popular", label: "Most Popular", icon: TrendingUp },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "most_comments", label: "Most Discussed", icon: MessageCircle },
];

// Post categories for filtering within communities
// Order: Introduce Yourself, Daily Coach Tips, Share Your Wins (merged), New Graduates, Questions & Help (last)
// Comment-only: introductions, tips (users can only comment, not create new posts)
const postCategories = [
  { id: "introductions", label: "Introduce Yourself", icon: Hand, color: "bg-pink-100 text-pink-700", bgGradient: "from-pink-50 to-rose-50", commentOnly: true },
  { id: "tips", label: "Coaching Tips", icon: Lightbulb, color: "bg-green-100 text-green-700", bgGradient: "from-green-50 to-emerald-50", commentOnly: true },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700", bgGradient: "from-amber-50 to-yellow-50" },
  { id: "graduates", label: "New Graduates", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700", bgGradient: "from-emerald-50 to-teal-50" },
  { id: "questions", label: "Questions & Help", icon: HelpCircle, color: "bg-blue-100 text-blue-700", bgGradient: "from-blue-50 to-sky-50" },
];

// Featured graduates pool - rotates daily
const FEATURED_GRADUATES = [
  {
    name: "Maria Rodriguez",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Earned $8,500 in her first 60 days!",
    quote: "The community support made all the difference. I couldn't have done it without the coaches and fellow students cheering me on!",
    certified: true,
    monthsActive: 4,
  },
  {
    name: "Jennifer Thompson",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Quit her nursing job & now earns more!",
    quote: "25 years as an ER nurse. Now I help 47+ clients and actually enjoy my work again!",
    certified: true,
    monthsActive: 12,
  },
  {
    name: "David Chen",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Signed first $1,200 client in week 3!",
    quote: "After 3 weeks of networking, someone said YES! I'm literally shaking - this is real!",
    certified: true,
    monthsActive: 2,
  },
  {
    name: "Amanda Foster",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Hit $5K monthly revenue in month 4!",
    quote: "Posting valuable content and following up with every lead. The business kits made launching so easy!",
    certified: true,
    monthsActive: 4,
  },
  {
    name: "Sarah Williams",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Booked 12 clients in first month!",
    quote: "The structured curriculum and mentor support gave me everything I needed to succeed!",
    certified: true,
    monthsActive: 3,
  },
  {
    name: "Michael Roberts",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Left corporate & earning $8K/month!",
    quote: "Best decision I ever made. The community keeps me motivated every single day!",
    certified: true,
    monthsActive: 6,
  },
  {
    name: "Lisa Martinez",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Launched online practice, 20+ clients!",
    quote: "From zero to 20 clients in 2 months. The training is worth every minute!",
    certified: true,
    monthsActive: 2,
  },
];

// Get daily rotating featured graduate based on day of year
const getDailyFeaturedGraduate = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return FEATURED_GRADUATES[dayOfYear % FEATURED_GRADUATES.length];
};

// Generate unique reactions for each post based on post ID (deterministic)
function generatePostReactions(postId: string, category: string | null, isPinned: boolean): Record<string, number> {
  // Simple hash function to get a consistent number from post ID
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);

  // Base multipliers based on post type
  let baseMultiplier = 1;
  if (isPinned) {
    baseMultiplier = 3; // Pinned posts get more engagement
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

  // Generate varied but consistent numbers for each emoji
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

// Note: All posts and comments now come from database

interface Post {
  id: string;
  title: string;
  content: string;
  isHtml?: boolean;
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
    isCertified?: boolean;
  };
  _count: {
    comments: number;
    likes: number;
  };
  reactions?: Record<string, number>;
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

export function CommunityClient({ posts: dbPosts, stats, communities = [], isAdmin = false }: CommunityClientProps) {
  const router = useRouter();
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  // Default to "introductions" - most welcoming entry point for new members
  const [selectedCategory, setSelectedCategory] = useState<string | null>("introductions");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Delete post state
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // All posts are now stored in database, so none are "static"
  // We can delete any post (admins only)
  const handleDeletePost = async () => {
    if (!deletePostId) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/community", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: deletePostId }),
      });

      const data = await response.json();

      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setDeletePostId(null);
    }
  };

  // Dynamic impressive stats - updates every 30 seconds for real-time feel
  const getDynamicStats = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const hourOfDay = now.getHours();
    const secondsInDay = hourOfDay * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // Base numbers - starting high, growing day by day
    const baseMembers = 5235;
    const basePractitioners = 1403;
    const baseTransformations = 20134;
    const baseEarnings = 8400000;

    // Add realistic growth day by day (small increments)
    const memberGrowth = dayOfYear * 2; // ~2 new members per day
    const practitionerGrowth = Math.floor(dayOfYear * 0.5); // ~1 every 2 days
    const transformationGrowth = dayOfYear * 5; // ~5 per day
    const earningsGrowth = dayOfYear * 8000; // grows with practitioners

    // Online count: dynamic range 53-197
    // Use sine wave for smooth variation throughout the day
    const onlineBase = 125; // midpoint of 53-197
    const onlineRange = 72; // half of (197-53)

    // Multiple sine waves for natural variation
    const hourVariation = Math.sin((hourOfDay / 24) * Math.PI * 2) * 40; // daily cycle
    const minuteVariation = Math.sin(secondsInDay / 1800) * 20; // 30-min cycle
    const smallVariation = Math.sin(secondsInDay / 180) * 12; // 3-min micro-variation

    // Calculate online count within 53-197 range
    const rawOnline = onlineBase + hourVariation + minuteVariation + smallVariation;
    const onlineNow = Math.max(53, Math.min(197, Math.floor(rawOnline)));

    // Coaches online: 5-10 range
    const baseCoaches = 7;
    const coachVariation = Math.floor(Math.sin(secondsInDay / 600) * 2.5);
    const coachesAvailable = Math.max(5, Math.min(10, baseCoaches + coachVariation));

    return {
      totalMembers: baseMembers + memberGrowth,
      certifiedPractitioners: basePractitioners + practitionerGrowth,
      clientTransformations: baseTransformations + transformationGrowth,
      totalEarnings: baseEarnings + earningsGrowth,
      onlineNow,
      coachesOnline: coachesAvailable,
      avgResponseTime: hourOfDay >= 9 && hourOfDay <= 18 ? "< 30 min" : "< 2 hours",
      postsToday: Math.floor(15 + (dayOfYear % 10) + Math.random() * 10),
      winsThisWeek: Math.floor(23 + (dayOfYear % 7) * 3),
    };
  };

  // State for dynamic stats that updates periodically
  const [dynamicStats, setDynamicStats] = useState(getDynamicStats);

  // Update stats every 30 seconds for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicStats(getDynamicStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // All posts now come from the database - generate unique reactions for each post
  const allPosts = useMemo(() => {
    return dbPosts.map(post => {
      // Generate unique reactions for each post based on its ID
      if (!post.reactions || Object.keys(post.reactions).length === 0) {
        return {
          ...post,
          reactions: generatePostReactions(post.id, post.category, post.isPinned),
        };
      }
      return post;
    });
  }, [dbPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = allPosts.filter((post) => {
      const matchesCommunity = selectedCommunity === "all" || post.communityId === selectedCommunity;
      const matchesCategory = selectedCategory === null || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCommunity && matchesCategory && matchesSearch;
    });

    // Sort posts
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b._count.likes - a._count.likes);
        break;
      case "trending":
        // Trending = high engagement relative to age
        filtered = [...filtered].sort((a, b) => {
          const aScore = (a._count.likes + a._count.comments * 2) / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
          const bScore = (b._count.likes + b._count.comments * 2) / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60));
          return bScore - aScore;
        });
        break;
      case "most_comments":
        filtered = [...filtered].sort((a, b) => b._count.comments - a._count.comments);
        break;
      case "newest":
      default:
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Always show pinned posts first
    const pinned = filtered.filter(p => p.isPinned);
    const notPinned = filtered.filter(p => !p.isPinned);
    return [...pinned, ...notPinned];
  }, [allPosts, selectedCommunity, selectedCategory, searchQuery, sortBy]);

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
        return (
          <Badge className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white border-0 text-[10px] font-semibold">
            <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Admin
          </Badge>
        );
      case "INSTRUCTOR":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-[10px] font-semibold">
            Instructor
          </Badge>
        );
      case "MENTOR":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-semibold">
            <Award className="w-2.5 h-2.5 mr-0.5" /> Coach
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryStyle = (categoryId: string | null) => {
    const cat = postCategories.find(c => c.id === categoryId);
    return cat || { id: "general", label: "General", icon: MessageSquare, color: "bg-gray-100 text-gray-700", bgGradient: "from-gray-50 to-gray-100" };
  };

  const selectedCommunityData = communities.find(c => c.id === selectedCommunity);
  const currentCategoryData = selectedCategory ? postCategories.find(c => c.id === selectedCategory) : null;
  const currentSortOption = SORT_OPTIONS.find(s => s.id === sortBy) || SORT_OPTIONS[0];

  // Calculate total reactions for a post
  const getTotalReactions = (post: Post) => {
    if (!post.reactions) return post._count.likes;
    return Object.values(post.reactions).reduce((sum, count) => sum + count, 0);
  };

  // Get the daily featured graduate
  const featuredGraduate = getDailyFeaturedGraduate();

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Compact Hero Banner */}
      <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 border-0 overflow-hidden relative">
        <CardContent className="p-4 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title + Live Indicator */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Community</h1>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {dynamicStats.onlineNow} online
                  </span>
                  <span className="text-burgundy-200">•</span>
                  <span className="text-burgundy-200">{dynamicStats.coachesOnline} coaches available</span>
                </div>
              </div>
            </div>

            {/* Center: Big Impact Numbers */}
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white">{dynamicStats.totalMembers.toLocaleString()}</p>
                <p className="text-xs text-burgundy-200">Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-gold-400">{dynamicStats.certifiedPractitioners.toLocaleString()}+</p>
                <p className="text-xs text-burgundy-200">Practitioners</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-green-400">${(dynamicStats.totalEarnings / 1000000).toFixed(1)}M+</p>
                <p className="text-xs text-burgundy-200">Earned by Grads</p>
              </div>
              <div className="text-center hidden md:block">
                <p className="text-3xl lg:text-4xl font-bold text-white">{dynamicStats.clientTransformations.toLocaleString()}+</p>
                <p className="text-xs text-burgundy-200">Lives Changed</p>
              </div>
            </div>

            {/* Right: CTA */}
            <CreatePostDialog
              communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
              communityName={selectedCommunityData?.name}
              defaultCategory={selectedCategory || undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Selector - Hidden for now (FM-only launch) */}
      {/* Students see only their enrolled community based on their tag/optin */}

      <div className="grid lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4">
          {/* Featured Graduate Spotlight - Simplified */}
          <Card className="border border-gray-200">
            <div className="bg-burgundy-600 p-3">
              <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4" />
                Success Story
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold text-sm">
                    {featuredGraduate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-gray-900 text-sm">{featuredGraduate.name}</span>
                  <p className="text-xs text-gray-500">{featuredGraduate.title}</p>
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium mb-2">{featuredGraduate.achievement}</p>
              <p className="text-xs text-gray-600 italic">&quot;{featuredGraduate.quote}&quot;</p>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card className="border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <Megaphone className="w-4 h-4 text-burgundy-600" />
                Topics
              </h3>
            </div>
            <CardContent className="p-3">
              <div className="space-y-1">
                {postCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all ${isSelected
                        ? `bg-gradient-to-r ${cat.bgGradient} border-2 border-burgundy-200`
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className={isSelected ? "font-semibold text-burgundy-700" : "text-gray-700"}>
                          {cat.label}
                        </span>
                        {"commentOnly" in cat && cat.commentOnly && (
                          <p className="text-[10px] text-gray-400">Comments only</p>
                        )}
                      </div>
                      {"isNew" in cat && cat.isNew && (
                        <Badge className="bg-purple-500 text-white border-0 text-[10px]">NEW</Badge>
                      )}
                      {isSelected && !("isNew" in cat && cat.isNew) && (
                        <div className="w-2 h-2 rounded-full bg-burgundy-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ask a Coach CTA - Simplified */}
          <Card className="border border-gray-200 hover:border-burgundy-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-burgundy-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ask a Coach</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {dynamicStats.coachesOnline} online
                  </div>
                </div>
              </div>
              <Link href="/messages">
                <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Coach
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Community Guidelines - Simplified */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-700 text-sm">Guidelines</h3>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  Be respectful and supportive
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  Celebrate each other&apos;s wins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  No spam or self-promotion
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4 xl:col-span-5 space-y-5">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search discussions..."
                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-burgundy-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-3 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <currentSortOption.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentSortOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${sortBy === option.id ? 'bg-burgundy-50 text-burgundy-700' : 'text-gray-700'
                        }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                      {sortBy === option.id && <CheckCircle className="w-4 h-4 ml-auto text-burgundy-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Badge */}
          {selectedCategory && currentCategoryData && (
            <div className="flex items-center gap-2">
              <Badge className={`${currentCategoryData.color} border-0 py-2 px-4`}>
                <currentCategoryData.icon className="w-4 h-4 mr-1.5" />
                {currentCategoryData.label}
                <button onClick={() => setSelectedCategory(null)} className="ml-2 hover:opacity-70">×</button>
              </Badge>
            </div>
          )}

          {/* Posts - Compact UI for all */}
          <div className="space-y-3">
            {filteredAndSortedPosts.map((post) => {
              const catStyle = getCategoryStyle(post.category);
              const CatIcon = catStyle.icon;

              // Get actual reaction emojis that have counts > 0
              const activeReactions = Object.entries(post.reactions || {})
                .filter(([_, count]) => count > 0)
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .slice(0, 4);

              return (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 shadow-sm hover:-translate-y-0.5 ${post.isPinned ? 'ring-2 ring-amber-300' : ''}`}>
                    {/* Category Banner - Hide when filtering by that category */}
                    {selectedCategory !== post.category && (
                      <div className={`bg-gradient-to-r ${catStyle.bgGradient} px-4 py-1.5 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${catStyle.color}`}>
                            <CatIcon className="w-3 h-3" />
                          </div>
                          <span className={`text-xs font-medium ${catStyle.color.split(' ')[1]}`}>
                            {catStyle.label}
                          </span>
                        </div>
                        {post.isPinned && (
                          <Badge className="bg-amber-400 text-amber-900 border-0 text-[10px]">
                            <Pin className="w-2.5 h-2.5 mr-1" /> Pinned
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardContent className="p-4">
                      {/* Author Row - Compact */}
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8 ring-1 ring-white shadow-sm">
                          <AvatarImage src={post.author.avatar || undefined} />
                          <AvatarFallback className={`text-xs font-bold text-white ${post.author.role === "MENTOR"
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : post.author.role === "ADMIN"
                              ? "bg-gradient-to-br from-burgundy-500 to-burgundy-700"
                              : "bg-gradient-to-br from-gray-400 to-gray-600"
                            }`}>
                            {getInitials(post.author.firstName, post.author.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {post.author.firstName} {post.author.lastName}
                            </span>
                            {getRoleBadge(post.author.role)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span>{post.viewCount.toLocaleString()} views</span>
                          </div>
                        </div>
                        {/* Admin Delete Button - All posts can be deleted now */}
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeletePostId(post.id);
                                }}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 leading-tight hover:text-burgundy-600 transition-colors mb-2">
                        {post.title}
                      </h3>

                      {/* Content Preview - short */}
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                        {post.content.replace(/\*\*/g, '').replace(/<[^>]*>/g, '').replace(/\n/g, ' ').substring(0, 140)}...
                      </p>

                      {/* Reactions Bar - Show only reactions that exist */}
                      {activeReactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {activeReactions.map(([emoji, count]) => (
                            <span
                              key={emoji}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 border border-gray-200 text-gray-600"
                            >
                              <span>{emoji}</span>
                              <span>{count}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Engagement Bar - Compact */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post._count.comments} comments</span>
                        </span>
                        <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50 text-xs h-7 px-2">
                          Read <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            {filteredAndSortedPosts.length === 0 && (
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-burgundy-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {searchQuery || selectedCategory
                      ? "No posts found"
                      : "Start the conversation!"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery || selectedCategory
                      ? "Try adjusting your filters or search query"
                      : "Be the first to share something with the community"}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={(open) => !open && setDeletePostId(null)}>
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
    </div>
  );
}
