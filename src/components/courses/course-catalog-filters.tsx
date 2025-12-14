"use client";

import { useState, useMemo } from "react";
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
}

// Default coach when none assigned
const DEFAULT_COACH = {
    name: "Sarah Mitchell",
    avatar: "/images/coaches/sarah.jpg",
    title: "Lead Instructor",
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

// Social proof testimonials - Enhanced
const TESTIMONIALS = [
    {
        name: "Sarah M.",
        role: "Functional Medicine Coach",
        quote: "Went from corporate burnout to $8K/month in 6 months. The certification gave me instant credibility.",
        avatar: null,
        income: "$8K/mo",
        rating: 5,
    },
    {
        name: "Michael T.",
        role: "Health Practitioner",
        quote: "The step-by-step approach made everything clear. Now I have 12 regular clients and growing.",
        avatar: null,
        income: "$6K/mo",
        rating: 5,
    },
    {
        name: "Lisa R.",
        role: "Wellness Business Owner",
        quote: "Started solo, now running a team of 5 coaches. AccrediPro gave me the foundation to scale.",
        avatar: null,
        income: "$25K/mo",
        rating: 5,
    },
    {
        name: "Jennifer K.",
        role: "Women's Health Specialist",
        quote: "My clients trust me because I'm certified. That credibility changed everything for my practice.",
        avatar: null,
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
}: CourseCatalogFiltersProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("featured");
    const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set(wishlistIds));
    const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);

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

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
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
                                    <p className="text-xs text-burgundy-200">{totalReviews + 500}+ Reviews</p>
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

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === null
                        ? "bg-burgundy-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    All Courses
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id
                            ? "bg-burgundy-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const enrollment = enrollmentMap.get(course.id);
                        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                        const courseAvgRating = course.analytics?.avgRating || 4.9;
                        const enrolledCount = (course.analytics?.totalEnrolled || course._count.enrollments) + 100;
                        const reviewCount = course._count.reviews + 50;
                        const coach = course.coach || DEFAULT_COACH;
                        const originalPrice = course.price ? Math.round(course.price * 1.5) : null;
                        const discountPercent = originalPrice && course.price ? getDiscountPercent(originalPrice, course.price) : 0;
                        const isWishlisted = localWishlist.has(course.id);
                        const isLoadingWishlist = wishlistLoading === course.id;

                        return (
                            <Link key={course.id} href={`/courses/${course.slug}`}>
                                <Card className="h-full overflow-hidden border-2 border-gray-100 hover:border-burgundy-200 hover:shadow-xl transition-all group">
                                    {/* Thumbnail */}
                                    <div className="h-44 relative overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                                        {course.thumbnail && (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
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
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                                    isWishlisted
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

                                    <CardContent className="p-5">
                                        {/* Title */}
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-600 transition-colors min-h-[56px]">
                                            {course.title}
                                        </h3>

                                        {/* Rating & Stats Row */}
                                        <div className="flex items-center gap-4 mb-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                                                <span className="font-semibold text-gray-900">{courseAvgRating.toFixed(1)}</span>
                                                <span className="text-gray-500">({reviewCount})</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{enrolledCount.toLocaleString()} enrolled</span>
                                            </div>
                                        </div>

                                        {/* Course Info Row */}
                                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
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

                                        {/* Career Path & Earning Potential */}
                                        {(() => {
                                            const careerData = getCourseCareerData(course);
                                            return (
                                                <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Career Outlook</span>
                                                        <Badge className={`ml-auto text-[10px] px-1.5 py-0 ${
                                                            careerData.demandLevel === "Very High"
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

                                        {/* Coach */}
                                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                            <Avatar className="h-10 w-10 ring-2 ring-burgundy-100">
                                                <AvatarImage src={coach.avatar || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white text-sm font-bold">
                                                    {getCoachInitials(coach.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">{coach.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{coach.title || "Lead Instructor"}</p>
                                            </div>
                                            <MessageSquare className="w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* Price Section */}
                                        <div className="flex items-center justify-between mb-4">
                                            {course.isFree ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-green-600">Free</span>
                                                    <Badge variant="outline" className="text-green-600 border-green-200 text-xs">No Credit Card</Badge>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {originalPrice && (
                                                        <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
                                                    )}
                                                    <span className="text-2xl font-bold text-burgundy-600">${course.price}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button or Progress */}
                                        {enrollment ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Your Progress</span>
                                                    <span className="font-bold text-burgundy-600">{Math.round(enrollment.progress)}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2" />
                                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Continue Learning
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold group-hover:bg-burgundy-700">
                                                {course.isFree ? (
                                                    <>
                                                        <GraduationCap className="w-4 h-4 mr-2" />
                                                        Start Learning
                                                    </>
                                                ) : (
                                                    <>
                                                        <GraduationCap className="w-4 h-4 mr-2" />
                                                        Enroll Now
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {/* Money Back Guarantee - for paid courses */}
                                        {!course.isFree && (
                                            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
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
                            Each track is a complete career pathway. Start with exploration, get certified, then scale your practice.
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
                                                className={`flex items-center gap-3 p-3 rounded-xl border ${
                                                    step.status === "available"
                                                        ? "bg-white border-gray-200"
                                                        : "bg-gray-50 border-gray-100"
                                                }`}
                                            >
                                                <span className="text-lg">{getStepIcon(step.type)}</span>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${
                                                        step.status === "available" ? "text-gray-900" : "text-gray-500"
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
                                        <Avatar className="h-10 w-10">
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
