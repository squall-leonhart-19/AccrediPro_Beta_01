"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  ChevronRight,
  ChevronDown,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  lessonType: string;
  videoDuration: number | null;
  isFreePreview: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

interface LessonProgress {
  isCompleted: boolean;
  watchTime?: number;
  lastPosition?: number;
}

interface CourseCurriculumAccordionProps {
  modules: Module[];
  courseSlug: string;
  isEnrolled: boolean;
  progressMap: Record<string, LessonProgress>;
}

const lessonTypeIcons: Record<string, typeof Video> = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: ClipboardList,
  LIVE_SESSION: Video,
};

export function CourseCurriculumAccordion({
  modules,
  courseSlug,
  isEnrolled,
  progressMap,
}: CourseCurriculumAccordionProps) {
  // First 2 modules open by default
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(modules.slice(0, 2).map((m) => m.id))
  );

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-burgundy-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
            <p className="text-sm text-gray-500">
              {modules.length} modules, {totalLessons} lessons
            </p>
          </div>
        </div>
      </div>

      <div>
        {modules.map((module, moduleIndex) => {
          const isOpen = openModules.has(module.id);
          const moduleCompleted = module.lessons.filter(
            (l) => progressMap[l.id]?.isCompleted
          ).length;
          const moduleProgress =
            module.lessons.length > 0
              ? (moduleCompleted / module.lessons.length) * 100
              : 0;

          return (
            <div key={module.id} className="border-b border-gray-100 last:border-0">
              {/* Module Header - Clickable */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-5 bg-gradient-to-r from-burgundy-50/50 to-transparent hover:from-burgundy-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-burgundy-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {moduleIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {module.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Progress
                        value={moduleProgress}
                        className="w-24 h-1.5 bg-burgundy-100"
                      />
                      <span className="text-xs text-gray-500">
                        {moduleCompleted}/{module.lessons.length} completed
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {module.lessons.length} lessons
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform" />
                    )}
                  </div>
                </div>
              </button>

              {/* Lessons - Collapsible */}
              {isOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  {module.lessons.map((lesson) => {
                    const progress = progressMap[lesson.id];
                    const isCompleted = progress?.isCompleted;
                    const isAccessible = isEnrolled || lesson.isFreePreview;
                    const LessonIcon = lessonTypeIcons[lesson.lessonType] || Video;

                    return (
                      <div key={lesson.id}>
                        {isAccessible ? (
                          <Link
                            href={`/learning/${courseSlug}/${lesson.id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group ml-14"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                isCompleted
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-500 group-hover:bg-burgundy-100 group-hover:text-burgundy-600"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <LessonIcon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium ${
                                  isCompleted ? "text-green-700" : "text-gray-900"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                {lesson.videoDuration && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(lesson.videoDuration)}
                                  </span>
                                )}
                                {lesson.isFreePreview && !isEnrolled && (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                    Free Preview
                                  </Badge>
                                )}
                                {lesson.lessonType !== "VIDEO" && (
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.lessonType.charAt(0) +
                                      lesson.lessonType
                                        .slice(1)
                                        .toLowerCase()
                                        .replace("_", " ")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                          </Link>
                        ) : (
                          <div className="flex items-center gap-4 px-5 py-4 opacity-60 ml-14">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-600">
                                {lesson.title}
                              </p>
                              {lesson.videoDuration && (
                                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(lesson.videoDuration)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
