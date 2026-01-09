"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Users,
    TrendingUp,
    Heart,
    Target,
    Tag,
    Loader2,
    Sparkles,
    Shield,
    Zap,
    BarChart3,
    ChevronRight,
    Flame,
    DollarSign,
    Briefcase,
    Lock,
    MessageCircle,
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
    graduateAccessExpiresAt?: string | null;
    isGraduate?: boolean;
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

// Course Tier/Level definitions (no "All" - user picks specific tier)
const COURSE_TIERS = [
    { id: "main", label: "🎯 Certification", keywords: ["certified", "certification"] },
    { id: "advanced", label: "📈 Advanced", keywords: ["advanced", "- advanced"] },
    { id: "master", label: "🏆 Master", keywords: ["master", "- master"] },
    { id: "practice", label: "💼 Practice Path", keywords: ["practice path", "practice"] },
];

// Helper to determine course tier from title
const getCourseLevel = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes("practice path")) return "practice";
    if (t.includes(" - master") || t.includes("master depth")) return "master";
    if (t.includes(" - advanced") || t.includes("advanced clinical")) return "advanced";
    // Main certification - default for "Certified X" titles
    return "main";
};

// Graduate pricing constants
const FULL_PRICE = 1997;
const GRADUATE_PRICE = 1597; // 20% graduate discount

