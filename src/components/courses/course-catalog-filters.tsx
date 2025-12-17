"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BookOpen,
    Clock,
    Award,
    Search,
    Star,
    GraduationCap,
    Play,
    CheckCircle,
    Users,
    ArrowRight,
    Lock,
    TrendingUp,
    Heart,
    Leaf,
    Target,
    Tag,
    Loader2,
    Sparkles,
    Shield,
    Zap,
    MessageSquare,
    Trophy,
    BarChart3,
    ChevronRight,
    Flame,
    DollarSign,
    Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
}

interface Module {
    lessons: { id: string }[];
}

interface CourseAnalytics {
    totalEnrolled: number;
    avgRating: number;
}

interface Coach {
    id: string;
    name: string;
    avatar: string | null;
    title: string | null;
}

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    shortDescription: string | null;
    thumbnail: string | null;
    difficulty: string;
    duration: number | null;
    isFeatured: boolean;
    isFree: boolean;
    price: number | null;
    certificateType: string;
    category: Category | null;
    coach: Coach | null;
    modules: Module[];
    _count: {
        enrollments: number;
        reviews: number;
    };
    analytics: CourseAnalytics | null;
}

interface Enrollment {
    courseId: string;
    status: string;
    progress: number;
}

interface CourseCatalogFiltersProps {
    courses: Course[];
    categories: Category[];
    enrollments: Enrollment[];
    specialOffers?: {
        id: string;
        title: string;
        discount: number;
        expiresAt: Date | null;
        courses: string[];
    }[];
    wishlistIds?: string[];
    isLoggedIn?: boolean;
    miniDiplomaCompletedAt?: string | null;
}

// Default coach when none assigned
const DEFAULT_COACH = {
    name: "Sarah M.",
    avatar: "/coaches/sarah-coach.webp",
    title: "Certified Functional Medicine Practitioner",
};

// All 9 accreditations
const ACCREDITATIONS = [
    { code: "CPD", name: "Continuing Professional Development" },
    { code: "CMA", name: "Complementary Medical Association" },
    { code: "IPHM", name: "International Practitioners of Holistic Medicine" },
    { code: "ICAHP", name: "International Community of Accredited Health Professionals" },
    { code: "IAOTH", name: "International Association of Therapists" },
    { code: "IGCT", name: "International Guild of Complementary Therapists" },
    { code: "CTAA", name: "Complementary Therapists Accredited Association" },
    { code: "IHTCP", name: "International Holistic Therapists & Course Providers" },
    { code: "IHTC", name: "International Holistic Therapists Council" },
];

// Graduate pricing constants
const FULL_PRICE = 1997;
const GRADUATE_PRICE = 997;
const GRADUATE_DISCOUNT_HOURS = 72; // 72 hours flash sale

// Helper to calculate time remaining
const getTimeRemaining = (completedAt: string | null): { expired: boolean; hours: number; minutes: number; seconds: number } | null => {
    if (!completedAt) return null;

    const completedDate = new Date(completedAt);
    const expiryDate = new Date(completedDate.getTime() + GRADUATE_DISCOUNT_HOURS * 60 * 60 * 1000);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { expired: false, hours, minutes, seconds };
};

