import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  UserPlus,
  GraduationCap,
  DollarSign,
  Activity,
} from "lucide-react";

async function getAdminStats() {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    newUsersThisWeek,
    completedThisMonth,
    activeUsers,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.certificate.count(),
    prisma.user.count({ where: { createdAt: { gte: lastWeek } } }),
    prisma.enrollment.count({
      where: { status: "COMPLETED", completedAt: { gte: lastMonth } },
    }),
    prisma.user.count({ where: { lastLoginAt: { gte: lastWeek } } }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        course: {
          select: { title: true },
        },
      },
    }),
  ]);

  const completionRate = totalEnrollments > 0
    ? Math.round((await prisma.enrollment.count({ where: { status: "COMPLETED" } }) / totalEnrollments) * 100)
    : 0;

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    newUsersThisWeek,
    completedThisMonth,
    completionRate,
    activeUsers,
    recentEnrollments,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const stats = await getAdminStats();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your AccrediPro LMS platform
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-burgundy-100 rounded-lg">
                <Users className="w-6 h-6 text-burgundy-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              +{stats.newUsersThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="p-3 bg-gold-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-gold-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Published programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalEnrollments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalCertificates.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">
              +{stats.completedThisMonth} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900">{stats.activeUsers}</p>
            <p className="text-sm text-gray-500 mt-1">
              Logged in within the last 7 days
            </p>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${Math.min((stats.activeUsers / stats.totalUsers) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-burgundy-500" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentEnrollments.map((enrollment: { id: string; enrolledAt: Date; user: { firstName: string; lastName: string }; course: { title: string } }) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{enrollment.course.title}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(enrollment.enrolledAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/courses"
              className="p-4 border border-gray-200 rounded-lg hover:border-burgundy-200 hover:bg-burgundy-50 transition-colors text-center"
            >
              <BookOpen className="w-8 h-8 mx-auto text-burgundy-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Courses</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-burgundy-200 hover:bg-burgundy-50 transition-colors text-center"
            >
              <Users className="w-8 h-8 mx-auto text-burgundy-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Users</p>
            </a>
            <a
              href="/admin/communications"
              className="p-4 border border-gray-200 rounded-lg hover:border-burgundy-200 hover:bg-burgundy-50 transition-colors text-center"
            >
              <TrendingUp className="w-8 h-8 mx-auto text-burgundy-600 mb-2" />
              <p className="font-medium text-gray-900">Send Bulk Email</p>
            </a>
            <a
              href="/admin/communications"
              className="p-4 border border-gray-200 rounded-lg hover:border-burgundy-200 hover:bg-burgundy-50 transition-colors text-center"
            >
              <Award className="w-8 h-8 mx-auto text-burgundy-600 mb-2" />
              <p className="font-medium text-gray-900">Send Bulk DM</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
