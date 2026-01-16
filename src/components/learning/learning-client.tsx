"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { WistiaPlayer } from "@/components/courses/wistia-player";
import { LessonContentReader } from "@/components/courses/lesson-content-reader";
import { LessonNotes } from "@/components/courses/lesson-notes";
import { MarkCompleteButton } from "@/components/courses/mark-complete-button";
import { LessonNavigation } from "@/components/courses/lesson-navigation";
import { InlineQuiz } from "@/components/courses/inline-quiz";
import {
  ChevronLeft,
  CheckCircle,
  Download,
  Clock,
  MessageCircle,
  FileText,
  Video,
  Play,
  List,
  X,
  Flame,
  Target,
  Award,
  Lock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  StickyNote,
  Timer,
  Users,
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
  resources: Resource[];
}

interface LessonSummary {
  id: string;
  title: string;
  order: number;
  videoDuration: number | null;
  lessonType: string;
  isFreePreview: boolean;
}

interface QuizAnswer {
  id: string;
  answer: string;
  order: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  explanation?: string;
  questionType: "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE";
  order: number;
  points: number;
  answers: QuizAnswer[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts?: number;
  timeLimit?: number;
  isRequired: boolean;
  showCorrectAnswers: boolean;
  questions: QuizQuestion[];
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: LessonSummary[];
  quiz?: Quiz | null;
}

interface Coach {
  id: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  certificateType?: string;
  modules: Module[];
  coach: Coach | null;
}

interface LearningClientProps {
  lesson: Lesson;
  module: {
    id: string;
    title: string;
    order: number;
    quiz: Quiz | null;
  };
  course: Course;
  progress: {
    isCompleted: boolean;
    watchTime: number;
    lastPosition: number;
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
  quiz: Quiz | null;
  quizAttempts: { id: string; score: number; passed: boolean }[];
  hasPassed: boolean;
  nextModule: { id: string; title: string; firstLessonId: string } | null;
  miniDiplomaData?: { optinAt: string | null; graduatesCount: number } | null;
}

export function LearningClient({
  lesson,
  module,
  course,
  progress,
  navigation,
  userStreak,
  progressMap: initialProgressMap,
  quiz,
  quizAttempts,
  hasPassed,
  nextModule,
  miniDiplomaData,
}: LearningClientProps) {
  const router = useRouter();
  // Initialize sidebar closed on mobile, open on desktop (lg breakpoint = 1024px)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([module.id]);
  const [localCompleted, setLocalCompleted] = useState(progress.isCompleted);
  // Local progress map for optimistic updates - initialized from server
  const [localProgressMap, setLocalProgressMap] = useState(initialProgressMap);
  const [localCourseProgress, setLocalCourseProgress] = useState(progress.courseProgress);

  // Set sidebar open on desktop after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setSidebarOpen(true);
    }
  }, []);

  // Sync state when lesson changes (new page navigation)
  // This ensures we start fresh with server data on each lesson
  useEffect(() => {
    setLocalCompleted(progress.isCompleted);
    setLocalProgressMap(initialProgressMap);
    setLocalCourseProgress(progress.courseProgress);
  }, [lesson.id, progress.isCompleted, initialProgressMap, progress.courseProgress]);

  // Inject toggleAnswer function for inline onclick handlers in lesson HTML
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).toggleAnswer = (answerId: string) => {
      const answerElement = document.getElementById(answerId);
      if (answerElement) {
        const isHidden = answerElement.style.display === "none" ||
          answerElement.classList.contains("hidden") ||
          !answerElement.style.display;

        if (isHidden) {
          answerElement.style.display = "block";
          answerElement.classList.remove("hidden");
        } else {
          answerElement.style.display = "none";
        }
      }
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).toggleAnswer;
    };
  }, []);

  const moduleProgressPercent = progress.moduleProgress.total > 0
    ? (progress.moduleProgress.completed / progress.moduleProgress.total) * 100
    : 0;

  const courseProgressPercent = localCourseProgress.total > 0
    ? (localCourseProgress.completed / localCourseProgress.total) * 100
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

  // Check if lesson is unlocked based on progressive unlocking
  const allLessonsInOrder = course.modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.lessons.sort((a, b) => a.order - b.order));

  const isLessonUnlocked = (lessonId: string): boolean => {
    const lessonIndex = allLessonsInOrder.findIndex((l) => l.id === lessonId);
    if (lessonIndex === 0) return true;
    const previousLesson = allLessonsInOrder[lessonIndex - 1];
    return previousLesson ? localProgressMap[previousLesson.id]?.isCompleted === true : false;
  };

  // Handle mark complete callback - update local state immediately for optimistic UI
  const handleMarkComplete = () => {
    // Only update if not already completed (prevent double counting)
    if (!localCompleted) {
      setLocalCompleted(true);
      // Update local progress map for sidebar
      setLocalProgressMap(prev => ({
        ...prev,
        [lesson.id]: { isCompleted: true }
      }));
      // Update course progress count
      setLocalCourseProgress(prev => ({
        ...prev,
        completed: prev.completed + 1
      }));
    }
  };

  // Determine if this is the Final Exam module (no next module = final exam)
  const isFinalExam = !nextModule && navigation.isLastLessonInModule && navigation.moduleHasQuiz;

  // Calculate countdown for mini diploma (48 hours from optin)
  const getCountdown = () => {
    if (!miniDiplomaData?.optinAt) return null;
    const optinDate = new Date(miniDiplomaData.optinAt);
    const expiryDate = new Date(optinDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 48 hours
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, expired: false };
  };

  const countdown = getCountdown();
  const isUrgent = countdown && !countdown.expired && countdown.days <= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 -m-4 lg:-m-8">
      {/* Urgency Countdown Banner - Mini Diploma only */}
      {miniDiplomaData && countdown && !countdown.expired && (
        <div className={cn(
          "flex items-center justify-center gap-4 px-4 py-2 text-sm font-medium",
          isUrgent
            ? "bg-gradient-to-r from-red-600 to-red-500 text-white animate-pulse"
            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        )}>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span>
              {isUrgent ? "⚠️ HURRY! " : ""}
              Access expires in: <strong>{countdown.days}d {countdown.hours}h</strong>
            </span>
          </div>
          <span className="hidden sm:inline text-white/80">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{miniDiplomaData.graduatesCount.toLocaleString()}+ graduates this month</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar - Fixed for mobile */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 sm:h-16">
          {/* Left: Back + Course Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Link href={`/courses/${course.slug}`}>
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50 px-2 sm:px-3">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            {/* Mobile: Show lesson title */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-burgundy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-burgundy-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {lesson.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{module.title}</p>
              </div>
            </div>
          </div>

          {/* Right: Progress + Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Streak Badge - Desktop only */}
            {userStreak && userStreak.currentStreak > 0 && (
              <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full px-3 py-1.5 border border-orange-200">
                <Flame className={cn(
                  "w-4 h-4",
                  userStreak.currentStreak >= 7 ? "text-orange-500" : "text-orange-400"
                )} />
                <span className="text-sm font-medium text-orange-700">
                  {userStreak.currentStreak} day streak
                </span>
              </div>
            )}

            {/* Progress Ring - Show on all screens */}
            <div className="flex items-center">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 -rotate-90">
                  <circle
                    cx="50%" cy="50%" r="35%"
                    stroke="currentColor" strokeWidth="3" fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%" cy="50%" r="35%"
                    stroke="currentColor" strokeWidth="3" fill="none"
                    strokeDasharray={100}
                    strokeDashoffset={100 - courseProgressPercent}
                    className="text-burgundy-600 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-burgundy-600">
                  {Math.round(courseProgressPercent)}%
                </span>
              </div>
            </div>

            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Main Content Area - Only apply right margin on desktop (lg+) when sidebar is open */}
        <main className={cn(
          "flex-1 transition-all duration-500 min-h-[calc(100vh-64px)] w-full",
          sidebarOpen ? "lg:mr-96" : ""
        )}>
          {/* Video Section */}
          {lesson.lessonType === "VIDEO" && lesson.videoId && (
            <div className="bg-black">
              <div className="max-w-6xl mx-auto">
                <div className="relative aspect-video">
                  <WistiaPlayer
                    videoId={lesson.videoId}
                    lessonId={lesson.id}
                    courseId={course.id}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text lessons render their own header from HTML content - no banner needed */}

          {/* Content Section */}
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Lesson Info Card - For video lessons */}
            {lesson.lessonType === "VIDEO" && (
              <div className="mb-8">
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
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {lesson.title}
                    </h1>
                    <p className="text-gray-500">
                      {module.title} • Lesson {progress.lessonIndexInModule + 1} of {progress.moduleProgress.total}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <LessonNotes lessonId={lesson.id} lessonTitle={lesson.title} />
                    <MarkCompleteButton
                      lessonId={lesson.id}
                      courseId={course.id}
                      moduleId={module.id}
                      isCompleted={localCompleted}
                      courseName={course.title}
                      courseSlug={course.slug}
                      lessonNumber={progress.lessonIndex + 1}
                      totalLessons={progress.totalLessons}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Description */}
            {lesson.description && lesson.lessonType === "VIDEO" && (
              <div className="relative mb-8">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-burgundy-500 to-purple-500 rounded-full" />
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-burgundy-600" />
                    </div>
                    About This Lesson
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {/* Lesson Content - Hidden for Final Exam (quiz intro replaces it) */}
            {lesson.content && !isFinalExam && (
              <div className="mb-8">
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
                  {lesson.lessonType === "VIDEO" ? (
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
                  ) : (
                    <LessonContentReader
                      content={lesson.content}
                      lessonId={lesson.id}
                      isCompleted={localCompleted}
                      onMarkComplete={handleMarkComplete}
                      hideCompletionMessage={isFinalExam}
                    />
                  )}
                </div>

                {/* Notes Section for TEXT lessons - Hidden for Final Exam */}
                {lesson.lessonType !== "VIDEO" && !isFinalExam && (
                  <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <StickyNote className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Your Notes</h3>
                          <p className="text-sm text-gray-500">Take notes to remember key points</p>
                        </div>
                      </div>
                      <LessonNotes lessonId={lesson.id} lessonTitle={lesson.title} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resources - Hidden for mini diplomas */}
            {lesson.resources.length > 0 && course.certificateType !== "MINI_DIPLOMA" && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  Downloadable Resources
                </h3>
                <div className="grid gap-3">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </p>
                        <p className="text-sm text-gray-500">{resource.type}</p>
                      </div>
                      <Download className="w-5 h-5 text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Coach Support - with profile image - Hidden for Final Exam */}
            {course.coach && !isFinalExam && (
              <div className="mb-8">
                <div className="bg-burgundy-700 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Coach Photo */}
                    <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-4 ring-burgundy-500 flex-shrink-0">
                      <AvatarImage src={course.coach.image || "/coaches/sarah-coach.webp"} />
                      <AvatarFallback className="bg-burgundy-600 text-white text-lg sm:text-xl font-bold">
                        {coachInitials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Coach Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg sm:text-xl font-bold text-white">
                        {course.coach.firstName} {course.coach.lastName}
                      </p>
                      <p className="text-burgundy-200 text-sm">Your Course Coach</p>
                    </div>

                    {/* Chat Button */}
                    <Link href={`/messages?to=${course.coach.id}`} className="flex-shrink-0">
                      <Button size="default" className="gap-2 bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold text-sm sm:text-base">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Chat With Your Coach!</span>
                        <span className="sm:hidden">Chat</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Quiz */}
            {navigation.isLastLessonInModule && navigation.moduleHasQuiz && quiz && (
              <InlineQuiz
                quiz={quiz}
                module={module}
                course={{
                  id: course.id,
                  title: course.title,
                  slug: course.slug,
                  certificateType: course.certificateType,
                  coach: course.coach ? {
                    id: course.coach.id,
                    firstName: course.coach.firstName || "",
                    lastName: course.coach.lastName || "",
                    avatar: course.coach.image || undefined,
                  } : undefined,
                }}
                nextModule={nextModule || undefined}
                hasPassed={hasPassed}
                previousAttempts={quizAttempts}
                isFinalExam={!nextModule} // No next module = this is the final exam
              />
            )}

            {/* Navigation - One-click Complete & Next */}
            <div className="flex items-center justify-between gap-4 py-8 border-t border-gray-200 mt-8">
              {/* Previous Button */}
              {navigation.prevLesson ? (
                <Link href={`/learning/${course.slug}/${navigation.prevLesson.id}`}>
                  <Button variant="outline" size="lg" className="gap-2 group hover:bg-burgundy-50 hover:border-burgundy-300">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {/* Complete & Next Button - One click auto-complete and navigate */}
              <LessonNavigation
                courseSlug={course.slug}
                courseId={course.id}
                moduleId={module.id}
                lessonId={lesson.id}
                courseName={course.title}
                prevLesson={null}
                nextLesson={navigation.nextLesson}
                isCompleted={localCompleted}
                completedLessons={localCourseProgress.completed}
                totalLessons={localCourseProgress.total}
                canAccessNextLesson={true}
                showQuizButton={navigation.isLastLessonInModule && navigation.moduleHasQuiz}
                bottomBar
                onMarkComplete={handleMarkComplete}
              />
            </div>

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

        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 right-0 h-[calc(100vh-64px)] bg-white border-l border-gray-200 shadow-xl z-40 transition-all duration-500 overflow-hidden",
          "w-full sm:w-96", // Full width on mobile, 96 (384px) on sm+
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-5 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 lg:hidden"
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
                {localCourseProgress.completed} of {localCourseProgress.total} lessons completed
              </p>
            </div>
          </div>

          {/* Module List */}
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 64px - 160px)" }}>
            {course.modules.map((mod, moduleIndex) => {
              const isExpanded = expandedModules.includes(mod.id);
              const isCurrentModule = mod.id === module.id;
              const completedInModule = mod.lessons.filter(
                (l) => localProgressMap[l.id]?.isCompleted
              ).length;
              const modProgress = mod.lessons.length > 0
                ? (completedInModule / mod.lessons.length) * 100
                : 0;

              return (
                <div key={mod.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={cn(
                      "w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors",
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
                        const lessonProgress = localProgressMap[les.id];
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
                              <span className="text-sm text-gray-400 truncate">{les.title}</span>
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
                                "text-sm truncate",
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

                      {/* Quiz indicator */}
                      {mod.quiz && (() => {
                        // Check if this module is the final exam (last module with a quiz)
                        const isModuleFinalExam = moduleIndex === course.modules.length - 1;
                        return (
                          <div className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl mt-2 border-t border-gray-100 pt-4",
                            isCurrentModule && navigation.isLastLessonInModule
                              ? isModuleFinalExam
                                ? "bg-gold-50 border border-gold-200"
                                : "bg-purple-50 border border-purple-200"
                              : ""
                          )}>
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              isModuleFinalExam ? "bg-gold-100" : "bg-purple-100"
                            )}>
                              <Award className={cn(
                                "w-4 h-4",
                                isModuleFinalExam ? "text-gold-600" : "text-purple-600"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm font-medium",
                              isModuleFinalExam ? "text-gold-700" : "text-purple-700"
                            )}>
                              {isModuleFinalExam ? "Final Exam" : "Module Quiz"}
                            </span>
                          </div>
                        );
                      })()}
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

      {/* Mobile FAB removed - use header toggle instead */}
    </div>
  );
}
