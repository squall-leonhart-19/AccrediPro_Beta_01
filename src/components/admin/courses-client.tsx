"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    BookOpen, Users, Award, GraduationCap, Plus, Edit, Trash2, Save, X, Loader2, Check,
    ChevronDown, ChevronUp, ChevronRight, Layers, Search, Copy, ExternalLink, Image,
    PlayCircle, ArrowUp, ArrowDown, AlertTriangle, TrendingUp, TrendingDown, Star,
    Eye, BarChart3, FileText, Video, Sparkles, Clock, Target, Zap, Settings,
} from "lucide-react";

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
    isFree: boolean;
    isPublished: boolean;
    isFeatured: boolean;
    difficulty: string;
    certificateType: string;
    category?: { id: string; name: string };
    _count: { enrollments: number; modules: number; certificates: number };
    modules?: Module[];
    completionRate?: number;
}

interface CoursesClientProps {
    initialCourses: Course[];
    totalEnrollments: number;
    totalCertificates: number;
    activeStudentsThisWeek: number;
    avgCompletionRate: number;
}

export function CoursesClient({
    initialCourses,
    totalEnrollments,
    totalCertificates,
    activeStudentsThisWeek = 0,
    avgCompletionRate = 0,
}: CoursesClientProps) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [filterType, setFilterType] = useState<"all" | "COMPLETION" | "CERTIFICATION" | "MINI_DIPLOMA">("all");
    const [sortBy, setSortBy] = useState<"recent" | "enrollments" | "completion">("recent");
    const [activeTab, setActiveTab] = useState<"all" | "attention">("all");

    // Module/Lesson state
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
    const [lessonForm, setLessonForm] = useState({ title: "", description: "", lessonType: "VIDEO", videoId: "", content: "" });

    // Course form
    const [formData, setFormData] = useState({
        title: "", slug: "", description: "", shortDescription: "",
        isFree: true, isPublished: false, isFeatured: false,
        difficulty: "BEGINNER", certificateType: "COMPLETION",
    });

    const resetForm = () => {
        setFormData({
            title: "", slug: "", description: "", shortDescription: "",
            isFree: true, isPublished: false, isFeatured: false,
            difficulty: "BEGINNER", certificateType: "COMPLETION",
        });
    };

    const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Stats
    const publishedCount = courses.filter(c => c.isPublished).length;
    const draftCount = courses.filter(c => !c.isPublished).length;
    const needsAttentionCourses = courses.filter(c =>
        !c.isPublished || c._count.modules === 0 || c._count.enrollments === 0
    );
    const topCourse = courses.reduce((top, c) => c._count.enrollments > (top?._count.enrollments || 0) ? c : top, courses[0]);

    // Filter & sort
    const filteredCourses = courses
        .filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "all" ||
                (filterStatus === "published" && course.isPublished) ||
                (filterStatus === "draft" && !course.isPublished);
            const matchesType = filterType === "all" || course.certificateType === filterType;
            const matchesTab = activeTab === "all" ||
                (activeTab === "attention" && needsAttentionCourses.includes(course));
            return matchesSearch && matchesStatus && matchesType && matchesTab;
        })
        .sort((a, b) => {
            if (sortBy === "enrollments") return b._count.enrollments - a._count.enrollments;
            if (sortBy === "completion") return (b.completionRate || 0) - (a.completionRate || 0);
            return 0;
        });

    // API calls
    const handleCreateCourse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const { course } = await res.json();
                setCourses(prev => [{ ...course, modules: [], _count: { enrollments: 0, modules: 0, certificates: 0 } }, ...prev]);
                setShowAddModal(false);
                resetForm();
            }
        } catch (error) {
            alert("Failed to create course");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateCourse = async () => {
        if (!editingCourse) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingCourse.id, ...formData }),
            });
            if (res.ok) {
                const { course } = await res.json();
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, ...course } : c));
                if (selectedCourse?.id === course.id) setSelectedCourse({ ...selectedCourse, ...course });
                setEditingCourse(null);
                resetForm();
            }
        } catch (error) {
            alert("Failed to update course");
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
                if (selectedCourse?.id === id) setSelectedCourse(null);
                setDeleteConfirm(null);
            }
        } catch (error) {
            alert("Failed to delete course");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePublish = async (course: Course) => {
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, isPublished: !course.isPublished }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
                if (selectedCourse?.id === course.id) setSelectedCourse({ ...selectedCourse, isPublished: !selectedCourse.isPublished });
            }
        } catch (error) {
            alert("Failed to update course");
        }
    };

    const handleToggleFeatured = async (course: Course) => {
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, isFeatured: !course.isFeatured }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isFeatured: !c.isFeatured } : c));
                if (selectedCourse?.id === course.id) setSelectedCourse({ ...selectedCourse, isFeatured: !selectedCourse.isFeatured });
            }
        } catch (error) {
            alert("Failed to update course");
        }
    };

    const handleDuplicateCourse = async (course: Course) => {
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
                    isPublished: false, isFeatured: false,
                    difficulty: course.difficulty,
                    certificateType: course.certificateType,
                }),
            });
            if (res.ok) {
                const { course: newCourse } = await res.json();
                setCourses(prev => [{ ...newCourse, modules: [], _count: { enrollments: 0, modules: 0, certificates: 0 } }, ...prev]);
            }
        } catch (error) {
            alert("Failed to duplicate course");
        } finally {
            setIsLoading(false);
        }
    };

    // Module API calls
    const handleCreateModule = async () => {
        if (!selectedCourse) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...moduleForm, courseId: selectedCourse.id }),
            });
            if (res.ok) {
                const { module } = await res.json();
                const updatedCourse = {
                    ...selectedCourse,
                    modules: [...(selectedCourse.modules || []), module],
                    _count: { ...selectedCourse._count, modules: selectedCourse._count.modules + 1 },
                };
                setSelectedCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
                setShowModuleModal(false);
                setModuleForm({ title: "", description: "" });
            }
        } catch (error) {
            alert("Failed to create module");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/admin/modules?id=${moduleId}`, { method: "DELETE" });
            if (res.ok) {
                const updatedCourse = {
                    ...selectedCourse,
                    modules: selectedCourse.modules?.filter(m => m.id !== moduleId) || [],
                    _count: { ...selectedCourse._count, modules: selectedCourse._count.modules - 1 },
                };
                setSelectedCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
            }
        } catch (error) {
            alert("Failed to delete module");
        }
    };

    // Lesson API calls
    const handleCreateLesson = async () => {
        if (!selectedModuleId || !selectedCourse) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...lessonForm, moduleId: selectedModuleId }),
            });
            if (res.ok) {
                const { lesson } = await res.json();
                const updatedModules = selectedCourse.modules?.map(m =>
                    m.id === selectedModuleId
                        ? { ...m, lessons: [...m.lessons, lesson], _count: { lessons: m._count.lessons + 1 } }
                        : m
                ) || [];
                const updatedCourse = { ...selectedCourse, modules: updatedModules };
                setSelectedCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
                setShowLessonModal(false);
                setLessonForm({ title: "", description: "", lessonType: "VIDEO", videoId: "", content: "" });
                setSelectedModuleId(null);
            }
        } catch (error) {
            alert("Failed to create lesson");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
            if (res.ok) {
                const updatedModules = selectedCourse.modules?.map(m =>
                    m.id === moduleId
                        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId), _count: { lessons: m._count.lessons - 1 } }
                        : m
                ) || [];
                const updatedCourse = { ...selectedCourse, modules: updatedModules };
                setSelectedCourse(updatedCourse);
                setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
            }
        } catch (error) {
            alert("Failed to delete lesson");
        }
    };

    const openEditModal = (course: Course) => {
        // Navigate to new editor
        // window.location.href = `/admin/courses/${course.id}`;
        // Using router for SPA feel if available, but window.location is safer for now if useRouter not imported or compatible
        window.location.href = `/admin/courses/${course.id}`;
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) next.delete(moduleId);
            else next.add(moduleId);
            return next;
        });
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto p-6 ${selectedCourse ? 'pr-0' : ''}`}>
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Academy Command Center</h1>
                            <p className="text-gray-500 mt-1">Manage courses, track performance, grow your academy</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowAddModal(true)}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                From Template
                            </Button>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Course
                            </Button>
                        </div>
                    </div>

                    {/* KPI Dashboard */}
                    <div className="grid grid-cols-6 gap-4">
                        <Card className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white border-0">
                            <CardContent className="p-4">
                                <BookOpen className="w-6 h-6 text-burgundy-200 mb-2" />
                                <p className="text-3xl font-bold">{courses.length}</p>
                                <p className="text-burgundy-100 text-sm">Courses</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                            <CardContent className="p-4">
                                <Check className="w-6 h-6 text-green-200 mb-2" />
                                <p className="text-3xl font-bold">{publishedCount}</p>
                                <p className="text-green-100 text-sm">Published</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                            <CardContent className="p-4">
                                <Users className="w-6 h-6 text-blue-200 mb-2" />
                                <p className="text-3xl font-bold">{totalEnrollments}</p>
                                <p className="text-blue-100 text-sm">Enrollments</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                            <CardContent className="p-4">
                                <Zap className="w-6 h-6 text-purple-200 mb-2" />
                                <p className="text-3xl font-bold">{activeStudentsThisWeek}</p>
                                <p className="text-purple-100 text-sm">Active This Week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
                            <CardContent className="p-4">
                                <Target className="w-6 h-6 text-amber-200 mb-2" />
                                <p className="text-3xl font-bold">{avgCompletionRate}%</p>
                                <p className="text-amber-100 text-sm">Avg Completion</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
                            <CardContent className="p-4">
                                <Award className="w-6 h-6 text-pink-200 mb-2" />
                                <p className="text-3xl font-bold">{totalCertificates}</p>
                                <p className="text-pink-100 text-sm">Certificates</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Performer & Needs Attention */}
                    <div className="grid grid-cols-2 gap-4">
                        {topCourse && (
                            <Card className="card-premium border-green-200 bg-green-50/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-100">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-green-600 font-medium">Top Performer</p>
                                            <p className="font-semibold text-gray-900 truncate">{topCourse.title}</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">{topCourse._count.enrollments} enrolled</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card className="card-premium border-amber-200 bg-amber-50/50 cursor-pointer" onClick={() => setActiveTab("attention")}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-100">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-amber-600 font-medium">Needs Attention</p>
                                        <p className="text-gray-600 text-sm">{needsAttentionCourses.length} courses need work</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-amber-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "all" ? "border-burgundy-600 text-burgundy-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            All Courses ({courses.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("attention")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${activeTab === "attention" ? "border-amber-600 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Needs Attention ({needsAttentionCourses.length})
                        </button>
                    </div>

                    {/* Search, Filter, Sort */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </select>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="all">All Types</option>
                            <option value="COMPLETION">Completion</option>
                            <option value="CERTIFICATION">Certification</option>
                            <option value="MINI_DIPLOMA">Mini Diploma</option>
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="recent">Recent First</option>
                            <option value="enrollments">Most Enrolled</option>
                            <option value="completion">Completion Rate</option>
                        </select>
                    </div>

                    {/* Course List */}
                    <div className="space-y-3">
                        {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                            <Card
                                key={course.id}
                                className={`card-premium cursor-pointer transition-all hover:shadow-lg ${selectedCourse?.id === course.id ? 'ring-2 ring-burgundy-500' : ''}`}
                                onClick={() => setSelectedCourse(course)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center">
                                        <div className="w-28 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center flex-shrink-0 rounded-l-xl">
                                            <GraduationCap className="w-8 h-8 text-burgundy-400" />
                                        </div>
                                        <div className="flex-1 p-4 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                                                        {course.isFeatured && <Badge className="bg-gold-100 text-gold-700 text-xs">⭐ Featured</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant={course.isPublished ? "success" : "secondary"} className="text-xs">
                                                            {course.isPublished ? "Published" : "Draft"}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">{course.certificateType.replace("_", " ")}</Badge>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{course._count.modules} modules</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{course._count.enrollments} enrolled</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{course._count.certificates} certified</span>
                                                        {course.completionRate !== undefined && (
                                                            <>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <span className="text-xs text-green-600">{course.completionRate}% completion</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(course)} title="Toggle Featured">
                                                        <Star className={`w-4 h-4 ${course.isFeatured ? 'fill-gold-400 text-gold-400' : ''}`} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(course)}>
                                                        {course.isPublished ? "Unpublish" : "Publish"}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(course)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDuplicateCourse(course)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    {deleteConfirm === course.id ? (
                                                        <>
                                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}><Check className="w-4 h-4" /></Button>
                                                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}><X className="w-4 h-4" /></Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteConfirm(course.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 mr-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <Card className="card-premium">
                                <CardContent className="p-12 text-center">
                                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                                    <p className="text-gray-500 mb-6">Create your first course to get started</p>
                                    <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setShowAddModal(true)}>
                                        <Plus className="w-4 h-4 mr-2" />Create Course
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            {selectedCourse && (
                <div className="w-[480px] border-l bg-white overflow-y-auto">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Course Builder</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}><X className="w-4 h-4" /></Button>
                        </div>

                        {/* Course Header */}
                        <div className="aspect-video bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <Image className="w-12 h-12 text-burgundy-300 mx-auto mb-2" />
                                <Button size="sm" variant="outline">Upload Thumbnail</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant={selectedCourse.isPublished ? "success" : "secondary"}>{selectedCourse.isPublished ? "Published" : "Draft"}</Badge>
                                <Badge variant="outline">{selectedCourse.difficulty}</Badge>
                                {selectedCourse.isFeatured && <Badge className="bg-gold-100 text-gold-700">⭐ Featured</Badge>}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-burgundy-600">{selectedCourse._count.modules}</p>
                                <p className="text-xs text-gray-500">Modules</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-blue-600">{selectedCourse._count.enrollments}</p>
                                <p className="text-xs text-gray-500">Enrolled</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-green-600">{selectedCourse._count.certificates}</p>
                                <p className="text-xs text-gray-500">Certified</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <a href={`/admin/courses/${selectedCourse.id}/builder`} className="inline-flex items-center justify-center bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
                                <Layers className="w-4 h-4 mr-2" />Open Builder
                            </a>
                            <Button variant="outline" onClick={() => window.open(`/courses/${selectedCourse.slug}`, '_blank')}>
                                <Eye className="w-4 h-4 mr-2" />Preview
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => openEditModal(selectedCourse)}>
                            <Edit className="w-4 h-4 mr-2" />Edit Course Details
                        </Button>

                        {/* Modules & Lessons */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">Modules & Lessons</h4>
                                <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setShowModuleModal(true)}>
                                    <Plus className="w-4 h-4 mr-1" />Add Module
                                </Button>
                            </div>

                            {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedCourse.modules.map((module, idx) => (
                                        <div key={module.id} className="border rounded-xl overflow-hidden">
                                            <div
                                                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => toggleModule(module.id)}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center text-sm font-bold text-burgundy-600">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{module.title}</p>
                                                    <p className="text-xs text-gray-500">{module._count.lessons} lessons</p>
                                                </div>
                                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedModuleId(module.id); setShowLessonModal(true); }}>
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                                {expandedModules.has(module.id) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>

                                            {/* Lessons */}
                                            {expandedModules.has(module.id) && (
                                                <div className="p-3 bg-white border-t space-y-2">
                                                    {module.lessons.length > 0 ? module.lessons.map((lesson, lidx) => (
                                                        <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                                                {lidx + 1}
                                                            </div>
                                                            {lesson.lessonType === "VIDEO" ? <Video className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-gray-500" />}
                                                            <span className="flex-1 text-sm text-gray-700 truncate">{lesson.title}</span>
                                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500" onClick={() => handleDeleteLesson(lesson.id, module.id)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    )) : (
                                                        <p className="text-sm text-gray-400 text-center py-2">No lessons yet</p>
                                                    )}
                                                    <Button size="sm" variant="outline" className="w-full" onClick={() => { setSelectedModuleId(module.id); setShowLessonModal(true); }}>
                                                        <Plus className="w-3 h-3 mr-1" />Add Lesson
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                    <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">No modules yet</p>
                                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setShowModuleModal(true)}>
                                        <Plus className="w-4 h-4 mr-1" />Add First Module
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Course URL */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Course URL</p>
                            <div className="flex items-center gap-2">
                                <code className="text-sm text-burgundy-600 flex-1 truncate">/courses/{selectedCourse.slug}</code>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(`/courses/${selectedCourse.slug}`, '_blank')}>
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Course Modal */}
            {(showAddModal || editingCourse) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">{editingCourse ? "Edit Course" : "Create New Course"}</h2>
                                <Button variant="ghost" size="sm" onClick={() => { setShowAddModal(false); setEditingCourse(null); resetForm(); }}><X className="w-5 h-5" /></Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                                <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="e.g., Gut Health Certification" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                    <select value={formData.difficulty} onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-2.5">
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
                                    <select value={formData.certificateType} onChange={(e) => setFormData(prev => ({ ...prev, certificateType: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-2.5">
                                        <option value="COMPLETION">Completion</option>
                                        <option value="CERTIFICATION">Certification</option>
                                        <option value="MINI_DIPLOMA">Mini Diploma</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isFree} onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))} className="rounded" />
                                    <span className="text-sm">Free Course</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))} className="rounded" />
                                    <span className="text-sm">Publish Now</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="rounded" />
                                    <span className="text-sm">Featured</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => { setShowAddModal(false); setEditingCourse(null); resetForm(); }}>Cancel</Button>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={editingCourse ? handleUpdateCourse : handleCreateCourse} disabled={isLoading || !formData.title || !formData.description}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {editingCourse ? "Save Changes" : "Create Course"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Module Modal */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Add Module</h2>
                                <Button variant="ghost" size="sm" onClick={() => { setShowModuleModal(false); setModuleForm({ title: "", description: "" }); }}><X className="w-5 h-5" /></Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
                                <Input value={moduleForm.title} onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Introduction to Gut Health" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <Textarea value={moduleForm.description} onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => { setShowModuleModal(false); setModuleForm({ title: "", description: "" }); }}>Cancel</Button>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={handleCreateModule} disabled={!moduleForm.title || isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Add Module
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Lesson Modal */}
            {showLessonModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Add Lesson</h2>
                                <Button variant="ghost" size="sm" onClick={() => { setShowLessonModal(false); setLessonForm({ title: "", description: "", lessonType: "VIDEO", videoId: "", content: "" }); setSelectedModuleId(null); }}><X className="w-5 h-5" /></Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                                <Input value={lessonForm.title} onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., What is the Microbiome?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select value={lessonForm.lessonType} onChange={(e) => setLessonForm(prev => ({ ...prev, lessonType: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-2.5">
                                    <option value="VIDEO">Video</option>
                                    <option value="TEXT">Text</option>
                                    <option value="QUIZ">Quiz</option>
                                </select>
                            </div>
                            {lessonForm.lessonType === "VIDEO" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Video ID (Wistia)</label>
                                    <Input value={lessonForm.videoId} onChange={(e) => setLessonForm(prev => ({ ...prev, videoId: e.target.value }))} placeholder="abc123xyz" />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <Textarea value={lessonForm.description} onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => { setShowLessonModal(false); setLessonForm({ title: "", description: "", lessonType: "VIDEO", videoId: "", content: "" }); setSelectedModuleId(null); }}>Cancel</Button>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={handleCreateLesson} disabled={!lessonForm.title || isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Add Lesson
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
