"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    BookOpen, Users, Award, GraduationCap, Plus, Edit, Trash2, Save, X, Loader2, Check,
    ChevronRight, Layers, Search, Copy, ExternalLink,
    TrendingUp, Star, Eye, BarChart3, FileText, Video, Clock, Zap, Settings,
    Grid3X3, List, Filter, MoreVertical, Globe, Lock, Tag, DollarSign,
    AlertTriangle, CheckCircle, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

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
}

const CERTIFICATE_LABELS: Record<string, { label: string; color: string }> = {
    COMPLETION: { label: "Completion", color: "bg-blue-100 text-blue-700" },
    CERTIFICATION: { label: "Certification", color: "bg-purple-100 text-purple-700" },
    MINI_DIPLOMA: { label: "Mini Diploma", color: "bg-pink-100 text-pink-700" },
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
    BEGINNER: { label: "Beginner", color: "bg-green-100 text-green-700" },
    INTERMEDIATE: { label: "Intermediate", color: "bg-yellow-100 text-yellow-700" },
    ADVANCED: { label: "Advanced", color: "bg-orange-100 text-orange-700" },
    EXPERT: { label: "Expert", color: "bg-red-100 text-red-700" },
};

export function CoursesClient({
    initialCourses,
    categories = [],
    totalEnrollments,
    totalCertificates,
    activeStudentsThisWeek = 0,
    avgCompletionRate = 0,
}: CoursesClientProps) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"recent" | "enrollments" | "title">("recent");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Form
    const [formData, setFormData] = useState({
        title: "", slug: "", description: "", shortDescription: "",
        isFree: true, isPublished: false, isFeatured: false,
        difficulty: "BEGINNER", certificateType: "COMPLETION",
        categoryId: "",
    });

    const resetForm = () => {
        setFormData({
            title: "", slug: "", description: "", shortDescription: "",
            isFree: true, isPublished: false, isFeatured: false,
            difficulty: "BEGINNER", certificateType: "COMPLETION",
            categoryId: "",
        });
    };

    const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Stats
    const publishedCount = courses.filter(c => c.isPublished).length;
    const draftCount = courses.filter(c => !c.isPublished).length;
    const totalLessons = courses.reduce((acc, c) => acc + (c.modules?.reduce((m, mod) => m + mod.lessons.length, 0) || 0), 0);

    // Separate Mini Diplomas from Main Courses
    const miniDiplomaCourses = courses.filter(c => c.certificateType === "MINI_DIPLOMA");
    const mainCourses = courses.filter(c => c.certificateType !== "MINI_DIPLOMA");

    // Get unique categories from courses
    const courseCategories = Array.from(new Set(courses.filter(c => c.category).map(c => c.category!.name)));

    // Filter function
    const filterCourse = (course: Course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);
        const matchesType = filterType === "all" || course.certificateType === filterType;
        const matchesCategory = filterCategory === "all" || course.category?.name === filterCategory;
        return matchesSearch && matchesStatus && matchesType && matchesCategory;
    };

    // Sort function
    const sortCourses = (a: Course, b: Course) => {
        if (sortBy === "enrollments") return b._count.enrollments - a._count.enrollments;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0; // recent - maintain original order
    };

    // Filter & sort both groups
    const filteredMainCourses = mainCourses.filter(filterCourse).sort(sortCourses);
    const filteredMiniDiplomas = miniDiplomaCourses.filter(filterCourse).sort(sortCourses);
    const filteredCourses = courses.filter(filterCourse).sort(sortCourses);

    // API calls
    const handleCreateCourse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    categoryId: formData.categoryId || null,
                }),
            });
            if (res.ok) {
                const { course } = await res.json();
                setCourses(prev => [{ ...course, modules: [], _count: { enrollments: 0, modules: 0, certificates: 0 } }, ...prev]);
                setShowAddModal(false);
                resetForm();
                toast.success("Course created successfully");
                // Redirect to editor
                window.location.href = `/admin/courses/${course.id}`;
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to create course");
            }
        } catch (error) {
            toast.error("Failed to create course");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCourse = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setCourses(prev => prev.filter(c => c.id !== id));
                setDeleteConfirm(null);
                toast.success("Course deleted");
            }
        } catch (error) {
            toast.error("Failed to delete course");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePublish = async (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, isPublished: !course.isPublished }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
                toast.success(course.isPublished ? "Course unpublished" : "Course published");
            }
        } catch (error) {
            toast.error("Failed to update course");
        }
    };

    const handleToggleFeatured = async (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, isFeatured: !course.isFeatured }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isFeatured: !c.isFeatured } : c));
                toast.success(course.isFeatured ? "Removed from featured" : "Added to featured");
            }
        } catch (error) {
            toast.error("Failed to update course");
        }
    };

    const handleDuplicateCourse = async (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `${course.title} (Copy)`,
                    slug: `${course.slug}-copy-${Date.now()}`,
                    description: course.description,
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
                toast.success("Course duplicated");
            }
        } catch (error) {
            toast.error("Failed to duplicate course");
        } finally {
            setIsLoading(false);
        }
    };

    const CourseCard = ({ course }: { course: Course }) => {
        const certType = CERTIFICATE_LABELS[course.certificateType] || CERTIFICATE_LABELS.COMPLETION;
        const diffLevel = DIFFICULTY_LABELS[course.difficulty] || DIFFICULTY_LABELS.BEGINNER;
        const totalCourseLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

        return (
            <Card
                className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-burgundy-300"
                onClick={() => window.location.href = `/admin/courses/${course.id}`}
            >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-burgundy-100 to-burgundy-200 overflow-hidden">
                    {course.thumbnail ? (
                        <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-burgundy-300" />
                        </div>
                    )}

                    {/* Status badges overlay */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                        <Badge className={course.isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                            {course.isPublished ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                            {course.isPublished ? "Live" : "Draft"}
                        </Badge>
                        {course.isFeatured && (
                            <Badge className="bg-gold-500 text-white">
                                <Star className="w-3 h-3 mr-1 fill-white" />
                                Featured
                            </Badge>
                        )}
                    </div>

                    {/* Quick actions overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            onClick={(e) => handleToggleFeatured(course, e)}
                        >
                            <Star className={`w-4 h-4 ${course.isFeatured ? 'fill-gold-400 text-gold-400' : 'text-gray-600'}`} />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/courses/${course.slug}`, '_blank');
                            }}
                        >
                            <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                    </div>

                    {/* Certificate type badge */}
                    <div className="absolute bottom-2 left-2">
                        <Badge className={certType.color}>
                            {certType.label}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-4">
                    {/* Category & Difficulty */}
                    <div className="flex items-center gap-2 mb-2 text-xs">
                        {course.category && (
                            <span className="text-burgundy-600 font-medium">{course.category.name}</span>
                        )}
                        {course.category && <span className="text-gray-300">•</span>}
                        <Badge variant="outline" className={`text-xs ${diffLevel.color} border-0`}>
                            {diffLevel.label}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-700 transition-colors">
                        {course.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <Layers className="w-4 h-4" />
                            <span>{course._count.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{totalCourseLessons} lessons</span>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 text-blue-600">
                                <Users className="w-4 h-4" />
                                <span className="font-semibold">{course._count.enrollments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                                <Award className="w-4 h-4" />
                                <span className="font-semibold">{course._count.certificates}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {course.isFree ? (
                                <Badge variant="outline" className="text-green-600 border-green-200">Free</Badge>
                            ) : course.price ? (
                                <span className="font-semibold text-gray-900">${Number(course.price)}</span>
                            ) : null}
                        </div>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => handleTogglePublish(course, e)}
                        >
                            {course.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDuplicateCourse(course, e)}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        {deleteConfirm === course.id ? (
                            <>
                                <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}>
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(course.id); }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const CourseListItem = ({ course }: { course: Course }) => {
        const certType = CERTIFICATE_LABELS[course.certificateType] || CERTIFICATE_LABELS.COMPLETION;
        const totalCourseLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

        return (
            <Card
                className="group hover:shadow-md transition-all cursor-pointer border-gray-200 hover:border-burgundy-300"
                onClick={() => window.location.href = `/admin/courses/${course.id}`}
            >
                <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-40 h-24 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex-shrink-0 rounded-l-xl overflow-hidden">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8 text-burgundy-300" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-3 pr-4 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Category & badges */}
                                    <div className="flex items-center gap-2 mb-1">
                                        {course.category && (
                                            <span className="text-xs text-burgundy-600 font-medium">{course.category.name}</span>
                                        )}
                                        <Badge className={`text-xs ${certType.color}`}>{certType.label}</Badge>
                                        {course.isFeatured && (
                                            <Badge className="text-xs bg-gold-100 text-gold-700">
                                                <Star className="w-3 h-3 mr-1 fill-gold-500" />
                                                Featured
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-burgundy-700 transition-colors">
                                        {course.title}
                                    </h3>

                                    {/* Stats row */}
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Badge variant={course.isPublished ? "default" : "secondary"} className={`text-xs ${course.isPublished ? "bg-green-100 text-green-700" : ""}`}>
                                                {course.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span>{course._count.modules} modules</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{totalCourseLessons} lessons</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-blue-600 font-medium">{course._count.enrollments} enrolled</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-green-600 font-medium">{course._count.certificates} certified</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" onClick={(e) => handleToggleFeatured(course, e)}>
                                        <Star className={`w-4 h-4 ${course.isFeatured ? 'fill-gold-400 text-gold-400' : ''}`} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => handleTogglePublish(course, e)}>
                                        {course.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`/courses/${course.slug}`, '_blank');
                                    }}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => handleDuplicateCourse(course, e)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    {deleteConfirm === course.id ? (
                                        <>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteConfirm(course.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header - ASI Branded */}
            <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 -mt-6 px-6 py-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/asi-logo.png" alt="ASI" className="w-12 h-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Course Management</h1>
                            <p className="text-[#C9A227] text-sm">AccrediPro Standards Institute</p>
                        </div>
                    </div>
                    <Button className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Course
                    </Button>
                </div>
            </div>

            {/* Stats Cards - ASI Styled */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-white border border-[#8B1E3F]/20 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-[#8B1E3F]">{courses.length}</p>
                                <p className="text-gray-500 text-sm">Total Courses</p>
                            </div>
                            <div className="w-10 h-10 bg-[#8B1E3F]/10 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-[#8B1E3F]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-green-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-green-700">{publishedCount}</p>
                                <p className="text-gray-500 text-sm">Published</p>
                            </div>
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-gray-700">{draftCount}</p>
                                <p className="text-gray-500 text-sm">Drafts</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-blue-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-700">{totalEnrollments.toLocaleString()}</p>
                                <p className="text-gray-500 text-sm">Enrollments</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-purple-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-700">{activeStudentsThisWeek}</p>
                                <p className="text-gray-500 text-sm">Active (7d)</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#C9A227] to-[#b8922a] text-white border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold">{totalCertificates}</p>
                                <p className="text-white/80 text-sm">Certificates</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white min-w-[150px]"
                        >
                            <option value="all">All Categories</option>
                            {courseCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </select>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                        >
                            <option value="all">All Types</option>
                            <option value="COMPLETION">Completion</option>
                            <option value="CERTIFICATION">Certification</option>
                            <option value="MINI_DIPLOMA">Mini Diploma</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                        >
                            <option value="recent">Recent First</option>
                            <option value="enrollments">Most Enrolled</option>
                            <option value="title">A-Z</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? "bg-burgundy-100 text-burgundy-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? "bg-burgundy-100 text-burgundy-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Active filters */}
                    {(searchQuery || filterCategory !== "all" || filterStatus !== "all" || filterType !== "all") && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            {searchQuery && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {searchQuery}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                                </Badge>
                            )}
                            {filterCategory !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    {filterCategory}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCategory("all")} />
                                </Badge>
                            )}
                            {filterStatus !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    {filterStatus}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus("all")} />
                                </Badge>
                            )}
                            {filterType !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    {CERTIFICATE_LABELS[filterType]?.label || filterType}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterType("all")} />
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
                                setSearchQuery("");
                                setFilterCategory("all");
                                setFilterStatus("all");
                                setFilterType("all");
                            }}>
                                Clear all
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {filteredCourses.length} of {courses.length} courses
                    ({filteredMainCourses.length} certifications, {filteredMiniDiplomas.length} mini diplomas)
                </p>
            </div>

            {/* Mini Diplomas Section */}
            {filteredMiniDiplomas.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Mini Diplomas</h2>
                            <p className="text-sm text-gray-500">Free lead magnets - {filteredMiniDiplomas.length} courses</p>
                        </div>
                        <a
                            href="/functional-medicine-diploma/lesson/1"
                            target="_blank"
                            className="ml-auto text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Preview FM V2
                        </a>
                    </div>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMiniDiplomas.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMiniDiplomas.map(course => (
                                <CourseListItem key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main Certifications Section */}
            {filteredMainCourses.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Main Certifications</h2>
                            <p className="text-sm text-gray-500">Paid courses - {filteredMainCourses.length} courses</p>
                        </div>
                    </div>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMainCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMainCourses.map(course => (
                                <CourseListItem key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Empty state */}
            {filteredCourses.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="py-16 text-center">
                        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery || filterCategory !== "all" || filterStatus !== "all" || filterType !== "all"
                                ? "Try adjusting your filters"
                                : "Create your first course to get started"
                            }
                        </p>
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Course
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Add Course Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
                                    <p className="text-sm text-gray-500 mt-1">Fill in the basics to get started</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setShowAddModal(false); resetForm(); }}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))}
                                    placeholder="e.g., Gut Health Coach Certification"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">/courses/</span>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                <Input
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                                    placeholder="Brief summary for course cards"
                                    maxLength={160}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    placeholder="Full course description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 bg-white"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 bg-white"
                                    >
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                        <option value="EXPERT">Expert</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(CERTIFICATE_LABELS).map(([value, { label, color }]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, certificateType: value }))}
                                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.certificateType === value
                                                    ? "border-burgundy-500 bg-burgundy-50 text-burgundy-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFree}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Free Course</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Publish Immediately</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Featured</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-burgundy-600 hover:bg-burgundy-700"
                                onClick={handleCreateCourse}
                                disabled={isLoading || !formData.title || !formData.description}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Create & Edit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
