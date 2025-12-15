"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award, Loader2, Lock, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CompletionCelebration } from "./completion-celebration";
import { useAchievement } from "@/components/gamification/achievement-toast";

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
  canAccessNextLesson: boolean; // false if lesson is not complete and user hasn't completed current one
  bottomBar?: boolean; // If true, render only the next button for bottom bar
  showQuizButton?: boolean; // If true, show "Take Quiz" instead of "Next Lesson"
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
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const showGamificationAchievements = (data: { data?: { completedLessons?: number; courseCompleted?: boolean } }) => {
    // Show XP for lesson completion
    showAchievement({
      id: `xp-${lessonId}`,
      type: "xp",
      title: "Lesson Complete!",
      value: 25,
    });

    const newCompletedCount = data.data?.completedLessons || completedLessons + 1;
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
    if (data.data?.courseCompleted) {
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

  const handleNextClick = async () => {
    // If already completed, just navigate
    if (isCompleted) {
      // If showing quiz button, go to quiz instead of next lesson
      if (showQuizButton) {
        router.push(`/courses/${courseSlug}/quiz/${moduleId}`);
      } else if (nextLesson) {
        router.push(`/learning/${courseSlug}/${nextLesson.id}`);
      }
      return;
    }

    // Otherwise, mark as complete first then navigate
    setLoading(true);

    try {
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId, moduleId }),
      });

      if (response.ok) {
        const data = await response.json();

        // Show gamification achievements
        showGamificationAchievements(data);

        // Check if course was just completed
        if (data.data?.courseCompleted) {
          setShowCelebration(true);
          return; // Don't navigate, show celebration
        }

        // If showing quiz button, go to quiz instead of next lesson
        if (showQuizButton) {
          router.push(`/courses/${courseSlug}/quiz/${moduleId}`);
        } else if (nextLesson) {
          // Navigate to next lesson
          router.push(`/learning/${courseSlug}/${nextLesson.id}`);
        } else {
          // No next lesson - go back to course page
          router.push(`/courses/${courseSlug}`);
        }
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async () => {
    // Mark current lesson complete if not already
    if (!isCompleted) {
      setLoading(true);
      try {
        const response = await fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, courseId, moduleId }),
        });

        if (response.ok) {
          const data = await response.json();

          // Show gamification achievements
          showGamificationAchievements(data);

          if (data.data?.courseCompleted) {
            setShowCelebration(true);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to complete course:", error);
      } finally {
        setLoading(false);
      }
    }

    // If course was already complete, just go to course page
    router.push(`/courses/${courseSlug}`);
  };

  // Bottom bar variant - only renders the next button
  if (bottomBar) {
    return (
      <>
        <Button
          onClick={handleNextClick}
          disabled={loading}
          size="lg"
          className={showQuizButton
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all"
            : "bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg transition-all"
          }
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : showQuizButton ? (
            <>
              <ClipboardCheck className="w-5 h-5 mr-2" />
              {isCompleted ? "Take Quiz" : "Complete & Take Quiz"}
            </>
          ) : (
            <>
              {isCompleted ? "Next Lesson" : "Complete & Next"}
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
        {/* Previous Button */}
        {prevLesson ? (
          <Link href={`/learning/${courseSlug}/${prevLesson.id}`}>
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

        {/* Mobile Progress */}
        <div className="lg:hidden flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <span className="text-xs text-gray-600">
            {completedLessons}/{totalLessons}
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
            disabled={loading || (!canAccessNextLesson && !isCompleted)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : !canAccessNextLesson && !isCompleted ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Complete to Take Quiz</span>
                <span className="sm:hidden">Locked</span>
              </>
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {isCompleted ? "Take Module Quiz" : "Complete & Take Quiz"}
                </span>
                <span className="sm:hidden">
                  {isCompleted ? "Quiz" : "Quiz"}
                </span>
              </>
            )}
          </Button>
        ) : nextLesson ? (
          <Button
            onClick={handleNextClick}
            disabled={loading}
            className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {isCompleted ? "Next Lesson" : "Complete & Next"}
                </span>
                <span className="sm:hidden">
                  {isCompleted ? "Next" : "Next"}
                </span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleCompleteCourse}
            disabled={loading}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2" />
                {isCompleted ? "View Certificate" : "Complete Course"}
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