// Career Path & Earning Potential Data for each course type
const COURSE_CAREER_DATA: Record<string, { careerPath: string; earningPotential: string; jobOutlook: string; demandLevel: "High" | "Very High" | "Growing" }> = {
    // Functional Medicine courses
    "functional-medicine": {
        careerPath: "FM Health Coach → Specialist → Practice Owner",
        earningPotential: "$5K-$15K/month",
        jobOutlook: "89% of grads launch within 60 days",
        demandLevel: "Very High",
    },
    "health-coach": {
        careerPath: "Health Coach → Specialist → Practice Owner",
        earningPotential: "$4K-$12K/month",
        jobOutlook: "Growing 22% year over year",
        demandLevel: "Very High",
    },
    "mini-diploma": {
        careerPath: "Foundation → Certification → Full Practice",
        earningPotential: "Start earning in 30 days",
        jobOutlook: "Perfect entry point",
        demandLevel: "Growing",
    },
    "womens-health": {
        careerPath: "Specialist → Women's Health Expert → Clinic Owner",
        earningPotential: "$6K-$18K/month",
        jobOutlook: "Fastest growing niche",
        demandLevel: "Very High",
    },
    "nutrition": {
        careerPath: "Nutrition Coach → Specialist → Program Creator",
        earningPotential: "$4K-$10K/month",
        jobOutlook: "High client retention",
        demandLevel: "High",
    },
    "business": {
        careerPath: "Solo Coach → Team Leader → Agency Owner",
        earningPotential: "$10K-$50K/month",
        jobOutlook: "Unlimited scaling potential",
        demandLevel: "Very High",
    },
    // Default fallback
    "default": {
        careerPath: "Certified Practitioner → Specialist → Business Owner",
        earningPotential: "$5K-$15K/month",
        jobOutlook: "High demand for certified pros",
        demandLevel: "High",
    },
};

// Get career data based on course title/category
const getCourseCareerData = (course: Course) => {
    const title = course.title.toLowerCase();
    const category = course.category?.name?.toLowerCase() || "";

    if (title.includes("mini") || title.includes("free") || title.includes("intro")) {
        return COURSE_CAREER_DATA["mini-diploma"];
    }
    if (title.includes("women") || title.includes("hormone") || category.includes("women")) {
        return COURSE_CAREER_DATA["womens-health"];
    }
    if (title.includes("business") || title.includes("marketing") || title.includes("client")) {
        return COURSE_CAREER_DATA["business"];
    }
    if (title.includes("nutrition") || title.includes("diet") || category.includes("nutrition")) {
        return COURSE_CAREER_DATA["nutrition"];
    }
    if (title.includes("functional") || title.includes("fm") || category.includes("functional")) {
        return COURSE_CAREER_DATA["functional-medicine"];
    }
    if (title.includes("health coach") || title.includes("certification")) {
        return COURSE_CAREER_DATA["health-coach"];
    }
    return COURSE_CAREER_DATA["default"];
};

// FM Specializations - Coming Soon with Unsplash images
const FM_SPECIALIZATIONS_CATALOG = [
    {
        id: "functional-nutrition",
        title: "Functional Nutrition",
        shortTitle: "Nutrition",
        badge: "CORE",
        description: "The foundation of all functional medicine. Every practitioner needs nutrition expertise.",
        marketDemand: "Very High",
        income: "$60K - $150K",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
        color: "emerald",
    },
    {
        id: "gut-health",
        title: "Gut Health & Microbiome",
        shortTitle: "Gut Health",
        badge: "HIGH DEMAND",
        description: "The root of 80% of chronic conditions. Massive client demand.",
        marketDemand: "Very High",
        income: "$70K - $180K",
        image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
        color: "green",
    },
    {
        id: "womens-hormones",
        title: "Women's Hormones",
        shortTitle: "Hormones",
        badge: "TRENDING",
        description: "Massive market with underserved women. PMS, PCOS, fertility, perimenopause.",
        marketDemand: "Very High",
        income: "$80K - $200K",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        color: "pink",
    },
    {
        id: "stress-nervous-system",
        title: "Stress & Nervous System",
        shortTitle: "Stress/HPA",
        badge: "GROWING",
        description: "Burnout epidemic driving massive demand. HPA axis, cortisol, adrenal support.",
        marketDemand: "High",
        income: "$60K - $140K",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
        color: "purple",
    },
    {
        id: "thyroid-metabolism",
        title: "Thyroid & Metabolism",
        shortTitle: "Thyroid",
        badge: "EVERGREEN",
        description: "Millions with undiagnosed thyroid issues. Hashimoto's, weight resistance.",
        marketDemand: "High",
        income: "$65K - $160K",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
        color: "amber",
    },
    {
        id: "blood-sugar-weight",
        title: "Blood Sugar & Weight",
        shortTitle: "Metabolic",
        badge: "HIGH VOLUME",
        description: "Obesity epidemic = endless clients. Insulin resistance, metabolic syndrome.",
        marketDemand: "Very High",
        income: "$55K - $130K",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop",
        color: "orange",
    },
    {
        id: "autoimmune",
        title: "Autoimmune & Inflammation",
        shortTitle: "Autoimmune",
        badge: "SPECIALIST",
        description: "Complex cases, premium rates. Growing autoimmune epidemic needs specialists.",
        marketDemand: "Medium-High",
        income: "$80K - $200K",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
        color: "red",
    },
    {
        id: "mental-health-brain",
        title: "Mental Health & Brain",
        shortTitle: "Brain Health",
        badge: "EMERGING",
        description: "Gut-brain axis, depression, anxiety, cognitive decline. Underserved market.",
        marketDemand: "Growing",
        income: "$70K - $170K",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
        color: "indigo",
    },
    {
        id: "sleep-circadian",
        title: "Sleep & Circadian Health",
        shortTitle: "Sleep",
        badge: "NICHE",
        description: "Sleep epidemic affecting millions. Circadian rhythm, insomnia, energy.",
        marketDemand: "Medium",
        income: "$50K - $120K",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop",
        color: "blue",
    },
    {
        id: "detox-environmental",
        title: "Detoxification & Environmental",
        shortTitle: "Detox",
        badge: "ADVANCED",
        description: "Toxin exposure increasing. Mold, heavy metals, environmental toxins.",
        marketDemand: "Growing",
        income: "$75K - $180K",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
        color: "teal",
    },
];

