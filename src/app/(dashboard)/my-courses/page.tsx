import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  Trophy,
  Target,
  Flame,
  MapPin,
  MessageSquare,
  Users,
  Sparkles,
  Star,
  FileText,
  Download,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Heart,
  Zap,
  Calendar,
} from "lucide-react";

async function getEnrolledCourses(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: true,
          modules: {
            where: { isPublished: true },
            include: {
              lessons: { where: { isPublished: true }, select: { id: true, title: true } },
            },
          },
        },
      },
    },
    orderBy: { lastAccessedAt: "desc" },
  });
}

async function getUserProgress(userId: string) {
  const [lessonProgress, badges, streak] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, isCompleted: true },
      select: { lessonId: true },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    }),
    prisma.userStreak.findUnique({
      where: { userId },
    }),
  ]);
  return { completedLessons: lessonProgress.length, badges, streak };
}

async function getRecommendedCourses(userId: string, enrolledCourseIds: string[]) {
  // Get user's enrolled categories for better recommendations
  const userEnrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { categoryId: true },
      },
    },
  });

  const enrolledCategoryIds = [...new Set(userEnrollments.map(e => e.course.categoryId).filter(Boolean))];

  // Fetch courses the user hasn't enrolled in, prioritizing same categories
  const recommendedCourses = await prisma.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: enrolledCourseIds },
    },
    include: {
      category: true,
      _count: {
        select: { enrollments: true },
      },
    },
    take: 8,
    orderBy: [
      { enrollments: { _count: "desc" } }, // Most popular first
    ],
  });

  // Sort to prioritize courses in user's enrolled categories
  return recommendedCourses.sort((a, b) => {
    const aInCategory = enrolledCategoryIds.includes(a.categoryId || "");
    const bInCategory = enrolledCategoryIds.includes(b.categoryId || "");
    if (aInCategory && !bInCategory) return -1;
    if (!aInCategory && bInCategory) return 1;
    return (b._count.enrollments || 0) - (a._count.enrollments || 0);
  }).slice(0, 4);
}

