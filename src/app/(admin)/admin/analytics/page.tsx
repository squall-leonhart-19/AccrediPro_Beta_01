import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  GraduationCap,
  Play,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Award,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

interface CourseModuleStats {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  totalStudents: number;
  neverLogged: number;
  neverStarted: number;
  started: number;
  moduleBreakdown: {
    moduleId: string;
    moduleTitle: string;
    moduleOrder: number;
    completedCount: number;
    percentage: number;
  }[];
  fullCompletions: number;
}

async function getStudentProgressData() {
  // Get all students (userType = STUDENT, no fake profiles)
  const totalStudents = await prisma.user.count({
    where: {
      userType: "STUDENT",
      isFakeProfile: false,
    }
  });

  // Students who never logged in
  const neverLoggedIn = await prisma.user.count({
    where: {
      userType: "STUDENT",
      isFakeProfile: false,
      firstLoginAt: null,
    }
  });

  // Students who logged in at least once
  const loggedIn = await prisma.user.count({
    where: {
      userType: "STUDENT",
      isFakeProfile: false,
      firstLoginAt: { not: null },
    }
  });

  // Get all courses with their modules
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
        }
      },
      enrollments: {
        where: {
          user: {
            userType: "STUDENT",
            isFakeProfile: false,
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstLoginAt: true,
            }
          }
        }
      }
    },
    orderBy: { title: "asc" }
  });

  // Build per-course stats
  const courseStats: CourseModuleStats[] = [];

  for (const course of courses) {
    const enrolledStudentIds = course.enrollments.map(e => e.userId);
    const totalEnrolled = enrolledStudentIds.length;

    if (totalEnrolled === 0) continue;

    // Never logged in (enrolled but firstLoginAt is null)
    const neverLoggedCount = course.enrollments.filter(e => !e.user.firstLoginAt).length;

    // Get lesson progress to determine "started"
    const userLessonProgress = await prisma.lessonProgress.groupBy({
      by: ["userId"],
      where: {
        userId: { in: enrolledStudentIds },
        lesson: { module: { courseId: course.id } },
      },
    });
    const usersWithProgress = new Set(userLessonProgress.map(p => p.userId));
    const startedCount = usersWithProgress.size;
    const neverStartedCount = totalEnrolled - startedCount;

    // Module completion breakdown
    const moduleBreakdown: CourseModuleStats["moduleBreakdown"] = [];

    for (const mod of course.modules) {
      const completedCount = await prisma.moduleProgress.count({
        where: {
          moduleId: mod.id,
          isCompleted: true,
          userId: { in: enrolledStudentIds },
        }
      });

      moduleBreakdown.push({
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleOrder: mod.order,
        completedCount,
        percentage: totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0,
      });
    }

    // Full course completions
    const fullCompletions = await prisma.enrollment.count({
      where: {
        courseId: course.id,
        status: "COMPLETED",
        userId: { in: enrolledStudentIds },
      }
    });

    courseStats.push({
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      totalStudents: totalEnrolled,
      neverLogged: neverLoggedCount,
      neverStarted: neverStartedCount,
      started: startedCount,
      moduleBreakdown,
      fullCompletions,
    });
  }

  return {
    totalStudents,
    neverLoggedIn,
    loggedIn,
    courseStats,
  };
}

export default async function StudentProgressAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return <div className="p-8 text-center text-red-500">Access denied</div>;
  }

  const data = await getStudentProgressData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Student Progress Analytics</h2>
          <p className="text-gray-500 mt-1">Paid students only (no leads/optins)</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Live Data
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Paid purchases only</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Logged In</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.loggedIn}</div>
            <p className="text-xs text-green-600 mt-1">
              {data.totalStudents > 0 ? Math.round((data.loggedIn / data.totalStudents) * 100) : 0}% login rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-red-500 shadow-sm bg-red-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Never Logged In</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{data.neverLoggedIn}</div>
            <p className="text-xs text-red-600 mt-1">
              {data.totalStudents > 0 ? Math.round((data.neverLoggedIn / data.totalStudents) * 100) : 0}% of students
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.courseStats.length}</div>
            <p className="text-xs text-gray-500 mt-1">With enrolled students</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-Course Breakdown */}
      <div className="space-y-6">
        {data.courseStats.map((course) => (
          <Card key={course.courseId} className="shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    {course.courseTitle}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {course.totalStudents} enrolled students • {course.moduleBreakdown.length} modules
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{course.fullCompletions}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{course.started}</div>
                    <div className="text-xs text-gray-500">Started</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{course.neverStarted}</div>
                    <div className="text-xs text-gray-500">Never Started</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600">Enrolled</div>
                  <div className="text-xl font-bold text-blue-700">{course.totalStudents}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600">Never Logged</div>
                  <div className="text-xl font-bold text-red-700">{course.neverLogged}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600">Never Started</div>
                  <div className="text-xl font-bold text-amber-700">{course.neverStarted}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600">Full Completion</div>
                  <div className="text-xl font-bold text-green-700">
                    {course.totalStudents > 0 ? Math.round((course.fullCompletions / course.totalStudents) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Module Progress Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-right w-32">Completed</TableHead>
                    <TableHead className="w-64">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.moduleBreakdown.map((mod) => (
                    <TableRow key={mod.moduleId}>
                      <TableCell className="font-medium text-gray-500">
                        {mod.moduleOrder}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mod.moduleTitle}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={
                          mod.percentage >= 50
                            ? "bg-green-50 text-green-700"
                            : mod.percentage >= 25
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-50 text-gray-700"
                        }>
                          {mod.completedCount} / {course.totalStudents}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={mod.percentage} className="h-2" />
                          <span className="text-sm font-medium text-gray-600 w-12">
                            {mod.percentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {course.moduleBreakdown.length === 0 && (
                <p className="text-center text-gray-500 py-4">No published modules</p>
              )}
            </CardContent>
          </Card>
        ))}

        {data.courseStats.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No courses with enrolled students</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
