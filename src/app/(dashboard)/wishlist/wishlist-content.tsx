"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Clock,
    Star,
    Users,
    Heart,
    ArrowRight,
    Trash2,
    Loader2,
    Play,
    Tag,
    GraduationCap,
    Sparkles,
    TrendingUp,
    DollarSign,
    ChevronRight,
    CheckCircle,
    Target,
    Map as MapIcon,
    Bookmark,
} from "lucide-react";
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

interface WishlistItem {
    id: string;
    courseId: string;
    addedAt: Date;
    course: Course;
}

interface Enrollment {
    courseId: string;
    status: string;
    progress: number;
}

interface WishlistContentProps {
    wishlist: WishlistItem[];
    enrollments: Enrollment[];
}

const DEFAULT_COACH = {
    name: "Sarah Mitchell",
    avatar: "/images/coaches/sarah.jpg",
    title: "Lead Instructor",
};

export function WishlistContent({ wishlist: initialWishlist, enrollments }: WishlistContentProps) {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return "Self-paced";
        const hours = Math.floor(minutes / 60);
        return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes} min`;
    };

    const removeFromWishlist = async (courseId: string) => {
        setRemovingId(courseId);

        try {
            const response = await fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            if (!response.ok) throw new Error("Failed to remove");

            setWishlist((prev) => prev.filter((item) => item.courseId !== courseId));
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove from wishlist");
        } finally {
            setRemovingId(null);
        }
    };

    // Calculate stats
    const totalValue = wishlist.reduce((acc, item) => acc + (item.course.price || 0), 0);
    const freeCoursesCount = wishlist.filter((item) => item.course.isFree).length;
    const certificationCount = wishlist.filter((item) => item.course.certificateType === "CERTIFICATION").length;
    const alreadyEnrolledCount = wishlist.filter((item) => enrollmentMap.has(item.course.id)).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Enhanced Hero Header */}
            <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                </div>
                <CardContent className="p-6 md:p-8 relative">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                                <Heart className="w-7 h-7 text-white fill-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Learning Wishlist</h1>
                                <p className="text-burgundy-100 text-base">
                                    {wishlist.length === 0
                                        ? "Save courses you want to take later"
                                        : `${wishlist.length} course${wishlist.length !== 1 ? "s" : ""} saved for your journey`}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {wishlist.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-gold-300 text-sm font-medium mb-1">
                                        <DollarSign className="w-4 h-4" />
                                        Total Value
                                    </div>
                                    <p className="text-xl font-bold text-white">
                                        ${totalValue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-green-300 text-sm font-medium mb-1">
                                        <Sparkles className="w-4 h-4" />
                                        Free Courses
                                    </div>
                                    <p className="text-xl font-bold text-white">{freeCoursesCount}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-1">
                                        <GraduationCap className="w-4 h-4" />
                                        Certifications
                                    </div>
                                    <p className="text-xl font-bold text-white">{certificationCount}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Wishlist Content */}
            {wishlist.length === 0 ? (
                <div className="space-y-6">
                    {/* Empty State - More engaging */}
                    <Card className="border-2 border-dashed border-gray-200">
                        <CardContent className="py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Save courses you're interested in by clicking the heart icon. Build your learning path one course at a time.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href="/courses">
                                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Browse All Courses
                                    </Button>
                                </Link>
                                <Link href="/roadmap">
                                    <Button variant="outline" className="border-burgundy-200 text-burgundy-600">
                                        <MapIcon className="w-4 h-4 mr-2" />
                                        View Your Roadmap
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Suggestions when empty */}
                    <Card className="bg-gradient-to-r from-gold-50 to-burgundy-50 border-gold-200/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-burgundy-600" />
                                Recommended for You
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Not sure where to start? Here's our recommended path:
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-gold-200">
                                    <Badge className="bg-green-100 text-green-700 mb-2">Free</Badge>
                                    <h4 className="font-medium text-gray-900 mb-1">Mini Diploma</h4>
                                    <p className="text-xs text-gray-500 mb-3">Start with a free introduction</p>
                                    <Link href="/my-mini-diploma">
                                        <Button size="sm" variant="outline" className="w-full text-xs">
                                            Start Free
                                        </Button>
                                    </Link>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-gold-200">
                                    <Badge className="bg-gold-100 text-gold-700 mb-2">Step 1</Badge>
                                    <h4 className="font-medium text-gray-900 mb-1">Certification</h4>
                                    <p className="text-xs text-gray-500 mb-3">Get professionally certified</p>
                                    <Link href="/tracks/functional-medicine">
                                        <Button size="sm" variant="outline" className="w-full text-xs">
                                            View Track
                                        </Button>
                                    </Link>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-gold-200">
                                    <Badge className="bg-burgundy-100 text-burgundy-700 mb-2">Explore</Badge>
                                    <h4 className="font-medium text-gray-900 mb-1">Career Center</h4>
                                    <p className="text-xs text-gray-500 mb-3">See income & career paths</p>
                                    <Link href="/career-center">
                                        <Button size="sm" variant="outline" className="w-full text-xs">
                                            Explore
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    {/* Already Enrolled Notice */}
                    {alreadyEnrolledCount > 0 && (
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <p className="text-sm text-green-700">
                                    <strong>{alreadyEnrolledCount}</strong> course{alreadyEnrolledCount > 1 ? "s" : ""} in your wishlist {alreadyEnrolledCount > 1 ? "are" : "is"} already in progress!
                                </p>
                                <Link href="/my-courses" className="ml-auto">
                                    <Button size="sm" variant="ghost" className="text-green-700">
                                        Continue Learning <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Course Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => {
                            const course = item.course;
                            const enrollment = enrollmentMap.get(course.id);
                            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                            const avgRating = course.analytics?.avgRating || 4.9;
                            const enrolledCount = course.analytics?.totalEnrolled || course._count.enrollments;
                            const coach = course.coach || DEFAULT_COACH;
                            const isRemoving = removingId === course.id;

                            return (
                                <Card key={item.id} className="overflow-hidden border-2 border-gray-100 hover:border-burgundy-200 hover:shadow-lg transition-all group">
                                    {/* Header with gradient */}
                                    <div className="h-36 relative overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeFromWishlist(course.id);
                                            }}
                                            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white shadow-lg"
                                            disabled={isRemoving}
                                        >
                                            {isRemoving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>

                                        {/* Price/Free Badge */}
                                        <div className="absolute top-3 left-3">
                                            {course.isFree ? (
                                                <Badge className="bg-green-500 text-white shadow-lg">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    FREE
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-white text-burgundy-700 shadow-lg font-bold">
                                                    ${course.price}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Course Type */}
                                        <div className="absolute bottom-3 left-3">
                                            <Badge className={`shadow-lg ${
                                                course.certificateType === "CERTIFICATION"
                                                    ? "bg-gold-400 text-burgundy-900"
                                                    : "bg-purple-500 text-white"
                                            }`}>
                                                <GraduationCap className="w-3 h-3 mr-1" />
                                                {course.certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}
                                            </Badge>
                                        </div>

                                        {/* Stats */}
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                                                <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                                                <span className="text-white text-xs font-medium">{avgRating.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        {/* Enrolled Indicator */}
                                        {enrollment && (
                                            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center">
                                                <Badge className="bg-white text-green-700 shadow-lg">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {enrollment.status === "COMPLETED" ? "Completed" : `${Math.round(enrollment.progress)}% Complete`}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-5">
                                        {/* Category */}
                                        {course.category && (
                                            <Badge variant="outline" className="text-xs mb-2">
                                                {course.category.name}
                                            </Badge>
                                        )}

                                        {/* Title */}
                                        <Link href={`/courses/${course.slug}`}>
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-600 transition-colors min-h-[48px]">
                                                {course.title}
                                            </h3>
                                        </Link>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                                            {course.shortDescription || course.description || "Start your journey to certification."}
                                        </p>

                                        {/* Coach & Meta */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-burgundy-400 to-burgundy-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {coach.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span>{coach.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDuration(course.duration)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {enrolledCount}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress or CTA */}
                                        {enrollment ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-semibold text-burgundy-600">{Math.round(enrollment.progress)}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2" />
                                                <Link href={`/courses/${course.slug}`}>
                                                    <Button className="w-full mt-2 bg-burgundy-600 hover:bg-burgundy-700" size="sm">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link href={`/courses/${course.slug}`}>
                                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                                    View Course
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Bottom CTA Section */}
                    <Card className="bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Ready to advance your career?</h3>
                                        <p className="text-sm text-gray-600">View your personalized roadmap and start your journey</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link href="/roadmap">
                                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                            <MapIcon className="w-4 h-4 mr-2" />
                                            My Roadmap
                                        </Button>
                                    </Link>
                                    <Link href="/courses">
                                        <Button variant="outline" className="border-burgundy-200 text-burgundy-600">
                                            Browse More
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