// Career Tracks - Enhanced with income potential
const CAREER_TRACKS = [
    {
        slug: "functional-medicine",
        name: "Functional Medicine",
        icon: Leaf,
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        description: "Become a certified Functional Medicine Health Coach with clinical knowledge and client-ready skills.",
        duration: "6-12 months",
        incomeRange: "$5K - $15K/mo",
        studentsCount: 1250,
        steps: [
            { name: "Free Mini Diploma", type: "exploration", status: "available" },
            { name: "Health Coach Certification", type: "certification", status: "available" },
            { name: "Advanced Practitioner", type: "mastery", status: "coming" },
            { name: "Business Builder", type: "scaling", status: "coming" },
        ],
    },
    {
        slug: "womens-health",
        name: "Women's Health",
        icon: Heart,
        color: "from-pink-500 to-rose-600",
        bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
        borderColor: "border-pink-200",
        textColor: "text-pink-700",
        description: "Specialize in hormones, menopause, and women's wellness. High-demand niche with loyal clients.",
        duration: "4-8 months",
        incomeRange: "$4K - $12K/mo",
        studentsCount: 890,
        steps: [
            { name: "Hormone Foundations", type: "exploration", status: "coming" },
            { name: "Women's Health Certification", type: "certification", status: "coming" },
            { name: "Specialty Mastery", type: "mastery", status: "coming" },
        ],
    },
    {
        slug: "coaching-business",
        name: "Coaching Business",
        icon: Briefcase,
        color: "from-blue-500 to-indigo-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        description: "Build a profitable coaching practice with client acquisition, branding, and scaling systems.",
        duration: "3-6 months",
        incomeRange: "$10K - $30K/mo",
        studentsCount: 650,
        steps: [
            { name: "Business Foundations", type: "exploration", status: "coming" },
            { name: "Client Attraction", type: "certification", status: "coming" },
            { name: "Scale & Leverage", type: "scaling", status: "coming" },
        ],
    },
];

// Social proof testimonials - Using real AccrediPro fake profile avatars
const TESTIMONIALS = [
    {
        name: "Tiffany R.",
        role: "Functional Medicine Coach",
        quote: "Went from corporate burnout to $8K/month in 6 months. The certification gave me instant credibility.",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg",
        income: "$8K/mo",
        rating: 5,
    },
    {
        name: "Addison T.",
        role: "Health Practitioner",
        quote: "The step-by-step approach made everything clear. Now I have 12 regular clients and growing.",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg",
        income: "$6K/mo",
        rating: 5,
    },
    {
        name: "Martha W.",
        role: "Wellness Business Owner",
        quote: "Started solo, now running a team of 5 coaches. AccrediPro gave me the foundation to scale.",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
        income: "$25K/mo",
        rating: 5,
    },
    {
        name: "Teresa L.",
        role: "Women's Health Specialist",
        quote: "My clients trust me because I'm certified. That credibility changed everything for my practice.",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg",
        income: "$10K/mo",
        rating: 5,
    },
];

