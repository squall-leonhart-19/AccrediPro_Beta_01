"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  Clock,
  BookOpen,
  MessageCircle,
  FileText,
  Video,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  List,
  X,
  Flame,
  Target,
  Sparkles,
  Award,
  Lock,
  ChevronDown,
  ChevronUp,
  StickyNote,
  HelpCircle,
  ArrowRight,
  Zap,
  Trophy,
} from "lucide-react";

// Types
interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  lessonType: string;
  videoId: string | null;
  videoDuration: number | null;
  order: number;
  isFreePreview: boolean;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Coach {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  modules: Module[];
  coach: Coach | null;
}

interface LessonPageV2Props {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    lessonType: string;
    videoId: string | null;
    videoDuration: number | null;
    resources: Resource[];
  };
  module: {
    id: string;
    title: string;
    order: number;
  };
  course: Course;
  progress: {
    isCompleted: boolean;
    moduleProgress: { total: number; completed: number };
    courseProgress: { total: number; completed: number };
    lessonIndex: number;
    totalLessons: number;
    lessonIndexInModule: number;
  };
  navigation: {
    prevLesson: { id: string; title: string } | null;
    nextLesson: { id: string; title: string; moduleId?: string } | null;
    isLastLessonInModule: boolean;
    moduleHasQuiz: boolean;
  };
  userStreak: { currentStreak: number; longestStreak: number } | null;
  progressMap: Record<string, { isCompleted: boolean }>;
}

