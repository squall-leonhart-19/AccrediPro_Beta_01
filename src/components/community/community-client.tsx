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
  Target,
  X,
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
// Order: Row 1: Introduce Yourself, Coaching Tips | Row 2: Wins, Graduates | Row 3: Questions, Career
// Comment-only: introductions, tips, questions-everyone-has, career-pathway (users can only comment, not create new posts)
const postCategories = [
  { id: "introductions", label: "Introduce Yourself", icon: Hand, color: "bg-pink-100 text-pink-700", bgGradient: "from-pink-50 to-rose-50", commentOnly: true },
  { id: "coaching-tips", label: "Coaching Tips", icon: Lightbulb, color: "bg-green-100 text-green-700", bgGradient: "from-green-50 to-emerald-50", commentOnly: true },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700", bgGradient: "from-amber-50 to-yellow-50" },
  { id: "graduates", label: "New Graduates", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700", bgGradient: "from-emerald-50 to-teal-50" },
  { id: "questions-everyone-has", label: "Questions Everyone Has", icon: HelpCircle, color: "bg-blue-100 text-blue-700", bgGradient: "from-blue-50 to-indigo-50", commentOnly: true },
  { id: "career-pathway", label: "Career Pathway", icon: Target, color: "bg-purple-100 text-purple-700", bgGradient: "from-purple-50 to-violet-50", commentOnly: true },
];

// Featured graduates pool - rotates daily with realistic zombie profiles
const FEATURED_GRADUATES = [
  {
    name: "Jennifer Thompson",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    achievement: "Quit nursing job & now earns more!",
    quote: "25 years as an ER nurse. Now I help 47+ clients and actually enjoy my work again! The community support made all the difference.",
    certified: true,
    monthsActive: 12,
  },
  {
    name: "Kelly McMahon",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    achievement: "Built $8K/month practice in 6 months!",
    quote: "As an ARNP of 25 years, I was burned out on traditional healthcare. Now I'm paid what my knowledge is worth and I set my own hours!",
    certified: true,
    monthsActive: 6,
  },
  {
    name: "Suzette Burke",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    achievement: "Helping others after own cancer journey!",
    quote: "I was diagnosed with breast cancer and knew there had to be a better way. Now I help others take control of their health like I did!",
    certified: true,
    monthsActive: 8,
  },
  {
    name: "Victoria Hayes",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    achievement: "First $5K month after 90 days!",
    quote: "I have Hashimoto's and wanted to understand my own health. Now I help other women with thyroid issues and I've never felt more fulfilled!",
    certified: true,
    monthsActive: 4,
  },
  {
    name: "Julie Frady",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    achievement: "16-year RN now thriving independently!",
    quote: "I was disgusted with our sick model healthcare system. After healing my own autoimmune issues, I now help others do the same!",
    certified: true,
    monthsActive: 10,
  },
  {
    name: "Amanda Harris",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    achievement: "Booked 15 clients in first 2 months!",
    quote: "As a nurse with lupus, I know what it's like to struggle. Now I help people with autoimmune diseases find real solutions!",
    certified: true,
    monthsActive: 5,
  },
  {
    name: "Lisa Gagliano",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    achievement: "Left hospital, now earning $6K/month!",
    quote: "I was tired of doctors just putting Band-Aids on everything. Now I help people find real solutions and get out of hospitals for good!",
    certified: true,
    monthsActive: 7,
  },
  {
    name: "Diane Bartiromo",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    achievement: "Retired nurse, thriving second career!",
    quote: "40 years of nursing taught me a lot. Now retired, I found my calling in functional medicine. No 5 AM alarm, no commute, pure passion!",
    certified: true,
    monthsActive: 9,
  },
  {
    name: "Joanne Bertrand",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    achievement: "Helping patients doctors couldn't!",
    quote: "My patients told me they needed more help than doctors gave them. Now I give them the one-on-one care they deserve!",
    certified: true,
    monthsActive: 6,
  },
  {
    name: "Kira Reoch",
    title: "FM Practitioner",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    achievement: "ICU nurse to wellness entrepreneur!",
    quote: "20 years in ICU and flight nursing. I couldn't participate in corporate healthcare anymore. Now I help people truly heal - mind, body, and spirit!",
    certified: true,
    monthsActive: 11,
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

// Note: Reactions are now stored in the database and passed from the server
// The generatePostReactions function is no longer needed - reactions come from DB

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
  likeCount?: number; // Total of all reactions (for sync)
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
  reactions?: Record<string, number> | null; // Stored reactions from database
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
  // Default to null (All) to show all posts across all categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Calculate post counts per category
  const categoryPostCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dbPosts.forEach(post => {
      const cat = post.category || "general";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [dbPosts]);

  // Pagination
  const POSTS_PER_PAGE = 20;
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);

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
    const basePractitioners = 1721; // Target: ~1721/2000 (86%)
    const baseTransformations = 20134;
    const baseEarnings = 8400000;

    // Dynamic daily practitioner growth (small daily variation for realism)
    // Use a seeded random-like function for today's increment
    const getTodayPractitionerGrowth = () => {
      // Simple hash to get consistent "random" value per day
      const seed = Math.sin(dayOfYear * 12.9898) * 43758.5453;
      const random = seed - Math.floor(seed); // 0-1 range
      return Math.floor(random * 3); // 0-2 daily variation (tiny, just for realism)
    };

    // Add realistic growth day by day (small increments)
    const memberGrowth = dayOfYear * 3; // ~3 new members per day
    const practitionerGrowth = getTodayPractitionerGrowth(); // 0-2 daily variation
    const transformationGrowth = dayOfYear * 8; // ~8 per day
    const earningsGrowth = (basePractitioners + practitionerGrowth) * 5000; // grows with practitioners

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

  // All posts and reactions now come from the database - no generation needed
  const allPosts = useMemo(() => {
    return dbPosts.map(post => ({
      ...post,
      // Use stored reactions from DB, or empty object if null
      reactions: (post.reactions as Record<string, number>) || {},
    }));
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

  // Reset pagination when filters change
  useEffect(() => {
    setVisiblePosts(POSTS_PER_PAGE);
  }, [selectedCommunity, selectedCategory, searchQuery, sortBy]);

  // Paginated posts to display
  const paginatedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, visiblePosts);
  }, [filteredAndSortedPosts, visiblePosts]);

  const hasMorePosts = visiblePosts < filteredAndSortedPosts.length;
  const totalFilteredPosts = filteredAndSortedPosts.length;
  const currentPage = Math.ceil(visiblePosts / POSTS_PER_PAGE);
  const totalPages = Math.ceil(totalFilteredPosts / POSTS_PER_PAGE);

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + POSTS_PER_PAGE, filteredAndSortedPosts.length));
  };

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
      {/* Improved Hero Banner with Community Goal */}
      <Card className="bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/10 rounded-full blur-3xl"></div>

        <CardContent className="p-6 relative">
          {/* Top Row: Title + Stats + CTA */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            {/* Left: Title + Live Indicator */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-500/10 flex items-center justify-center border border-gold-400/20">
                <Heart className="w-7 h-7 text-gold-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">AccrediPro Community</h1>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="flex items-center gap-1.5 text-green-400 font-medium">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                    {dynamicStats.onlineNow} online
                  </span>
                  <span className="text-burgundy-300">•</span>
                  <span className="text-burgundy-200">{dynamicStats.coachesOnline} coaches available</span>
                </div>
              </div>
            </div>

            {/* Center: Impact Numbers - More compact */}
            <div className="flex items-center gap-4 lg:gap-6 bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">{dynamicStats.totalMembers.toLocaleString()}</p>
                <p className="text-[10px] text-burgundy-200 uppercase tracking-wider">Members</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-gold-400">{dynamicStats.certifiedPractitioners.toLocaleString()}+</p>
                <p className="text-[10px] text-burgundy-200 uppercase tracking-wider">Certified</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-green-400">${(dynamicStats.totalEarnings / 1000000).toFixed(1)}M+</p>
                <p className="text-[10px] text-burgundy-200 uppercase tracking-wider">Earned</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block"></div>
              <div className="text-center hidden md:block">
                <p className="text-2xl lg:text-3xl font-bold text-white">{dynamicStats.clientTransformations.toLocaleString()}+</p>
                <p className="text-[10px] text-burgundy-200 uppercase tracking-wider">Lives Changed</p>
              </div>
            </div>

            {/* Right: CTA */}
            <CreatePostDialog
              communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
              communityName={selectedCommunityData?.name}
              defaultCategory={selectedCategory || undefined}
            />
          </div>

          {/* Community Goal Banner */}
          <div className="bg-gradient-to-r from-gold-500/20 via-gold-400/15 to-gold-500/20 rounded-xl p-4 border border-gold-400/20">
            <div className="flex flex-col gap-3">
              {/* Top row: Icon + Goal text + Progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-gold-300 text-sm font-semibold">Community Goal: 2,000 Certified Practitioners by 2025</p>
                    <p className="text-burgundy-200 text-xs">We&apos;re {Math.round((dynamicStats.certifiedPractitioners / 2000) * 100)}% there! Every story inspires another practitioner to join.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <div className="flex-1 sm:w-48 h-2.5 bg-burgundy-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((dynamicStats.certifiedPractitioners / 2000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-gold-400 text-sm font-bold whitespace-nowrap">{dynamicStats.certifiedPractitioners.toLocaleString()}/2,000</span>
                </div>
              </div>
              {/* Bottom row: CTA explanation */}
              <div className="flex items-center justify-between bg-burgundy-900/30 rounded-lg px-3 py-2">
                <p className="text-burgundy-100 text-xs">
                  <span className="text-gold-400 font-medium">Click &quot;New Discussion&quot;</span> above to share your wins, celebrate graduation, or inspire others with your journey!
                </p>
                <span className="text-burgundy-300 text-[10px] hidden sm:inline">+{7 + Math.floor(Math.sin(new Date().getDate() * 12.9898) * 43758.5453 % 1 * 20)} joined today</span>
              </div>
            </div>
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
                <Avatar className="w-10 h-10 ring-2 ring-gold-400">
                  <AvatarImage src={featuredGraduate.avatar || undefined} alt={featuredGraduate.name} />
                  <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold text-sm">
                    {featuredGraduate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900 text-sm">{featuredGraduate.name}</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">{featuredGraduate.title}</p>
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium mb-2">{featuredGraduate.achievement}</p>
              <p className="text-xs text-gray-600 italic">&quot;{featuredGraduate.quote}&quot;</p>
            </CardContent>
          </Card>

          {/* Topics - Enhanced UI */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-600 p-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Megaphone className="w-4 h-4 text-white" />
                </div>
                Browse Topics
              </h3>
              <p className="text-burgundy-200 text-xs mt-1">Explore {Object.values(categoryPostCounts).reduce((a, b) => a + b, 0).toLocaleString()}+ posts</p>
            </div>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {postCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const postCount = categoryPostCounts[cat.id] || 0;

                  // Color mapping for each category
                  const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; iconBg: string; gradient: string }> = {
                    introductions: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", icon: "text-pink-600", iconBg: "bg-pink-100", gradient: "from-pink-500 to-rose-500" },
                    "questions-everyone-has": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100", gradient: "from-blue-500 to-indigo-500" },
                    "career-pathway": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100", gradient: "from-purple-500 to-violet-500" },
                    "coaching-tips": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100", gradient: "from-green-500 to-emerald-500" },
                    wins: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-600", iconBg: "bg-amber-100", gradient: "from-amber-500 to-orange-500" },
                    graduates: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-600", iconBg: "bg-emerald-100", gradient: "from-emerald-500 to-teal-500" },
                  };
                  const colors = colorMap[cat.id] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "text-gray-600", iconBg: "bg-gray-100", gradient: "from-gray-500 to-gray-600" };

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`relative flex flex-col items-center p-3 rounded-xl text-center transition-all duration-200 group overflow-hidden ${isSelected
                        ? `${colors.bg} border ${colors.border} shadow-md ring-2 ring-offset-1 ring-${cat.id === 'wins' ? 'amber' : cat.id === 'graduates' ? 'emerald' : cat.id === 'questions-everyone-has' ? 'blue' : cat.id === 'career-pathway' ? 'purple' : cat.id === 'coaching-tips' ? 'green' : 'pink'}-400`
                        : `bg-white hover:${colors.bg} border border-gray-100 hover:border-gray-200 hover:shadow-sm`
                        }`}
                    >
                      {/* Icon with gradient background when selected */}
                      <div className={`p-2 rounded-lg mb-1.5 transition-all duration-200 ${isSelected
                        ? `bg-gradient-to-br ${colors.gradient} shadow-sm`
                        : `${colors.iconBg} group-hover:scale-105`
                        }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? "text-white" : colors.icon}`} />
                      </div>

                      {/* Label */}
                      <span className={`font-medium text-xs leading-tight block ${isSelected ? colors.text : "text-gray-700"}`}>
                        {cat.label}
                      </span>

                      {/* Post count badge */}
                      <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-sm`
                        : `${colors.iconBg} ${colors.text}`
                        }`}>
                        {postCount.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Clear filter button */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full mt-3 p-2 text-xs text-burgundy-600 hover:text-burgundy-700 bg-burgundy-50 hover:bg-burgundy-100 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
                >
                  <X className="w-3 h-3" /> Clear filter
                </button>
              )}
            </CardContent>
          </Card>

          {/* Ask Your Coach CTA - With Sarah's profile */}
          <Card className="border border-gray-200 hover:border-burgundy-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10 ring-2 ring-amber-400">
                  <AvatarImage src="/coaches/sarah-coach.webp" alt="Coach Sarah" />
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">SM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Ask Your Coach</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Sarah is online
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">Your dedicated FM Coach is here to help you succeed!</p>
              <Link href="/messages">
                <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Sarah
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
            {paginatedPosts.map((post) => {
              const catStyle = getCategoryStyle(post.category);
              const CatIcon = catStyle.icon;

              // Get actual reaction emojis that have counts > 0, heart first
              const activeReactions = Object.entries(post.reactions || {})
                .filter(([_, count]) => count > 0)
                .sort(([a], [b]) => {
                  // Heart first, then by count
                  if (a === "❤️") return -1;
                  if (b === "❤️") return 1;
                  return 0;
                })
                .slice(0, 4);

              return (
                // Pinned Announcements: Show full content inline, no clicking needed
                post.isPinned ? (
                  <div key={post.id} className="bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 border-2 border-burgundy-200 rounded-xl overflow-hidden">
                    {/* Announcement Header */}
                    <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-600 px-4 py-2.5 flex items-center justify-between">
                      <span className="text-white font-bold text-sm flex items-center gap-2">
                        <Megaphone className="w-4 h-4" />
                        Announcement
                      </span>
                      <Badge className="bg-white/20 text-white border-0 text-[10px]">
                        Pinned
                      </Badge>
                    </div>

                    {/* Full Announcement Content */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-burgundy-900 mb-3">
                        {post.title}
                      </h3>

                      {/* Full Content - Rendered as HTML */}
                      <div
                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                          prose-p:my-2 prose-ul:my-2 prose-li:my-0.5
                          prose-strong:text-burgundy-800 prose-em:text-burgundy-600"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      {/* Reactions Bar */}
                      {activeReactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-burgundy-200/50">
                          {activeReactions.map(([emoji, count]) => (
                            <button
                              key={emoji}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white border border-burgundy-200 text-gray-700 hover:bg-burgundy-50 hover:border-burgundy-300 transition-all"
                            >
                              <span className="text-base">{emoji}</span>
                              <span className="font-medium">{count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Regular Posts: Show as clickable cards
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5 border border-gray-100">
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
                          {/* Admin Delete Button */}
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
                )
              );
            })}

            {paginatedPosts.length === 0 && (
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

            {/* Load More / Pagination */}
            {paginatedPosts.length > 0 && (
              <div className="pt-6 pb-4">
                {/* Pagination Info */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-700">{paginatedPosts.length}</span> of{" "}
                    <span className="font-semibold text-gray-700">{totalFilteredPosts}</span> posts
                    {totalPages > 1 && (
                      <span className="ml-2 text-gray-400">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </p>
                </div>

                {/* Load More Button */}
                {hasMorePosts && (
                  <div className="flex justify-center">
                    <Button
                      onClick={loadMorePosts}
                      variant="outline"
                      className="px-8 py-2 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 hover:border-burgundy-300"
                    >
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Load More Posts ({Math.min(POSTS_PER_PAGE, totalFilteredPosts - visiblePosts)} more)
                    </Button>
                  </div>
                )}

                {/* All Posts Loaded Message */}
                {!hasMorePosts && totalFilteredPosts > POSTS_PER_PAGE && (
                  <p className="text-center text-sm text-gray-400">
                    You&apos;ve reached the end of the posts
                  </p>
                )}
              </div>
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
