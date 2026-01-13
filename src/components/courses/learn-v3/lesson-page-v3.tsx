"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    BookOpen,
    Clock,
    Menu,
    X,
    Play,
    Lock,
    MessageCircle,
    Award,
    Flame,
} from "lucide-react";
import { FloatingMentorChat } from "@/components/ai/floating-mentor-chat";
import { SarahLessonBubble } from "@/components/courses/sarah-lesson-bubble";
import { LessonNotes } from "@/components/courses/lesson-notes";
import { InlineQuiz } from "@/components/courses/inline-quiz";
import confetti from "canvas-confetti";
import { toast } from "sonner";

// =============================================================================
// TYPES
// =============================================================================
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

interface LessonPageV3Props {
    lesson: {
        id: string;
        title: string;
        description: string | null;
        content: string | null;
        lessonType: string;
        videoId: string | null;
        videoDuration: number | null;
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
        nextLesson: { id: string; title: string } | null;
        isLastLessonInModule: boolean;
        moduleHasQuiz: boolean;
        quizId?: string;
    };
    userStreak: { currentStreak: number; longestStreak: number } | null;
    progressMap: Record<string, { isCompleted: boolean }>;
    quizData?: {
        quiz: {
            id: string;
            title: string;
            description?: string;
            passingScore: number;
            maxAttempts?: number;
            timeLimit?: number;
            isRequired: boolean;
            showCorrectAnswers: boolean;
            questions: {
                id: string;
                question: string;
                explanation?: string;
                questionType: "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE";
                order: number;
                points: number;
                answers: {
                    id: string;
                    answer: string;
                    order: number;
                    isCorrect?: boolean;
                }[];
            }[];
        };
        hasPassed: boolean;
        previousAttempts: { id: string; score: number; passed: boolean }[];
        nextModule?: {
            id: string;
            title: string;
            firstLessonId: string;
        };
    };
}

// =============================================================================
// HELPER: Process lesson content to inject style overrides
// =============================================================================
function processLessonContent(htmlContent: string | null): string {
    if (!htmlContent) return '';

    // CSS overrides to inject - COMPREHENSIVE SCHOOL-QUALITY FIX
    const styleOverrides = `
    <style id="lesson-overrides">
        /* Hide duplicate brand header */
        .brand-header { display: none !important; }
        .lesson-footer { display: none !important; }
        
        /* Force full width layout */
        .lesson-container {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            min-height: auto !important;
        }
        
        /* =========================================== */
        /* MODULE HEADER - School Quality Styling */
        /* =========================================== */
        .module-header {
            max-width: 100% !important;
            width: 100% !important;
            border-radius: 16px !important;
            margin: 0 0 32px 0 !important;
            padding: 32px !important;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%) !important;
            box-shadow: 0 10px 40px -10px rgba(114, 47, 55, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .module-header .module-label,
        .module-header .lesson-meta,
        .module-header .meta-item {
            color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .module-header .lesson-title,
        .module-header h1 {
            color: #ffffff !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* =========================================== */
        /* WELCOME BOX - Fix Text Visibility */
        /* =========================================== */
        .welcome-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 0 32px 0 !important;
            padding: 28px 32px !important;
            border-radius: 16px !important;
            background: linear-gradient(135deg, #722F37 0%, #8B3D43 100%) !important;
            box-shadow: 0 8px 32px -8px rgba(114, 47, 55, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .welcome-box p,
        .welcome-box p.quote,
        .welcome-box p.author,
        .welcome-box h2,
        .welcome-box h3,
        .welcome-box li,
        .welcome-box a,
        .welcome-box em,
        .welcome-box strong,
        .welcome-box span {
            color: #ffffff !important;
            opacity: 1 !important;
        }
        
        .welcome-box p.author {
            color: rgba(255, 255, 255, 0.85) !important;
        }
        
        /* =========================================== */
        /* TOC BOX (In This Lesson) */
        /* =========================================== */
        .toc-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 0 32px 0 !important;
            background: #f8f8f8 !important;
            border: 1px solid #e5e5e5 !important;
            border-radius: 16px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        
        /* =========================================== */
        /* ALERT BOXES - Rounded, School Style */
        /* =========================================== */
        .alert-box {
            max-width: 100% !important;
            width: 100% !important;
            padding: 24px 28px !important;
            margin: 28px 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        
        .alert-box.success {
            background: #f0fdf4 !important;
            border: 1px solid #86efac !important;
            border-left: 4px solid #22c55e !important;
        }
        
        .alert-box.warning {
            background: #fffbeb !important;
            border: 1px solid #fcd34d !important;
            border-left: 4px solid #f59e0b !important;
        }
        
        /* =========================================== */
        /* CONTENT BOXES - Full Width with Borders */
        /* =========================================== */
        .objectives-box,
        .case-study,
        .check-understanding,
        .key-terms-box,
        .comparison-grid,
        .principle-card,
        .toolkit-container,
        .stats-box,
        .takeaways-box {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin-bottom: 28px !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
            border: 1px solid #e5e5e5 !important;
        }
        
        .takeaways-box {
            background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%) !important;
            border: 1px solid #fde047 !important;
        }
        
        /* =========================================== */
        /* TYPOGRAPHY - Clean Reading Experience */
        /* =========================================== */
        .lesson-container > h2,
        .lesson-container > h3,
        .lesson-container > h4,
        .lesson-container > p,
        .lesson-container > ul,
        .lesson-container > ol,
        .lesson-container > dl,
        .lesson-container > blockquote {
            max-width: 900px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        
        h2 {
            color: #722F37 !important;
            font-weight: 700 !important;
            margin-top: 48px !important;
            margin-bottom: 20px !important;
        }
        
        h2::after {
            background: linear-gradient(90deg, #B8860B, #D4A84B) !important;
            height: 3px !important;
            border-radius: 2px !important;
        }
        
        /* =========================================== */
        /* LISTS - Better Formatting */
        /* =========================================== */
        .content-list {
            max-width: 900px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        
        .content-list li {
            padding: 8px 0 !important;
            border-bottom: 1px solid #f3f3f3 !important;
        }
        
        .content-list li:last-child {
            border-bottom: none !important;
        }
        
        /* Force inner wrapper to be full width */
        .lesson-container > div[style*="max-width: 800px"],
        .lesson-container > div[style*="max-width:800px"] {
            max-width: 100% !important;
            width: 100% !important;
        }
    </style>
    `;

    let processedContent = htmlContent;

    // If this is a full HTML document, extract only the relevant parts
    if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html')) {
        // Extract styles from <head>
        const styleMatches = htmlContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
        const extractedStyles = styleMatches.join('\n');

        // Extract body content
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

        // Combine: overrides + extracted styles + body content
        processedContent = styleOverrides + extractedStyles + bodyContent;
    } else {
        // Not a full HTML doc, just prepend overrides
        processedContent = styleOverrides + htmlContent;
    }

    return processedContent;
}