export function LessonPageV2({
  lesson,
  module,
  course,
  progress,
  navigation,
  userStreak,
  progressMap,
}: LessonPageV2Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([module.id]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(progress.isCompleted);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll for floating header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const moduleProgressPercent = progress.moduleProgress.total > 0
    ? (progress.moduleProgress.completed / progress.moduleProgress.total) * 100
    : 0;

  const courseProgressPercent = progress.courseProgress.total > 0
    ? (progress.courseProgress.completed / progress.courseProgress.total) * 100
    : 0;

  const coachInitials = course.coach
    ? `${course.coach.firstName?.[0] || ""}${course.coach.lastName?.[0] || ""}`.toUpperCase()
    : "C";

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleMarkComplete = async () => {
    if (localCompleted) return;
    setIsCompleting(true);
    try {
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          courseId: course.id,
          moduleId: module.id,
        }),
      });
      if (response.ok) {
        setLocalCompleted(true);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Check if lesson is unlocked
  const allLessonsInOrder = course.modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.lessons.sort((a, b) => a.order - b.order));

  const isLessonUnlocked = (lessonId: string): boolean => {
    const lessonIndex = allLessonsInOrder.findIndex((l) => l.id === lessonId);
    if (lessonIndex === 0) return true;
    const previousLesson = allLessonsInOrder[lessonIndex - 1];
    return previousLesson ? progressMap[previousLesson.id]?.isCompleted === true : false;
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      theaterMode ? "bg-black" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
    )}>
      {/* Floating Header - Appears on scroll */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5 translate-y-0"
          : "translate-y-[-100%]"
      )}>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/courses/${course.slug}`}>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="hidden md:block">
              <h1 className="text-sm font-semibold text-gray-900 truncate max-w-md">
                {lesson.title}
              </h1>
              <p className="text-xs text-gray-500">{module.title}</p>
            </div>
          </div>

          {/* Floating Progress Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={100}
                  strokeDashoffset={100 - moduleProgressPercent}
                  className="text-burgundy-600 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-burgundy-600">
                {Math.round(moduleProgressPercent)}%
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Main Content Area - Only apply right margin on desktop (lg+) when sidebar is open */}
        <main className={cn(
          "flex-1 transition-all duration-500 w-full",
          sidebarOpen ? "lg:mr-96" : ""
        )}>
          {/* Hero Section with Course Info */}
          <div className={cn(
            "relative overflow-hidden",
            theaterMode ? "bg-black" : "bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-purple-900"
          )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative">
              {/* Top Bar */}
              <div className={cn(
                "flex items-center justify-between px-6 lg:px-10 py-4",
                isScrolled ? "opacity-0" : "opacity-100",
                "transition-opacity duration-300"
              )}>
                <Link href={`/courses/${course.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-2 text-white/80 hover:text-white hover:bg-white/10">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Course</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  {/* Streak Badge */}
                  {userStreak && userStreak.currentStreak > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <Flame className={cn(
                        "w-4 h-4",
                        userStreak.currentStreak >= 7 ? "text-orange-400" : "text-white/60"
                      )} />
                      <span className="text-sm font-medium text-white">
                        {userStreak.currentStreak} day streak
                      </span>
                    </div>
                  )}

                  {/* Theater Mode Toggle */}
                  {lesson.lessonType === "VIDEO" && lesson.videoId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheaterMode(!theaterMode)}
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      {theaterMode ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}

                  {/* Toggle Sidebar */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Video Section */}
              {lesson.lessonType === "VIDEO" && lesson.videoId ? (
                <div className={cn(
                  "mx-auto transition-all duration-500",
                  theaterMode ? "max-w-none px-0" : "max-w-6xl px-6 lg:px-10 pb-8"
                )}>
                  <div className={cn(
                    "relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50",
                    theaterMode && "rounded-none"
                  )}>
                    <div className="aspect-video bg-black flex items-center justify-center">
                      {/* Wistia Player Placeholder - Replace with actual WistiaPlayer */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-md border border-white/20 cursor-pointer hover:bg-white/20 transition-all hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                          <p className="text-white/60 text-sm">Video ID: {lesson.videoId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Text Lesson Hero */
                <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
                    <FileText className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/80">Text Lesson</span>
                    {lesson.videoDuration && (
                      <>
                        <span className="text-white/40">•</span>
                        <Clock className="w-4 h-4 text-white/80" />
                        <span className="text-sm text-white/80">{formatDuration(lesson.videoDuration)} read</span>
                      </>
                    )}
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {lesson.title}
                  </h1>

                  {lesson.description && (
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                      {lesson.description}
                    </p>
                  )}

                  {/* Module Progress */}
                  <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-3 text-white/60">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">
                        Lesson {progress.lessonIndexInModule + 1} of {progress.moduleProgress.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                          style={{ width: `${moduleProgressPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {Math.round(moduleProgressPercent)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="max-w-4xl mx-auto px-6 lg:px-10 py-12">
            {/* Lesson Info Card - For video lessons */}
            {lesson.lessonType === "VIDEO" && (
              <div className="mb-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {localCompleted && (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {lesson.videoDuration && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDuration(lesson.videoDuration)}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {lesson.title}
                    </h1>
                    <p className="text-gray-500">
                      {module.title} • Lesson {progress.lessonIndexInModule + 1} of {progress.moduleProgress.total}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="lg" className="gap-2">
                      <StickyNote className="w-4 h-4" />
                      Notes
                    </Button>
                    {!localCompleted && (
                      <Button
                        size="lg"
                        onClick={handleMarkComplete}
                        disabled={isCompleting}
                        className="gap-2 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white shadow-lg shadow-burgundy-500/25"
                      >
                        {isCompleting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Description */}
            {lesson.description && lesson.lessonType !== "VIDEO" && (
              <div className="relative mb-10">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-burgundy-500 to-purple-500 rounded-full" />
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-burgundy-600" />
                    </div>
                    Learning Objectives
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{lesson.description}</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div className="mb-10">
                <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div
                    className="prose prose-lg prose-gray max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900
                      prose-p:text-gray-600 prose-p:leading-relaxed
                      prose-a:text-burgundy-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900
                      prose-ul:text-gray-600 prose-ol:text-gray-600
                      prose-li:marker:text-burgundy-500"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>

                {/* Reading completion for text lessons */}
                {lesson.lessonType !== "VIDEO" && !localCompleted && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleMarkComplete}
                      disabled={isCompleting}
                      className="gap-3 bg-gradient-to-r from-burgundy-600 to-purple-600 hover:from-burgundy-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-burgundy-500/25 transition-all hover:scale-105"
                    >
                      {isCompleting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      I&apos;ve Finished This Lesson
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  Downloadable Resources
                </h3>
                <div className="grid gap-4">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </p>
                        <p className="text-sm text-gray-500">{resource.type}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Download className="w-5 h-5 text-blue-600" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Coach Support */}
            {course.coach && (
              <div className="mb-10">
                <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-700 rounded-2xl p-8 text-white">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative flex items-center gap-6">
                    <Avatar className="w-20 h-20 ring-4 ring-white/20">
                      <AvatarImage src={course.coach.avatar || undefined} />
                      <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                        {coachInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-burgundy-200 text-sm font-medium mb-1">Need Help?</p>
                      <p className="text-2xl font-bold mb-1">
                        {course.coach.firstName} {course.coach.lastName}
                      </p>
                      <p className="text-white/70">Your dedicated course coach</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/messages?to=${course.coach.id}`}>
                        <Button size="lg" className="gap-2 bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold shadow-lg">
                          <MessageCircle className="w-4 h-4" />
                          Ask a Question
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 py-8 border-t border-gray-200">
              {navigation.prevLesson ? (
                <Link href={`/learning/${course.slug}/${navigation.prevLesson.id}`}>
                  <Button variant="outline" size="lg" className="gap-2 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left hidden sm:block">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="font-medium truncate max-w-[150px]">{navigation.prevLesson.title}</p>
                    </div>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {navigation.isLastLessonInModule && navigation.moduleHasQuiz ? (
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg group"
                >
                  <Award className="w-5 h-5" />
                  Start Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : navigation.nextLesson ? (
                <Link href={`/learning/${course.slug}/${navigation.nextLesson.id}`}>
                  <Button
                    size="lg"
                    disabled={!localCompleted}
                    className={cn(
                      "gap-2 group",
                      localCompleted
                        ? "bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <div className="text-left hidden sm:block">
                      <p className="text-xs opacity-70">Next Lesson</p>
                      <p className="font-medium truncate max-w-[150px]">{navigation.nextLesson.title}</p>
                    </div>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                >
                  <Trophy className="w-5 h-5" />
                  Complete Course
                </Button>
              )}
            </div>

            {/* Spacer */}
            <div className="h-20" />
          </div>
        </main>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Floating Sidebar */}
        <aside className={cn(
          "fixed top-0 right-0 h-full bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl shadow-black/10 z-40 transition-all duration-500",
          "w-full sm:w-96", // Full width on mobile, 96 (384px) on sm+
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Overall Progress */}
            <div className="bg-gradient-to-r from-burgundy-50 to-purple-50 rounded-xl p-4 border border-burgundy-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-burgundy-600">{Math.round(courseProgressPercent)}%</span>
              </div>
              <Progress value={courseProgressPercent} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {progress.courseProgress.completed} of {progress.courseProgress.total} lessons completed
              </p>
            </div>
          </div>

          {/* Module List */}
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 180px)" }}>
            {course.modules.map((mod, moduleIndex) => {
              const isExpanded = expandedModules.includes(mod.id);
              const isCurrentModule = mod.id === module.id;
              const completedInModule = mod.lessons.filter(
                (l) => progressMap[l.id]?.isCompleted
              ).length;
              const modProgress = mod.lessons.length > 0
                ? (completedInModule / mod.lessons.length) * 100
                : 0;

              return (
                <div key={mod.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={cn(
                      "w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors",
                      isCurrentModule && "bg-burgundy-50/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors",
                      isCurrentModule
                        ? "bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white"
                        : modProgress === 100
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                    )}>
                      {modProgress === 100 ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        moduleIndex + 1
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={cn(
                        "font-medium text-sm",
                        isCurrentModule ? "text-burgundy-700" : "text-gray-900"
                      )}>
                        {mod.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              modProgress === 100 ? "bg-green-500" : "bg-burgundy-500"
                            )}
                            style={{ width: `${modProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {completedInModule}/{mod.lessons.length}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Lessons */}
                  {isExpanded && (
                    <div className="pb-4 px-4">
                      {mod.lessons.map((les) => {
                        const lessonProgress = progressMap[les.id];
                        const isLesCompleted = lessonProgress?.isCompleted;
                        const isCurrent = les.id === lesson.id;
                        const isUnlocked = isLessonUnlocked(les.id);

                        if (!isUnlocked && !isLesCompleted) {
                          return (
                            <div
                              key={les.id}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-50"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-400">{les.title}</span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={les.id}
                            href={`/learning/${course.slug}/${les.id}`}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                              isCurrent
                                ? "bg-burgundy-100 border border-burgundy-200"
                                : "hover:bg-gray-50"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              isLesCompleted
                                ? "bg-green-100"
                                : isCurrent
                                  ? "bg-burgundy-200"
                                  : "bg-gray-100"
                            )}>
                              {isLesCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : isCurrent ? (
                                <Play className="w-4 h-4 text-burgundy-600" />
                              ) : (
                                <Video className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm",
                                isCurrent
                                  ? "font-semibold text-burgundy-700"
                                  : isLesCompleted
                                    ? "text-green-700"
                                    : "text-gray-700"
                              )}>
                                {les.title}
                              </p>
                              {les.videoDuration && (
                                <p className="text-xs text-gray-400">
                                  {formatDuration(les.videoDuration)}
                                </p>
                              )}
                            </div>
                            {isCurrent && (
                              <div className="w-2 h-2 rounded-full bg-burgundy-500 animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Floating Action Button - Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {!localCompleted && (
          <Button
            size="lg"
            onClick={handleMarkComplete}
            disabled={isCompleting}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white shadow-xl shadow-burgundy-500/30"
          >
            {isCompleting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </Button>
        )}
        <Button
          size="lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 shadow-xl shadow-gold-500/30"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
