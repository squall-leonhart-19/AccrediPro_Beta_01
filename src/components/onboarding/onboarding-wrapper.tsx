"use client";

import { useState, useEffect } from "react";
import { Walkthrough } from "./walkthrough";

interface OnboardingWrapperProps {
  children: React.ReactNode;
  hasCompletedOnboarding: boolean;
  userName: string;
  coachName?: string;
}

export function OnboardingWrapper({
  children,
  hasCompletedOnboarding,
  userName,
  coachName,
}: OnboardingWrapperProps) {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to let the page render first
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => setShowWalkthrough(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

  const handleComplete = () => {
    setShowWalkthrough(false);
  };

  return (
    <>
      {children}
      {isClient && showWalkthrough && (
        <Walkthrough
          userName={userName}
          coachName={coachName}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
