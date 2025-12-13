"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InteractiveTour } from "@/components/ui/interactive-tour";

interface OnboardingWrapperProps {
  children: React.ReactNode;
  hasCompletedOnboarding: boolean;
  userName: string;
  coachName?: string;
  userId: string;
}

export function OnboardingWrapper({
  children,
  hasCompletedOnboarding,
  userName,
  coachName,
  userId,
}: OnboardingWrapperProps) {
  const [showTour, setShowTour] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Check if tour was already completed
    const tourComplete = localStorage.getItem(`tour-complete-${userId}`) === "true";

    // Show tour if onboarding not complete AND tour not completed
    if (!hasCompletedOnboarding && !tourComplete) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, userId]);

  const handleComplete = () => {
    setShowTour(false);
    router.push("/start-here");
  };

  const handleSkip = () => {
    setShowTour(false);
    router.push("/start-here");
  };

  return (
    <>
      {children}
      {isClient && showTour && (
        <InteractiveTour
          onComplete={handleComplete}
          onSkip={handleSkip}
          userId={userId}
        />
      )}
    </>
  );
}
