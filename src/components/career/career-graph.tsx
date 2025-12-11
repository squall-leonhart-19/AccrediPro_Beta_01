"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Star,
  Lock,
  CheckCircle,
  ChevronRight,
  Award,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CourseNode {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  difficulty: string;
  certificateType: string;
  category: { id: string; name: string } | null;
  duration: number | null;
  prerequisites?: string[];
  isEnrolled: boolean;
  isCompleted: boolean;
  progress: number;
}

interface CareerGraphProps {
  courses: CourseNode[];
  userLevel: number;
  totalPoints: number;
  completedCourses: number;
}

export function CareerGraph({ courses, userLevel, totalPoints, completedCourses }: CareerGraphProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"path" | "grid">("path");

  // Group courses by difficulty level (career stage)
  const coursesByStage = useMemo(() => {
    const stages = {
      BEGINNER: { label: "Foundation", description: "Build your knowledge base", icon: BookOpen, courses: [] as CourseNode[] },
      INTERMEDIATE: { label: "Growth", description: "Expand your expertise", icon: TrendingUp, courses: [] as CourseNode[] },
      ADVANCED: { label: "Mastery", description: "Achieve professional excellence", icon: Star, courses: [] as CourseNode[] },
      EXPERT: { label: "Leadership", description: "Become an industry leader", icon: Award, courses: [] as CourseNode[] },
    };

    courses.forEach((course) => {
      if (stages[course.difficulty as keyof typeof stages]) {
        stages[course.difficulty as keyof typeof stages].courses.push(course);
      }
    });

    return stages;
  }, [courses]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    courses.forEach((c) => {
      if (c.category) {
        cats.set(c.category.id, c.category.name);
      }
    });
    return Array.from(cats.entries()).map(([id, name]) => ({ id, name }));
  }, [courses]);

  // Filter courses by category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return courses;
    return courses.filter((c) => c.category?.id === selectedCategory);
  }, [courses, selectedCategory]);

  // Calculate career progress
  const careerProgress = useMemo(() => {
    const totalCourses = courses.length;
    if (totalCourses === 0) return 0;
    return Math.round((completedCourses / totalCourses) * 100);
  }, [courses, completedCourses]);

  // Get next recommended courses
  const recommendedCourses = useMemo(() => {
    return courses
      .filter((c) => !c.isCompleted && !c.isEnrolled)
      .slice(0, 3);
  }, [courses]);

  // Get in-progress courses
  const inProgressCourses = useMemo(() => {
    return courses.filter((c) => c.isEnrolled && !c.isCompleted);
  }, [courses]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "from-green-500 to-emerald-600";
      case "INTERMEDIATE":
        return "from-yellow-500 to-amber-600";
      case "ADVANCED":
        return "from-orange-500 to-red-500";
      case "EXPERT":
        return "from-purple-500 to-violet-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return <Award className="w-4 h-4" />;
      case "MINI_DIPLOMA":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Career Overview Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-6 lg:p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-gold-400" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-1">Career Roadmap</h1>
                <p className="text-burgundy-100">Your personalized learning journey</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-sm text-burgundy-100">Level</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold-400" />
                  {userLevel}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-sm text-burgundy-100">Points</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  {totalPoints.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-sm text-burgundy-100">Completed</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {completedCourses}
                </div>
              </div>
            </div>
          </div>

          {/* Career Progress */}
          <div className="mt-6 bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-burgundy-100">Overall Career Progress</span>
              <span className="text-lg font-bold">{careerProgress}%</span>
            </div>
            <Progress value={careerProgress} className="h-3 bg-white/10" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === null
                ? "bg-burgundy-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700"
            )}
          >
            All Paths
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat.id
                  ? "bg-burgundy-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "path" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("path")}
            className={viewMode === "path" ? "bg-burgundy-600 hover:bg-burgundy-700" : ""}
          >
            Path View
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-burgundy-600 hover:bg-burgundy-700" : ""}
          >
            Grid View
          </Button>
        </div>
      </div>

      {/* In Progress Courses */}
      {inProgressCourses.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-burgundy-600" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-burgundy-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">{course.title}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <Progress value={course.progress} className="flex-1 h-2" />
                        <span className="text-sm font-bold text-burgundy-600">{Math.round(course.progress)}%</span>
                      </div>
                      <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Path View */}
      {viewMode === "path" ? (
        <div className="space-y-8">
          {Object.entries(coursesByStage).map(([difficulty, stage], stageIndex) => {
            const stageCourses = selectedCategory
              ? stage.courses.filter((c) => c.category?.id === selectedCategory)
              : stage.courses;

            if (stageCourses.length === 0) return null;

            const StageIcon = stage.icon;
            const completedInStage = stageCourses.filter((c) => c.isCompleted).length;
            const stageProgress = stageCourses.length > 0 ? Math.round((completedInStage / stageCourses.length) * 100) : 0;

            return (
              <div key={difficulty} className="relative">
                {/* Stage Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg",
                    getDifficultyColor(difficulty)
                  )}>
                    <StageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{stage.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {completedInStage}/{stageCourses.length} completed
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Progress value={stageProgress} className="w-24 h-2" />
                    <span className="text-sm font-medium text-gray-600">{stageProgress}%</span>
                  </div>
                </div>

                {/* Stage Courses */}
                <div className="ml-6 pl-6 border-l-2 border-gray-200">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stageCourses.map((course) => (
                      <Link key={course.id} href={`/courses/${course.slug}`}>
                        <Card className={cn(
                          "h-full transition-all cursor-pointer",
                          course.isCompleted
                            ? "bg-green-50 border-green-200 hover:border-green-300"
                            : course.isEnrolled
                            ? "bg-burgundy-50 border-burgundy-200 hover:border-burgundy-300"
                            : "hover:border-gray-300 hover:shadow-md"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge className={cn(
                                "text-xs",
                                course.isCompleted
                                  ? "bg-green-100 text-green-700"
                                  : course.isEnrolled
                                  ? "bg-burgundy-100 text-burgundy-700"
                                  : "bg-gray-100 text-gray-700"
                              )}>
                                {getCertificateIcon(course.certificateType)}
                                <span className="ml-1">
                                  {course.certificateType === "CERTIFICATION"
                                    ? "Certification"
                                    : course.certificateType === "MINI_DIPLOMA"
                                    ? "Mini Diploma"
                                    : "Certificate"}
                                </span>
                              </Badge>
                              {course.isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : course.isEnrolled ? (
                                <TrendingUp className="w-5 h-5 text-burgundy-600" />
                              ) : (
                                <Lock className="w-5 h-5 text-gray-400" />
                              )}
                            </div>

                            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{course.title}</h4>
                            {course.shortDescription && (
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.shortDescription}</p>
                            )}

                            {course.isEnrolled && !course.isCompleted && (
                              <div className="flex items-center gap-2">
                                <Progress value={course.progress} className="flex-1 h-1.5" />
                                <span className="text-xs font-medium text-burgundy-600">
                                  {Math.round(course.progress)}%
                                </span>
                              </div>
                            )}

                            {course.isCompleted && (
                              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Connection Line */}
                {stageIndex < Object.keys(coursesByStage).length - 1 && (
                  <div className="flex items-center justify-center py-4">
                    <ChevronRight className="w-6 h-6 text-gray-300 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className={cn(
                "h-full transition-all cursor-pointer",
                course.isCompleted
                  ? "bg-green-50 border-green-200 hover:border-green-300"
                  : course.isEnrolled
                  ? "bg-burgundy-50 border-burgundy-200 hover:border-burgundy-300"
                  : "hover:border-gray-300 hover:shadow-lg"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn(
                      "text-xs bg-gradient-to-r text-white",
                      getDifficultyColor(course.difficulty)
                    )}>
                      {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                    </Badge>
                    {course.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : course.isEnrolled ? (
                      <div className="text-xs font-bold text-burgundy-600">{Math.round(course.progress)}%</div>
                    ) : null}
                  </div>

                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{course.title}</h4>
                  {course.category && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {course.category.name}
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {getCertificateIcon(course.certificateType)}
                    <span>
                      {course.certificateType === "CERTIFICATION"
                        ? "Certification"
                        : course.certificateType === "MINI_DIPLOMA"
                        ? "Mini Diploma"
                        : "Certificate"}
                    </span>
                  </div>

                  {course.isEnrolled && !course.isCompleted && (
                    <Progress value={course.progress} className="mt-3 h-1.5" />
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Recommended Next Steps */}
      {recommendedCourses.length > 0 && (
        <Card className="bg-gradient-to-r from-gold-50 to-amber-50 border-gold-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <Badge className={cn(
                        "text-xs mb-2 bg-gradient-to-r text-white",
                        getDifficultyColor(course.difficulty)
                      )}>
                        {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                      </Badge>
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{course.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{course.shortDescription}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
