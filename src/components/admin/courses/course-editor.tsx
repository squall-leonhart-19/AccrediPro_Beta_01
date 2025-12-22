"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft, Save, Loader2, Plus, Trash2, Video, FileText, ChevronDown, ChevronUp,
    ExternalLink, Eye, LayoutDashboard, Settings, Layers, Users, Zap, Tag
} from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, or use javascript alert if not sure

// Types
interface Category {
    id: string;
    name: string;
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
}

interface Module {
    id: string;
    title: string;
    order: number;
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
    categoryId?: string;
    modules: Module[];
    tags: { tag: { id: string; name: string } }[];
    offers: { offer: SpecialOffer }[];
}

interface CourseEditorProps {
    course: Course;
    categories: Category[];
    availableOffers: SpecialOffer[];
}

export function CourseEditor({ course: initialCourse, categories, availableOffers }: CourseEditorProps) {
    const router = useRouter();
    const [course, setCourse] = useState<Course>(initialCourse);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("settings");

    // Module/Lesson State
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(initialCourse.modules.map(m => m.id)));
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [moduleForm, setModuleForm] = useState({ title: "" });

    // Lesson State
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState({ title: "", lessonType: "VIDEO" });

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
                    price: course.isFree ? undefined : course.price,
                    isFree: course.isFree,
                    categoryId: course.categoryId,
                    difficulty: course.difficulty,
                    certificateType: course.certificateType,
                    isPublished: course.isPublished,
                    isFeatured: course.isFeatured,
                }),
            });

            if (!res.ok) throw new Error("Failed to update");

            const updated = await res.json();
            // setCourse(prev => ({ ...prev, ...updated.course })); // Optimistic update used mostly
            toast.success("Course updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Module Handlers ---
    const handleCreateModule = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id, title: moduleForm.title }),
            });
            if (res.ok) {
                const { module } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: [...prev.modules, { ...module, lessons: [], _count: { lessons: 0 } }]
                }));
                setModuleForm({ title: "" });
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
                setLessonForm({ title: "", lessonType: "VIDEO" });
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
                        <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Badge variant={course.isPublished ? "success" : "secondary"}>
                                {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <span>•</span>
                            <span className="font-mono text-xs">{course.slug}</span>
                        </div>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto space-y-6">
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
                    </TabsList>

                    {/* SETTINGS TAB */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-6">
                                <Card>
                                    <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Course Title</label>
                                            <Input value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Slug (URL)</label>
                                            <Input value={course.slug} onChange={e => setCourse({ ...course, slug: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Short Description</label>
                                            <Textarea value={course.shortDescription || ""} onChange={e => setCourse({ ...course, shortDescription: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Full Description</label>
                                            <Textarea rows={6} value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Category</label>
                                            <select
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                                                value={course.categoryId || ""}
                                                onChange={e => setCourse({ ...course, categoryId: e.target.value })}
                                            >
                                                <option value="">Select Category...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Difficulty</label>
                                            <select
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                                                value={course.difficulty}
                                                onChange={e => setCourse({ ...course, difficulty: e.target.value })}
                                            >
                                                <option value="BEGINNER">Beginner</option>
                                                <option value="INTERMEDIATE">Intermediate</option>
                                                <option value="ADVANCED">Advanced</option>
                                                <option value="EXPERT">Expert</option>
                                            </select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isFree"
                                                className="rounded border-gray-300"
                                                checked={course.isFree}
                                                onChange={e => setCourse({ ...course, isFree: e.target.checked })}
                                            />
                                            <label htmlFor="isFree" className="text-sm font-medium">Free Course</label>
                                        </div>
                                        {!course.isFree && (
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">Price (USD)</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                    <Input
                                                        type="number"
                                                        className="pl-7"
                                                        value={course.price || ""}
                                                        onChange={e => setCourse({ ...course, price: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Draft / Published</label>
                                            <div className="flex items-center h-6">
                                                <input
                                                    type="checkbox"
                                                    className="toggle"
                                                    checked={course.isPublished}
                                                    onChange={e => setCourse({ ...course, isPublished: e.target.checked })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Featured</label>
                                            <input
                                                type="checkbox"
                                                checked={course.isFeatured}
                                                onChange={e => setCourse({ ...course, isFeatured: e.target.checked })}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CURRICULUM TAB */}
                    <TabsContent value="curriculum" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Modules & Lessons</h2>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700" onClick={() => setIsModuleModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Module
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {course.modules.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                    <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No content yet</h3>
                                    <p className="text-gray-500">Start by adding your first module</p>
                                </div>
                            ) : (
                                course.modules.map((module, idx) => (
                                    <Card key={module.id} className="overflow-hidden">
                                        <div
                                            className="p-4 flex items-center gap-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors"
                                            onClick={() => toggleModuleExp(module.id)}
                                        >
                                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-burgundy-100 text-burgundy-700 font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                <p className="text-xs text-gray-500">{module._count.lessons} lessons</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedModuleId(module.id);
                                                    setIsLessonModalOpen(true);
                                                }}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-500" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteModule(module.id);
                                                }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                {expandedModules.has(module.id) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>
                                        </div>

                                        {expandedModules.has(module.id) && (
                                            <div className="border-t p-2 space-y-1">
                                                {module.lessons.map((lesson, lidx) => (
                                                    <div key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group">
                                                        <div className="w-6 text-center text-xs text-gray-400 font-mono">{lidx + 1}</div>
                                                        {lesson.lessonType === "VIDEO" ? <Video className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-gray-500" />}
                                                        <span className="flex-1 text-sm font-medium text-gray-700">{lesson.title}</span>
                                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.open(`/admin/courses/${course.id}/lessons/${lesson.id}`, '_blank')}>
                                                                <Settings className="w-3 h-3" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteLesson(lesson.id, module.id)}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => {
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
                                    <div className="text-center py-8 text-gray-500">
                                        No active offers for this course
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {course.offers.map(({ offer }) => (
                                            <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Tag className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium">{offer.title}</p>
                                                        <p className="text-xs text-gray-500">{offer.code ? `Code: ${offer.code}` : "Auto-applied"}</p>
                                                    </div>
                                                </div>
                                                <Badge>{offer.discountType === "percentage" ? `${offer.discountValue}%` : `$${offer.discountValue}`}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Module</h3>
                        <Input
                            placeholder="Module Title"
                            value={moduleForm.title}
                            onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                            className="mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setIsModuleModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateModule} disabled={!moduleForm.title}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {isLessonModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Lesson</h3>
                        <Input
                            placeholder="Lesson Title"
                            value={lessonForm.title}
                            onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                            className="mb-4"
                        />
                        <select
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm mb-4"
                            value={lessonForm.lessonType}
                            onChange={e => setLessonForm({ ...lessonForm, lessonType: e.target.value })}
                        >
                            <option value="VIDEO">Video Lesson</option>
                            <option value="TEXT">Text / Article</option>
                            <option value="QUIZ">Quiz</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateLesson} disabled={!lessonForm.title}>Create</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
