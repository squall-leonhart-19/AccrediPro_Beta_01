"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Award, ClipboardCheck } from "lucide-react";
import { LessonNavigation } from "./lesson-navigation";
import { MarkCompleteButton } from "./mark-complete-button";
import { CompleteAndQuizButton } from "./complete-and-quiz-button";

interface BottomLessonNavProps {
  courseSlug: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  courseName: string;
  moduleName: string;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string; moduleId?: string } | null;
  isCompleted: boolean;
  moduleProgress: { total: number; completed: number };
  lessonIndexInModule: number;
  isLastLessonInModule?: boolean;
  moduleHasQuiz?: boolean;
}

export function BottomLessonNav({
  courseSlug,
  courseId,
  moduleId,
  lessonId,
  courseName,
  moduleName,
  prevLesson,
  nextLesson,
  isCompleted,
  moduleProgress,
  lessonIndexInModule,
  isLastLessonInModule = false,
  moduleHasQuiz = false,
}: BottomLessonNavProps) {
  const progressPercentage = moduleProgress.total > 0
    ? (moduleProgress.completed / moduleProgress.total) * 100
    : 0;

  // Determine if we should show "Take Quiz" button instead of "Next Lesson"
  // This happens when:
  // 1. This is the last lesson in the module
  // 2. The module has a published quiz
  // 3. The next lesson is in a different module (or there's no next lesson)
  const shouldShowQuizButton = isLastLessonInModule && moduleHasQuiz;

  // Check if next lesson is in the same module or different
  const nextLessonInDifferentModule = nextLesson && nextLesson.moduleId !== moduleId;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-shrink-0">
          {prevLesson ? (
            <Link href={`/learning/${courseSlug}/${prevLesson.id}`}>
              <Button variant="outline" size="lg" className="border-gray-300">
                <ChevronLeft className="w-5 h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="lg" disabled className="border-gray-200 opacity-50">
              <ChevronLeft className="w-5 h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}
        </div>

        {/* Center: Module Progress */}
        <div className="flex-1 max-w-xs text-center hidden sm:block">
          <p className="text-sm text-gray-600 mb-1">
            Lesson {lessonIndexInModule + 1} of {moduleProgress.total}
          </p>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Next/Complete/Quiz */}
        <div className="flex-shrink-0">
          {shouldShowQuizButton ? (
            // Show "Complete & Start Quiz" button for last lesson in module with quiz
            <CompleteAndQuizButton
              lessonId={lessonId}
              courseId={courseId}
              moduleId={moduleId}
              isCompleted={isCompleted}
              courseName={courseName}
            />
          ) : nextLesson ? (
            <LessonNavigation
              courseSlug={courseSlug}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
              courseName={courseName}
              prevLesson={null}
              nextLesson={nextLesson}
              isCompleted={isCompleted}
              completedLessons={moduleProgress.completed}
              totalLessons={moduleProgress.total}
              canAccessNextLesson={isCompleted}
              bottomBar
            />
          ) : (
            <MarkCompleteButton
              lessonId={lessonId}
              courseId={courseId}
              moduleId={moduleId}
              isCompleted={isCompleted}
              courseName={courseName}
              courseSlug={courseSlug}
              lessonNumber={lessonIndexInModule + 1}
              totalLessons={moduleProgress.total}
            />
          )}
        </div>
      </div>
    </div>
  );
}
