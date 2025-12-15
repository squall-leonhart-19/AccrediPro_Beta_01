"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ClipboardList } from "lucide-react";
import confetti from "canvas-confetti";

interface CompleteAndQuizButtonProps {
  lessonId: string;
  courseId: string;
  moduleId: string;
  isCompleted: boolean;
  courseName: string;
}

export function CompleteAndQuizButton({
  lessonId,
  courseId,
  moduleId,
  isCompleted,
  courseName,
}: CompleteAndQuizButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const scrollToQuiz = () => {
    // Find the quiz section and scroll to it
    const quizSection = document.getElementById("inline-quiz-section");
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClick = async () => {
    if (completed) {
      // Already completed, just scroll to quiz
      scrollToQuiz();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          moduleId,
        }),
      });

      if (response.ok) {
        setCompleted(true);

        // Small celebration
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#7c2d12", "#991b1b", "#b91c1c"],
        });

        // Refresh to show the quiz and scroll to it
        router.refresh();

        // Wait a bit for the page to refresh then scroll
        setTimeout(() => {
          scrollToQuiz();
        }, 500);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size="lg"
      className={
        completed
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
          : "bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold shadow-lg"
      }
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Completing...
        </>
      ) : completed ? (
        <>
          <ClipboardList className="w-5 h-5 mr-2" />
          Start Quiz
        </>
      ) : (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Complete & Start Quiz
        </>
      )}
    </Button>
  );
}
