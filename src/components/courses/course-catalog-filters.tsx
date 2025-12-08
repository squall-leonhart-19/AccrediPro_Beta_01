"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Award,
  Search,
  Star,
  GraduationCap,
  Play,
  CheckCircle,
  TrendingUp,
  Grid3X3,
  List,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Module {
  lessons: { id: string }[];
}

interface CourseAnalytics {
  totalEnrolled: number;
  avgRating: number;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  difficulty: string;
  duration: number | null;
  isFeatured: boolean;
  isFree: boolean;
  price: number | null;
  certificateType: string;
  category: Category | null;
  modules: Module[];
  _count: {
    enrollments: number;
    reviews: number;
  };
  analytics: CourseAnalytics | null;
}

interface Enrollment {
  courseId: string;
  status: string;
  progress: number;
}

interface CourseCatalogFiltersProps {
  courses: Course[];
  categories: Category[];
  enrollments: Enrollment[];
}

export function CourseCatalogFilters({
  courses,
  categories,
  enrollments,
}: CourseCatalogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === null || course.category?.id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  const featuredCourses = filteredCourses.filter((c) => c.isFeatured);
  const allCourses = filteredCourses;

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Self-paced";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-700";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-700";
      case "ADVANCED":
        return "bg-orange-100 text-orange-700";
      case "EXPERT":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCertificateLabel = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return "Certification";
      case "MINI_DIPLOMA":
        return "Mini Diploma";
      default:
        return "Certificate";
    }
  };

  const totalEnrolled = courses.reduce(
    (acc, c) => acc + (c.analytics?.totalEnrolled || c._count.enrollments),
    0
  );

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <GraduationCap className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Course Catalog</h1>
            <p className="text-burgundy-100 text-lg mb-6">
              Discover professional certifications and mini-diplomas to advance your career
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-burgundy-100">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">{filteredCourses.length} Courses</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">{totalEnrolled.toLocaleString()} Students</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={viewMode === "grid" ? "outline" : "ghost"}
          size="sm"
          className="hidden sm:flex"
          onClick={() => setViewMode("grid")}
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Grid
        </Button>
        <Button
          variant={viewMode === "list" ? "outline" : "ghost"}
          size="sm"
          className="hidden sm:flex"
          onClick={() => setViewMode("list")}
        >
          <List className="w-4 h-4 mr-2" />
          List
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-burgundy-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700"
            }`}
          >
            All Courses
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-burgundy-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-burgundy-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Featured Programs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredCourses.slice(0, 2).map((course) => {
              const enrollment = enrollmentMap.get(course.id);
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              const avgRating = course.analytics?.avgRating || 4.9;
              const enrolledCount =
                course.analytics?.totalEnrolled || course._count.enrollments;

              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full card-hover overflow-hidden border-2 border-gold-200 bg-gradient-to-br from-white to-gold-50">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-gold-100 text-gold-700 border-gold-200">
                          {getCertificateLabel(course.certificateType)}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {course.shortDescription || course.description}
                      </p>

                      {/* Rating and Stats */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                          <span className="font-semibold text-gray-900">
                            {avgRating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({course._count.reviews})
                          </span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 text-sm">
                          {enrolledCount.toLocaleString()} students
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(course.duration)}
                        </span>
                      </div>
                    </div>

                    <CardFooter className="bg-gray-50 border-t p-4">
                      {enrollment ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                              {enrollment.status === "COMPLETED" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 text-burgundy-600" />
                                  Continue Learning
                                </>
                              )}
                            </span>
                            <span className="text-sm font-bold text-burgundy-600">
                              {Math.round(enrollment.progress)}%
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      ) : (
                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                          {course.isFree ? "Start Free" : "Enroll Now"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* All Courses Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-burgundy-600" />
          <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
          <Badge variant="secondary" className="ml-2">
            {filteredCourses.length}
          </Badge>
        </div>

        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCourses.map((course) => {
              const enrollment = enrollmentMap.get(course.id);
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              const avgRating = course.analytics?.avgRating || 4.9;
              const enrolledCount =
                course.analytics?.totalEnrolled || course._count.enrollments;

              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full overflow-hidden border border-gray-200 hover:border-burgundy-300 hover:shadow-lg transition-all duration-200 group">
                    {/* Course Image/Banner Area */}
                    <div className="h-32 bg-gradient-to-br from-burgundy-500 via-burgundy-600 to-burgundy-700 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getDifficultyColor(course.difficulty)} shadow-sm`}>
                          {course.difficulty.charAt(0) +
                            course.difficulty.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-burgundy-700 shadow-sm">
                          {getCertificateLabel(course.certificateType)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        <span className="text-white text-sm font-medium">
                          {avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-700 transition-colors min-h-[48px]">
                        {course.title}
                      </h3>

                      {course.category && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          {course.category.name}
                        </Badge>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(course.duration)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {enrolledCount.toLocaleString()} enrolled
                        </span>
                        {enrollment ? (
                          <div className="flex items-center gap-2">
                            <Progress value={enrollment.progress} className="w-16 h-1.5" />
                            <span className="text-xs font-bold text-burgundy-600">
                              {Math.round(enrollment.progress)}%
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-burgundy-600">
                            {course.isFree
                              ? "Free"
                              : course.price
                              ? `$${course.price}`
                              : "Free"}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {allCourses.map((course) => {
              const enrollment = enrollmentMap.get(course.id);
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              const avgRating = course.analytics?.avgRating || 4.9;
              const enrolledCount =
                course.analytics?.totalEnrolled || course._count.enrollments;

              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {course.title}
                            </h3>
                            {course.category && (
                              <Badge variant="outline" className="flex-shrink-0">
                                {course.category.name}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                              <span className="font-medium text-gray-900">
                                {avgRating.toFixed(1)}
                              </span>
                            </div>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(course.duration)}
                            </span>
                            <span>
                              {enrolledCount.toLocaleString()} enrolled
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty.charAt(0) +
                              course.difficulty.slice(1).toLowerCase()}
                          </Badge>

                          {enrollment ? (
                            <div className="text-right">
                              <span className="text-sm font-bold text-burgundy-600">
                                {Math.round(enrollment.progress)}%
                              </span>
                              <div className="w-20">
                                <Progress
                                  value={enrollment.progress}
                                  className="h-1.5"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="font-semibold text-burgundy-600">
                              {course.isFree
                                ? "Free"
                                : course.price
                                ? `$${course.price}`
                                : "Free"}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters"
                : "Check back soon for new courses!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
