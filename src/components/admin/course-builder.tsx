"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Save, Eye, Settings, Plus, Trash2, Edit, Check, X, Loader2,
    GripVertical, ChevronDown, ChevronRight, Video, FileText, HelpCircle,
    ClipboardList, Globe, Lock, Layers, BookOpen, PlayCircle, MoreVertical,
} from "lucide-react";

interface Lesson {
    id: string;
    title: string;
    description?: string;
    content?: string;
    videoId?: string;
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
    modules: Module[];
    _count: { enrollments: number; certificates: number };
}

interface CourseBuilderProps {
    course: Course;
}

const lessonTypeIcons: Record<string, any> = {
    VIDEO: Video,
    TEXT: FileText,
    QUIZ: HelpCircle,
    ASSIGNMENT: ClipboardList,
};

export function CourseBuilder({ course: initialCourse }: CourseBuilderProps) {
    const router = useRouter();
    const [course, setCourse] = useState<Course>(initialCourse);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set(initialCourse.modules.map(m => m.id))
    );
    const [isSaving, setIsSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Editing states
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editingModuleTitle, setEditingModuleTitle] = useState("");
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [showAddModule, setShowAddModule] = useState(false);

    // Lesson form
    const [lessonForm, setLessonForm] = useState({
        title: "",
        description: "",
        content: "",
        videoId: "",
        lessonType: "VIDEO",
        isPublished: true,
    });

    // Course settings form
    const [settingsForm, setSettingsForm] = useState({
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription || "",
        difficulty: course.difficulty,
        certificateType: course.certificateType,
        isFree: course.isFree,
        isPublished: course.isPublished,
        isFeatured: course.isFeatured,
    });

    // Update lesson form when selecting a lesson
    useEffect(() => {
        if (selectedLesson) {
            setLessonForm({
                title: selectedLesson.title,
                description: selectedLesson.description || "",
                content: selectedLesson.content || "",
                videoId: selectedLesson.videoId || "",
                lessonType: selectedLesson.lessonType,
                isPublished: selectedLesson.isPublished,
            });
        }
    }, [selectedLesson]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) next.delete(moduleId);
            else next.add(moduleId);
            return next;
        });
    };

    // API Functions
    const saveLesson = async () => {
        if (!selectedLesson) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/lessons", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedLesson.id, ...lessonForm }),
            });
            if (res.ok) {
                const { lesson } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.map(m => ({
                        ...m,
                        lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, ...lesson } : l),
                    })),
                }));
                setSelectedLesson({ ...selectedLesson, ...lesson });
                setHasChanges(false);
            }
        } catch (error) {
            console.error("Failed to save lesson:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const createModule = async () => {
        if (!newModuleTitle.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newModuleTitle, courseId: course.id }),
            });
            if (res.ok) {
                const { module } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: [...prev.modules, { ...module, lessons: [] }],
                }));
                setExpandedModules(prev => new Set([...prev, module.id]));
                setNewModuleTitle("");
                setShowAddModule(false);
            }
        } catch (error) {
            console.error("Failed to create module:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateModuleTitle = async (moduleId: string) => {
        if (!editingModuleTitle.trim()) return;
        try {
            const res = await fetch("/api/admin/modules", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: moduleId, title: editingModuleTitle }),
            });
            if (res.ok) {
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.map(m => m.id === moduleId ? { ...m, title: editingModuleTitle } : m),
                }));
                setEditingModuleId(null);
            }
        } catch (error) {
            console.error("Failed to update module:", error);
        }
    };

    const deleteModule = async (moduleId: string) => {
        if (!confirm("Delete this module and all its lessons?")) return;
        try {
            const res = await fetch(`/api/admin/modules?id=${moduleId}`, { method: "DELETE" });
            if (res.ok) {
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.filter(m => m.id !== moduleId),
                }));
                if (selectedModule?.id === moduleId) {
                    setSelectedModule(null);
                    setSelectedLesson(null);
                }
            }
        } catch (error) {
            console.error("Failed to delete module:", error);
        }
    };

    const createLesson = async (moduleId: string) => {
        try {
            const res = await fetch("/api/admin/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "New Lesson",
                    moduleId,
                    lessonType: "VIDEO",
                }),
            });
            if (res.ok) {
                const { lesson } = await res.json();
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.map(m =>
                        m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
                    ),
                }));
                // Auto-select the new lesson for editing
                setSelectedLesson(lesson);
                setSelectedModule(prev => course.modules.find(m => m.id === moduleId) || prev);
                setExpandedModules(prev => new Set([...prev, moduleId]));
            }
        } catch (error) {
            console.error("Failed to create lesson:", error);
        }
    };

    const deleteLesson = async (lessonId: string, moduleId: string) => {
        if (!confirm("Delete this lesson?")) return;
        try {
            const res = await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
            if (res.ok) {
                setCourse(prev => ({
                    ...prev,
                    modules: prev.modules.map(m =>
                        m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
                    ),
                }));
                if (selectedLesson?.id === lessonId) {
                    setSelectedLesson(null);
                }
            }
        } catch (error) {
            console.error("Failed to delete lesson:", error);
        }
    };

    const saveCourseSettings = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: course.id, ...settingsForm }),
            });
            if (res.ok) {
                const { course: updated } = await res.json();
                setCourse(prev => ({ ...prev, ...updated }));
                setShowSettings(false);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const LessonIcon = selectedLesson ? lessonTypeIcons[selectedLesson.lessonType] || FileText : FileText;

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-semibold text-gray-900">{course.title}</h1>
                        <p className="text-xs text-gray-500">{course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Badge variant={course.isPublished ? "success" : "secondary"} className="text-xs">
                        {course.isPublished ? <><Globe className="w-3 h-3 mr-1" /> Published</> : <><Lock className="w-3 h-3 mr-1" /> Draft</>}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Course Structure */}
                <div className="w-80 bg-white border-r flex flex-col overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                Course Structure
                            </h2>
                        </div>
                        <p className="text-xs text-gray-500">{course.modules.length} modules</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {course.modules.map((module, moduleIdx) => (
                            <div key={module.id} className="border rounded-lg overflow-hidden bg-gray-50">
                                {/* Module Header */}
                                <div className="flex items-center gap-2 p-3 bg-white border-b">
                                    <button onClick={() => toggleModule(module.id)} className="text-gray-400 hover:text-gray-600">
                                        {expandedModules.has(module.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>

                                    {editingModuleId === module.id ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <Input
                                                value={editingModuleTitle}
                                                onChange={(e) => setEditingModuleTitle(e.target.value)}
                                                className="h-7 text-sm"
                                                autoFocus
                                                onKeyDown={(e) => e.key === "Enter" && updateModuleTitle(module.id)}
                                            />
                                            <Button size="sm" className="h-7 w-7 p-0" onClick={() => updateModuleTitle(module.id)}>
                                                <Check className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingModuleId(null)}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 truncate">{module.title}</p>
                                                <p className="text-xs text-gray-400">{module.lessons.length} lessons</p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingModuleId(module.id); setEditingModuleTitle(module.title); }}>
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteModule(module.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Lessons */}
                                {expandedModules.has(module.id) && (
                                    <div className="p-2 space-y-1">
                                        {module.lessons.map((lesson, lessonIdx) => {
                                            const Icon = lessonTypeIcons[lesson.lessonType] || FileText;
                                            const isSelected = selectedLesson?.id === lesson.id;
                                            return (
                                                <div
                                                    key={lesson.id}
                                                    onClick={() => { setSelectedLesson(lesson); setSelectedModule(module); }}
                                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors ${isSelected ? 'bg-burgundy-100 border border-burgundy-300' : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span className="text-xs text-gray-400 w-5">{lessonIdx + 1}</span>
                                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-burgundy-600' : 'text-gray-400'}`} />
                                                    <span className={`flex-1 text-sm truncate ${isSelected ? 'text-burgundy-900 font-medium' : 'text-gray-700'}`}>
                                                        {lesson.title}
                                                    </span>
                                                    {!lesson.isPublished && <Lock className="w-3 h-3 text-gray-400" />}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500"
                                                        onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id, module.id); }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            onClick={() => createLesson(module.id)}
                                            className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-burgundy-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Lesson
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Module */}
                        {showAddModule ? (
                            <div className="border rounded-lg p-3 bg-white space-y-2">
                                <Input
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    placeholder="Module title..."
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && createModule()}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1 bg-burgundy-600 hover:bg-burgundy-700" onClick={createModule} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Module"}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => { setShowAddModule(false); setNewModuleTitle(""); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddModule(true)}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-burgundy-400 hover:text-burgundy-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Module
                            </button>
                        )}
                    </div>
                </div>

                {/* Center - Lesson Editor */}
                <div className="flex-1 overflow-y-auto">
                    {selectedLesson ? (
                        <div className="max-w-4xl mx-auto p-8">
                            {/* Lesson Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center">
                                        <LessonIcon className="w-5 h-5 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{selectedModule?.title}</p>
                                        <h2 className="text-xl font-bold text-gray-900">Edit Lesson</h2>
                                    </div>
                                </div>
                                <Button
                                    className="bg-burgundy-600 hover:bg-burgundy-700"
                                    onClick={saveLesson}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Lesson
                                </Button>
                            </div>

                            {/* Lesson Form */}
                            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                                    <Input
                                        value={lessonForm.title}
                                        onChange={(e) => { setLessonForm(prev => ({ ...prev, title: e.target.value })); setHasChanges(true); }}
                                        placeholder="Enter lesson title..."
                                        className="text-lg"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { value: "VIDEO", label: "Video", icon: Video, desc: "Video lesson" },
                                            { value: "TEXT", label: "Text", icon: FileText, desc: "Text content" },
                                            { value: "QUIZ", label: "Quiz", icon: HelpCircle, desc: "Knowledge check" },
                                            { value: "ASSIGNMENT", label: "Assignment", icon: ClipboardList, desc: "Hands-on work" },
                                        ].map(type => (
                                            <button
                                                key={type.value}
                                                onClick={() => { setLessonForm(prev => ({ ...prev, lessonType: type.value })); setHasChanges(true); }}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${lessonForm.lessonType === type.value
                                                        ? 'border-burgundy-500 bg-burgundy-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <type.icon className={`w-6 h-6 mb-2 ${lessonForm.lessonType === type.value ? 'text-burgundy-600' : 'text-gray-400'}`} />
                                                <p className={`font-medium ${lessonForm.lessonType === type.value ? 'text-burgundy-900' : 'text-gray-900'}`}>{type.label}</p>
                                                <p className="text-xs text-gray-500">{type.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Video ID (for video lessons) */}
                                {lessonForm.lessonType === "VIDEO" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Wistia Video ID</label>
                                        <div className="flex gap-3">
                                            <Input
                                                value={lessonForm.videoId}
                                                onChange={(e) => { setLessonForm(prev => ({ ...prev, videoId: e.target.value })); setHasChanges(true); }}
                                                placeholder="e.g., abc123xyz"
                                                className="flex-1"
                                            />
                                            {lessonForm.videoId && (
                                                <Button variant="outline" onClick={() => window.open(`https://fast.wistia.net/embed/iframe/${lessonForm.videoId}`, '_blank')}>
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Preview
                                                </Button>
                                            )}
                                        </div>
                                        {lessonForm.videoId && (
                                            <div className="mt-4 aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                                <iframe
                                                    src={`https://fast.wistia.net/embed/iframe/${lessonForm.videoId}`}
                                                    className="w-full h-full"
                                                    allow="autoplay; fullscreen"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Content (for text lessons) */}
                                {lessonForm.lessonType === "TEXT" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
                                        <Textarea
                                            value={lessonForm.content}
                                            onChange={(e) => { setLessonForm(prev => ({ ...prev, content: e.target.value })); setHasChanges(true); }}
                                            placeholder="Write your lesson content here..."
                                            rows={12}
                                            className="font-mono"
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <Textarea
                                        value={lessonForm.description}
                                        onChange={(e) => { setLessonForm(prev => ({ ...prev, description: e.target.value })); setHasChanges(true); }}
                                        placeholder="Brief description of this lesson..."
                                        rows={3}
                                    />
                                </div>

                                {/* Publish Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Publish Lesson</p>
                                        <p className="text-sm text-gray-500">Make this lesson visible to enrolled students</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={lessonForm.isPublished}
                                            onChange={(e) => { setLessonForm(prev => ({ ...prev, isPublished: e.target.checked })); setHasChanges(true); }}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-burgundy-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Lesson</h3>
                                <p className="text-gray-400">Click on a lesson in the sidebar to edit it</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Settings (collapsible) */}
                {showSettings && (
                    <div className="w-96 bg-white border-l overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-gray-900">Course Settings</h2>
                                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <Input
                                        value={settingsForm.title}
                                        onChange={(e) => setSettingsForm(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <Textarea
                                        value={settingsForm.description}
                                        onChange={(e) => setSettingsForm(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                        <select
                                            value={settingsForm.difficulty}
                                            onChange={(e) => setSettingsForm(prev => ({ ...prev, difficulty: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-300 p-2.5"
                                        >
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate</label>
                                        <select
                                            value={settingsForm.certificateType}
                                            onChange={(e) => setSettingsForm(prev => ({ ...prev, certificateType: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-300 p-2.5"
                                        >
                                            <option value="COMPLETION">Completion</option>
                                            <option value="CERTIFICATION">Certification</option>
                                            <option value="MINI_DIPLOMA">Mini Diploma</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settingsForm.isPublished}
                                            onChange={(e) => setSettingsForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Publish Course</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settingsForm.isFeatured}
                                            onChange={(e) => setSettingsForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Featured Course</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settingsForm.isFree}
                                            onChange={(e) => setSettingsForm(prev => ({ ...prev, isFree: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Free Course</span>
                                    </label>
                                </div>

                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={saveCourseSettings} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
