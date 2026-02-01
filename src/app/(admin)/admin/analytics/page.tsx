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
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

async function getStudentProgressData() {
  // Overview stats - only count STUDENTS (not leads)
  const [totalStudents, neverLoggedIn, loggedIn] = await Promise.all([
    prisma.user.count({
      where: { userType: "STUDENT", isFakeProfile: false }
    }),
    prisma.user.count({
      where: { userType: "STUDENT", isFakeProfile: false, firstLoginAt: null }
    }),
    prisma.user.count({
      where: { userType: "STUDENT", isFakeProfile: false, firstLoginAt: { not: null } }
    }),
  ]);

  // ONLY get courses that have at least 1 real student enrollment
  const coursesWithEnrollments = await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          user: { userType: "STUDENT", isFakeProfile: false }
        }
      }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      _count: {
        select: {
          enrollments: {
            where: { user: { userType: "STUDENT", isFakeProfile: false } }
          }
        }
      },
      modules: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true }
      },
      enrollments: {
        where: { user: { userType: "STUDENT", isFakeProfile: false } },
        select: {
          userId: true,
          status: true,
          progress: true,
          user: { select: { firstLoginAt: true } }
        }
      }
    },
    orderBy: { title: "asc" }
  });

  // Get module completions in batch
  const allModuleIds = coursesWithEnrollments.flatMap(c => c.modules.map(m => m.id));
  const allModuleProgress = await prisma.moduleProgress.groupBy({
    by: ["moduleId"],
    where: { moduleId: { in: allModuleIds }, isCompleted: true },
    _count: { userId: true }
  });
  const moduleCompletionCount = new Map(allModuleProgress.map(mp => [mp.moduleId, mp._count.userId]));

  // Get lesson progress per course for "started" calculation
  const allCourseIds = coursesWithEnrollments.map(c => c.id);
  const lessonProgressByCourse = await prisma.lessonProgress.findMany({
    where: { lesson: { module: { courseId: { in: allCourseIds } } } },
    select: { userId: true, lesson: { select: { module: { select: { courseId: true } } } } }
  });

  const startedByCourse = new Map<string, Set<string>>();
  for (const lp of lessonProgressByCourse) {
    const courseId = lp.lesson.module.courseId;
    if (!startedByCourse.has(courseId)) startedByCourse.set(courseId, new Set());
    startedByCourse.get(courseId)!.add(lp.userId);
  }

  // Build course stats
  const courseStats = coursesWithEnrollments.map(course => {
    const enrolledUserIds = new Set(course.enrollments.map(e => e.userId));
    const totalEnrolled = enrolledUserIds.size;

    const neverLogged = course.enrollments.filter(e => !e.user.firstLoginAt).length;
    const startedSet = startedByCourse.get(course.id) || new Set();
    const startedInCourse = [...enrolledUserIds].filter(id => startedSet.has(id)).length;
    const neverStarted = totalEnrolled - startedInCourse;
    const fullCompletions = course.enrollments.filter(e => e.status === "COMPLETED").length;

    // Calculate average progress
    const avgProgress = totalEnrolled > 0
      ? Math.round(course.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalEnrolled)
      : 0;

    const moduleBreakdown = course.modules.map(mod => ({
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleOrder: mod.order,
      completedCount: moduleCompletionCount.get(mod.id) || 0,
      percentage: totalEnrolled > 0
        ? Math.round(((moduleCompletionCount.get(mod.id) || 0) / totalEnrolled) * 100)
        : 0,
    }));

    return {
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      totalStudents: totalEnrolled,
      neverLogged,
      neverStarted,
      started: startedInCourse,
      moduleBreakdown,
      fullCompletions,
      avgProgress,
      completionRate: totalEnrolled > 0 ? Math.round((fullCompletions / totalEnrolled) * 100) : 0,
    };
  }).sort((a, b) => b.totalStudents - a.totalStudents); // Sort by enrollment count

  return { totalStudents, neverLoggedIn, loggedIn, courseStats };
}

export default async function StudentProgressAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return <div className="p-8 text-center text-red-500">Access denied</div>;
  }

  const data = await getStudentProgressData();
  const totalCompletions = data.courseStats.reduce((sum, c) => sum + c.fullCompletions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Student Progress Analytics</h2>
          <p className="text-gray-500 mt-1">
            Paid students only • {data.courseStats.length} courses with enrollments
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Live
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{data.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Logged In</p>
                <p className="text-2xl font-bold">{data.loggedIn}</p>
                <p className="text-xs text-green-600">
                  {data.totalStudents > 0 ? Math.round((data.loggedIn / data.totalStudents) * 100) : 0}%
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm bg-red-50/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Never Logged</p>
                <p className="text-2xl font-bold text-red-700">{data.neverLoggedIn}</p>
                <p className="text-xs text-red-600">
                  {data.totalStudents > 0 ? Math.round((data.neverLoggedIn / data.totalStudents) * 100) : 0}%
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completions</p>
                <p className="text-2xl font-bold">{totalCompletions}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Courses</p>
                <p className="text-2xl font-bold">{data.courseStats.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {data.courseStats.map((course) => (
          <Card key={course.courseId} className="shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                    <CardDescription>{course.moduleBreakdown.length} modules</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{course.totalStudents}</p>
                    <p className="text-xs text-gray-500">Enrolled</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{course.fullCompletions}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{course.neverLogged}</p>
                    <p className="text-xs text-gray-500">Never Logged</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{course.neverStarted}</p>
                    <p className="text-xs text-gray-500">Never Started</p>
                  </div>
                  <div className="pl-4 border-l">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-bold">{course.completionRate}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Completion Rate</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12 py-2">#</TableHead>
                      <TableHead className="py-2">Module</TableHead>
                      <TableHead className="text-right py-2 w-24">Done</TableHead>
                      <TableHead className="py-2 w-48">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.moduleBreakdown.map((mod) => (
                      <TableRow key={mod.moduleId} className="hover:bg-gray-50/50">
                        <TableCell className="py-2 text-gray-400">{mod.moduleOrder}</TableCell>
                        <TableCell className="py-2 font-medium text-sm">{mod.moduleTitle}</TableCell>
                        <TableCell className="text-right py-2">
                          <span className={`text-sm font-medium ${mod.percentage >= 50 ? "text-green-600"
                              : mod.percentage >= 25 ? "text-amber-600"
                                : "text-gray-500"
                            }`}>
                            {mod.completedCount}/{course.totalStudents}
                          </span>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={mod.percentage}
                              className="h-1.5 flex-1"
                            />
                            <span className="text-xs text-gray-500 w-8 text-right">
                              {mod.percentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
