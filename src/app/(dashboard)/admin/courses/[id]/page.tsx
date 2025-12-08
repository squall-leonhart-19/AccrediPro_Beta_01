import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Star,
  ChevronLeft,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  BarChart3,
  Layers,
  Video,
  User,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

async function getCourseDetails(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      category: true,
      coach: {
        select: { firstName: true, lastName: true, email: true },
      },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                select: { isCompleted: true },
              },
            },
          },
          progress: {
            select: { isCompleted: true },
          },
        },
      },
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
      analytics: true,
      _count: {
        select: { reviews: true },
      },
    },
  });

  if (!course) return null;

  // Process module-level analytics
  const moduleAnalytics = course.modules.map((module) => {
    const totalEnrollments = course.enrollments.length;
    const completedCount = module.progress.filter((p) => p.isCompleted).length;
    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedCount / totalEnrollments) * 100)
        : 0;

    // Lesson analytics
    const lessonAnalytics = module.lessons.map((lesson) => {
      const lessonCompletedCount = lesson.progress.filter(
        (p) => p.isCompleted
      ).length;
      const lessonCompletionRate =
        totalEnrollments > 0
          ? Math.round((lessonCompletedCount / totalEnrollments) * 100)
          : 0;

      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.lessonType,
        duration: lesson.videoDuration,
        completedCount: lessonCompletedCount,
        completionRate: lessonCompletionRate,
      };
    });

    return {
      id: module.id,
      title: module.title,
      order: module.order,
      isPublished: module.isPublished,
      totalLessons: module.lessons.length,
      completedCount,
      completionRate,
      lessons: lessonAnalytics,
    };
  });

  // Overall stats
  const totalEnrollments = course.enrollments.length;
  const completedEnrollments = course.enrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const inProgressEnrollments = course.enrollments.filter(
    (e) => e.status === "ACTIVE"
  ).length;
  const notStartedEnrollments = course.enrollments.filter(
    (e) => e.status === "PAUSED"
  ).length;

  const avgProgress =
    totalEnrollments > 0
      ? Math.round(
          course.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) /
            totalEnrollments
        )
      : 0;

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    isPublished: course.isPublished,
    isFeatured: course.isFeatured,
    difficulty: course.difficulty,
    duration: course.duration,
    certificateType: course.certificateType,
    category: course.category?.name || "Uncategorized",
    coach: course.coach
      ? `${course.coach.firstName} ${course.coach.lastName}`
      : null,
    createdAt: course.createdAt,
    publishedAt: course.publishedAt,
    totalEnrollments,
    completedEnrollments,
    inProgressEnrollments,
    notStartedEnrollments,
    avgProgress,
    completionRate:
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0,
    avgRating: course.analytics?.avgRating
      ? Number(course.analytics.avgRating)
      : 0,
    totalRevenue: course.analytics?.totalRevenue
      ? Number(course.analytics.totalRevenue)
      : 0,
    totalReviews: course._count.reviews,
    modules: moduleAnalytics,
    recentEnrollments: course.enrollments.slice(0, 5).map((e) => ({
      id: e.id,
      user: e.user,
      status: e.status,
      progress: Number(e.progress),
      enrolledAt: e.enrolledAt,
    })),
  };
}

export default async function AdminCourseDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const course = await getCourseDetails(id);

  if (!course) {
    notFound();
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4 text-blue-500" />;
      case "QUIZ":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge
              className={
                course.isPublished
                  ? "bg-green-100 text-green-700 border-0"
                  : "bg-gray-100 text-gray-600 border-0"
              }
            >
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
            {course.coach && (
              <span className="text-sm text-gray-500">
                Coach: {course.coach}
              </span>
            )}
          </div>
        </div>
        <Link href={`/courses/${course.slug}`}>
          <Button variant="outline">View Course</Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrolled</p>
                <p className="text-2xl font-bold mt-1">
                  {course.totalEnrollments.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold mt-1">
                  {course.completedEnrollments}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold mt-1">
                  {course.inProgressEnrollments}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold mt-1">{course.completionRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-burgundy-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
                  <span className="text-2xl font-bold">
                    {course.avgRating > 0 ? course.avgRating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {course.totalReviews} reviews
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Analytics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-burgundy-600" />
            Module Completion Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {course.modules.map((module, index) => (
              <div key={module.id} className="border rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        Module {index + 1}
                      </span>
                      {!module.isPublished && (
                        <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mt-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {module.totalLessons} lessons •{" "}
                      {module.completedCount.toLocaleString()} students completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-burgundy-600">
                      {module.completionRate}%
                    </p>
                    <p className="text-xs text-gray-500">completion rate</p>
                  </div>
                </div>

                <Progress value={module.completionRate} className="h-2 mb-4" />

                {/* Lesson Details */}
                <div className="space-y-2 mt-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-400 w-6">
                          {index + 1}.{lessonIndex + 1}
                        </span>
                        {getLessonTypeIcon(lesson.type)}
                        <span className="text-sm text-gray-700">
                          {lesson.title}
                        </span>
                        {lesson.duration && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration} min
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress
                            value={lesson.completionRate}
                            className="h-1.5"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12 text-right">
                          {lesson.completionRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {course.modules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No modules found for this course
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Enrollments */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-burgundy-600" />
            Recent Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {course.recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center text-white font-semibold">
                    {enrollment.user.firstName?.[0] || "U"}
                    {enrollment.user.lastName?.[0] || ""}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enrollment.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {enrollment.status === "COMPLETED" ? (
                        <Badge className="bg-green-100 text-green-700 border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      ) : enrollment.status === "ACTIVE" ? (
                        <Badge className="bg-blue-100 text-blue-700 border-0">
                          <PlayCircle className="w-3 h-3 mr-1" />
                          In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-0">
                          {enrollment.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right w-16">
                    <p className="font-semibold text-burgundy-600">
                      {enrollment.progress}%
                    </p>
                    <Progress value={enrollment.progress} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            ))}

            {course.recentEnrollments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No enrollments yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
