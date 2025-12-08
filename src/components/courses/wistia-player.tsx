"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

interface WistiaPlayerProps {
  videoId: string;
  lessonId: string;
  courseId: string;
}

declare global {
  interface Window {
    _wq: Array<{
      id: string;
      onReady: (video: WistiaVideo) => void;
    }>;
  }
}

interface WistiaVideo {
  bind: (event: string, callback: (...args: unknown[]) => void) => void;
  unbind: (event: string) => void;
  time: () => number;
  duration: () => number;
  percentWatched: () => number;
}

export function WistiaPlayer({ videoId, lessonId, courseId }: WistiaPlayerProps) {
  const videoRef = useRef<WistiaVideo | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const hasReportedCompletionRef = useRef(false);

  const updateProgress = useCallback(async (watchTime: number, position: number) => {
    try {
      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          watchTime: Math.round(watchTime),
          lastPosition: Math.round(position),
        }),
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }, [lessonId, courseId]);

  const markComplete = useCallback(async () => {
    if (hasReportedCompletionRef.current) return;
    hasReportedCompletionRef.current = true;

    try {
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId }),
      });
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
      hasReportedCompletionRef.current = false;
    }
  }, [lessonId, courseId]);

  useEffect(() => {
    window._wq = window._wq || [];

    window._wq.push({
      id: videoId,
      onReady: (video: WistiaVideo) => {
        videoRef.current = video;

        // Track time updates (every 30 seconds)
        video.bind("timechange", (time: unknown) => {
          const currentTime = time as number;
          if (currentTime - lastUpdateRef.current >= 30) {
            updateProgress(currentTime, currentTime);
            lastUpdateRef.current = currentTime;
          }
        });

        // Track video end
        video.bind("end", () => {
          const duration = video.duration();
          updateProgress(duration, duration);
          markComplete();
        });

        // Track 90% completion
        video.bind("percentwatchedchanged", (percent: unknown) => {
          const percentWatched = percent as number;
          if (percentWatched >= 0.9) {
            markComplete();
          }
        });

        // Save progress on pause
        video.bind("pause", () => {
          const currentTime = video.time();
          updateProgress(currentTime, currentTime);
        });
      },
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.unbind("timechange");
        videoRef.current.unbind("end");
        videoRef.current.unbind("percentwatchedchanged");
        videoRef.current.unbind("pause");
      }
    };
  }, [videoId, updateProgress, markComplete]);

  return (
    <>
      <Script
        src="https://fast.wistia.com/assets/external/E-v1.js"
        strategy="afterInteractive"
      />
      <div className="wistia-responsive">
        <div
          className={`wistia_embed wistia_async_${videoId} videoFoam=true`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
}
