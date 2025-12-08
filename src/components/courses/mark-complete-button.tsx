"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompletionCelebration } from "./completion-celebration";
import { useAchievement } from "@/components/gamification/achievement-toast";

interface MarkCompleteButtonProps {
  lessonId: string;
  courseId: string;
  moduleId: string;
  isCompleted: boolean;
  courseName?: string;
  courseSlug?: string;
  lessonNumber?: number;
  totalLessons?: number;
}

export function MarkCompleteButton({
  lessonId,
  courseId,
  moduleId,
  isCompleted: initialCompleted,
  courseName = "",
  courseSlug = "",
  lessonNumber = 1,
  totalLessons = 1,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const { showAchievement } = useAchievement();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);

    try {
      const endpoint = isCompleted ? "/api/progress/uncomplete" : "/api/progress/complete";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId, moduleId }),
      });

      if (response.ok) {
        const data = await response.json();
        const wasNotCompleted = !isCompleted;
        setIsCompleted(!isCompleted);

        // Show gamification elements when completing (not uncompleting)
        if (wasNotCompleted) {
          // Always show XP for lesson completion
          showAchievement({
            id: `xp-${lessonId}`,
            type: "xp",
            title: "Lesson Complete!",
            value: 25,
          });

          // Check for milestone achievements
          const newCompletedCount = (data.data?.completedLessons || lessonNumber);
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

          // Module completion (every 5 lessons roughly)
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
        }

        // Check if course was just completed
        if (data.data?.courseCompleted) {
          setShowCelebration(true);
          // Show level up achievement for course completion
          setTimeout(() => {
            showAchievement({
              id: `course-complete-${courseId}`,
              type: "levelup",
              title: "Course Mastered!",
              description: `You've completed ${courseName}`,
            });
          }, 500);
        }

        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || isPending;

  return (
    <>
      <Button
        onClick={toggleComplete}
        disabled={isLoading}
        className={cn(
          "relative overflow-hidden transition-all duration-300 font-medium shadow-lg",
          isCompleted
            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/20"
            : "bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white shadow-burgundy-900/30"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </>
        ) : (
          <>
            <Circle className="w-4 h-4 mr-2" />
            Mark Complete
          </>
        )}
      </Button>

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        courseName={courseName}
        courseSlug={courseSlug}
      />
    </>
  );
}
