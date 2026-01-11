"use client";
import React from "react";

interface OnboardingWrapperProps {
  children: React.ReactNode;
  hasCompletedOnboarding: boolean;
  userName: string;
  coachName?: string;
  userId: string;
}

export function OnboardingWrapper({
  children,
}: OnboardingWrapperProps) {
  // Tour removed as per user request
  return <>{children}</>;
}

