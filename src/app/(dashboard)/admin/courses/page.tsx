import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Star,
  ChevronRight,
  Clock,
  BarChart3,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

async function getAdminCourses() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
      modules: {
        include: {
          lessons: true,
        },
      },
      enrollments: {
        select: {
          id: true,
          status: true,
          progress: true,
        },
      },
      analytics: true,
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return courses.map((course) => {
    const totalEnrollments = course.enrollments.length;
    const completedEnrollments = course.enrollments.filter(
      (e) => e.status === "COMPLETED"
    ).length;
    const inProgressEnrollments = course.enrollments.filter(
      (e) => e.status === "IN_PROGRESS"
    ).length;
    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;
    const avgProgress =
      totalEnrollments > 0
        ? Math.round(
            course.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) /
              totalEnrollments
          )
        : 0;

    const totalLessons = course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      category: course.category?.name || "Uncategorized",
      totalModules: course.modules.length,
      totalLessons,
      totalEnrollments,
      completedEnrollments,
      inProgressEnrollments,
      completionRate,
      avgProgress,
      avgRating: course.analytics?.avgRating
        ? Number(course.analytics.avgRating)
        : 0,
      totalReviews: course._count.reviews,
      totalRevenue: course.analytics?.totalRevenue
        ? Number(course.analytics.totalRevenue)
        : 0,
    };
  });
}

async function getOverallStats() {
  const [totalCourses, publishedCourses, totalEnrollments, completedEnrollments] =
    await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: "COMPLETED" } }),
    ]);

  return {
    totalCourses,
    publishedCourses,
    totalEnrollments,
    completedEnrollments,
    overallCompletionRate:
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0,
  };
}

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [courses, stats] = await Promise.all([
    getAdminCourses(),
    getOverallStats(),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-600 mt-1">
          Monitor course performance and student progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold mt-1">{stats.totalCourses}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.publishedCourses} published
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="text-3xl font-bold mt-1">
                  {stats.totalEnrollments.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completions</p>
                <p className="text-3xl font-bold mt-1">
                  {stats.completedEnrollments.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold mt-1">
                  {stats.overallCompletionRate}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-burgundy-600" />
            All Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Course
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Enrolled
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    In Progress
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Completed
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Completion Rate
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Rating
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.totalModules} modules •{" "}
                            {course.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {course.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 border-0">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-0">
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {course.totalEnrollments.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <PlayCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">
                          {course.inProgressEnrollments.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">
                          {course.completedEnrollments.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {course.completionRate}%
                        </span>
                        <Progress
                          value={course.completionRate}
                          className="h-1.5 w-20"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {course.avgRating > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                          <span className="font-medium text-gray-900">
                            {course.avgRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({course.totalReviews})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No ratings</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1 text-burgundy-600 hover:text-burgundy-700 text-sm font-medium"
                      >
                        Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
