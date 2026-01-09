"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    FileText,
    FileDown,
    FolderOpen,
    Search,
    ArrowLeft,
    ClipboardList,
    Pill,
    Calculator,
    Heart,
    Utensils,
    Activity,
    TestTube,
    Target,
    Sparkles,
    ChevronRight,
    TrendingUp,
    BookOpen,
    GraduationCap,
    Loader2,
} from "lucide-react";
import Link from "next/link";

interface CourseResource {
    id: string;
    title: string;
    type: string;
    url: string;
    size: number | null;
    courseName: string;
    courseSlug: string;
    courseThumbnail: string | null;
    moduleName: string;
    lessonName: string;
}

interface EnrolledCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    progress: number;
    resourceCount: number;
}

// Interactive templates (React components)
const INTERACTIVE_TOOLS = [
    {
        id: "intake",
        title: "Client Intake Form",
        description: "Collect comprehensive health history and goals from clients",
        icon: ClipboardList,
        color: "from-burgundy-500 to-burgundy-600",
        bgColor: "bg-burgundy-50",
        textColor: "text-burgundy-600",
        module: "Clinical Assessment",
        href: "/my-library/resources?tool=intake",
        features: ["Auto-save progress", "Generate PDF", "4 sections"],
    },
    {
        id: "protocol",
        title: "Protocol Builder",
        description: "Create personalized health protocols step-by-step",
        icon: Pill,
        color: "from-emerald-500 to-emerald-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        module: "Protocol Building",
        href: "/my-library/resources?tool=protocol",
        features: ["7-step wizard", "5 categories", "Export to PDF"],
    },
    {
        id: "pricing",
        title: "Pricing Calculator",
        description: "Calculate ideal pricing based on income goals",
        icon: Calculator,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        module: "Practice Building",
        href: "/my-library/resources?tool=pricing",
        features: ["Income targeting", "Client math", "Service pricing"],
    },
    {
        id: "gut-health",
        title: "Gut Health Tracker",
        description: "Track digestive symptoms with severity ratings and trends",
        icon: Heart,
        color: "from-burgundy-500 to-burgundy-600",
        bgColor: "bg-burgundy-50",
        textColor: "text-burgundy-600",
        module: "Gut Health",
        href: "/my-library/resources?tool=gut-health",
        features: ["Daily tracking", "Symptom scoring", "Recommendations"],
    },
    {
        id: "nutrition",
        title: "Nutrition Assessment",
        description: "Evaluate dietary habits with food frequency questionnaire",
        icon: Utensils,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        module: "Functional Nutrition",
        href: "/my-library/resources?tool=nutrition",
        features: ["Food frequency", "Macro tracking", "Hydration"],
    },
    {
        id: "stress",
        title: "Stress Assessment Quiz",
        description: "Evaluate stress levels and HPA axis function",
        icon: Activity,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
        module: "Stress & Adrenal",
        href: "/my-library/resources?tool=stress",
        features: ["18 questions", "HPA indicators", "Score analysis"],
    },
    {
        id: "hormones",
        title: "Hormone Symptom Checker",
        description: "Map symptoms to hormone imbalance patterns",
        icon: Target,
        color: "from-pink-500 to-pink-600",
        bgColor: "bg-pink-50",
        textColor: "text-pink-600",
        module: "Female Hormones",
        href: "/my-library/resources?tool=hormones",
        features: ["5 hormone patterns", "Visual mapping", "Recommendations"],
    },
    {
        id: "blood-sugar",
        title: "Blood Sugar Tracker",
        description: "Log glucose readings with trend visualization",
        icon: TrendingUp,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        module: "Blood Sugar & Metabolic",
        href: "/my-library/resources?tool=blood-sugar",
        features: ["Daily logging", "7-day trends", "Custom targets"],
    },
    {
        id: "lab-results",
        title: "Lab Results Calculator",
        description: "Compare conventional vs. functional optimal ranges",
        icon: TestTube,
        color: "from-teal-500 to-cyan-600",
        bgColor: "bg-teal-50",
        textColor: "text-teal-600",
        module: "Functional Lab Testing",
        href: "/my-library/resources?tool=lab-results",
        features: ["16+ markers", "Optimal ranges", "Interpretations"],
    },
];

