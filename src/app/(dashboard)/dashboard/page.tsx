import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
  Play,
  MessageSquare,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Calendar,
  Zap,
  Target,
  Trophy,
  Flame,
  Star,
  ChevronRight,
} from "lucide-react";

async function getDashboardData(userId: string) {
  const [enrollments, certificates, recentActivity, coach, totalUsers, userStreak, badges, user] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: "desc" },
      take: 5,
    }),
    prisma.certificate.count({ where: { userId } }),
    prisma.lessonProgress.findMany({
      where: { userId, isCompleted: true },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
    prisma.enrollment.findFirst({
      where: { userId, course: { coachId: { not: null } } },
      include: {
        course: {
          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
    }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.userStreak.findUnique({ where: { userId } }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take: 3,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { hasCompletedOnboarding: true },
    }),
  ]);

  const [totalWatchTime, completedLessonsThisWeek, moduleProgress] = await Promise.all([
    prisma.lessonProgress.aggregate({
      where: { userId },
      _sum: { watchTime: true },
    }),
    prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.moduleProgress.findMany({
      where: { userId, isCompleted: true },
    }),
  ]);

  // Calculate percentile
  const completedLessons = await prisma.lessonProgress.count({
    where: { userId, isCompleted: true },
  });
  const avgCompletions = totalUsers > 0 ? completedLessons / totalUsers : 0;
  const percentile = Math.min(95, Math.max(10, Math.round(50 + (completedLessons - avgCompletions) * 5)));

  return {
    enrollments,
    certificates,
    recentActivity,
    totalWatchTime: totalWatchTime._sum.watchTime || 0,
    coach: coach?.course?.coach || null,
    totalUsers,
    userStreak,
    badges,
    completedLessonsThisWeek,
    moduleProgressCount: moduleProgress.length,
    percentile,
    hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const {
    enrollments,
    certificates,
    recentActivity,
    totalWatchTime,
    coach,
    userStreak,
    badges,
    completedLessonsThisWeek,
    percentile,
    hasCompletedOnboarding,
  } = await getDashboardData(session.user.id);

  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE").length;

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  // Calculate next best step
  const getNextBestStep = () => {
    if (enrollments.length === 0) {
      return { text: "Start your first course", link: "/courses", icon: BookOpen };
    }
    const activeEnrollment = enrollments.find(e => e.status === "ACTIVE" && e.progress < 100);
    if (activeEnrollment) {
      return {
        text: `Continue "${activeEnrollment.course.title}"`,
        link: `/courses/${activeEnrollment.course.slug}`,
        icon: Play,
      };
    }
    return { text: "Explore new courses", link: "/courses", icon: BookOpen };
  };

  const nextStep = getNextBestStep();

  // AI Insights
  const getInsights = () => {
    const insights = [];

    if (percentile >= 80) {
      insights.push({
        icon: Trophy,
        text: `You're in the top ${100 - percentile}% of students this week!`,
        color: "text-gold-600",
        bg: "bg-gold-50",
      });
    } else if (percentile >= 60) {
      insights.push({
        icon: TrendingUp,
        text: `You're outpacing ${percentile}% of other learners!`,
        color: "text-green-600",
        bg: "bg-green-50",
      });
    }

    if (totalWatchTime > 3600) {
      insights.push({
        icon: Zap,
        text: "Your dedication shows - you've studied over an hour!",
        color: "text-purple-600",
        bg: "bg-purple-50",
      });
    }

    if ((userStreak?.currentStreak || 0) >= 3) {
      insights.push({
        icon: Flame,
        text: `${userStreak?.currentStreak} day streak! Your consistency shows coaching potential`,
        color: "text-orange-600",
        bg: "bg-orange-50",
      });
    }

    if (completedLessonsThisWeek >= 5) {
      insights.push({
        icon: Star,
        text: `Amazing progress! You completed ${completedLessonsThisWeek} lessons this week`,
        color: "text-burgundy-600",
        bg: "bg-burgundy-50",
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: Target,
        text: "Complete 3 lessons this week to unlock progress insights!",
        color: "text-gray-600",
        bg: "bg-gray-50",
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <DashboardWrapper userName={session.user.firstName || "Learner"} userId={session.user.id} hasCompletedOnboarding={hasCompletedOnboarding}>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Welcome Header */}
        <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <CardContent className="p-8 lg:p-10 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-gold-300 text-sm font-medium mb-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  Welcome Back
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Hello, {session.user.firstName || "Learner"}!
                </h1>
                <p className="text-burgundy-100 text-lg mb-6 max-w-xl">
                  Continue your journey to excellence in Functional Medicine. You&apos;re making great progress!
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href={nextStep.link}>
                    <Button className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 shadow-lg font-semibold">
                      <nextStep.icon className="w-4 h-4 mr-2" />
                      {nextStep.text.length > 25 ? "Continue Learning" : nextStep.text}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  {coach && (
                    <Link href={`/messages?to=${coach.id}`}>
                      <Button className="bg-burgundy-500 hover:bg-burgundy-400 text-white border border-white/30">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Coach
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Next Best Step Card */}
              <div className="lg:w-80 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center gap-2 text-gold-300 font-semibold mb-3">
                  <Target className="w-5 h-5" />
                  Your Next Best Step
                </div>
                <p className="text-white/90 mb-4 text-sm">{nextStep.text}</p>
                <Link href={nextStep.link}>
                  <Button size="sm" className="w-full bg-white text-burgundy-700 hover:bg-white/90 font-semibold">
                    Go Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Progress Insights */}
        {insights.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.slice(0, 4).map((insight, i) => (
              <Card key={i} className={`${insight.bg} border-0`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <p className={`text-sm font-medium ${insight.color}`}>{insight.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Grid - Enhanced with Streak */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-burgundy-100 to-burgundy-50">
                  <BookOpen className="w-6 h-6 text-burgundy-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{inProgressCourses}</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{completedCourses}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gold-100 to-gold-50">
                  <Award className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{certificates}</p>
                  <p className="text-sm text-gray-500">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatWatchTime(totalWatchTime)}</p>
                  <p className="text-sm text-gray-500">Watch Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{userStreak?.currentStreak || 0}</p>
                  <p className="text-sm text-gray-500">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning - Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {enrollments.length > 0 ? (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Play className="w-5 h-5 text-burgundy-600" />
                      Continue Learning
                    </h2>
                    <Link href="/courses">
                      <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {enrollments.slice(0, 3).map((enrollment) => {
                      const totalLessons = enrollment.course.modules.reduce(
                        (acc, m) => acc + m.lessons.length,
                        0
                      );
                      const completedModules = 0; // Placeholder

                      return (
                        <Link
                          key={enrollment.id}
                          href={`/courses/${enrollment.course.slug}`}
                          className="block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 border border-transparent hover:border-burgundy-100 transition-all group">
                            <div className="w-20 h-20 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-burgundy-200">
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gold-100 text-gold-700 border-0 text-xs">
                                  {enrollment.course.certificateType.replace("_", " ")}
                                </Badge>
                                {enrollment.status === "COMPLETED" && (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 truncate group-hover:text-burgundy-700 transition-colors">
                                {enrollment.course.title}
                              </h3>

                              {/* Enhanced Progress Info */}
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-3">
                                  <Progress value={enrollment.progress} className="h-2 flex-1 max-w-[200px]" />
                                  <span className="text-sm font-semibold text-burgundy-600">
                                    {Math.round(enrollment.progress)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{enrollment.course.modules.length} modules</span>
                                  <span>•</span>
                                  <span>{totalLessons} lessons</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center group-hover:bg-burgundy-600 transition-colors">
                                <Play className="w-5 h-5 text-burgundy-600 group-hover:text-white transition-colors" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-premium">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-burgundy-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Learning Journey</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Explore our Functional Medicine courses and begin your path to professional certification.
                  </p>
                  <Link href="/courses">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                      Browse Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-burgundy-600" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.lesson.module.course.title}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {activity.completedAt
                            ? new Date(activity.completedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges Earned */}
            {badges.length > 0 && (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold-600" />
                    Recent Badges
                  </h3>
                  <div className="space-y-3">
                    {badges.map((userBadge) => (
                      <div key={userBadge.id} className="flex items-center gap-3 p-3 bg-gold-50 rounded-xl">
                        <span className="text-2xl">{userBadge.badge.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{userBadge.badge.name}</p>
                          <p className="text-xs text-gray-500">{userBadge.badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Your Coach Card */}
            {coach && (
              <Card className="card-premium overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-burgundy-500 to-burgundy-600 relative">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400 rounded-full blur-2xl -translate-y-1/2" />
                  </div>
                </div>
                <CardContent className="p-6 -mt-10 relative">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl mb-3">
                      <AvatarImage src={coach.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-xl font-bold">
                        {getInitials(coach.firstName, coach.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="mb-2 bg-gold-100 text-gold-700 border-0">
                      Your Coach
                    </Badge>
                    <h3 className="font-semibold text-gray-900">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    {coach.bio && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{coach.bio}</p>
                    )}
                    <div className="flex gap-2 mt-4 w-full">
                      <Link href={`/messages?to=${coach.id}`} className="flex-1">
                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      <Link href="/mentorship">
                        <Button variant="outline" size="sm" className="border-burgundy-200 text-burgundy-600">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/courses" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-burgundy-100">
                        <BookOpen className="w-5 h-5 text-burgundy-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Browse Courses</span>
                    </div>
                  </Link>
                  <Link href="/community" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-gold-100">
                        <MessageSquare className="w-5 h-5 text-gold-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Community</span>
                    </div>
                  </Link>
                  <Link href="/certificates" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">My Certificates</span>
                    </div>
                  </Link>
                  <Link href="/mentorship" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">My Coach</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-burgundy-600" />
                  Upcoming
                </h3>
                <div className="text-center py-6 text-gray-500 text-sm">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p>No upcoming sessions</p>
                  <Link href="/mentorship">
                    <Button variant="link" size="sm" className="text-burgundy-600 mt-2">
                      Schedule with coach
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
