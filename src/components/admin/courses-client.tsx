"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BookOpen, Users, Award, GraduationCap, Plus, Trash2, Check, X,
    Search, Copy, ExternalLink, Eye, Globe, Lock, Star, ImageIcon,
    MoreHorizontal, ArrowRight, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
    id: string;
    name: string;
}

interface Lesson {
    id: string;
    title: string;
    order: number;
    isPublished: boolean;
    lessonType: string;
    videoDuration?: number;
}

interface Module {
    id: string;
    title: string;
    description?: string;
    order: number;
    isPublished: boolean;
    lessons: Lesson[];
    _count: { lessons: number };
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    thumbnail?: string;
    price?: number;
    isFree: boolean;
    isPublished: boolean;
    isFeatured: boolean;
    difficulty: string;
    certificateType: string;
    category?: Category;
    _count: { enrollments: number; modules: number; certificates: number };
    modules?: Module[];
}

interface CoursesClientProps {
    initialCourses: Course[];
    categories?: Category[];
    totalEnrollments: number;
    totalCertificates: number;
    activeStudentsThisWeek: number;
    avgCompletionRate: number;
    // Mini Diploma funnel data (optional - passed from server)
    miniDiplomaFunnel?: {
        optedIn: number;
        started: number;
        completed: number;
        convertedToPaid: number;
    };
}

