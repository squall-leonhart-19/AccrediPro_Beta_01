"use client";

import useSWR, { preload, mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Course structure data (modules, lessons list) - changes rarely
export function useCourseStructure(courseSlug: string) {
  return useSWR(
    courseSlug ? `/api/course/${courseSlug}/structure` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 300000, // 5 min deduplication
    }
  );
}

// Lesson content - specific lesson data
export function useLessonContent(courseSlug: string, lessonId: string) {
  return useSWR(
    courseSlug && lessonId ? `/api/course/${courseSlug}/lesson/${lessonId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 min
    }
  );
}

// User progress for a course
export function useUserProgress(courseId: string) {
  return useSWR(
    courseId ? `/api/user/progress/${courseId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 sec
    }
  );
}

// Prefetch next lesson when user is on current lesson
export function prefetchNextLesson(courseSlug: string, nextLessonId: string) {
  if (courseSlug && nextLessonId) {
    preload(`/api/course/${courseSlug}/lesson/${nextLessonId}`, fetcher);
  }
}

// Optimistic update for lesson completion
export function updateProgressOptimistically(
  courseId: string,
  lessonId: string,
  isCompleted: boolean
) {
  mutate(
    `/api/user/progress/${courseId}`,
    (current: any) => {
      if (!current) return current;
      return {
        ...current,
        lessonProgress: {
          ...current.lessonProgress,
          [lessonId]: { isCompleted },
        },
      };
    },
    { revalidate: false }
  );
}

// Invalidate course progress (after completion sync)
export function invalidateCourseProgress(courseId: string) {
  mutate(`/api/user/progress/${courseId}`);
}
