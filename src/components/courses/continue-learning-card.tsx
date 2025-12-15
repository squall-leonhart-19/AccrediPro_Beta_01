"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  BookOpen,
  Clock,
  ArrowRight,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContinueLearningCardProps {
  courseTitle: string;
  courseSlug: string;
  courseThumbnail?: string;
  moduleName: string;
  lessonTitle: string;
  lessonId: string;
  lessonType: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
  lastVisited: Date;
  moduleProgress: number; // percentage
  moduleCompleted: number;
  moduleTotal: number;
  estimatedTimeRemaining?: number; // minutes
}

export function ContinueLearningCard({
  courseTitle,
  courseSlug,
  courseThumbnail,
  moduleName,
  lessonTitle,
  lessonId,
  lessonType,
  lastVisited,
  moduleProgress,
  moduleCompleted,
  moduleTotal,
  estimatedTimeRemaining,
}: ContinueLearningCardProps) {
  const lessonTypeIcon =
    lessonType === "VIDEO" ? (
      <Play className="w-4 h-4" />
    ) : (
      <BookOpen className="w-4 h-4" />
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Course Header with Thumbnail */}
      <div className="relative h-32 bg-gradient-to-r from-burgundy-600 to-burgundy-700 overflow-hidden">
        {courseThumbnail && (
          <img
            src={courseThumbnail}
            alt={courseTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span className="text-xs text-burgundy-200 font-medium">
              Continue Learning
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg truncate">
              {courseTitle}
            </h3>
            <p className="text-burgundy-200 text-sm truncate">{moduleName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Current Lesson */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center text-burgundy-600">
            {lessonTypeIcon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {lessonTitle}
            </p>
            <p className="text-xs text-gray-500">
              Last visited {formatDistanceToNow(new Date(lastVisited))} ago
            </p>
          </div>
        </div>

        {/* Module Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Module Progress</span>
            <span className="font-medium text-burgundy-600">
              {moduleCompleted}/{moduleTotal} lessons
            </span>
          </div>
          <Progress value={moduleProgress} className="h-2" />
        </div>

        {/* Time Remaining */}
        {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>~{estimatedTimeRemaining} min remaining in module</span>
          </div>
        )}

        {/* CTA Button */}
        <Link href={`/learning/${courseSlug}/${lessonId}`}>
          <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white">
            Continue Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Compact version for sidebar or header
export function ContinueLearningBanner({
  courseTitle,
  courseSlug,
  lessonTitle,
  lessonId,
  moduleName,
}: {
  courseTitle: string;
  courseSlug: string;
  lessonTitle: string;
  lessonId: string;
  moduleName: string;
}) {
  return (
    <Link
      href={`/learning/${courseSlug}/${lessonId}`}
      className="flex items-center gap-3 p-3 bg-gradient-to-r from-burgundy-50 to-burgundy-100 border border-burgundy-200 rounded-xl hover:from-burgundy-100 hover:to-burgundy-150 transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-burgundy-600 flex items-center justify-center text-white flex-shrink-0">
        <Bookmark className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-burgundy-600 font-medium">
          Continue where you left off
        </p>
        <p className="text-sm font-medium text-gray-900 truncate">
          {lessonTitle}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {courseTitle} - {moduleName}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-burgundy-400 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
