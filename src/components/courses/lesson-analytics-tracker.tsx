"use client";

import { useEffect, useRef, useCallback } from "react";

interface LessonAnalyticsTrackerProps {
  lessonId: string;
  courseId: string;
  lessonType: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
}

export function LessonAnalyticsTracker({
  lessonId,
  courseId,
  lessonType,
}: LessonAnalyticsTrackerProps) {
  const startTimeRef = useRef<number>(Date.now());
  const lastUpdateRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const hasIncrementedVisitRef = useRef<boolean>(false);

  // Track scroll depth for text lessons
  const trackScrollDepth = useCallback(() => {
    if (lessonType !== "TEXT") return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    const scrollPercent = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );

    if (scrollPercent > maxScrollRef.current) {
      maxScrollRef.current = scrollPercent;
    }
  }, [lessonType]);

  // Send analytics update
  const sendUpdate = useCallback(
    async (options?: { incrementVisit?: boolean; final?: boolean }) => {
      const now = Date.now();
      const timeSpent = Math.round((now - lastUpdateRef.current) / 1000); // seconds

      // Only send if there's meaningful time (> 5 seconds or it's a final update)
      if (timeSpent < 5 && !options?.final && !options?.incrementVisit) {
        return;
      }

      try {
        await fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            courseId,
            timeSpent: options?.final ? timeSpent : timeSpent,
            scrollDepth: lessonType === "TEXT" ? maxScrollRef.current : undefined,
            incrementVisit: options?.incrementVisit,
          }),
        });
        lastUpdateRef.current = now;
      } catch (error) {
        console.error("Failed to update analytics:", error);
      }
    },
    [lessonId, courseId, lessonType]
  );

  // Track page visibility changes
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Page is hidden - save progress
      sendUpdate({ final: true });
    } else {
      // Page is visible again - reset timer
      lastUpdateRef.current = Date.now();
    }
  }, [sendUpdate]);

  // Track when user leaves page
  const handleBeforeUnload = useCallback(() => {
    sendUpdate({ final: true });
  }, [sendUpdate]);

  useEffect(() => {
    // Increment visit count on first load
    if (!hasIncrementedVisitRef.current) {
      hasIncrementedVisitRef.current = true;
      sendUpdate({ incrementVisit: true });
    }

    // Set up scroll tracking for text lessons
    if (lessonType === "TEXT") {
      window.addEventListener("scroll", trackScrollDepth, { passive: true });
      trackScrollDepth(); // Initial check
    }

    // Track visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Periodic update every 30 seconds
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        sendUpdate();
      }
    }, 30000);

    return () => {
      // Cleanup
      if (lessonType === "TEXT") {
        window.removeEventListener("scroll", trackScrollDepth);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalId);

      // Final update on unmount
      sendUpdate({ final: true });
    };
  }, [
    lessonType,
    trackScrollDepth,
    handleVisibilityChange,
    handleBeforeUnload,
    sendUpdate,
  ]);

  // This is an invisible tracker component
  return null;
}
