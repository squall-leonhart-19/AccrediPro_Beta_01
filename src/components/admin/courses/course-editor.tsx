"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft, Save, Loader2, Plus, Trash2, Video, FileText, ChevronDown, ChevronUp,
    Eye, Settings, Layers, Zap, Tag, Upload, ImageIcon, Users, Star, Award,
    Clock, BookOpen, GraduationCap, TrendingUp, BarChart3, CheckCircle, AlertCircle,
    DollarSign, Calendar, Globe, X, Grip
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Category {
    id: string;
    name: string;
}

interface Coach {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatar: string | null;
}

interface SpecialOffer {
    id: string;
    title: string;
    discountValue: number;
    discountType: string;
    code: string | null;
}

interface Lesson {
    id: string;
    title: string;
    order: number;
    isPublished: boolean;
    lessonType: string;
    duration?: number;
}

interface Module {
    id: string;
    title: string;
    order: number;
    isPublished: boolean;
    lessons: Lesson[];
    _count: { lessons: number };
}

interface CourseStats {
    enrollments: number;
    modules: number;
    certificates: number;
    reviews?: number;
    avgRating?: number;
    completionRate?: number;
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
    duration?: number;
    categoryId?: string;
    coachId?: string;
    modules: Module[];
    tags: { tag: { id: string; name: string } }[];
    offers: { offer: SpecialOffer }[];
    _count: CourseStats;
    analytics?: {
        totalEnrolled: number;
        avgRating: number;
        completionRate: number;
    };
    createdAt: string;
    updatedAt: string;
}

interface CourseEditorProps {
    course: Course;
    categories: Category[];
    coaches?: Coach[];
    availableOffers: SpecialOffer[];
}

const DIFFICULTY_OPTIONS = [
    { value: "BEGINNER", label: "Beginner", color: "bg-green-100 text-green-700" },
    { value: "INTERMEDIATE", label: "Intermediate", color: "bg-yellow-100 text-yellow-700" },
    { value: "ADVANCED", label: "Advanced", color: "bg-orange-100 text-orange-700" },
    { value: "EXPERT", label: "Expert", color: "bg-red-100 text-red-700" },
];

const CERTIFICATE_TYPES = [
    { value: "COMPLETION", label: "Completion Certificate", icon: CheckCircle },
    { value: "CERTIFICATION", label: "Professional Certification", icon: Award },
    { value: "MINI_DIPLOMA", label: "Mini Diploma", icon: GraduationCap },
];