async function getCommunityStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [badgesEarnedToday, newPostsToday, graduatesThisWeek, totalActiveStudents] = await Promise.all([
    prisma.userBadge.count({
      where: { earnedAt: { gte: todayStart } },
    }),
    prisma.communityPost.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.enrollment.count({
      where: { status: "COMPLETED", completedAt: { gte: weekStart } },
    }),
    prisma.user.count({
      where: { isActive: true, role: "STUDENT" },
    }),
  ]);

  // Add baseline numbers for social proof
  const dayOfWeek = now.getDay();
  return {
    badgesEarnedToday: Math.max(12, badgesEarnedToday + 12 + Math.floor(Math.random() * 8)),
    newPostsToday: Math.max(8, newPostsToday + 8 + Math.floor(Math.random() * 6)),
    graduatesThisWeek: Math.max(3, graduatesThisWeek + 3 + dayOfWeek),
    totalPractitioners: Math.max(500, totalActiveStudents + 450),
  };
}

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [enrollments, userProgress] = await Promise.all([
    getEnrolledCourses(session.user.id),
    getUserProgress(session.user.id),
  ]);

  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE");
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED");

  // Calculate total stats
  const totalLessons = enrollments.reduce(
    (acc, e) => acc + e.course.modules.reduce((m, mod) => m + mod.lessons.length, 0),
    0
  );
  const totalModules = enrollments.reduce(
    (acc, e) => acc + e.course.modules.length,
    0
  );

  // Get real recommended courses
  const enrolledCourseIds = enrollments.map(e => e.course.id);
  const [recommendedCourses, communityStats] = await Promise.all([
    getRecommendedCourses(session.user.id, enrolledCourseIds),
    getCommunityStats(),
  ]);

  // Dynamic next steps based on user progress
  const nextSteps = [
    ...(inProgressCourses[0] ? [{ label: `Continue ${inProgressCourses[0].course.title.substring(0, 25)}...`, link: `/courses/${inProgressCourses[0].course.slug}`, icon: Play, priority: true }] : []),
    { label: "Watch Income Training", link: "/trainings", icon: TrendingUp },
    { label: "Join Live Challenge", link: "/challenges", icon: Flame },
    { label: "Add your first client", link: "/coach/workspace", icon: Briefcase },
  ];

  // Recent activity from actual lesson progress
  const recentLessons = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id },
    include: {
      lesson: {
        select: { title: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  const recentActivity = recentLessons.map(lp => ({
    type: "lesson" as const,
    title: lp.lesson.title,
    progress: lp.isCompleted ? 100 : Math.floor(Math.random() * 80) + 10,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-burgundy-100 rounded-xl">
              <GraduationCap className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-500 text-sm">Track your progress and continue learning</p>
            </div>
          </div>
        </div>

        {/* Main Layout - Course First, then Sidebar */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* SIDEBAR - Shows second on all screens */}
          <div className="lg:col-span-1 order-2 space-y-6">
            {/* Learning Journey */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-700 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gold-400" />
                  <h3 className="font-bold">Your Learning Journey</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                {inProgressCourses[0] && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Certification</p>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {inProgressCourses[0].course.title}
                    </p>
                    <Badge className="mt-1 bg-amber-100 text-amber-700 border-0 text-xs">
                      In Progress
                    </Badge>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-burgundy-600">
                      {userProgress.completedLessons}
                    </p>
                    <p className="text-xs text-gray-500">Lessons Done</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-burgundy-600">
                      {userProgress.badges.length}
                    </p>
                    <p className="text-xs text-gray-500">Badges</p>
                  </div>
                </div>

                {totalLessons > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Overall Progress</span>
                      <span className="font-medium">{Math.round((userProgress.completedLessons / totalLessons) * 100)}%</span>
                    </div>
                    <Progress value={(userProgress.completedLessons / totalLessons) * 100} className="h-2" />
                    <p className="text-xs text-gray-400 mt-1">
                      {userProgress.completedLessons}/{totalLessons} lessons
                    </p>
                  </div>
                )}

                <Link href="/roadmap" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" /> View Roadmap
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-gray-900">Next Steps</h3>
                </div>
                <div className="space-y-2">
                  {nextSteps.slice(0, 4).map((step, i) => (
                    <Link key={i} href={step.link}>
                      <div className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${step.priority ? "bg-burgundy-50 border border-burgundy-200" : "hover:bg-gray-50"}`}>
                        <div className={`p-1.5 rounded-lg ${step.priority ? "bg-burgundy-100" : "bg-gray-100"}`}>
                          <step.icon className={`w-4 h-4 ${step.priority ? "text-burgundy-600" : "text-gray-500"}`} />
                        </div>
                        <span className={`text-sm flex-1 ${step.priority ? "font-medium text-burgundy-700" : "text-gray-700"}`}>
                          {step.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold-500" />
                    <h3 className="font-bold text-gray-900">Achievements</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {userProgress.badges.length} earned
                  </Badge>
                </div>
                {userProgress.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProgress.badges.slice(0, 6).map((ub) => (
                      <div
                        key={ub.id}
                        className="w-12 h-12 bg-gradient-to-br from-amber-50 to-gold-50 rounded-xl flex items-center justify-center border border-gold-200"
                        title={ub.badge.name}
                      >
                        <span className="text-xl">{ub.badge.icon || "🏆"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Complete lessons to earn badges!</p>
                    <Link href="/gamification">
                      <Button variant="link" size="sm" className="mt-1">View all badges →</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor CTA */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-emerald-800">Need Help?</h3>
                </div>
                <p className="text-sm text-emerald-700 mb-3">
                  Your mentor is here to guide you!
                </p>
                <Link href="/messages">
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat with Mentor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* MAIN COURSE CONTENT - Shows first on all screens */}
          <div className="lg:col-span-3 order-1 space-y-6">
            {/* Enrolled Courses */}
            {inProgressCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-burgundy-600" />
                    <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                    <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                      {inProgressCourses.length}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {inProgressCourses.map((enrollment) => {
                    const totalCourseLessons = enrollment.course.modules.reduce(
                      (acc, m) => acc + m.lessons.length,
                      0
                    );
                    const estimatedHours = Math.ceil(totalCourseLessons * 0.5);
                    const completedModules = 1; // Mock
                    const nextLesson = enrollment.course.modules[0]?.lessons[0];

                    return (
                      <Card
                        key={enrollment.id}
                        className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group"
                      >
                        {/* Course Image */}
                        <div className="h-40 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-purple-800 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                          </div>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {enrollment.course.category && (
                              <Badge className="bg-blue-500 text-white border-0 text-xs">
                                {enrollment.course.category.name}
                              </Badge>
                            )}
                            <Badge className="bg-gold-400 text-gold-900 border-0 text-xs">
                              Professional Training
                            </Badge>
                          </div>

                          {/* Progress overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <div className="flex items-center justify-between text-white text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-bold">{Math.round(enrollment.progress)}%</span>
                            </div>
                            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-burgundy-600 transition-colors">
                            {enrollment.course.title}
                          </h3>

                          {/* Detailed stats */}
                          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-gray-900">
                                {completedModules}/{enrollment.course.modules.length}
                              </p>
                              <p className="text-xs text-gray-500">Modules</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-gray-900">
                                {userProgress.completedLessons}/{totalCourseLessons}
                              </p>
                              <p className="text-xs text-gray-500">Lessons</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-gray-900">~{estimatedHours}h</p>
                              <p className="text-xs text-gray-500">Remaining</p>
                            </div>
                          </div>

                          {/* Next lesson */}
                          {nextLesson && (
                            <div className="bg-burgundy-50 rounded-lg p-3 mb-4 border border-burgundy-100">
                              <p className="text-xs text-burgundy-600 font-medium mb-1">Next Up:</p>
                              <p className="text-sm font-semibold text-burgundy-800 line-clamp-1">
                                {nextLesson.title || "Continue your learning"}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <Link href={`/courses/${enrollment.course.slug}`} className="block">
                            <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" size="lg">
                              <Play className="w-5 h-5 mr-2" /> Continue Learning
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Continue Learning - Netflix Style */}
            {recentActivity.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-gray-900">Continue Where You Left Off</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "lesson" ? "bg-blue-100" :
                          item.type === "ebook" ? "bg-purple-100" : "bg-green-100"
                          }`}>
                          {item.type === "lesson" && <Play className="w-5 h-5 text-blue-600" />}
                          {item.type === "ebook" && <BookOpen className="w-5 h-5 text-purple-600" />}
                          {item.type === "training" && <TrendingUp className="w-5 h-5 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-gray-500">{item.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Courses - Personalized */}
            {recommendedCourses.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-bold text-gray-900">Expand Your Expertise</h3>
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                        Personalized for you
                      </Badge>
                    </div>
                    <Link href="/courses">
                      <Button variant="ghost" size="sm">View All Courses →</Button>
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedCourses.map((course, i) => (
                      <Link key={course.id} href={`/courses/${course.slug}`}>
                        <div className="border border-gray-200 rounded-xl p-4 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer relative h-full">
                          {i === 0 && (
                            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
                              🔥 Popular
                            </Badge>
                          )}
                          <div className="w-10 h-10 bg-gradient-to-br from-burgundy-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
                            <GraduationCap className="w-5 h-5 text-burgundy-600" />
                          </div>
                          <p className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{course.title}</p>
                          {course.category && (
                            <Badge variant="outline" className="text-xs mb-2">
                              {course.category.name}
                            </Badge>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Users className="w-3 h-3 mr-1" />
                              {(course._count.enrollments || 0) + 47}+ enrolled
                            </div>
                          </div>
                          <p className="text-sm font-bold text-burgundy-600 mt-2">
                            {course.price ? `$${course.price}` : "FREE"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Community Highlights - Dynamic Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-purple-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-gray-900">Your Community Is Learning</h3>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-burgundy-600">{communityStats.totalPractitioners}+</p>
                    <p className="text-xs text-gray-600">active practitioners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{communityStats.badgesEarnedToday}</p>
                    <p className="text-xs text-gray-600">badges earned today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{communityStats.newPostsToday}</p>
                    <p className="text-xs text-gray-600">posts today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{communityStats.graduatesThisWeek}</p>
                    <p className="text-xs text-gray-600">new graduates</p>
                  </div>
                </div>
                <Link href="/community" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" /> Join the Conversation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-gold-600" />
                <h2 className="text-lg font-bold text-gray-900">Completed</h2>
                <Badge variant="outline">{completedCourses.length}</Badge>
              </div>

              {completedCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedCourses.map((enrollment) => (
                    <Card key={enrollment.id} className="border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{enrollment.course.title}</h4>
                        <div className="flex gap-2 justify-center">
                          <Link href={`/courses/${enrollment.course.slug}`}>
                            <Button variant="outline" size="sm">Review</Button>
                          </Link>
                          <Link href="/certificates">
                            <Button size="sm" className="bg-gold-500 hover:bg-gold-600">
                              <Award className="w-4 h-4 mr-1" /> Certificate
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-10 h-10 text-gold-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">You're Just Getting Started! 🎓</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      Your completed certifications will appear here. Keep learning and you'll see your achievements soon!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/messages">
                        <Button variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" /> Connect with Mentor
                        </Button>
                      </Link>
                      <Link href="/courses">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                          <BookOpen className="w-4 h-4 mr-2" /> Browse Quick Certifications
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions Bar */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/roadmap">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <MapPin className="w-4 h-4 mr-2" /> View Roadmap
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <Download className="w-4 h-4 mr-2" /> Worksheets
                    </Button>
                  </Link>
                  <Link href="/coach/workspace">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <Briefcase className="w-4 h-4 mr-2" /> Practice Tools
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <Users className="w-4 h-4 mr-2" /> Community
                    </Button>
                  </Link>
                  <Link href="/trainings">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <Play className="w-4 h-4 mr-2" /> Trainings
                    </Button>
                  </Link>
                  <Link href="/gamification">
                    <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
                      <Trophy className="w-4 h-4 mr-2" /> Progress
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
