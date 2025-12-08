"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompletionCelebration } from "./completion-celebration";

interface MarkCompleteButtonProps {
  lessonId: string;
  courseId: string;
  moduleId: string;
  isCompleted: boolean;
  courseName?: string;
  courseSlug?: string;
}

export function MarkCompleteButton({
  lessonId,
  courseId,
  moduleId,
  isCompleted: initialCompleted,
  courseName = "",
  courseSlug = "",
}: MarkCompleteButtonProps) {
  const router = useRouter();
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
        setIsCompleted(!isCompleted);

        // Check if course was just completed
        if (data.data?.courseCompleted) {
          setShowCelebration(true);
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