export function CourseEditor({ course: initialCourse, categories, coaches = [], availableOffers }: CourseEditorProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [course, setCourse] = useState<Course>(initialCourse);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("settings");

    // Module/Lesson State
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(initialCourse.modules.map(m => m.id)));
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [moduleForm, setModuleForm] = useState({ title: "", description: "" });

    // Lesson State
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState({ title: "", lessonType: "VIDEO", duration: 0 });

    // Computed stats
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalDuration = course.modules.reduce((acc, m) =>
        acc + m.lessons.reduce((lacc, l) => lacc + (l.duration || 0), 0), 0
    );
    const publishedLessons = course.modules.reduce((acc, m) =>
        acc + m.lessons.filter(l => l.isPublished).length, 0
    );

    const handleUpdateCourse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: course.id,
                    title: course.title,
                    slug: course.slug,
                    description: course.description,
                    shortDescription: course.shortDescription,
                    thumbnail: course.thumbnail,
                    price: course.isFree ? null : course.price,
                    isFree: course.isFree,
                    categoryId: course.categoryId || null,
                    coachId: course.coachId || null,
                    difficulty: course.difficulty,
                    certificateType: course.certificateType,
                    duration: course.duration,
                    isPublished: course.isPublished,
                    isFeatured: course.isFeatured,
                }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Course updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "courses");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const result = await res.json();
            const url = result.data?.url || result.url;
            if (!url) throw new Error("No URL returned");
            setCourse({ ...course, thumbnail: url });
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Module Handlers ---
    const handleCreateModule = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: course.id,
                    title: moduleForm.title,
                    description: moduleForm.description
                }),
            });
            if (res.ok) {
                const { module } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: [...prev.modules, { ...module, lessons: [], _count: { lessons: 0 } }]
                }));
                setModuleForm({ title: "", description: "" });
                setIsModuleModalOpen(false);
                toast.success("Module added");
            }
        } catch (e) {
            toast.error("Failed to add module");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Delete this module and all its lessons?")) return;
        try {
            await fetch(`/api/admin/modules?id=${moduleId}`, { method: "DELETE" });
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.filter(m => m.id !== moduleId)
            }));
            toast.success("Module deleted");
        } catch (e) {
            toast.error("Failed to delete module");
        }
    };

    const handleToggleModulePublish = async (moduleId: string, isPublished: boolean) => {
        try {
            await fetch("/api/admin/modules", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: moduleId, isPublished }),
            });
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m.id === moduleId ? { ...m, isPublished } : m
                )
            }));
            toast.success(isPublished ? "Module published" : "Module unpublished");
        } catch (e) {
            toast.error("Failed to update module");
        }
    };

    // --- Lesson Handlers ---
    const handleCreateLesson = async () => {
        if (!selectedModuleId) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ moduleId: selectedModuleId, ...lessonForm }),
            });
            if (res.ok) {
                const { lesson } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.map(m =>
                        m.id === selectedModuleId
                            ? { ...m, lessons: [...m.lessons, lesson], _count: { lessons: m._count.lessons + 1 } }
                            : m
                    )
                }));
                setLessonForm({ title: "", lessonType: "VIDEO", duration: 0 });
                setIsLessonModalOpen(false);
                toast.success("Lesson added");
            }
        } catch (e) {
            toast.error("Failed to add lesson");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
        if (!confirm("Delete this lesson?")) return;
        try {
            await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m.id === moduleId
                        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId), _count: { lessons: m._count.lessons - 1 } }
                        : m
                )
            }));
            toast.success("Lesson deleted");
        } catch (e) {
            toast.error("Failed to delete lesson");
        }
    };

    const toggleModuleExp = (id: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const formatDuration = (minutes: number) => {
        if (!minutes) return "0m";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/admin/courses")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="h-6 w-px bg-gray-200" />
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                            <Badge variant={course.isPublished ? "default" : "secondary"} className={course.isPublished ? "bg-green-100 text-green-700" : ""}>
                                {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                            {course.isFeatured && (
                                <Badge className="bg-gold-100 text-gold-700">Featured</Badge>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{course.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={handleUpdateCourse} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">{course._count?.enrollments || 0}</span>
                        <span className="text-gray-500">enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{course.analytics?.avgRating?.toFixed(1) || "N/A"}</span>
                        <span className="text-gray-500">rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">{course._count?.certificates || 0}</span>
                        <span className="text-gray-500">certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold">{course._count?.modules || 0}</span>
                        <span className="text-gray-500">modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold">{totalLessons}</span>
                        <span className="text-gray-500">lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold">{formatDuration(course.duration || totalDuration)}</span>
                        <span className="text-gray-500">duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-500" />
                        <span className="font-semibold">{course.analytics?.completionRate?.toFixed(0) || 0}%</span>
                        <span className="text-gray-500">completion</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto space-y-6">
                    <TabsList className="bg-white border p-1 rounded-xl shadow-sm">
                        <TabsTrigger value="settings" className="data-[state=active]:bg-burgundy-100 data-[state=active]:text-burgundy-800">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings & Pricing
                        </TabsTrigger>
                        <TabsTrigger value="curriculum" className="data-[state=active]:bg-burgundy-100 data-[state=active]:text-burgundy-800">
                            <Layers className="w-4 h-4 mr-2" />
                            Curriculum
                        </TabsTrigger>
                        <TabsTrigger value="offers" className="data-[state=active]:bg-burgundy-100 data-[state=active]:text-burgundy-800">
                            <Zap className="w-4 h-4 mr-2" />
                            Offers & Discounts
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-burgundy-100 data-[state=active]:text-burgundy-800">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* SETTINGS TAB */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Main Info */}
                            <div className="col-span-2 space-y-6">
                                {/* Course Thumbnail */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            Course Thumbnail
                                        </CardTitle>
                                        <CardDescription>
                                            This image will be displayed in the catalog and course pages. Recommended: 800x400px
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start gap-6">
                                            {/* Preview */}
                                            <div className="relative w-80 aspect-[2/1] bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                                                {course.thumbnail ? (
                                                    <>
                                                        <Image
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            onClick={() => setCourse({ ...course, thumbnail: "" })}
                                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                        <ImageIcon className="w-12 h-12 mb-2" />
                                                        <span className="text-sm">No image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Upload Controls */}
                                            <div className="flex-1 space-y-4">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Upload className="w-4 h-4 mr-2" />
                                                    )}
                                                    Upload Image
                                                </Button>

                                                <div className="text-center text-gray-400 text-sm">or</div>

                                                <div>
                                                    <Label className="text-sm font-medium mb-2 block">Image URL</Label>
                                                    <Input
                                                        placeholder="https://images.unsplash.com/..."
                                                        value={course.thumbnail || ""}
                                                        onChange={e => setCourse({ ...course, thumbnail: e.target.value })}
                                                    />
                                                </div>

                                                <p className="text-xs text-gray-500">
                                                    Supports: JPG, PNG, WebP. Max 5MB. Use Unsplash for free images.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* General Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>General Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Course Title</Label>
                                                <Input
                                                    value={course.title}
                                                    onChange={e => setCourse({ ...course, title: e.target.value })}
                                                    placeholder="e.g., Functional Medicine Practitioner"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">URL Slug</Label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">/courses/</span>
                                                    <Input
                                                        value={course.slug}
                                                        onChange={e => setCourse({ ...course, slug: e.target.value })}
                                                        className="font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Short Description</Label>
                                            <Textarea
                                                value={course.shortDescription || ""}
                                                onChange={e => setCourse({ ...course, shortDescription: e.target.value })}
                                                placeholder="Brief summary shown in course cards (max 160 characters)"
                                                maxLength={160}
                                                rows={2}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{(course.shortDescription || "").length}/160 characters</p>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Full Description</Label>
                                            <Textarea
                                                rows={6}
                                                value={course.description}
                                                onChange={e => setCourse({ ...course, description: e.target.value })}
                                                placeholder="Detailed course description with benefits, outcomes, and what students will learn..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Estimated Duration (minutes)</Label>
                                                <Input
                                                    type="number"
                                                    value={course.duration || ""}
                                                    onChange={e => setCourse({ ...course, duration: parseInt(e.target.value) || 0 })}
                                                    placeholder="e.g., 1200 (20 hours)"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Auto-calculated: {formatDuration(totalDuration)} from lessons
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Settings */}
                            <div className="space-y-6">
                                {/* Organization */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Organization</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Category</Label>
                                            <select
                                                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                                value={course.categoryId || ""}
                                                onChange={e => setCourse({ ...course, categoryId: e.target.value || undefined })}
                                            >
                                                <option value="">Select Category...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Difficulty Level</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {DIFFICULTY_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setCourse({ ...course, difficulty: opt.value })}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                            course.difficulty === opt.value
                                                                ? opt.color + " ring-2 ring-offset-2 ring-burgundy-500"
                                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Certificate Type</Label>
                                            <div className="space-y-2">
                                                {CERTIFICATE_TYPES.map(type => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => setCourse({ ...course, certificateType: type.value })}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                                                            course.certificateType === type.value
                                                                ? "bg-burgundy-100 text-burgundy-800 ring-2 ring-burgundy-500"
                                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        <type.icon className="w-4 h-4" />
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {coaches.length > 0 && (
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Assigned Coach</Label>
                                                <select
                                                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                                    value={course.coachId || ""}
                                                    onChange={e => setCourse({ ...course, coachId: e.target.value || undefined })}
                                                >
                                                    <option value="">No coach assigned</option>
                                                    {coaches.map(coach => (
                                                        <option key={coach.id} value={coach.id}>
                                                            {coach.firstName} {coach.lastName} ({coach.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Pricing */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5" />
                                            Pricing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="isFree" className="text-sm font-medium">Free Course</Label>
                                            <Switch
                                                id="isFree"
                                                checked={course.isFree}
                                                onCheckedChange={(checked) => setCourse({ ...course, isFree: checked })}
                                            />
                                        </div>

                                        {!course.isFree && (
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Price (USD)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                    <Input
                                                        type="number"
                                                        className="pl-8 text-lg font-semibold"
                                                        value={course.price || ""}
                                                        onChange={e => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })}
                                                        placeholder="97"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Publishing */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="w-5 h-5" />
                                            Publishing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium">Published</Label>
                                                <p className="text-xs text-gray-500">Visible in catalog</p>
                                            </div>
                                            <Switch
                                                checked={course.isPublished}
                                                onCheckedChange={(checked) => setCourse({ ...course, isPublished: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium">Featured</Label>
                                                <p className="text-xs text-gray-500">Show as best seller</p>
                                            </div>
                                            <Switch
                                                checked={course.isFeatured}
                                                onCheckedChange={(checked) => setCourse({ ...course, isFeatured: checked })}
                                            />
                                        </div>

                                        <div className="pt-4 border-t space-y-2 text-xs text-gray-500">
                                            <div className="flex items-center justify-between">
                                                <span>Created</span>
                                                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Last updated</span>
                                                <span>{new Date(course.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CURRICULUM TAB */}
                    <TabsContent value="curriculum" className="space-y-6">
                        {/* Curriculum Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{course.modules.length}</p>
                                        <p className="text-sm text-gray-500">Modules</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Layers className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{totalLessons}</p>
                                        <p className="text-sm text-gray-500">Total Lessons</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{publishedLessons}</p>
                                        <p className="text-sm text-gray-500">Published</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                                        <p className="text-sm text-gray-500">Total Duration</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Modules & Lessons</h2>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setIsModuleModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Module
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {course.modules.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="py-12 text-center">
                                        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">No content yet</h3>
                                        <p className="text-gray-500 mb-4">Start by adding your first module</p>
                                        <Button onClick={() => setIsModuleModalOpen(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Module
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                course.modules.map((module, idx) => (
                                    <Card key={module.id} className="overflow-hidden">
                                        <div
                                            className="p-4 flex items-center gap-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors"
                                            onClick={() => toggleModuleExp(module.id)}
                                        >
                                            <Grip className="w-5 h-5 text-gray-400 cursor-grab" />
                                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy-100 text-burgundy-700 font-bold">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                    <Badge variant={module.isPublished ? "default" : "secondary"} className={module.isPublished ? "bg-green-100 text-green-700" : ""}>
                                                        {module.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">{module._count.lessons} lessons</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={module.isPublished}
                                                    onCheckedChange={(checked) => {
                                                        // Don't propagate to parent
                                                        handleToggleModulePublish(module.id, checked);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <Button size="sm" variant="ghost" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedModuleId(module.id);
                                                    setIsLessonModalOpen(true);
                                                }}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteModule(module.id);
                                                }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                {expandedModules.has(module.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                            </div>
                                        </div>

                                        {expandedModules.has(module.id) && (
                                            <div className="border-t p-3 space-y-1 bg-white">
                                                {module.lessons.length === 0 ? (
                                                    <div className="text-center py-6 text-gray-500">
                                                        <p className="text-sm">No lessons in this module</p>
                                                    </div>
                                                ) : (
                                                    module.lessons.map((lesson, lidx) => (
                                                        <div key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                                                            <Grip className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                                                            <div className="w-6 text-center text-xs text-gray-400 font-mono">{lidx + 1}</div>
                                                            {lesson.lessonType === "VIDEO" ? (
                                                                <Video className="w-4 h-4 text-blue-500" />
                                                            ) : lesson.lessonType === "QUIZ" ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-gray-500" />
                                                            )}
                                                            <span className="flex-1 text-sm font-medium text-gray-700">{lesson.title}</span>
                                                            <Badge variant={lesson.isPublished ? "default" : "secondary"} className={`text-xs ${lesson.isPublished ? "bg-green-100 text-green-700" : ""}`}>
                                                                {lesson.isPublished ? "Live" : "Draft"}
                                                            </Badge>
                                                            {lesson.duration && (
                                                                <span className="text-xs text-gray-400">{formatDuration(lesson.duration)}</span>
                                                            )}
                                                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.open(`/admin/courses/${course.id}/builder?module=${module.id}&lesson=${lesson.id}`, '_blank')}>
                                                                    <Settings className="w-3.5 h-3.5" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteLesson(lesson.id, module.id)}>
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                <Button variant="ghost" size="sm" className="w-full text-gray-500 border border-dashed mt-2" onClick={() => {
                                                    setSelectedModuleId(module.id);
                                                    setIsLessonModalOpen(true);
                                                }}>
                                                    <Plus className="w-3 h-3 mr-2" /> Add Lesson
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* OFFERS TAB */}
                    <TabsContent value="offers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Special Offers</CardTitle>
                                <CardDescription>Manage discounts and special offers linked to this course.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {course.offers.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="font-medium">No active offers for this course</p>
                                        <p className="text-sm mt-1">Create offers in the Marketing section</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {course.offers.map(({ offer }) => (
                                            <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Tag className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{offer.title}</p>
                                                        <p className="text-sm text-gray-500">{offer.code ? `Code: ${offer.code}` : "Auto-applied"}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1">
                                                    {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `-$${offer.discountValue}`}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ANALYTICS TAB */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-8 h-8 text-blue-500" />
                                    <Badge className="bg-blue-100 text-blue-700">Enrollments</Badge>
                                </div>
                                <p className="text-3xl font-bold">{course._count?.enrollments || 0}</p>
                                <p className="text-sm text-gray-500 mt-1">Total students</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Star className="w-8 h-8 text-yellow-500" />
                                    <Badge className="bg-yellow-100 text-yellow-700">Rating</Badge>
                                </div>
                                <p className="text-3xl font-bold">{course.analytics?.avgRating?.toFixed(1) || "N/A"}</p>
                                <p className="text-sm text-gray-500 mt-1">Average rating</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Award className="w-8 h-8 text-green-500" />
                                    <Badge className="bg-green-100 text-green-700">Certificates</Badge>
                                </div>
                                <p className="text-3xl font-bold">{course._count?.certificates || 0}</p>
                                <p className="text-sm text-gray-500 mt-1">Issued</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <TrendingUp className="w-8 h-8 text-purple-500" />
                                    <Badge className="bg-purple-100 text-purple-700">Completion</Badge>
                                </div>
                                <p className="text-3xl font-bold">{course.analytics?.completionRate?.toFixed(0) || 0}%</p>
                                <p className="text-sm text-gray-500 mt-1">Completion rate</p>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Course Progress Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Published Lessons</span>
                                            <span className="font-medium">{publishedLessons}/{totalLessons}</span>
                                        </div>
                                        <Progress value={totalLessons > 0 ? (publishedLessons / totalLessons) * 100 : 0} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Content Completeness</span>
                                            <span className="font-medium">{course.thumbnail ? "100%" : "80%"}</span>
                                        </div>
                                        <Progress value={course.thumbnail ? 100 : 80} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Module Modal */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModuleModalOpen(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Add New Module</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Module Title</Label>
                                <Input
                                    placeholder="e.g., Introduction to Functional Medicine"
                                    value={moduleForm.title}
                                    onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Description (optional)</Label>
                                <Textarea
                                    placeholder="Brief description of this module..."
                                    value={moduleForm.description}
                                    onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => setIsModuleModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateModule} disabled={!moduleForm.title || isLoading} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Module
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Lesson Modal */}
            {isLessonModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsLessonModalOpen(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Add New Lesson</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Lesson Title</Label>
                                <Input
                                    placeholder="e.g., Understanding Root Causes"
                                    value={lessonForm.title}
                                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Lesson Type</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: "VIDEO", label: "Video", icon: Video },
                                        { value: "TEXT", label: "Article", icon: FileText },
                                        { value: "QUIZ", label: "Quiz", icon: CheckCircle },
                                    ].map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setLessonForm({ ...lessonForm, lessonType: type.value })}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                                lessonForm.lessonType === type.value
                                                    ? "border-burgundy-500 bg-burgundy-50 text-burgundy-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <type.icon className="w-5 h-5" />
                                            <span className="text-xs font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 15"
                                    value={lessonForm.duration || ""}
                                    onChange={e => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateLesson} disabled={!lessonForm.title || isLoading} className="bg-burgundy-600 hover:bg-burgundy-700">
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Lesson
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