export function CourseCatalogFilters({
    courses,
    categories,
    enrollments,
    specialOffers = [],
    wishlistIds = [],
    isLoggedIn = false,
    miniDiplomaCompletedAt = null,
}: CourseCatalogFiltersProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("featured");
    const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set(wishlistIds));
    const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(getTimeRemaining(miniDiplomaCompletedAt));

    // Update countdown every second
    useEffect(() => {
        if (!miniDiplomaCompletedAt) return;

        const timer = setInterval(() => {
            setCountdown(getTimeRemaining(miniDiplomaCompletedAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [miniDiplomaCompletedAt]);

    // Check if user qualifies for graduate discount
    const hasGraduateDiscount = countdown && !countdown.expired;

    const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

    const toggleWishlist = async (e: React.MouseEvent, courseId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error("Please login to save courses to your wishlist");
            router.push("/login");
            return;
        }

        setWishlistLoading(courseId);
        const isInWishlist = localWishlist.has(courseId);

        try {
            const response = await fetch("/api/wishlist", {
                method: isInWishlist ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            if (!response.ok) throw new Error("Failed to update wishlist");

            setLocalWishlist((prev) => {
                const newSet = new Set(prev);
                if (isInWishlist) {
                    newSet.delete(courseId);
                    toast.success("Removed from wishlist");
                } else {
                    newSet.add(courseId);
                    toast.success("Added to wishlist");
                }
                return newSet;
            });
        } catch {
            toast.error("Failed to update wishlist");
        } finally {
            setWishlistLoading(null);
        }
    };

    // Filter courses
    const filteredCourses = useMemo(() => {
        let filtered = courses.filter((course) => {
            const matchesSearch = searchQuery === "" ||
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === null || course.category?.id === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        switch (sortBy) {
            case "newest": filtered = [...filtered].reverse(); break;
            case "popular": filtered = [...filtered].sort((a, b) => (b.analytics?.totalEnrolled || b._count.enrollments) - (a.analytics?.totalEnrolled || a._count.enrollments)); break;
            case "rating": filtered = [...filtered].sort((a, b) => (b.analytics?.avgRating || 0) - (a.analytics?.avgRating || 0)); break;
            case "price-low": filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0)); break;
            case "price-high": filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0)); break;
        }
        return filtered;
    }, [courses, searchQuery, selectedCategory, sortBy]);

    const totalEnrolled = courses.reduce((acc, c) => acc + (c.analytics?.totalEnrolled || c._count.enrollments), 0);
    const totalReviews = courses.reduce((acc, c) => acc + c._count.reviews, 0);
    const avgRating = courses.length > 0
        ? (courses.reduce((acc, c) => acc + (c.analytics?.avgRating || 4.8), 0) / courses.length).toFixed(1)
        : "4.9";

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return "Self-paced";
        const hours = Math.floor(minutes / 60);
        return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes} min`;
    };

    const getCertBadgeStyle = (type: string) => {
        return type === "CERTIFICATION"
            ? "bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 font-semibold"
            : "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold";
    };

    const getDiscountPercent = (original: number, current: number) => {
        return Math.round(((original - current) / original) * 100);
    };

    const getCoachInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStepIcon = (type: string) => {
        switch (type) {
            case "exploration": return "🎯";
            case "certification": return "🏆";
            case "mastery": return "⭐";
            case "scaling": return "🚀";
            default: return "📚";
        }
    };

    return (
        <div className="space-y-8">
            {/* Hero Header - Simplified, No Free Course Button */}
            <div className="relative bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative z-10 p-6 md:p-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-gold-400/30">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-semibold text-gold-200">Accredited Professional Training</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Build Your Career in <span className="text-gold-400">Health & Wellness</span>
                        </h1>

                        <p className="text-lg text-burgundy-100 mb-8 max-w-2xl mx-auto">
                            Industry-recognized certifications that give you the credentials, knowledge, and confidence to build a thriving practice.
                        </p>

                        {/* Trust Badges - Centered */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg">
                                <Users className="w-5 h-5 text-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold">{(totalEnrolled + 2500).toLocaleString()}+</p>
                                    <p className="text-xs text-burgundy-200">Students Enrolled</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg">
                                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold">{avgRating}/5.0</p>
                                    <p className="text-xs text-burgundy-200">1,344+ Reviews</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg">
                                <Shield className="w-5 h-5 text-gold-400" />
                                <div className="text-left">
                                    <p className="text-white font-bold">Accredited</p>
                                    <p className="text-xs text-burgundy-200">Certifications</p>
                                </div>
                            </div>
                        </div>

                        {/* Single CTA */}
                        <Link href="/roadmap">
                            <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold shadow-lg px-8">
                                <Target className="w-5 h-5 mr-2" />
                                View My Personalized Roadmap
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search courses, certifications..."
                        className="pl-10 h-11 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 bg-white">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Category Pills - Only show All for now */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap bg-burgundy-600 text-white shadow-md"
                >
                    All Courses
                </button>
            </div>

            {/* Course Grid - Enhanced Cards */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-burgundy-600" />
                        <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
                        <Badge variant="secondary" className="text-xs">{filteredCourses.length} available</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredCourses.map((course) => {
                        const enrollment = enrollmentMap.get(course.id);
                        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                        const courseAvgRating = course.analytics?.avgRating || 4.9;
                        // Custom enrolled/review counts based on course for social proof
                        const isFMPractitioner = course.slug === "functional-medicine-complete-certification";
                        const isWomensHormone = course.slug === "womens-hormone-health-coach";
                        const isGutHealth = course.slug === "gut-health-digestive-wellness-coach";
                        const isCohortClosed = isWomensHormone || isGutHealth;
                        const enrolledCount = isFMPractitioner ? 1447 : isWomensHormone ? 892 : isGutHealth ? 756 : (course.analytics?.totalEnrolled || course._count.enrollments) + 100;
                        const reviewCount = isFMPractitioner ? 823 : isWomensHormone ? 412 : isGutHealth ? 347 : course._count.reviews;
                        const coach = course.coach || DEFAULT_COACH;
                        const originalPrice = course.price ? Math.round(course.price * 1.5) : null;
                        const discountPercent = originalPrice && course.price ? getDiscountPercent(originalPrice, course.price) : 0;
                        const isWishlisted = localWishlist.has(course.id);
                        const isLoadingWishlist = wishlistLoading === course.id;

                        return (
                            <Link key={course.id} href={`/courses/${course.slug}`}>
                                <Card className="h-full overflow-hidden border-2 border-gray-100 hover:border-burgundy-200 hover:shadow-xl transition-all group">
                                    {/* Thumbnail - 2:1 aspect ratio (slightly shorter than 16:9) */}
                                    <div className="aspect-[2/1] relative overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                                        {course.thumbnail && (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Top Badges Row */}
                                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                            <div className="flex flex-col gap-1.5">
                                                {course.isFree && (
                                                    <Badge className="bg-green-500 text-white shadow-lg">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        FREE
                                                    </Badge>
                                                )}
                                                {!course.isFree && discountPercent > 0 && (
                                                    <Badge className="bg-red-500 text-white shadow-lg">
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {discountPercent}% OFF
                                                    </Badge>
                                                )}
                                                {course.isFeatured && (
                                                    <Badge className="bg-gold-400 text-burgundy-900 shadow-lg">
                                                        <Flame className="w-3 h-3 mr-1" />
                                                        Best Seller
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Wishlist Button */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, course.id)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${isWishlisted
                                                    ? "bg-red-500 text-white"
                                                    : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                                                    }`}
                                                disabled={isLoadingWishlist}
                                            >
                                                {isLoadingWishlist ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                                                )}
                                            </button>
                                        </div>

                                        {/* Bottom - Certificate Type */}
                                        <div className="absolute bottom-3 left-3">
                                            <Badge className={`${getCertBadgeStyle(course.certificateType)} shadow-lg`}>
                                                <Award className="w-3 h-3 mr-1" />
                                                {course.certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-3 sm:p-5">
                                        {/* Title */}
                                        <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-burgundy-600 transition-colors min-h-[40px] sm:min-h-[56px]">
                                            {course.title}
                                        </h3>

                                        {/* Rating & Stats Row */}
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400 fill-gold-400" />
                                                <span className="font-semibold text-gray-900">{courseAvgRating.toFixed(1)}</span>
                                                <span className="text-gray-400">({reviewCount.toLocaleString()})</span>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-1 text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{enrolledCount.toLocaleString()} enrolled</span>
                                            </div>
                                        </div>

                                        {/* Course Info Row - hidden on mobile */}
                                        <div className="hidden sm:flex items-center gap-3 mb-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{formatDuration(course.duration)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>{totalLessons} lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                <span>{course.difficulty}</span>
                                            </div>
                                        </div>

                                        {/* Career Path & Earning Potential - hidden on mobile */}
                                        {(() => {
                                            const careerData = getCourseCareerData(course);
                                            return (
                                                <div className="hidden sm:block mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Career Outlook</span>
                                                        <Badge className={`ml-auto text-[10px] px-1.5 py-0 ${careerData.demandLevel === "Very High"
                                                            ? "bg-red-100 text-red-700"
                                                            : careerData.demandLevel === "High"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                            {careerData.demandLevel} Demand
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-start gap-2">
                                                            <Briefcase className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                            <span className="text-xs text-gray-700">{careerData.careerPath}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                            <span className="text-xs font-semibold text-emerald-700">{careerData.earningPotential}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ChevronRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                            <span className="text-xs text-gray-600">{careerData.jobOutlook}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Coach/Instructor Section - Enhanced */}
                                        <div className="hidden sm:block mb-4 p-3 bg-gradient-to-r from-gray-50 to-burgundy-50/30 rounded-xl border border-gray-100">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-12 w-12 ring-2 ring-burgundy-200 shadow-md">
                                                    <AvatarImage src={coach.avatar || undefined} />
                                                    <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white text-sm font-bold">
                                                        {getCoachInitials(coach.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 text-sm">{coach.name}</p>
                                                        <Badge className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0">Verified</Badge>
                                                    </div>
                                                    <p className="text-[10px] text-burgundy-600 font-medium">{coach.title || "Certified Functional Medicine Practitioner"}</p>
                                                    <div className="flex items-center gap-1 mt-1.5">
                                                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 bg-gold-50 border-gold-200 text-gold-700">80+ CEU</Badge>
                                                        {ACCREDITATIONS.slice(0, 3).map((acc) => (
                                                            <Badge key={acc.code} variant="outline" className="text-[8px] px-1 py-0 h-4 bg-white border-gray-200 text-gray-600" title={acc.name}>
                                                                {acc.code}
                                                            </Badge>
                                                        ))}
                                                        <span className="text-[8px] text-gray-400">+6 more</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Section - With Graduate Flash Sale */}
                                        <div className="mb-2 sm:mb-4">
                                            {course.isFree ? (
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <span className="text-lg sm:text-2xl font-bold text-green-600">Free</span>
                                                    <Badge variant="outline" className="hidden sm:inline-flex text-green-600 border-green-200 text-xs">No Credit Card</Badge>
                                                </div>
                                            ) : hasGraduateDiscount ? (
                                                <div className="space-y-2">
                                                    {/* Graduate Flash Sale Banner */}
                                                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-lg p-2 text-center animate-pulse">
                                                        <div className="flex items-center justify-center gap-2 text-xs font-bold">
                                                            <Flame className="w-4 h-4" />
                                                            <span>GRADUATE FLASH SALE</span>
                                                            <Flame className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-[10px] opacity-90 mt-0.5">
                                                            Before we close the spot!
                                                        </div>
                                                    </div>
                                                    {/* Countdown Timer */}
                                                    <div className="flex items-center justify-center gap-1 text-xs">
                                                        <span className="text-gray-500">Ends in:</span>
                                                        <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                                            {String(countdown?.hours || 0).padStart(2, '0')}:{String(countdown?.minutes || 0).padStart(2, '0')}:{String(countdown?.seconds || 0).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    {/* Price Display */}
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-lg text-gray-400 line-through">${FULL_PRICE}</span>
                                                        <span className="text-2xl font-bold text-green-600">${GRADUATE_PRICE}</span>
                                                        <Badge className="bg-green-100 text-green-700 text-xs">Save $1,000!</Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <span className="text-lg sm:text-2xl font-bold text-burgundy-600">${FULL_PRICE}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button or Progress */}
                                        {enrollment ? (
                                            <div className="space-y-1 sm:space-y-2">
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-bold text-burgundy-600">{Math.round(enrollment.progress)}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-1.5 sm:h-2" />
                                                <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold text-xs sm:text-sm h-8 sm:h-10">
                                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Continue Learning</span>
                                                    <span className="sm:hidden">Continue</span>
                                                </Button>
                                            </div>
                                        ) : isCohortClosed ? (
                                            <Button size="sm" className="w-full bg-gray-400 cursor-not-allowed font-semibold text-xs sm:text-sm h-8 sm:h-10" disabled>
                                                <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Cohort Closed - Spots Filled</span>
                                                <span className="sm:hidden">Sold Out</span>
                                            </Button>
                                        ) : (
                                            <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold group-hover:bg-burgundy-700 text-xs sm:text-sm h-8 sm:h-10">
                                                {course.isFree ? (
                                                    <>
                                                        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Start Learning</span>
                                                        <span className="sm:hidden">Start</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Enroll Now</span>
                                                        <span className="sm:hidden">Enroll</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {/* Money Back Guarantee - hidden on mobile */}
                                        {!course.isFree && (
                                            <p className="hidden sm:flex text-xs text-center text-gray-500 mt-3 items-center justify-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                30-Day Money-Back Guarantee
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* FM Specializations - Coming Soon */}
            {!searchQuery && !selectedCategory && (
                <section className="pt-6">
                    <div className="text-center mb-8">
                        <Badge className="bg-gold-100 text-gold-700 mb-3">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Specialization Tracks
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">FM Specializations</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Master a specific niche within functional medicine. Each specialization unlocks premium client opportunities.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {FM_SPECIALIZATIONS_CATALOG.map((spec, index) => (
                            <Card key={spec.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative">
                                {/* Coming Soon Overlay */}
                                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Badge className="bg-white text-gray-900 shadow-lg">Coming Soon</Badge>
                                </div>

                                {/* Image */}
                                <div className="aspect-[3/2] relative overflow-hidden">
                                    <img
                                        src={spec.image}
                                        alt={spec.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Rank Badge */}
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-burgundy-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                        {index + 1}
                                    </div>

                                    {/* Status Badge */}
                                    <Badge className={`absolute top-2 right-2 text-[10px] shadow-lg ${spec.badge === "CORE" ? "bg-emerald-500 text-white" :
                                        spec.badge === "HIGH DEMAND" ? "bg-green-500 text-white" :
                                            spec.badge === "TRENDING" ? "bg-pink-500 text-white" :
                                                spec.badge === "GROWING" ? "bg-purple-500 text-white" :
                                                    spec.badge === "EVERGREEN" ? "bg-amber-500 text-white" :
                                                        spec.badge === "HIGH VOLUME" ? "bg-orange-500 text-white" :
                                                            spec.badge === "SPECIALIST" ? "bg-red-500 text-white" :
                                                                spec.badge === "EMERGING" ? "bg-indigo-500 text-white" :
                                                                    spec.badge === "NICHE" ? "bg-blue-500 text-white" :
                                                                        "bg-teal-500 text-white"
                                        }`}>
                                        {spec.badge}
                                    </Badge>

                                    {/* Title on image */}
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <h3 className="font-bold text-white text-sm line-clamp-1">{spec.shortTitle}</h3>
                                    </div>
                                </div>

                                <CardContent className="p-3">
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{spec.description}</p>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Market Demand</span>
                                            <Badge className={`text-[9px] px-1.5 py-0 ${spec.marketDemand === "Very High" ? "bg-red-100 text-red-700" :
                                                spec.marketDemand === "High" ? "bg-orange-100 text-orange-700" :
                                                    spec.marketDemand === "Growing" ? "bg-blue-100 text-blue-700" :
                                                        "bg-gray-100 text-gray-700"
                                                }`}>
                                                {spec.marketDemand}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between bg-green-50 rounded-md px-2 py-1">
                                            <span className="text-[10px] text-green-600 font-medium">Earning Potential</span>
                                            <span className="text-xs font-bold text-green-700">{spec.income}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500 mb-3">All specializations are included in the full certification. Choose your focus area.</p>
                        <Link href="/tracks/functional-medicine">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                                Explore Specialization Tracks
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>
            )}

            {/* Career Tracks - Completely Redesigned */}
            {!searchQuery && !selectedCategory && (
                <section className="pt-6">
                    <div className="text-center mb-8">
                        <Badge className="bg-burgundy-100 text-burgundy-700 mb-3">
                            <Target className="w-3 h-3 mr-1" />
                            Choose Your Path
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Career Tracks</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Complete career pathways from exploration to scaling. Each track builds on the previous step.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {CAREER_TRACKS.map((track) => (
                            <Card key={track.slug} className={`overflow-hidden border-2 ${track.borderColor} hover:shadow-2xl transition-all`}>
                                {/* Track Header */}
                                <div className={`bg-gradient-to-r ${track.color} p-6 text-white relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <track.icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">{track.name}</h3>
                                                <p className="text-sm text-white/80">{track.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span className="font-semibold">{track.incomeRange}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{track.studentsCount.toLocaleString()} students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className={`p-6 ${track.bgColor}`}>
                                    <p className="text-sm text-gray-700 mb-5">{track.description}</p>

                                    {/* Steps */}
                                    <div className="space-y-2.5 mb-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Journey</p>
                                        {track.steps.map((step, j) => (
                                            <div
                                                key={j}
                                                className={`flex items-center gap-3 p-3 rounded-xl border ${step.status === "available"
                                                    ? "bg-white border-gray-200"
                                                    : "bg-gray-50 border-gray-100"
                                                    }`}
                                            >
                                                <span className="text-lg">{getStepIcon(step.type)}</span>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${step.status === "available" ? "text-gray-900" : "text-gray-500"
                                                        }`}>
                                                        {step.name}
                                                    </p>
                                                </div>
                                                {step.status === "available" ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={`/tracks/${track.slug}`}>
                                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold">
                                            Explore {track.name} Track
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials - After Career Tracks */}
            {!searchQuery && !selectedCategory && (
                <section className="pt-4">
                    <div className="text-center mb-8">
                        <Badge className="bg-green-100 text-green-700 mb-3">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Real Results
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Students Transforming Their Lives</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Join thousands of practitioners who built successful careers with AccrediPro certifications.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <Card key={i} className="bg-white border-gray-200 hover:shadow-lg transition-all">
                                <CardContent className="p-5">
                                    {/* Stars */}
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{t.quote}"</p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 ring-2 ring-burgundy-100">
                                            <AvatarImage src={t.avatar} alt={t.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white text-sm font-bold">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-gray-500">{t.role}</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
                                            {t.income}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            {!searchQuery && !selectedCategory && (
                <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 border-0 overflow-hidden">
                    <CardContent className="p-8 relative">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 bg-gold-400/20 px-3 py-1 rounded-full mb-3">
                                    <Trophy className="w-4 h-4 text-gold-400" />
                                    <span className="text-sm font-semibold text-gold-300">Your Career Awaits</span>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                    Ready to Transform Your Career?
                                </h3>
                                <p className="text-burgundy-100 max-w-xl">
                                    Get your personalized roadmap based on your goals. See exactly what steps to take and when.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/roadmap">
                                    <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold shadow-lg">
                                        <Target className="w-5 h-5 mr-2" />
                                        See My Roadmap
                                    </Button>
                                </Link>
                                <Link href="/mentorship">
                                    <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/40 font-semibold">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Talk to a Coach
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