// Helper to calculate time remaining for graduate access
const getGraduateTimeRemaining = (expiresAt: string | null): { expired: boolean; days: number; hours: number; minutes: number } | null => {
    if (!expiresAt) return null;

    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { expired: false, days, hours, minutes };
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

// Super Categories for Tab Navigation
const SUPER_CATEGORIES = [
    {
        id: "all",
        label: "All Courses",
        icon: "📚",
        rawCategories: [] as string[], // Empty means show all
    },
    {
        id: "health",
        label: "Health & Wellness",
        icon: "🌿",
        rawCategories: [
            "FUNCTIONAL MEDICINE", "INTEGRATIVE MEDICINE", "CLINICAL CONDITIONS",
            "CLINICAL & CONDITION-SPECIFIC", "GUT HEALTH", "AUTOIMMUNE & INFLAMMATION",
            "BIOHACKING & LONGEVITY", "ENVIRONMENTAL & LIFESTYLE WELLNESS",
            "SPECIALIZED BODY SYSTEMS", "GENETICS & ADVANCED TESTING",
            "HEALTHCARE PROFESSIONAL TRACKS", "ADVANCED FUNCTIONAL MEDICINE",
            "FunctionalMedicine", "IntegrativeMedicine"
        ],
    },
    {
        id: "womens",
        label: "Women's Health",
        icon: "👩",
        rawCategories: [
            "WOMEN'S HORMONES", "WOMEN'S HEALTH & HORMONES",
            "FERTILITY, BIRTH & POSTPARTUM", "HORMONES & METABOLISM",
            "WomensHormones", "FertilityBirth"
        ],
    },
    {
        id: "nutrition",
        label: "Nutrition & Diet",
        icon: "🥗",
        rawCategories: [
            "NUTRITION & LIFESTYLE", "DIET & NUTRITION APPROACHES",
            "HERBALISM & PLANT MEDICINE", "AYURVEDA & TRADITIONAL MEDICINE",
            "Herbalism"
        ],
    },
    {
        id: "family",
        label: "Family & Parenting",
        icon: "👨‍👩‍👧",
        rawCategories: [
            "PARENTING", "FAMILY, PARENTING & SPECIAL POPULATIONS",
            "SPECIALIZED POPULATIONS", "Parenting"
        ],
    },
    {
        id: "pet",
        label: "Pet & Animal",
        icon: "🐾",
        rawCategories: [
            "PET WELLNESS", "PET WELLNESS & ANIMAL CARE",
            "EQUINE, ANIMAL-ASSISTED & NATURE THERAPY", "PetWellness"
        ],
    },
    {
        id: "spiritual",
        label: "Spiritual & Energy",
        icon: "✨",
        rawCategories: [
            "SPIRITUAL HEALING", "SPIRITUAL HEALING & ENERGY WORK",
            "SPIRITUAL & ENERGY", "ART, MUSIC, SOUND & EXPRESSIVE THERAPIES"
        ],
    },
    {
        id: "mental",
        label: "Mental Health",
        icon: "🧠",
        rawCategories: [
            "MENTAL HEALTH", "MENTAL HEALTH & NERVOUS SYSTEM", "TRAUMA RECOVERY",
            "NARCISSISTIC ABUSE & RELATIONSHIP TRAUMA", "GRIEF & BEREAVEMENT",
            "ADDICTION & RECOVERY", "ADDICTION RECOVERY", "NEURODIVERSITY",
            "EMOTIONAL & HOLISTIC WELLNESS", "SENIOR & END-OF-LIFE",
            "VETERANS & MILITARY", "DISABILITY WELLNESS",
            "NarcTrauma", "Neurodiversity", "Mindfulness", "GriefEndoflife"
        ],
    },
    {
        id: "therapy",
        label: "Therapy & Bodywork",
        icon: "💆",
        rawCategories: [
            "THERAPY MODALITIES", "BODYWORK & MASSAGE THERAPY", "YOGA & MOVEMENT",
            "MIND-BODY MODALITIES", "FITNESS & ATHLETIC PERFORMANCE",
            "ALTERNATIVE & TRADITIONAL THERAPIES", "SEXUAL WELLNESS & INTIMACY",
            "SEXUALITY & INTIMACY", "MEN'S HEALTH", "FAITH-BASED COACHING",
            "BUSINESS & PRACTICE BUILDING", "TherapyModalities", "FaithBased", "SexIntimacy"
        ],
    },
];

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


export function CourseCatalogFilters({
    courses,
    categories,
    enrollments,
    specialOffers = [],
    wishlistIds = [],
    isLoggedIn = false,
    miniDiplomaCompletedAt = null,
    graduateAccessExpiresAt = null,
    isGraduate = false,
}: CourseCatalogFiltersProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSuperCategory, setSelectedSuperCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("featured");
    const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set(wishlistIds));
    const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
    const [graduateCountdown, setGraduateCountdown] = useState(getGraduateTimeRemaining(graduateAccessExpiresAt));
    const [selectedTier, setSelectedTier] = useState<string | null>(null); // null = show all tiers

    // Update countdown every minute (for days/hours display)
    useEffect(() => {
        if (!graduateAccessExpiresAt) return;

        const timer = setInterval(() => {
            setGraduateCountdown(getGraduateTimeRemaining(graduateAccessExpiresAt));
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [graduateAccessExpiresAt]);

    // Check if user qualifies for graduate discount
    const hasGraduateDiscount = isGraduate && graduateCountdown && !graduateCountdown.expired;

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

    // Filter courses - also hide already enrolled courses from catalog
    const filteredCourses = useMemo(() => {
        let filtered = courses.filter((course) => {
            // Hide courses the user is already enrolled in
            const isEnrolled = enrollmentMap.has(course.id);
            if (isEnrolled) return false;

            const matchesSearch = searchQuery === "" ||
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === null || course.category?.id === selectedCategory;

            // Super-category filter
            const superCat = SUPER_CATEGORIES.find(sc => sc.id === selectedSuperCategory);
            const matchesSuperCategory = selectedSuperCategory === "all" ||
                (superCat && superCat.rawCategories.some(raw =>
                    course.category?.name?.toUpperCase().includes(raw.toUpperCase()) ||
                    raw.toUpperCase().includes(course.category?.name?.toUpperCase() || "")
                ));

            // Tier/Level filter
            const courseTier = getCourseLevel(course.title);
            const matchesTier = selectedTier === null || courseTier === selectedTier;

            return matchesSearch && matchesCategory && matchesSuperCategory && matchesTier;
        });

        switch (sortBy) {
            case "newest": filtered = [...filtered].reverse(); break;
            case "popular": filtered = [...filtered].sort((a, b) => (b.analytics?.totalEnrolled || b._count.enrollments) - (a.analytics?.totalEnrolled || a._count.enrollments)); break;
            case "rating": filtered = [...filtered].sort((a, b) => (b.analytics?.avgRating || 0) - (a.analytics?.avgRating || 0)); break;
            case "price-low": filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0)); break;
            case "price-high": filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0)); break;
        }
        return filtered;
    }, [courses, searchQuery, selectedCategory, selectedSuperCategory, selectedTier, sortBy, enrollmentMap]);

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

    return (
        <div className="space-y-6">
            {/* Compact Hero Header - Variant 2 Style */}
            <div className="relative bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 rounded-xl overflow-hidden">
                <div className="relative z-10 px-5 py-4">
                    {/* Main Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Icon + Title + Subtitle */}
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/30 flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px]">
                                        Accredited Professional Training
                                    </Badge>
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    Build Your Career in <span className="text-gold-400">Health & Wellness</span>
                                </h1>
                                <p className="text-xs text-burgundy-200 mt-0.5 max-w-md hidden sm:block">
                                    Industry-recognized certifications for a thriving practice.
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats + CTA */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Stats as pills */}
                            <div className="hidden md:flex items-center gap-2">
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Users className="w-3 h-3 mr-1.5 text-gold-400" />
                                    {(totalEnrolled + 2500).toLocaleString()}+ Students
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Star className="w-3 h-3 mr-1.5 text-gold-400 fill-gold-400" />
                                    {avgRating} • 1,344+ Reviews
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Shield className="w-3 h-3 mr-1.5 text-gold-400" />
                                    Accredited
                                </Badge>
                            </div>
                            {/* CTA */}
                            <Link href="/my-personal-roadmap-by-coach-sarah">
                                <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-9">
                                    <Target className="w-4 h-4 mr-1.5" />
                                    View Roadmap
                                </Button>
                            </Link>
                        </div>
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

            {/* Super-Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {SUPER_CATEGORIES.map((category) => {
                    const isSelected = selectedSuperCategory === category.id;
                    // Count courses in this super-category
                    const categoryCount = category.id === "all"
                        ? courses.filter(c => !enrollmentMap.has(c.id)).length
                        : courses.filter(c => {
                            if (enrollmentMap.has(c.id)) return false;
                            return category.rawCategories.some(raw =>
                                c.category?.name?.toUpperCase().includes(raw.toUpperCase()) ||
                                raw.toUpperCase().includes(c.category?.name?.toUpperCase() || "")
                            );
                        }).length;

                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedSuperCategory(category.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${isSelected
                                ? "bg-burgundy-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                                }`}>
                                {categoryCount}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Tier/Level Filter Row */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {COURSE_TIERS.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    // Count courses at this tier
                    const tierCount = courses.filter(c => {
                        if (enrollmentMap.has(c.id)) return false;
                        return getCourseLevel(c.title) === tier.id;
                    }).length;

                    return (
                        <button
                            key={tier.id}
                            onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${isSelected
                                ? "bg-gold-400 text-burgundy-900 border-gold-500 shadow-sm"
                                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
                                }`}
                        >
                            <span>{tier.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? "bg-burgundy-900/20 text-burgundy-900" : "bg-gray-100 text-gray-500"
                                }`}>
                                {tierCount}
                            </span>
                        </button>
                    );
                })}
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
                                    {/* Thumbnail - Auto-fit with natural aspect ratio */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700 w-full">
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                width={400}
                                                height={250}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="aspect-[16/10] w-full" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Top Badges Row */}
                                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                            <div className="flex flex-col gap-1.5">
                                                {course.isFree && (
                                                    <Badge className="bg-green-500 text-white shadow-lg">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        FREE
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

                                        {/* CTA Button - Chat with Coach */}
                                        {enrollment ? (
                                            <div className="space-y-1 sm:space-y-2">
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-bold text-burgundy-600">{Math.round(enrollment.progress)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-burgundy-600 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                                                </div>
                                                <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold text-xs sm:text-sm h-8 sm:h-10">
                                                    <span className="hidden sm:inline">Continue Learning</span>
                                                    <span className="sm:hidden">Continue</span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Link href="/coach-sarah" onClick={(e) => e.stopPropagation()}>
                                                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs sm:text-sm h-8 sm:h-10">
                                                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Apply Now</span>
                                                    <span className="sm:hidden">Apply</span>
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>


        </div>
    );
}