export function CoursesClient({
    initialCourses,
    totalEnrollments,
    totalCertificates,
    activeStudentsThisWeek = 0,
    avgCompletionRate = 0,
    miniDiplomaFunnel,
}: CoursesClientProps) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "published" | "draft">("all");

    // Stats
    const publishedCount = courses.filter(c => c.isPublished).length;
    const draftCount = courses.filter(c => !c.isPublished).length;
    const miniDiplomaCourses = courses.filter(c => c.certificateType === "MINI_DIPLOMA");
    const mainCourses = courses.filter(c => c.certificateType !== "MINI_DIPLOMA");

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" ||
            (filterType === "published" && course.isPublished) ||
            (filterType === "draft" && !course.isPublished);
        return matchesSearch && matchesType;
    });

    const filteredMiniDiplomas = filteredCourses.filter(c => c.certificateType === "MINI_DIPLOMA");
    const filteredMainCourses = filteredCourses.filter(c => c.certificateType !== "MINI_DIPLOMA");

    // Actions
    const handleTogglePublish = async (course: Course) => {
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, isPublished: !course.isPublished }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
                toast.success(course.isPublished ? "Unpublished" : "Published");
            }
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleDuplicate = async (course: Course) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `${course.title} (Copy)`,
                    slug: `${course.slug}-copy-${Date.now()}`,
                    description: course.description || "",
                    shortDescription: course.shortDescription,
                    isFree: course.isFree,
                    isPublished: false,
                    isFeatured: false,
                    difficulty: course.difficulty,
                    certificateType: course.certificateType,
                }),
            });
            if (res.ok) {
                const { course: newCourse } = await res.json();
                setCourses(prev => [{ ...newCourse, modules: [], _count: { enrollments: 0, modules: 0, certificates: 0 } }, ...prev]);
                toast.success("Duplicated");
            }
        } catch {
            toast.error("Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setCourses(prev => prev.filter(c => c.id !== id));
                setDeleteConfirm(null);
                toast.success("Deleted");
            }
        } catch {
            toast.error("Failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Course Row Component - Clean, minimal
    const CourseRow = ({ course }: { course: Course }) => {
        const lessonCount = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

        return (
            <div className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                {/* Thumbnail */}
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {course.thumbnail ? (
                        <Image src={course.thumbnail} alt="" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/courses/${course.id}`}
                            className="font-medium text-gray-900 hover:text-burgundy-600 truncate"
                        >
                            {course.title}
                        </Link>
                        {course.isFeatured && (
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{course._count.modules} modules</span>
                        <span>•</span>
                        <span>{lessonCount} lessons</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{course._count.enrollments}</p>
                        <p className="text-xs text-gray-500">enrolled</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{course._count.certificates}</p>
                        <p className="text-xs text-gray-500">certified</p>
                    </div>
                </div>

                {/* Status */}
                <Badge
                    variant={course.isPublished ? "default" : "secondary"}
                    className={course.isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                >
                    {course.isPublished ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {course.isPublished ? "Live" : "Draft"}
                </Badge>

                {/* Actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}`}>
                                Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(course)}>
                            {course.isPublished ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(course)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {deleteConfirm === course.id ? (
                            <div className="flex items-center gap-1 px-2 py-1">
                                <Button size="sm" variant="destructive" className="flex-1 h-7" onClick={() => handleDelete(course.id)}>
                                    <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7" onClick={() => setDeleteConfirm(null)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setDeleteConfirm(course.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {publishedCount} published • {draftCount} drafts
                    </p>
                </div>
                <Button asChild className="bg-burgundy-600 hover:bg-burgundy-700">
                    <Link href="/admin/courses/new">
                        <Plus className="w-4 h-4 mr-2" />
                        New Course
                    </Link>
                </Button>
            </div>

            {/* Stats Row - Clean, minimal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{totalEnrollments.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Total Enrollments</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{activeStudentsThisWeek}</p>
                                <p className="text-sm text-gray-500">Active (7d)</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{totalCertificates}</p>
                                <p className="text-sm text-gray-500">Certificates</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{avgCompletionRate}%</p>
                                <p className="text-sm text-gray-500">Completion Rate</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mini Diploma Funnel - If data available */}
            {miniDiplomaFunnel && (
                <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Mini Diploma Funnel</h3>
                                    <p className="text-sm text-gray-500">Free lead magnet performance</p>
                                </div>
                            </div>
                            <Link href="/admin/leads" className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1">
                                View Details <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-2xl font-semibold text-gray-900">{miniDiplomaFunnel.optedIn}</p>
                                <p className="text-xs text-gray-500">Opted In</p>
                            </div>
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-2xl font-semibold text-gray-900">{miniDiplomaFunnel.started}</p>
                                <p className="text-xs text-gray-500">Started</p>
                                <p className="text-xs text-pink-600 mt-0.5">
                                    {miniDiplomaFunnel.optedIn > 0 ? Math.round((miniDiplomaFunnel.started / miniDiplomaFunnel.optedIn) * 100) : 0}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-2xl font-semibold text-gray-900">{miniDiplomaFunnel.completed}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                                <p className="text-xs text-pink-600 mt-0.5">
                                    {miniDiplomaFunnel.started > 0 ? Math.round((miniDiplomaFunnel.completed / miniDiplomaFunnel.started) * 100) : 0}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-2xl font-semibold text-emerald-600">{miniDiplomaFunnel.convertedToPaid}</p>
                                <p className="text-xs text-gray-500">Converted</p>
                                <p className="text-xs text-emerald-600 mt-0.5">
                                    {miniDiplomaFunnel.completed > 0 ? Math.round((miniDiplomaFunnel.convertedToPaid / miniDiplomaFunnel.completed) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>
                <div className="flex items-center bg-white border rounded-lg overflow-hidden">
                    {(["all", "published", "draft"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${filterType === type
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mini Diplomas Section */}
            {filteredMiniDiplomas.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="font-medium text-gray-700">Mini Diplomas</h2>
                        <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                            {filteredMiniDiplomas.length}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {filteredMiniDiplomas.map(course => (
                            <CourseRow key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Courses Section */}
            {filteredMainCourses.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="font-medium text-gray-700">Certifications</h2>
                        <Badge variant="secondary">
                            {filteredMainCourses.length}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {filteredMainCourses.map(course => (
                            <CourseRow key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                    <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900">No courses found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
