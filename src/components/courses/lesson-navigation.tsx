"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award, Loader2, Lock, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CompletionCelebration } from "./completion-celebration";
import { useAchievement } from "@/components/gamification/achievement-toast";
import { prefetchNextLesson } from "@/hooks/use-course-data";

interface LessonNavigationProps {
  courseSlug: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  courseName: string;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
  canAccessNextLesson: boolean;
  bottomBar?: boolean;
  showQuizButton?: boolean;
}

export function LessonNavigation({
  courseSlug,
  courseId,
  moduleId,
  lessonId,
  courseName,
  prevLesson,
  nextLesson,
  isCompleted,
  completedLessons,
  totalLessons,
  canAccessNextLesson,
  bottomBar = false,
  showQuizButton = false,
}: LessonNavigationProps) {
  const router = useRouter();
  const { showAchievement } = useAchievement();
  const [isPending, startTransition] = useTransition();
  const [showCelebration, setShowCelebration] = useState(false);
  // OPTIMISTIC STATE: Track completion locally for instant UI
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);
  const [optimisticCount, setOptimisticCount] = useState(completedLessons);

  // PREFETCH: Preload next lesson data when component mounts
  useEffect(() => {
    if (nextLesson?.id) {
      prefetchNextLesson(courseSlug, nextLesson.id);
    }
  }, [courseSlug, nextLesson?.id]);

  const progressPercentage = totalLessons > 0 ? (optimisticCount / totalLessons) * 100 : 0;

  const showGamificationAchievements = (newCompletedCount: number, courseCompleted?: boolean) => {
    // Show XP for lesson completion
    showAchievement({
      id: `xp-${lessonId}`,
      type: "xp",
      title: "Lesson Complete!",
      value: 25,
    });

    const progress = Math.round((newCompletedCount / totalLessons) * 100);

    // First lesson badge
    if (newCompletedCount === 1) {
      setTimeout(() => {
        showAchievement({
          id: "first-lesson",
          type: "badge",
          title: "First Step!",
          description: "Completed your first lesson",
          icon: "🎯",
        });
      }, 1500);
    }

    // Module completion (every 5 lessons)
    if (newCompletedCount % 5 === 0 && newCompletedCount > 0) {
      setTimeout(() => {
        showAchievement({
          id: `milestone-${newCompletedCount}`,
          type: "milestone",
          title: `${newCompletedCount} Lessons Done!`,
          description: "Keep up the momentum!",
        });
      }, 1500);
    }

    // Progress milestones
    if (progress === 25 || progress === 50 || progress === 75) {
      setTimeout(() => {
        showAchievement({
          id: `progress-${progress}`,
          type: "badge",
          title: `${progress}% Complete!`,
          description: `You're ${progress === 75 ? "almost there" : "making great progress"}!`,
          icon: progress === 25 ? "🌟" : progress === 50 ? "⭐" : "🔥",
        });
      }, 2000);
    }

    // Course completion
    if (courseCompleted) {
      setTimeout(() => {
        showAchievement({
          id: `course-complete-${courseId}`,
          type: "levelup",
          title: "Course Mastered!",
          description: `You've completed ${courseName}`,
        });
      }, 500);
    }
  };

  const scrollToQuiz = () => {
    // Find and scroll to the quiz section on the same page
    const quizSection = document.querySelector('[class*="scroll-mt-24"]');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextClick = async () => {
    // If showing quiz button, scroll to quiz section instead of navigating
    if (showQuizButton) {
      // Mark lesson as complete if not already
      if (!optimisticCompleted) {
        const newCount = optimisticCount + 1;
        setOptimisticCompleted(true);
        setOptimisticCount(newCount);
        showGamificationAchievements(newCount);

        // Sync to database in background
        fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, courseId, moduleId }),
        }).catch((error) => {
          console.error("Background sync failed:", error);
        });
      }

      // Scroll to quiz section
      scrollToQuiz();
      return;
    }

    // If already completed, just navigate instantly
    if (optimisticCompleted) {
      if (nextLesson) {
        router.push(`/learning/${courseSlug}/${nextLesson.id}`);
      }
      return;
    }

    // OPTIMISTIC UI: Update state immediately, navigate instantly
    const newCount = optimisticCount + 1;
    setOptimisticCompleted(true);
    setOptimisticCount(newCount);

    // Show achievements immediately
    showGamificationAchievements(newCount);

    // Navigate immediately (don't wait for API)
    if (nextLesson) {
      startTransition(() => {
        router.push(`/learning/${courseSlug}/${nextLesson.id}`);
      });
    } else {
      startTransition(() => {
        router.push(`/courses/${courseSlug}`);
      });
    }

    // Sync to database in background (fire and forget)
    fetch("/api/progress/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, courseId, moduleId }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        if (data.data?.courseCompleted) {
          setShowCelebration(true);
        }
      }
    }).catch((error) => {
      console.error("Background sync failed:", error);
    });
  };

  const handleCompleteCourse = async () => {
    if (!optimisticCompleted) {
      // Optimistic update
      const newCount = optimisticCount + 1;
      setOptimisticCompleted(true);
      setOptimisticCount(newCount);
      showGamificationAchievements(newCount, true);

      // Background sync
      fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId, moduleId }),
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          if (data.data?.courseCompleted) {
            setShowCelebration(true);
            return;
          }
        }
        router.push(`/courses/${courseSlug}`);
      }).catch(() => {
        router.push(`/courses/${courseSlug}`);
      });
    } else {
      router.push(`/courses/${courseSlug}`);
    }
  };

  // Bottom bar variant - only renders the next button
  // Don't show button if there's a quiz - user will use the Continue button in quiz results
  if (bottomBar) {
    if (showQuizButton) {
      // Return empty for quiz pages - the quiz component has its own continue button
      return null;
    }

    return (
      <>
        <Button
          onClick={handleNextClick}
          disabled={isPending}
          size="lg"
          className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              {optimisticCompleted ? "Next Lesson" : "Complete & Next"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Celebration Modal */}
        <CompletionCelebration
          isOpen={showCelebration}
          onClose={() => {
            setShowCelebration(false);
            router.push(`/courses/${courseSlug}`);
          }}
          courseName={courseName}
          courseSlug={courseSlug}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        {/* Previous Button - with prefetch for instant navigation */}
        {prevLesson ? (
          <Link href={`/learning/${courseSlug}/${prevLesson.id}`} prefetch={true}>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous Lesson</span>
              <span className="sm:hidden">Prev</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {/* Mobile Progress - uses optimistic count */}
        <div className="lg:hidden flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <span className="text-xs text-gray-600">
            {optimisticCount}/{totalLessons}
          </span>
          <Progress
            value={progressPercentage}
            className="w-16 h-1.5 bg-gray-200"
          />
        </div>

        {/* Next/Complete/Quiz Button */}
        {showQuizButton ? (
          <Button
            onClick={handleNextClick}
            disabled={isPending || (!canAccessNextLesson && !optimisticCompleted)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : !canAccessNextLesson && !optimisticCompleted ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Complete to Take Quiz</span>
                <span className="sm:hidden">Locked</span>
              </>
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {optimisticCompleted ? "Take Module Quiz" : "Complete & Take Quiz"}
                </span>
                <span className="sm:hidden">Quiz</span>
              </>
            )}
          </Button>
        ) : nextLesson ? (
          <Button
            onClick={handleNextClick}
            disabled={isPending}
            className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {optimisticCompleted ? "Next Lesson" : "Complete & Next"}
                </span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleCompleteCourse}
            disabled={isPending}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2" />
                {optimisticCompleted ? "View Certificate" : "Complete Course"}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          router.push(`/courses/${courseSlug}`);
        }}
        courseName={courseName}
        courseSlug={courseSlug}
      />
    </>
  );
}
