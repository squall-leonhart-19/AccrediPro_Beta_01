"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { LessonNavigation } from "./lesson-navigation";
import { MarkCompleteButton } from "./mark-complete-button";

interface BottomLessonNavProps {
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
  currentIndex: number;
}

export function BottomLessonNav({
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
  currentIndex,
}: BottomLessonNavProps) {
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-shrink-0">
          {prevLesson ? (
            <Link href={`/courses/${courseSlug}/learn/${prevLesson.id}`}>
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

        {/* Center: Progress */}
        <div className="flex-1 max-w-xs text-center hidden sm:block">
          <p className="text-sm text-gray-600 mb-1">
            Lesson {currentIndex + 1} of {totalLessons}
          </p>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Next/Complete */}
        <div className="flex-shrink-0">
          {nextLesson ? (
            <LessonNavigation
              courseSlug={courseSlug}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
              courseName={courseName}
              prevLesson={null}
              nextLesson={nextLesson}
              isCompleted={isCompleted}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
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
              lessonNumber={currentIndex + 1}
              totalLessons={totalLessons}
            />
          )}
        </div>
      </div>
    </div>
  );
}