// Calculate reading time - consistent per lesson (10-20 min range)
function getReadingTime(lessonId: string): number {
    // Use lessonId hash to generate consistent reading time between 10-20 minutes
    let hash = 0;
    for (let i = 0; i < lessonId.length; i++) {
        hash = ((hash << 5) - hash) + lessonId.charCodeAt(i);
        hash |= 0;
    }
    return 10 + Math.abs(hash % 11); // Returns 10-20
}

// =============================================================================
// COMPONENT
// =============================================================================
export function LessonPageV3({
    lesson,
    module,
    course,
    progress,
    navigation,
    userStreak,
    progressMap,
    quizData,
}: LessonPageV3Props) {
    // State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedModules, setExpandedModules] = useState<string[]>([module.id]);
    const [isCompleting, setIsCompleting] = useState(false);
    const [localCompleted, setLocalCompleted] = useState(progress.isCompleted);
    const [isScrolled, setIsScrolled] = useState(false);
    const [localProgressMap, setLocalProgressMap] = useState(progressMap);
    const router = useRouter();

    // Handle scroll for sticky header visibility
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Initialize sidebar state based on screen size (desktop = open)
    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Interactive Elements Handler (Reveal Answer)
    useEffect(() => {
        const container = document.querySelector('.prose');
        if (!container) return;

        const handleInteract = (e: Event) => {
            const target = e.target as HTMLElement;

            // Handle Reveal Button
            if (target.classList.contains('reveal-btn')) {
                const answer = target.nextElementSibling;
                if (answer && answer.classList.contains('answer-text')) {
                    answer.classList.toggle('show');
                    target.textContent = answer.classList.contains('show') ? 'Hide Answer' : 'Reveal Answer';
                }
            }
        };

        container.addEventListener('click', handleInteract);
        return () => container.removeEventListener('click', handleInteract);
    }, [lesson.content]); // Re-run when content changes

    // Calculations
    const courseProgressPercent = progress.courseProgress.total > 0
        ? Math.round((progress.courseProgress.completed / progress.courseProgress.total) * 100)
        : 0;

    const coachInitials = course.coach
        ? `${course.coach.firstName?.[0] || ""}${course.coach.lastName?.[0] || ""}`.toUpperCase()
        : "SM";

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
        if (localCompleted || isCompleting) return;
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
                // GAMIFICATION: Confetti & Toast
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#722f37', '#d4a84b', '#ffffff'], // Brand colors
                });

                toast.success("Lesson Completed!", {
                    description: "+50 XP earned. Keep up the momentum!",
                    duration: 2000,
                    icon: <Flame className="w-4 h-4 text-gold-500" />
                });

                setLocalCompleted(true);
                // Optimistic update for sidebar
                setLocalProgressMap(prev => ({
                    ...prev,
                    [lesson.id]: { isCompleted: true }
                }));

                // Wait a bit for the celebration before navigating
                setTimeout(() => {
                    // Auto-navigate logic
                    if (navigation.isLastLessonInModule && navigation.moduleHasQuiz) {
                        // Scroll to inline quiz section
                        const quizSection = document.getElementById("inline-quiz-section");
                        if (quizSection) {
                            quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    } else if (navigation.nextLesson) {
                        // Navigate to next lesson
                        router.push(`/learning/${course.slug}/${navigation.nextLesson.id}`);
                    } else {
                        // No next lesson - this was the last lesson
                        router.refresh();
                    }
                }, 1500);
            }
        } catch (error) {
            console.error("Failed to complete lesson:", error);
            toast.error("Failed to save progress");
        } finally {
            setIsCompleting(false);
        }
    };


    // Check if lesson is unlocked (progressive unlocking)
    const allLessonsInOrder = course.modules
        .sort((a, b) => a.order - b.order)
        .flatMap((m) => m.lessons.sort((a, b) => a.order - b.order));

    const isLessonUnlocked = (lessonId: string): boolean => {
        const lessonIndex = allLessonsInOrder.findIndex((l) => l.id === lessonId);
        if (lessonIndex === 0) return true;
        const previousLesson = allLessonsInOrder[lessonIndex - 1];
        return previousLesson ? localProgressMap[previousLesson.id]?.isCompleted === true : false;
    };

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    // Handle "Reveal Answer" buttons in injected content
    useEffect(() => {
        const container = document.querySelector('.prose'); // Scope to prose container
        if (!container) return;

        const handleReveal = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.classList.contains('reveal-btn')) {
                const answer = target.nextElementSibling as HTMLElement;
                if (answer && answer.classList.contains('answer-text')) {
                    // Toggle visibility
                    const isHidden = answer.style.display === 'none' || !answer.style.display;
                    if (isHidden) {
                        answer.style.display = 'block';
                        answer.classList.add('show');
                        target.textContent = 'Hide Answer';
                    } else {
                        answer.style.display = 'none';
                        answer.classList.remove('show');
                        target.textContent = 'Reveal Answer';
                    }
                }
            }
        };

        // Delegate listener to the container so we don't need to re-bind if content re-renders
        container.addEventListener('click', handleReveal as EventListener);

        return () => {
            container.removeEventListener('click', handleReveal as EventListener);
        };
    }, [lesson.content]);

    // =============================================================================
    // RENDER
    // =============================================================================
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ===== CLEAN TOP HEADER ===== */}
            <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex-none">
                <div className="h-full max-w-[1400px] mx-auto flex items-center justify-between px-4">
                    {/* Left: Back Button */}
                    <Link href={`/courses/${course.slug}`} className="flex-shrink-0">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-900 -ml-2">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>
                    </Link>

                    {/* Center: Course/Lesson info - only on scroll */}
                    <div className={cn(
                        "hidden sm:block absolute left-1/2 -translate-x-1/2 text-center max-w-md transition-all duration-300",
                        isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {module.title}
                        </p>
                    </div>

                    {/* Right: Progress + Sidebar Toggle */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Streak Badge */}
                        {userStreak && userStreak.currentStreak > 0 && (
                            <div className="hidden lg:flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1 border border-orange-100">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-xs font-semibold text-orange-600">
                                    {userStreak.currentStreak} day streak
                                </span>
                            </div>
                        )}

                        {/* Progress Pill */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                            <div className="relative w-5 h-5">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 20 20">
                                    <circle cx="10" cy="10" r="8" strokeWidth="2" fill="none" className="text-gray-200" stroke="currentColor" />
                                    <circle
                                        cx="10" cy="10" r="8" strokeWidth="2" fill="none"
                                        strokeDasharray={50.26} /* 2 * pi * 8 */
                                        strokeDashoffset={50.26 * (1 - courseProgressPercent / 100)}
                                        className="text-[#722f37]"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-xs font-bold text-gray-700">{courseProgressPercent}%</span>
                        </div>

                        {/* Course Content Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="gap-2 border-gray-200"
                        >
                            <Menu className="w-4 h-4" />
                            <span className="hidden sm:inline text-sm">Content</span>
                        </Button>

                    </div>
                </div>
            </header>

            {/* ===== MAIN LAYOUT ===== */}
            <div className="flex flex-1 relative">
                {/* ===== CONTENT AREA ===== */}
                <main className="flex-1 min-w-0">
                    {/* Video Section (if VIDEO lesson) */}
                    {lesson.lessonType === "VIDEO" && lesson.videoId && (
                        <div className="bg-black">
                            <div className="max-w-5xl mx-auto">
                                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                    {/* Placeholder for Wistia Player */}
                                    <div className="text-center text-white/60">
                                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm">Video Player: {lesson.videoId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Container - Full Width */}
                    <div className="w-full px-0 sm:px-4 lg:px-8 py-6">


                        {/* Lesson Content - Full Width, CSS handles inner content width */}
                        {lesson.content && (
                            <div className="w-full">
                                <div
                                    className="w-full prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: processLessonContent(lesson.content) }}
                                />
                            </div>
                        )}


                        {/* ===== NAVIGATION ===== */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-gray-200">
                            {navigation.prevLesson ? (
                                <Link href={`/learning/${course.slug}/${navigation.prevLesson.id}`} className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                                        <ChevronLeft className="w-5 h-5" />
                                        Previous
                                    </Button>
                                </Link>
                            ) : (
                                <div className="hidden sm:block" />
                            )}

                            {!localCompleted ? (
                                <Button
                                    size="lg"
                                    onClick={handleMarkComplete}
                                    disabled={isCompleting}
                                    className="gap-2 w-full sm:w-auto bg-[#722f37] hover:bg-[#5a252c] text-white"
                                >
                                    {isCompleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Complete & Continue
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Completed</span>
                                    </div>
                                    {navigation.isLastLessonInModule && navigation.moduleHasQuiz && quizData ? (
                                        <Button
                                            size="lg"
                                            onClick={() => {
                                                const quizSection = document.getElementById("inline-quiz-section");
                                                if (quizSection) {
                                                    quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
                                                }
                                            }}
                                            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            <Award className="w-5 h-5" />
                                            Take Quiz
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    ) : navigation.nextLesson ? (
                                        <Link href={`/learning/${course.slug}/${navigation.nextLesson.id}`}>
                                            <Button
                                                size="lg"
                                                className="gap-2 bg-[#722f37] hover:bg-[#5a252c] text-white"
                                            >
                                                Next Lesson
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Award className="w-5 h-5" />
                                            Course Complete!
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ===== INLINE QUIZ SECTION ===== */}
                        {quizData && navigation.isLastLessonInModule && localCompleted && (
                            <div id="inline-quiz-section" className="mt-8 pt-8 border-t border-gray-200 scroll-mt-24">
                                <InlineQuiz
                                    quiz={quizData.quiz}
                                    module={{ id: module.id, title: module.title, order: module.order }}
                                    course={{
                                        id: course.id,
                                        title: course.title,
                                        slug: course.slug,
                                        coach: course.coach ? {
                                            id: course.coach.id,
                                            firstName: course.coach.firstName || "",
                                            lastName: course.coach.lastName || "",
                                            avatar: course.coach.avatar || undefined,
                                        } : undefined,
                                    }}
                                    nextModule={quizData.nextModule}
                                    hasPassed={quizData.hasPassed}
                                    previousAttempts={quizData.previousAttempts}
                                />
                            </div>
                        )}

                        {/* ===== NOTES SECTION - Made Prominent ===== */}
                        <div className="mt-10 pt-10 border-t border-gray-200">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">My Study Notes</h3>
                                            <p className="text-sm text-gray-500">Take notes to reinforce your learning</p>
                                        </div>
                                    </div>
                                    <LessonNotes lessonId={lesson.id} lessonTitle={lesson.title} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>






                {/* ===== COACH SARAH LESSON HELPER ===== */}
                <SarahLessonBubble
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                    courseTitle={course.title}
                    moduleTitle={module.title}
                />
            </div>
        </div>
    );
}
