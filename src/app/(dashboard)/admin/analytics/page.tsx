import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  DollarSign,
  GraduationCap,
  MessageSquare,
  Activity,
} from "lucide-react";

async function getAnalytics() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    completedCourses,
    totalRevenue,
    courseAnalytics,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "COMPLETED" } }),
    prisma.courseAnalytics.aggregate({
      _sum: { totalRevenue: true },
    }),
    prisma.courseAnalytics.findMany({
      include: {
        course: {
          select: { title: true, slug: true },
        },
      },
    }),
    prisma.enrollment.findMany({
      take: 10,
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

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    completedCourses,
    totalRevenue: totalRevenue._sum.totalRevenue || 0,
    courseAnalytics,
    recentEnrollments,
  };
}

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const analytics = await getAnalytics();

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published Courses",
      value: analytics.totalCourses.toLocaleString(),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Enrollments",
      value: analytics.totalEnrollments.toLocaleString(),
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completions",
      value: analytics.completedCourses.toLocaleString(),
      icon: Award,
      color: "text-gold-600",
      bgColor: "bg-gold-100",
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-burgundy-600",
      bgColor: "bg-burgundy-100",
    },
    {
      title: "Completion Rate",
      value: `${analytics.totalEnrollments > 0 ? Math.round((analytics.completedCourses / analytics.totalEnrollments) * 100) : 0}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Analytics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-burgundy-600" />
            Course Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Enrolled</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Completed</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Avg Rating</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.courseAnalytics.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{course.course.title}</p>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {course.totalEnrolled.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {course.totalCompleted.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-gold-600 font-medium">
                        {course.avgRating.toFixed(1)}
                        <span className="text-gold-400">★</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ${course.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Enrollments */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-burgundy-600" />
            Recent Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {enrollment.user.firstName} {enrollment.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-burgundy-600">
                    {enrollment.course.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
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
