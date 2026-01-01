"use client";

import { useRouter } from "next/navigation";
import { WomensHealthLessonRouter } from "@/components/mini-diploma/lessons/womens-health/lesson-router";

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

export function WomensHealthLessonContainer({
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course: "womens-health",
          }),
        });
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  const handleNext = () => {
    if (lessonNumber < 9) {
      // Go to next lesson
      router.push(`/womens-health-diploma/lesson/${lessonNumber + 1}`);
    } else {
      // Final lesson - go to certificate/completion page
      router.push("/womens-health-diploma");
    }
  };

  return (
    <WomensHealthLessonRouter
      lessonNumber={lessonNumber}
      firstName={firstName}
      onComplete={handleComplete}
      onNext={handleNext}
      isCompleted={isCompleted}
    />
  );
}
