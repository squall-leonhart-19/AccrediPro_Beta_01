import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Play,
  Award,
  Target,
  Video,
  GraduationCap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle2,
  Activity,
  Flame,
} from "lucide-react";

async function getAnalyticsData() {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Get video milestone tracking data
  const videoMilestones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const milestoneCounts = await Promise.all(
    videoMilestones.map(async (milestone) => {
      const count = await prisma.userTag.count({
        where: { tag: `training_video_${milestone}` },
      });
      return { milestone, count };
    })
  );

  // Get overall stats
  const [
    totalUsers,
    usersThisWeek,
    usersLastWeek,
    totalEnrollments,
    completedEnrollments,
    totalCertificates,
    miniDiplomaCompletions,
    activeUsersThisWeek,
    coursesData,
    usersByDay,
    enrollmentsByDay,
    topCoursesByEnrollment,
    topCoursesByCompletion,
    recentActivity,
  ] = await Promise.all([
    // Total registered users (with email)
    prisma.user.count({ where: { email: { not: null }, isFakeProfile: false } }),
    // New users this week
    prisma.user.count({ where: { email: { not: null }, isFakeProfile: false, createdAt: { gte: lastWeek } } }),
    // New users last week (for comparison)
    prisma.user.count({
      where: {
        email: { not: null },
        isFakeProfile: false,
        createdAt: { gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000), lt: lastWeek },
      },
    }),
    // Total enrollments
    prisma.enrollment.count(),
    // Completed enrollments
    prisma.enrollment.count({ where: { status: "COMPLETED" } }),
    // Total certificates
    prisma.certificate.count(),
    // Mini diploma completions
    prisma.user.count({ where: { miniDiplomaCompletedAt: { not: null } } }),
    // Active users this week
    prisma.user.count({ where: { email: { not: null }, lastLoginAt: { gte: lastWeek } } }),
    // Course stats
    prisma.course.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        certificateType: true,
        _count: { select: { enrollments: true } },
        enrollments: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
      },
    }),
    // Users by day (last 30 days)
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${lastMonth} AND email IS NOT NULL AND "isFakeProfile" = false
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
    // Enrollments by day (last 30 days)
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("enrolledAt") as date, COUNT(*) as count
      FROM "Enrollment"
      WHERE "enrolledAt" >= ${lastMonth}
      GROUP BY DATE("enrolledAt")
      ORDER BY date ASC
    `,
    // Top courses by enrollment
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { enrollments: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        certificateType: true,
        _count: { select: { enrollments: true } },
      },
    }),
    // Top courses by completion rate
    prisma.course.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        _count: { select: { enrollments: true } },
        enrollments: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
      },
    }),
    // Recent user activity
    prisma.user.findMany({
      where: { email: { not: null }, lastLoginAt: { not: null } },
      orderBy: { lastLoginAt: "desc" },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        lastLoginAt: true,
        _count: { select: { enrollments: true } },
      },
    }),
  ]);

  // Calculate percentages and growth
  const userGrowth = usersLastWeek > 0
    ? Math.round(((usersThisWeek - usersLastWeek) / usersLastWeek) * 100)
    : usersThisWeek > 0 ? 100 : 0;

  const completionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

  // Process courses for completion rate ranking
  const coursesWithCompletionRate = topCoursesByCompletion
    .map((course) => ({
      ...course,
      completionRate: course._count.enrollments > 0
        ? Math.round((course.enrollments.length / course._count.enrollments) * 100)
        : 0,
    }))
    .filter((c) => c._count.enrollments >= 3) // At least 3 enrollments
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // Process daily data for charts
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last30Days.push(date.toISOString().split("T")[0]);
  }

  const usersByDayMap = new Map(
    usersByDay.map((d) => [new Date(d.date).toISOString().split("T")[0], Number(d.count)])
  );
  const enrollmentsByDayMap = new Map(
    enrollmentsByDay.map((d) => [new Date(d.date).toISOString().split("T")[0], Number(d.count)])
  );

  const dailyData = last30Days.map((date) => ({
    date,
    users: usersByDayMap.get(date) || 0,
    enrollments: enrollmentsByDayMap.get(date) || 0,
  }));

  // Video funnel data - calculate drop-off
  const videoFunnel = milestoneCounts.map((m, index) => {
    const prevCount = index === 0 ? totalUsers : milestoneCounts[index - 1].count;
    const dropOff = prevCount > 0 ? Math.round(((prevCount - m.count) / prevCount) * 100) : 0;
    return {
      ...m,
      percentage: totalUsers > 0 ? Math.round((m.count / totalUsers) * 100) : 0,
      dropOff,
    };
  });

  // Course type breakdown
  const certificationCourses = coursesData.filter((c) => c.certificateType === "CERTIFICATION");
  const miniDiplomaCourses = coursesData.filter((c) => c.certificateType === "MINI_DIPLOMA");
  const completionCourses = coursesData.filter((c) => c.certificateType === "COMPLETION");

  return {
    totalUsers,
    usersThisWeek,
    userGrowth,
    totalEnrollments,
    completedEnrollments,
    completionRate,
    totalCertificates,
    miniDiplomaCompletions,
    activeUsersThisWeek,
    videoFunnel,
    topCoursesByEnrollment,
    coursesWithCompletionRate,
    dailyData,
    recentActivity,
    courseTypeBreakdown: {
      certifications: certificationCourses.length,
      miniDiplomas: miniDiplomaCourses.length,
      completions: completionCourses.length,
    },
  };
}

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;

  const data = await getAnalyticsData();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Find max values for chart scaling
  const maxUsers = Math.max(...data.dailyData.map((d) => d.users), 1);
  const maxEnrollments = Math.max(...data.dailyData.map((d) => d.enrollments), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-burgundy-600" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Track user engagement, video completion, and course performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {data.userGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${data.userGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(data.userGrowth)}%
                  </span>
                  <span className="text-xs text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-burgundy-500" />
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.activeUsersThisWeek.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-500">
                    {data.totalUsers > 0 ? Math.round((data.activeUsersThisWeek / data.totalUsers) * 100) : 0}% engagement
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
          </CardContent>
        </Card>

        {/* Course Completion */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.completionRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-500">
                    {data.completedEnrollments}/{data.totalEnrollments} completed
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Certificates Issued</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.totalCertificates.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <GraduationCap className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-gray-500">
                    {data.miniDiplomaCompletions} mini diplomas
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500" />
          </CardContent>
        </Card>
      </div>

      {/* Video Completion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-burgundy-600" />
            Training Video Watch Funnel
          </CardTitle>
          <CardDescription>
            Track how far users watch the training video (70%+ = completed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.videoFunnel.map((milestone) => (
              <div key={milestone.milestone} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{milestone.milestone}% watched</span>
                    {milestone.milestone === 70 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        Completion Threshold
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-semibold">{milestone.count} users</span>
                    <span className="text-gray-400 w-16 text-right">{milestone.percentage}%</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress
                    value={milestone.percentage}
                    className={`h-6 ${milestone.milestone >= 70 ? "[&>div]:bg-green-500" : "[&>div]:bg-burgundy-500"}`}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs font-medium text-white drop-shadow">
                      {milestone.count > 0 && `${milestone.percentage}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-burgundy-50 rounded-lg">
              <p className="text-2xl font-bold text-burgundy-700">
                {data.videoFunnel.find((m) => m.milestone === 10)?.count || 0}
              </p>
              <p className="text-xs text-gray-600">Started Watching</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">
                {data.videoFunnel.find((m) => m.milestone === 50)?.count || 0}
              </p>
              <p className="text-xs text-gray-600">Reached 50%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {data.videoFunnel.find((m) => m.milestone === 70)?.count || 0}
              </p>
              <p className="text-xs text-gray-600">Completed (70%+)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-burgundy-600" />
              User Registrations (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {data.dailyData.map((day, index) => {
                const height = maxUsers > 0 ? (day.users / maxUsers) * 100 : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    <div
                      className="w-full bg-burgundy-500 rounded-t transition-all hover:bg-burgundy-600 min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {formatDate(day.date)}: {day.users} users
                      </div>
                    </div>
                    {/* X-axis labels (show every 5th) */}
                    {index % 5 === 0 && (
                      <span className="text-[10px] text-gray-400 mt-1 -rotate-45 origin-left">
                        {formatDate(day.date)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Total: {data.dailyData.reduce((sum, d) => sum + d.users, 0)} new users</span>
              <span>Avg: {Math.round(data.dailyData.reduce((sum, d) => sum + d.users, 0) / 30)}/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-600" />
              Course Enrollments (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {data.dailyData.map((day, index) => {
                const height = maxEnrollments > 0 ? (day.enrollments / maxEnrollments) * 100 : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    <div
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600 min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {formatDate(day.date)}: {day.enrollments} enrollments
                      </div>
                    </div>
                    {/* X-axis labels (show every 5th) */}
                    {index % 5 === 0 && (
                      <span className="text-[10px] text-gray-400 mt-1 -rotate-45 origin-left">
                        {formatDate(day.date)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Total: {data.dailyData.reduce((sum, d) => sum + d.enrollments, 0)} enrollments</span>
              <span>Avg: {Math.round(data.dailyData.reduce((sum, d) => sum + d.enrollments, 0) / 30)}/day</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Courses by Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-burgundy-600" />
              Top Courses by Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topCoursesByEnrollment.map((course, index) => (
              <div key={course.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center text-burgundy-700 font-bold text-sm flex-shrink-0">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        course.certificateType === "CERTIFICATION"
                          ? "border-gold-400 text-gold-700"
                          : course.certificateType === "MINI_DIPLOMA"
                          ? "border-purple-400 text-purple-700"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {course.certificateType.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-burgundy-600">{course._count.enrollments}</p>
                  <p className="text-xs text-gray-500">enrolled</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Courses by Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Best Completion Rates
            </CardTitle>
            <CardDescription>Courses with at least 3 enrollments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.coursesWithCompletionRate.length > 0 ? (
              data.coursesWithCompletionRate.map((course, index) => (
                <div key={course.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-500">
                      {course.enrollments.length}/{course._count.enrollments} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{course.completionRate}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Not enough data yet. Need courses with 3+ enrollments.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Course Catalog Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gold-50 rounded-xl border border-gold-200">
              <Award className="w-10 h-10 text-gold-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gold-700">{data.courseTypeBreakdown.certifications}</p>
              <p className="text-sm text-gray-600">Full Certifications</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <GraduationCap className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">{data.courseTypeBreakdown.miniDiplomas}</p>
              <p className="text-sm text-gray-600">Mini Diplomas</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-700">{data.courseTypeBreakdown.completions}</p>
              <p className="text-sm text-gray-600">Completion Courses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-burgundy-600" />
            Recent User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {data.recentActivity.map((user) => (
              <div key={user.id} className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center text-burgundy-700 font-semibold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user._count.enrollments} course{user._count.enrollments !== 1 ? "s" : ""} enrolled
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last active</p>
                  <p className="text-sm font-medium text-gray-700">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
