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
  userId,
  courseId,
}: LessonContainerProps) {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Save lesson completion using user tags API
      await fetch("/api/user/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: `wh-lesson-complete:${lessonNumber}`,
          value: new Date().toISOString(),
        }),
      });

      // Trigger auto-DM for milestone lessons (3, 6, 9)
      if (lessonNumber === 3 || lessonNumber === 6 || lessonNumber === 9) {
        await fetch("/api/auto-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trigger: "wh_lesson_complete",
            triggerValue: lessonNumber.toString(),
          }),
        });
      }

      // If all 9 lessons are complete, trigger mini diploma completion
      if (lessonNumber === 9) {
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
      // Final lesson - handleComplete is awaited before this is called
      router.push("/womens-health-diploma/complete");
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
