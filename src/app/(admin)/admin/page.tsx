import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  UserPlus,
  GraduationCap,
  Activity,
  MessageSquare,
  Mail,
  ChevronRight,
  Flame,
  Target,
  Clock,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Settings,
  Bell,
  FileText,
  Star,
  Eye,
  Play,
} from "lucide-react";

async function getAdminStats() {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    newUsersThisWeek,
    newUsersLastWeek,
    completedThisMonth,
    activeUsers,
    recentEnrollments,
    recentUsers,
    topCourses,
    totalMessages,
    unreadMessages,
    publishedCourses,
    avgCourseProgress,
  ] = await Promise.all([
    // Only count users with email (registered users who can log in)
    // Excludes imported leads without email addresses
    prisma.user.count({ where: { email: { not: null } } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.certificate.count(),
    prisma.user.count({ where: { email: { not: null }, createdAt: { gte: lastWeek } } }),
    prisma.user.count({ where: { email: { not: null }, createdAt: { gte: twoWeeksAgo, lt: lastWeek } } }),
    prisma.enrollment.count({
      where: { status: "COMPLETED", completedAt: { gte: lastMonth } },
    }),
    prisma.user.count({ where: { email: { not: null }, lastLoginAt: { gte: lastWeek } } }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, avatar: true },
        },
        course: {
          select: { title: true, slug: true },
        },
      },
    }),
    prisma.user.findMany({
      where: { email: { not: null } },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        createdAt: true,
        role: true,
      },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { enrollments: { _count: "desc" } },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        _count: { select: { enrollments: true } },
        analytics: { select: { avgRating: true, totalEnrolled: true } },
      },
    }),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.aggregate({ _avg: { progress: true } }),
  ]);

  const completedEnrollments = await prisma.enrollment.count({ where: { status: "COMPLETED" } });
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  // Calculate user growth percentage
  const userGrowth = newUsersLastWeek > 0
    ? Math.round(((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100)
    : newUsersThisWeek > 0 ? 100 : 0;

  return {
    totalUsers,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
    newUsersThisWeek,
    userGrowth,
    completedThisMonth,
    completionRate,
    activeUsers,
    recentEnrollments,
    recentUsers,
    topCourses,
    totalMessages,
    unreadMessages,
    avgProgress: avgCourseProgress._avg.progress ? Number(avgCourseProgress._avg.progress) : 0,
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
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Control Center
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session.user.firstName}. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/admin/communications">
            <Button className="gap-2 bg-burgundy-600 hover:bg-burgundy-700">
              <Mail className="w-4 h-4" />
              Send Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Grid - 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Registered Users */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Registered Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.userGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.userGrowth)}%
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

        {/* Active Learners */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active Learners</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.activeUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-500">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active rate
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

        {/* Total Enrollments */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalEnrollments.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-500">
                    {stats.completionRate}% completion
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
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
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalCertificates.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-green-600 font-medium">
                    +{stats.completedThisMonth}
                  </span>
                  <span className="text-xs text-gray-400">this month</span>
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

      {/* Second Row - Progress Overview & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Platform Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold-500" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Average Progress</span>
                <span className="text-sm font-semibold text-burgundy-600">
                  {Math.round(stats.avgProgress)}%
                </span>
              </div>
              <Progress value={stats.avgProgress} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.completionRate}%
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">User Engagement</span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </span>
              </div>
              <Progress
                value={Math.round((stats.activeUsers / stats.totalUsers) * 100)}
                className="h-2"
              />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
                  <p className="text-xs text-gray-500">Published Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                  <p className="text-xs text-gray-500">Total Messages</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent New Users */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-burgundy-500" />
              New Users
            </CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(user.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-500" />
              Top Courses
            </CardTitle>
            <Link href="/admin/courses">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {stats.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center text-burgundy-700 font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course._count.enrollments}
                      </span>
                      {course.analytics?.avgRating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                          {Number(course.analytics.avgRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Recent Enrollments
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {stats.newUsersThisWeek} this week
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {stats.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={enrollment.user.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                      {enrollment.user.firstName?.charAt(0)}{enrollment.user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enrolled in <span className="font-medium text-burgundy-600">{enrollment.course.title}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(enrollment.enrolledAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-burgundy-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/courses" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all group">
                <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center group-hover:bg-burgundy-200">
                  <BookOpen className="w-5 h-5 text-burgundy-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700">Manage Courses</p>
                  <p className="text-xs text-gray-500">{stats.totalCourses} total</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </div>
            </Link>
            <Link href="/admin/users" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700">User Management</p>
                  <p className="text-xs text-gray-500">{stats.totalUsers} users</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </div>
            </Link>
            <Link href="/admin/communications" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all group">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700">Communications</p>
                  <p className="text-xs text-gray-500">Send bulk messages</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </div>
            </Link>
            <Link href="/admin/analytics" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all group">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700">Analytics</p>
                  <p className="text-xs text-gray-500">View reports</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </div>
            </Link>
            <Link href="/messages" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-50 transition-all group relative">
                <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center group-hover:bg-gold-200">
                  <MessageSquare className="w-5 h-5 text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700">Messages</p>
                  <p className="text-xs text-gray-500">Direct messages</p>
                </div>
                {stats.unreadMessages > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {stats.unreadMessages}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