export default function CourseMaterialsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [courseResources, setCourseResources] = useState<CourseResource[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"courses" | "interactive">("courses");
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course resources
                const resResources = await fetch("/api/user/library/course-resources");
                if (resResources.ok) {
                    const data = await resResources.json();
                    setCourseResources(data.resources || []);
                }

                // Fetch enrolled courses
                const resEnrollments = await fetch("/api/user/enrollments");
                if (resEnrollments.ok) {
                    const data = await resEnrollments.json();
                    // Transform enrollments into course list with resource counts
                    const coursesWithResources = (data.enrollments || []).map((e: any) => ({
                        id: e.course.id,
                        title: e.course.title,
                        slug: e.course.slug,
                        thumbnail: e.course.thumbnail,
                        progress: e.progress || 0,
                        resourceCount: 0, // Will be populated
                    }));
                    setEnrolledCourses(coursesWithResources);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Update resource counts after both are loaded
    useEffect(() => {
        if (courseResources.length > 0 && enrolledCourses.length > 0) {
            const updatedCourses = enrolledCourses.map(course => ({
                ...course,
                resourceCount: courseResources.filter(r => r.courseSlug === course.slug).length,
            }));
            if (JSON.stringify(updatedCourses) !== JSON.stringify(enrolledCourses)) {
                setEnrolledCourses(updatedCourses);
            }
        }
    }, [courseResources]);

    // Filter resources for selected course
    const filteredResources = selectedCourse
        ? courseResources.filter(r => r.courseSlug === selectedCourse)
        : courseResources;

    const searchFilteredResources = filteredResources.filter(r =>
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTools = INTERACTIVE_TOOLS.filter(t =>
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCourseData = enrolledCourses.find(c => c.slug === selectedCourse);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        {selectedCourse ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-gray-600 hover:text-gray-900"
                                onClick={() => setSelectedCourse(null)}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Courses
                            </Button>
                        ) : (
                            <Link href="/my-library">
                                <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Library
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Hero Banner */}
                    <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-white mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        {selectedCourse ? selectedCourseData?.title || 'Course Materials' : 'Course Materials'}
                                    </h1>
                                    <p className="text-burgundy-100">
                                        {selectedCourse
                                            ? `${searchFilteredResources.length} downloadable resources`
                                            : 'Select a course to view its resources'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* If no course selected, show course selection */}
                {!selectedCourse ? (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab("courses")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "courses"
                                        ? "bg-white text-burgundy-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4 inline mr-2" />
                                    My Courses
                                </button>
                                <button
                                    onClick={() => setActiveTab("interactive")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "interactive"
                                        ? "bg-white text-burgundy-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 inline mr-2" />
                                    Interactive Tools
                                </button>
                            </div>
                        </div>

                        {/* My Courses Tab - Course Selection */}
                        {activeTab === "courses" && (
                            <div>
                                {loading ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-burgundy-600" />
                                        <p className="text-gray-500">Loading your courses...</p>
                                    </div>
                                ) : enrolledCourses.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                                            <GraduationCap className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                            Enroll in a course to access downloadable materials and resources.
                                        </p>
                                        <Link href="/courses">
                                            <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                                Browse Courses
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Course to View Resources</h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {enrolledCourses.map((course) => (
                                                <Card
                                                    key={course.id}
                                                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-burgundy-200"
                                                    onClick={() => setSelectedCourse(course.slug)}
                                                >
                                                    {/* Course Thumbnail */}
                                                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-burgundy-100 to-burgundy-200">
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <GraduationCap className="w-12 h-12 text-burgundy-400" />
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-3 right-3">
                                                            <Badge className="bg-burgundy-600 text-white">
                                                                {course.resourceCount} Resources
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Course Info */}
                                                    <div className="p-5">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-burgundy-600 transition-colors line-clamp-2">
                                                            {course.title}
                                                        </h3>

                                                        {/* Progress */}
                                                        <div className="mb-4">
                                                            <div className="flex items-center justify-between text-sm mb-1">
                                                                <span className="text-gray-500">Progress</span>
                                                                <span className="font-semibold text-burgundy-600">{course.progress}%</span>
                                                            </div>
                                                            <Progress value={course.progress} className="h-2" />
                                                        </div>

                                                        <div className="flex items-center text-burgundy-600 font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                                                            View Resources
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Interactive Tools Tab */}
                        {activeTab === "interactive" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-gold-500" />
                                        Practice-Building Tools
                                    </h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredTools.map((tool) => (
                                            <Link key={tool.id} href={tool.href}>
                                                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-burgundy-200 transition-all group cursor-pointer h-full">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                            <tool.icon className="w-7 h-7 text-white" />
                                                        </div>
                                                        <Badge className={`${tool.bgColor} ${tool.textColor} border-0 text-xs`}>
                                                            {tool.module}
                                                        </Badge>
                                                    </div>

                                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-burgundy-600 transition-colors">
                                                        {tool.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-4">{tool.description}</p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {tool.features.map((feature, i) => (
                                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center text-burgundy-600 font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                                                        Open Tool
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Resources for Selected Course */
                    <div>
                        {/* Search */}
                        <div className="relative max-w-md mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-white border-gray-200"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-burgundy-600" />
                                <p className="text-gray-500">Loading resources...</p>
                            </div>
                        ) : searchFilteredResources.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                                    <FileDown className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources yet</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Resources will appear here as you progress through this course.
                                </p>
                                <Link href={`/courses/${selectedCourse}/learn`}>
                                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                        Continue Learning
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchFilteredResources.map((resource) => (
                                    <div key={resource.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-burgundy-200 transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-xl flex items-center justify-center">
                                                {resource.type === "PDF" && <FileText className="w-6 h-6 text-burgundy-600" />}
                                                {resource.type === "DOCUMENT" && <FileText className="w-6 h-6 text-blue-600" />}
                                                {resource.type === "SPREADSHEET" && <FileText className="w-6 h-6 text-green-600" />}
                                                {!["PDF", "DOCUMENT", "SPREADSHEET"].includes(resource.type) && <FileDown className="w-6 h-6 text-gray-600" />}
                                            </div>
                                            <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                                                {resource.type}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{resource.moduleName}</p>
                                        <p className="text-xs text-gray-400 mb-4">Lesson: {resource.lessonName}</p>
                                        {resource.size && (
                                            <p className="text-xs text-gray-400 mb-3">{(resource.size / 1024 / 1024).toFixed(1)} MB</p>
                                        )}
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                                <FileDown className="w-4 h-4 mr-2" /> Download
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
