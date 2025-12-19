"use client";

import { useRouter } from "next/navigation";
import { LessonRouter } from "@/components/mini-diploma/lessons/lesson-router";

interface LessonContainerProps {
  lessonNumber: number;
  lessonId: string;
  firstName: string;
  isCompleted: boolean;
  userId: string;
  enrollmentId: string;
  courseId: string;
  moduleId: string;
}

export function LessonContainer({
  lessonNumber,
  lessonId,
  firstName,
  isCompleted,
  courseId,
  moduleId,
}: LessonContainerProps) {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Mark lesson as complete using the existing progress API
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          moduleId,
        }),
      });

      const data = await response.json();

      // If all 9 lessons are complete, trigger mini diploma completion
      if (data.success && lessonNumber === 9) {
        await fetch("/api/mini-diploma/complete", {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  const handleNext = () => {
    if (lessonNumber < 9) {
      // Go to next lesson
      router.push(`/mini-diploma/lesson/${lessonNumber + 1}`);
    } else {
      // Final lesson - go to certificate/completion page
      router.push("/mini-diploma");
    }
  };

  return (
    <LessonRouter
      lessonNumber={lessonNumber}
      firstName={firstName}
      onComplete={handleComplete}
      onNext={handleNext}
      isCompleted={isCompleted}
    />
  );
}
