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
  Rocket,
  GraduationCap,
  DollarSign,
  Target,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  MessageCircle,
  Award,
  Flame,
  BadgeCheck,
  Headphones,
  Crown,
  ChevronDown,
} from "lucide-react";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

// Emoji reactions
const REACTIONS = [
  { id: "like", emoji: "❤️", label: "Love" },
  { id: "celebrate", emoji: "🎉", label: "Celebrate" },
  { id: "helpful", emoji: "💡", label: "Helpful" },
  { id: "inspiring", emoji: "🔥", label: "Inspiring" },
];

// Sort options
const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "popular", label: "Most Popular", icon: TrendingUp },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "most_comments", label: "Most Discussed", icon: MessageCircle },
];

// Post categories for filtering within communities
const postCategories = [
  { id: "introductions", label: "Introduce Yourself", icon: Hand, color: "bg-pink-100 text-pink-700", bgGradient: "from-pink-50 to-rose-50", adminOnly: true },
  { id: "tips", label: "Daily Coach Tips", icon: Lightbulb, color: "bg-green-100 text-green-700", bgGradient: "from-green-50 to-emerald-50" },
  { id: "questions", label: "Questions & Help", icon: HelpCircle, color: "bg-blue-100 text-blue-700", bgGradient: "from-blue-50 to-sky-50" },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700", bgGradient: "from-amber-50 to-yellow-50" },
  { id: "momentum", label: "Practice Momentum", icon: Rocket, color: "bg-purple-100 text-purple-700", bgGradient: "from-purple-50 to-violet-50", isNew: true },
  { id: "graduates", label: "Graduates", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700", bgGradient: "from-emerald-50 to-teal-50" },
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

// Sample posts data for demonstration
const SAMPLE_POSTS = [
  {
    id: "pinned-introductions",
    title: "Welcome! Introduce Yourself to the Community",
    content: `Hello and welcome to the AccrediPro Functional Medicine community!

We're so excited you're here. This is a supportive space where practitioners at every stage of their journey come together to learn, grow, and celebrate wins.

**Please introduce yourself by commenting below!**

Share a bit about:
- Your name and where you're from
- Your background (healthcare, wellness, career changer?)
- What drew you to Functional Medicine
- What you hope to achieve
- One fun fact about yourself!

Don't be shy - everyone here started exactly where you are. Our community is incredibly supportive, and many lifelong friendships have started with a simple introduction.

We can't wait to meet you and support you on your journey!`,
    category: "introductions",
    isPinned: true,
    viewCount: 8934,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    author: {
      id: "admin-1",
      firstName: "AccrediPro",
      lastName: "Team",
      avatar: null,
      role: "ADMIN",
      isCertified: true,
    },
    _count: { comments: 847, likes: 1256 },
    reactions: { like: 567, celebrate: 423, helpful: 89, inspiring: 234 },
  },
  {
    id: "pinned-share-win",
    title: "Share Your Wins Here! Celebrate Every Step of Your Journey",
    content: `Welcome to our wins celebration space!

This is THE place to share your achievements, big or small. Every win counts!

**Share things like:**
- Signed your first client
- Completed a module or certification
- Hit a revenue milestone
- Got amazing client feedback
- Launched your website or social media
- Had a breakthrough moment

**Why share?**
Your wins inspire others. When you share, you help fellow students see what's possible. Plus, our coaches love celebrating with you!

**How to share:**
Simply reply to this post with your win. Add photos or details if you'd like!

Let's celebrate together! What's your latest win?`,
    category: "wins",
    isPinned: true,
    viewCount: 2847,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    author: {
      id: "admin-1",
      firstName: "AccrediPro",
      lastName: "Team",
      avatar: null,
      role: "ADMIN",
      isCertified: true,
    },
    _count: { comments: 156, likes: 312 },
    reactions: { like: 189, celebrate: 98, helpful: 15, inspiring: 67 },
  },
  {
    id: "graduate-1",
    title: "I DID IT! Just Received My Functional Medicine Practitioner Certificate!",
    content: `After 6 months of intensive study, late nights, and countless practice sessions, I finally passed my final exam and received my certificate yesterday!

This journey has been absolutely transformational. Not just for my career, but for my entire understanding of health and wellness.

**What helped me succeed:**
- The structured curriculum that built knowledge step by step
- Amazing support from mentors (special thanks to Sarah!)
- The community here - you all kept me motivated
- The practice cases that prepared me for real clients

I already have 3 discovery calls booked for next week! Can't wait to start helping people transform their health.

Thank you to everyone who supported me on this journey! 🎉`,
    category: "graduates",
    isPinned: true,
    viewCount: 1247,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    author: {
      id: "user-1",
      firstName: "Maria",
      lastName: "Rodriguez",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 23, likes: 89 },
    reactions: { like: 45, celebrate: 32, helpful: 8, inspiring: 24 },
  },
  {
    id: "graduate-2",
    title: "From Nurse to FM Practitioner - My Transformation Story",
    content: `25 years as an ER nurse. Burned out. Feeling like I was just putting band-aids on problems.

Then I found Functional Medicine.

Today marks my one-year anniversary of launching my practice. In that time:
✅ Helped 47 clients transform their health
✅ Quit my hospital job (finally!)
✅ Earning more than I ever did as a nurse
✅ Actually ENJOYING my work again

The certification program gave me everything I needed. The business kits made launching SO much easier than I expected.

To everyone still studying - keep going. It's worth every minute. 💪`,
    category: "graduates",
    isPinned: false,
    viewCount: 892,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    author: {
      id: "user-2",
      firstName: "Jennifer",
      lastName: "Thompson",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 31, likes: 124 },
    reactions: { like: 67, celebrate: 41, helpful: 12, inspiring: 38 },
  },
  {
    id: "momentum-1",
    title: "Just Signed My FIRST Paying Client! $1,200 for 8-Week Program!",
    content: `IT HAPPENED! 🎉

After 3 weeks of networking and offering free discovery calls, someone said YES!

She's starting my 8-week gut health transformation program next Monday. $1,200 paid in full!

I'm literally shaking as I write this. This is real. I'm actually doing this.

Thank you to everyone who encouraged me to keep going when I had no responses to my first posts. Your support means everything!`,
    category: "momentum",
    isPinned: false,
    viewCount: 456,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    author: {
      id: "user-3",
      firstName: "David",
      lastName: "Chen",
      avatar: null,
      role: "STUDENT",
      isCertified: false,
    },
    _count: { comments: 42, likes: 156 },
    reactions: { like: 78, celebrate: 65, helpful: 5, inspiring: 42 },
  },
  {
    id: "momentum-2",
    title: "Hit $5K This Month - Here's Exactly What I Did",
    content: `Month 4 of my practice and I just crossed $5,000 in revenue!

**Here's my breakdown:**
- 2 new 12-week clients ($997 each) = $1,994
- 3 existing clients renewed ($499 each) = $1,497
- 1 VIP intensive day ($1,500) = $1,500
- Total: $4,991 (calling it $5K!)

**What's working for me:**
1. Posting valuable content on Instagram 3x/week
2. Hosting a free monthly webinar
3. Following up with EVERY lead within 24 hours
4. Using the email templates from the business kit

If you're struggling, DM me. Happy to share more details!`,
    category: "momentum",
    isPinned: false,
    viewCount: 723,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    author: {
      id: "user-4",
      firstName: "Amanda",
      lastName: "Foster",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 56, likes: 203 },
    reactions: { like: 89, celebrate: 54, helpful: 48, inspiring: 67 },
  },
  {
    id: "tips-1",
    title: "3 Questions That Transform Every Discovery Call",
    content: `After conducting 200+ discovery calls, I've found these 3 questions convert better than anything else:

**1. "What would your life look like if this problem was completely solved?"**
Gets them visualizing the transformation - emotional connection.

**2. "What have you already tried, and why do you think it didn't work?"**
Shows you're different. Positions you as the solution to their failed attempts.

**3. "On a scale of 1-10, how committed are you to solving this in the next 90 days?"**
Qualifies their readiness. Anything below 7 = not ready to invest.

Try these in your next call and let me know how it goes!`,
    category: "tips",
    isPinned: false,
    viewCount: 1089,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    author: {
      id: "coach-1",
      firstName: "Dr. Sarah",
      lastName: "Mitchell",
      avatar: null,
      role: "MENTOR",
      isCertified: true,
    },
    _count: { comments: 38, likes: 167 },
    reactions: { like: 72, celebrate: 23, helpful: 89, inspiring: 45 },
  },
];

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
  reactions?: {
    like: number;
    celebrate: number;
    helpful: number;
    inspiring: number;
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

export function CommunityClient({ posts: dbPosts, stats, communities = [], isAdmin = false }: CommunityClientProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  // Default to "introductions" - most welcoming entry point for new members
  const [selectedCategory, setSelectedCategory] = useState<string | null>("introductions");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  // Combine DB posts with sample posts for display
  const allPosts = useMemo(() => {
    // If no DB posts, show sample posts
    if (dbPosts.length === 0) {
      return SAMPLE_POSTS.map(p => ({
        ...p,
        communityId: null,
        communityName: null,
        categoryName: null,
        categoryColor: null,
      }));
    }
    return dbPosts;
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
    return post.reactions.like + post.reactions.celebrate + post.reactions.helpful + post.reactions.inspiring;
  };

  // Get the daily featured graduate
  const featuredGraduate = getDailyFeaturedGraduate();

  return (
    <div className="space-y-4 animate-fade-in">
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
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
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all ${
                        isSelected
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
                        {"adminOnly" in cat && (
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
        <div className="lg:col-span-3 space-y-4">
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
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                        sortBy === option.id ? 'bg-burgundy-50 text-burgundy-700' : 'text-gray-700'
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

          {/* Posts */}
          <div className="space-y-4">
            {filteredAndSortedPosts.map((post) => {
              const catStyle = getCategoryStyle(post.category);
              const CatIcon = catStyle.icon;
              const totalReactions = getTotalReactions(post);

              return (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ${
                    post.isPinned ? 'ring-2 ring-amber-300' : ''
                  }`}>
                    {/* Category Banner */}
                    <div className={`bg-gradient-to-r ${catStyle.bgGradient} px-5 py-2 flex items-center justify-between`}>
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

                    <CardContent className="p-5">
                      {/* Author Row */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                            <AvatarImage src={post.author.avatar || undefined} />
                            <AvatarFallback className={`font-bold text-white ${
                              post.author.role === "MENTOR"
                                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                : post.author.role === "ADMIN"
                                ? "bg-gradient-to-br from-burgundy-500 to-burgundy-700"
                                : "bg-gradient-to-br from-gray-400 to-gray-600"
                            }`}>
                              {getInitials(post.author.firstName, post.author.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          {/* Verified Badge for Certified Members */}
                          {post.author.isCertified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <BadgeCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900">
                              {post.author.firstName} {post.author.lastName}
                            </span>
                            {post.author.isCertified && post.author.role === "STUDENT" && (
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">
                                <BadgeCheck className="w-2.5 h-2.5 mr-0.5" /> Certified
                              </Badge>
                            )}
                            {getRoleBadge(post.author.role)}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.viewCount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight hover:text-burgundy-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.content.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 200)}...
                      </p>

                      {/* Emoji Reactions Bar */}
                      <div className="flex items-center gap-2 mb-4">
                        {REACTIONS.map((reaction) => {
                          const count = post.reactions?.[reaction.id as keyof typeof post.reactions] || 0;
                          if (count === 0) return null;
                          return (
                            <button
                              key={reaction.id}
                              className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-full text-sm transition-colors"
                              onClick={(e) => e.preventDefault()}
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-gray-600 font-medium">{count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Engagement Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-rose-500">
                            <Heart className="w-5 h-5 fill-rose-500" />
                            <span className="font-semibold">{totalReactions}</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{post._count.comments} comments</span>
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50">
                          Read more <ArrowRight className="w-4 h-4 ml-1" />
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
    </div>
  );
}
