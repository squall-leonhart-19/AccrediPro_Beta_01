"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Play,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  List,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
} from "lucide-react";
import type { LessonProgress } from "@prisma/client";

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: {
    id: string;
    title: string;
    order: number;
    videoDuration: number | null;
    isFreePreview: boolean;
    lessonType?: string;
  }[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

interface LessonSidebarProps {
  course: Course;
  currentLessonId: string;
  progressMap: Map<string, LessonProgress>;
  slug: string;
}

const lessonTypeIcons: Record<string, typeof Video> = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: ClipboardList,
  LIVE_SESSION: Video,
};

export function LessonSidebar({
  course,
  currentLessonId,
  progressMap,
  slug,
}: LessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map((m) => m.id)
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedTotal = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => progressMap.get(l.id)?.isCompleted).length,
    0
  );
  const overallProgress = totalLessons > 0 ? (completedTotal / totalLessons) * 100 : 0;

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 hover:from-gold-500 hover:to-gold-600 rounded-full w-14 h-14 shadow-xl shadow-gold-500/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-80 bg-white border-l border-gray-200 overflow-y-auto transition-all duration-300",
          "fixed lg:relative inset-y-0 right-0 z-40",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
        style={{ height: "calc(100vh - 57px)", top: "57px" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-burgundy-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Course Content</h3>
              <p className="text-xs text-gray-500">
                {completedTotal} of {totalLessons} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress
              value={overallProgress}
              className="flex-1 h-2 bg-gray-200"
            />
            <span className="text-xs font-semibold text-burgundy-600">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>

        {/* Modules */}
        <div className="divide-y divide-gray-100">
          {course.modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.includes(module.id);
            const completedLessons = module.lessons.filter(
              (l) => progressMap.get(l.id)?.isCompleted
            ).length;
            const moduleProgress = module.lessons.length > 0
              ? (completedLessons / module.lessons.length) * 100
              : 0;

            return (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center text-sm font-semibold text-burgundy-600">
                    {moduleIndex + 1}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight mb-1 pr-4">
                      {module.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px]">
                        <Progress
                          value={moduleProgress}
                          className="h-1 bg-gray-200"
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {completedLessons}/{module.lessons.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="pb-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const progress = progressMap.get(lesson.id);
                      const isCompleted = progress?.isCompleted;
                      const isCurrent = lesson.id === currentLessonId;
                      const LessonIcon = lessonTypeIcons[lesson.lessonType || "VIDEO"] || Video;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${slug}/learn/${lesson.id}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 ml-4 mr-2 rounded-xl transition-all",
                            isCurrent
                              ? "bg-burgundy-50 border border-burgundy-200"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                              isCompleted
                                ? "bg-green-100"
                                : isCurrent
                                ? "bg-burgundy-100"
                                : "bg-gray-100"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : isCurrent ? (
                              <Play className="w-4 h-4 text-burgundy-600" />
                            ) : (
                              <LessonIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm leading-tight",
                                isCurrent
                                  ? "text-gray-900 font-medium"
                                  : isCompleted
                                  ? "text-green-700"
                                  : "text-gray-600"
                              )}
                            >
                              {lesson.title}
                            </p>
                            {lesson.videoDuration && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDuration(lesson.videoDuration)}
                              </p>
                            )}
                          </div>
                          {isCurrent && (
                            <div className="w-2 h-2 rounded-full bg-burgundy-600 animate-pulse flex-shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
