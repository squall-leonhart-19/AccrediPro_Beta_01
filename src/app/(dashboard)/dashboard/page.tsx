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
import { getSpecializationTrack } from "@/lib/specialization-tracks";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Play,
  MessageSquare,
  GraduationCap,
  CheckCircle,
  Target,
  Trophy,
  Flame,
  ChevronRight,
  Lock,
  Map,
  Users,
  Shield,
  TrendingUp,
} from "lucide-react";

// Career stages with income potential
const CAREER_STAGES = [
  { id: 1, title: "Certified Practitioner", income: "$3K-$5K/month", status: "locked" },
  { id: 2, title: "Working Practitioner", income: "$5K-$10K/month", status: "locked" },
  { id: 3, title: "Advanced & Master", income: "$10K-$30K/month", status: "locked" },
  { id: 4, title: "Business Scaler", income: "$30K-$50K/month", status: "locked" },
];

async function getDashboardData(userId: string) {
  const [enrollments, certificates, recentActivity, coach, userStreak, badges, user, userTags] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              where: { isPublished: true },
              include: {
                lessons: {
                  where: { isPublished: true },
                  select: { id: true, title: true },
                },
              },
              orderBy: { order: "asc" },
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
    prisma.userStreak.findUnique({ where: { userId } }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take: 4,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { hasCompletedOnboarding: true },
    }),
    prisma.userTag.findMany({
      where: { userId },
      select: { tag: true },
    }),
  ]);

  // Get completed lessons for this user
  const completedLessonIds = await prisma.lessonProgress.findMany({
    where: { userId, isCompleted: true },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedLessonIds.map((l) => l.lessonId));

  const totalWatchTime = await prisma.lessonProgress.aggregate({
    where: { userId },
    _sum: { watchTime: true },
  });

  const completedLessons = completedLessonIds.length;

  // Get specialization from tags
  const tagStrings = userTags.map((t) => t.tag);
  const specialization = getSpecializationTrack(tagStrings);

  // Find next incomplete lesson
  let nextLesson: { title: string; courseSlug: string; lessonId: string; moduleName: string } | null = null;
  for (const enrollment of enrollments) {
    if (enrollment.status !== "COMPLETED") {
      for (const module of enrollment.course.modules) {
        for (const lesson of module.lessons) {
          if (!completedSet.has(lesson.id)) {
            nextLesson = {
              title: lesson.title,
              courseSlug: enrollment.course.slug,
              lessonId: lesson.id,
              moduleName: module.title,
            };
            break;
          }
        }
        if (nextLesson) break;
      }
    }
    if (nextLesson) break;
  }

  return {
    enrollments,
    certificates,
    recentActivity,
    totalWatchTime: totalWatchTime._sum.watchTime || 0,
    coach: coach?.course?.coach || null,
    userStreak,
    badges,
    hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
    specialization,
    nextLesson,
    completedLessonsCount: completedLessons,
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
    hasCompletedOnboarding,
    specialization,
    nextLesson,
    completedLessonsCount,
  } = await getDashboardData(session.user.id);

  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE").length;
  const firstName = session.user.firstName || "Practitioner";

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  // Determine current career stage
  const getCurrentStage = () => {
    if (completedCourses >= 4) return { stage: 4, title: "Business Scaler", status: "active" };
    if (completedCourses >= 3) return { stage: 3, title: "Advanced & Master", status: "in_progress" };
    if (completedCourses >= 2) return { stage: 2, title: "Working Practitioner", status: "in_progress" };
    if (completedCourses >= 1 || inProgressCourses > 0) return { stage: 1, title: "Certified Practitioner", status: "in_progress" };
    return { stage: 0, title: "Exploration", status: "exploration" };
  };

  const currentCareer = getCurrentStage();

  // Get career stage message - focused on earning potential and life transformation
  const getCareerMessage = () => {
    if (currentCareer.stage === 0) {
      return "Start your journey to a rewarding career helping others transform their health — and earn $3K-$50K+/month doing what you love.";
    }
    if (currentCareer.stage === 1) {
      return "You're on your way to earning $3K-$5K/month as a Certified Practitioner. Keep going — your new career awaits!";
    }
    if (currentCareer.stage === 2) {
      return "Building toward $5K-$10K/month with your own practice. You're turning your passion into a real income.";
    }
    if (currentCareer.stage === 3) {
      return "Advancing to $10K-$30K/month as an industry authority. Premium clients and premium rates ahead!";
    }
    return "Scaling to $30K-$50K+/month with teams and leverage. You're building a wellness empire!";
  };

  // Get meaningful activity interpretations
  const getActivityMeaning = (activity: typeof recentActivity[0]) => {
    const lessonTitle = activity.lesson.title.toLowerCase();
    if (lessonTitle.includes("orientation") || lessonTitle.includes("welcome")) {
      return "You're officially inside the program";
    }
    if (lessonTitle.includes("community") || lessonTitle.includes("support")) {
      return "Support is available when you need it";
    }
    if (lessonTitle.includes("assessment") || lessonTitle.includes("quiz")) {
      return "You've validated your understanding";
    }
    return "Progress toward your certification";
  };

  return (
    <DashboardWrapper userName={firstName} userId={session.user.id} hasCompletedOnboarding={hasCompletedOnboarding}>
      <div className="space-y-6 animate-fade-in">
        {/* ACCREDIPRO HERO HEADER */}
        <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <CardContent className="p-6 md:p-8 relative">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* AccrediPro Branding */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Shield className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-1">
                      AccrediPro Dashboard
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      Welcome back, {firstName}!
                    </h1>
                  </div>
                </div>

                {/* Career Context */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4 max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-400/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-gold-300" />
                    </div>
                    <div>
                      <p className="text-burgundy-200 text-xs">Your Career Path</p>
                      <p className="text-white font-semibold">{specialization.name} Practitioner</p>
                    </div>
                    <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                      {currentCareer.title}
                    </Badge>
                  </div>
                </div>

                <p className="text-burgundy-100 text-base max-w-lg">
                  {getCareerMessage()}
                </p>
              </div>

              {/* Next Best Step Card */}
              <div className="lg:w-80 bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 text-burgundy-700 font-semibold mb-3">
                  <Target className="w-5 h-5" />
                  Your Next Step
                </div>
                {nextLesson ? (
                  <>
                    <p className="text-gray-900 font-medium mb-1 line-clamp-2">
                      {nextLesson.title}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Continue building toward {currentCareer.title}.
                    </p>
                    <Link href={`/learning/${nextLesson.courseSlug}/${nextLesson.lessonId}`}>
                      <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Lesson
                      </Button>
                    </Link>
                  </>
                ) : enrollments.length === 0 ? (
                  <>
                    <p className="text-gray-900 font-medium mb-1">
                      Start Your Free Mini Diploma
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Begin your journey to certification with AccrediPro.
                    </p>
                    <Link href="/roadmap">
                      <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold">
                        View My Roadmap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-900 font-medium mb-1">
                      Explore Your Next Certification
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Continue advancing your AccrediPro career.
                    </p>
                    <Link href="/roadmap">
                      <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 font-semibold">
                        View My Roadmap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid - Cleaner Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{inProgressCourses}</p>
              <p className="text-xs text-burgundy-100">Active Courses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{completedCourses}</p>
              <p className="text-xs text-emerald-100">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-500 to-amber-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{certificates}</p>
              <p className="text-xs text-amber-100">Certificates</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{formatWatchTime(totalWatchTime) || "0m"}</p>
              <p className="text-xs text-blue-100">Study Time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* FIX #5 - Step-Based Course List */}
            {enrollments.length > 0 ? (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-burgundy-600" />
                        Your Courses
                      </h2>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-green-700">297 learning now</span>
                      </div>
                    </div>
                    <Link href="/my-courses">
                      <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {enrollments.slice(0, 4).map((enrollment) => {
                      // FIX #1 - Proper step labeling aligned with career ladder
                      const courseTitle = enrollment.course.title.toLowerCase();
                      const certType = enrollment.course.certificateType;

                      // Determine course type and label
                      const isMiniDiploma = courseTitle.includes("mini diploma") || certType === "MINI_DIPLOMA";
                      const isAssessment = courseTitle.includes("test") || courseTitle.includes("assessment") || courseTitle.includes("exam");
                      const isCertification = courseTitle.includes("certification") || certType === "CERTIFICATION";

                      let stepLabel: string;
                      let labelColor: string;

                      if (isMiniDiploma) {
                        stepLabel = "EXPLORATION (Pre-Step)";
                        labelColor = "bg-purple-100 text-purple-700";
                      } else if (isCertification) {
                        stepLabel = "STEP 1 — CERTIFIED PRACTITIONER";
                        labelColor = "bg-emerald-100 text-emerald-700";
                      } else if (isAssessment) {
                        stepLabel = "MILESTONE (Assessment)";
                        labelColor = "bg-amber-100 text-amber-700";
                      } else {
                        stepLabel = "CORE TRAINING";
                        labelColor = "bg-burgundy-100 text-burgundy-700";
                      }

                      return (
                        <Link
                          key={enrollment.id}
                          href={`/courses/${enrollment.course.slug}`}
                          className="block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 border border-transparent hover:border-burgundy-100 transition-all group">
                            <div className="w-16 h-16 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-burgundy-200">
                              <GraduationCap className="w-8 h-8 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`text-xs border-0 ${labelColor}`}>
                                  {stepLabel}
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

                              <div className="mt-2 flex items-center gap-3">
                                <Progress value={enrollment.progress} className="h-2 flex-1 max-w-[180px]" />
                                <span className="text-sm font-semibold text-burgundy-600">
                                  {Math.round(enrollment.progress)}%
                                </span>
                                <span className="text-xs text-gray-500">
                                  {enrollment.course.modules.length} modules
                                </span>
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
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-4">
                    <Map className="w-8 h-8 text-burgundy-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Career Path</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    View your personalized roadmap and begin your journey to certification.
                  </p>
                  <Link href="/roadmap">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                      View My Roadmap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* FIX #3 & #6 - Meaningful Recent Activity with Next Action */}
            {recentActivity.length > 0 && (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-burgundy-600" />
                    Recent Progress
                  </h2>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.lesson.title}
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            {getActivityMeaning(activity)}
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

                  {/* FIX #3 - Next action at bottom of Recent Progress */}
                  {nextLesson && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="text-burgundy-600">Next milestone:</span> Complete the Mini Diploma to unlock your Certified Practitioner pathway.
                          </p>
                        </div>
                        <Link href={`/learning/${nextLesson.courseSlug}/${nextLesson.lessonId}`}>
                          <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                            Continue Lesson
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AccrediPro Career Ladder */}
            <Card className="card-premium overflow-hidden">
              <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold-400" />
                  Your Career Ladder
                </h3>
                <p className="text-burgundy-200 text-xs mt-1">Unlock income levels as you progress</p>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {CAREER_STAGES.map((stage, index) => {
                    const isUnlocked = currentCareer.stage >= stage.id;
                    const isCurrent = currentCareer.stage === stage.id - 1;
                    const isNext = currentCareer.stage === stage.id;

                    // Gradient colors for each step
                    const stepColors = [
                      { bg: "from-emerald-500 to-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
                      { bg: "from-amber-500 to-amber-600", light: "bg-amber-50", border: "border-amber-200" },
                      { bg: "from-blue-500 to-blue-600", light: "bg-blue-50", border: "border-blue-200" },
                      { bg: "from-burgundy-500 to-burgundy-600", light: "bg-burgundy-50", border: "border-burgundy-200" },
                    ];
                    const colors = stepColors[index];

                    return (
                      <div
                        key={stage.id}
                        className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${isUnlocked
                            ? `${colors.light} ${colors.border} border`
                            : isCurrent || isNext
                              ? "bg-gray-50 border border-gray-200 ring-2 ring-burgundy-400/50"
                              : "bg-gray-50 border border-gray-100 opacity-60"
                          }`}
                      >
                        {/* Step Number */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${isUnlocked || isCurrent || isNext
                            ? `bg-gradient-to-br ${colors.bg}`
                            : "bg-gray-300"
                          }`}>
                          {isUnlocked ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span>{stage.id}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${isUnlocked ? "text-gray-900" : isCurrent || isNext ? "text-gray-800" : "text-gray-500"
                              }`}>
                              {stage.title}
                            </p>
                            {(isCurrent || isNext) && !isUnlocked && (
                              <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs px-2 py-0">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs font-medium ${isUnlocked ? "text-green-600" : "text-gray-400"
                            }`}>
                            {stage.income}
                          </p>
                        </div>

                        {/* Connecting line */}
                        {index < CAREER_STAGES.length - 1 && (
                          <div className={`absolute left-7 top-full w-0.5 h-2 ${isUnlocked ? "bg-green-400" : "bg-gray-200"
                            }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link href="/roadmap" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                    <Map className="w-4 h-4 mr-2" />
                    View Full Roadmap
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help? - Compact Coach Card */}
            <Card className="border border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy-200 shadow-md">
                      <img
                        src="/coaches/sarah-coach.webp"
                        alt="Coach Sarah"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">Need Help?</p>
                    <p className="text-xs text-gray-500">Sarah responds in &lt;2 hours</p>
                  </div>
                  <Link href="/messages">
                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* FIX #9 - Student Momentum */}
            <Card className="card-premium bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Student Momentum
                </h3>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-gray-700 italic mb-2">
                    "Just completed my first intake session with confidence."
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    — Working Practitioner
                  </p>
                </div>
                <Link href="/community">
                  <Button variant="ghost" size="sm" className="w-full mt-3 text-green-700 hover:bg-green-100">
                    View Student Progress
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/roadmap" className="block">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-burgundy-50 transition-colors">
                      <Map className="w-4 h-4 text-burgundy-600" />
                      <span className="text-sm text-gray-700">My Roadmap</span>
                    </div>
                  </Link>
                  <Link href="/career-center" className="block">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-burgundy-50 transition-colors">
                      <Target className="w-4 h-4 text-gold-600" />
                      <span className="text-sm text-gray-700">Career Center</span>
                    </div>
                  </Link>
                  <Link href="/certificates" className="block">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-burgundy-50 transition-colors">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">My Certificates</span>
                    </div>
                  </Link>
                  <Link href="/community" className="block">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-burgundy-50 transition-colors">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Community</span>
                    </div>
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
