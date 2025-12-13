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

  // Get career stage message
  const getCareerMessage = () => {
    if (currentCareer.stage === 0) {
      return "You're exploring your path to becoming a certified practitioner.";
    }
    if (currentCareer.stage === 1) {
      return "You're building the skills to work confidently with real clients.";
    }
    if (currentCareer.stage === 2) {
      return "You're developing your practice and building your income foundation.";
    }
    if (currentCareer.stage === 3) {
      return "You're mastering advanced techniques and becoming an industry authority.";
    }
    return "You're scaling your business and building leverage.";
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
        {/* FIX #1 - Career Context Header */}
        <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <CardContent className="p-6 md:p-8 relative">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                {/* Welcome + Career Context */}
                <div className="inline-flex items-center gap-2 text-gold-300 text-sm font-medium mb-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  Welcome back, {firstName}
                </div>

                <div className="mb-4">
                  <p className="text-burgundy-200 text-sm mb-1">Career Path</p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {specialization.name} Practitioner
                  </h1>
                </div>

                <div className="mb-4">
                  <p className="text-burgundy-200 text-sm mb-1">Current Stage</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-base px-3 py-1">
                      {currentCareer.title}
                    </Badge>
                    {currentCareer.status === "in_progress" && (
                      <span className="text-gold-300 text-sm">(In Progress)</span>
                    )}
                  </div>
                </div>

                <p className="text-burgundy-100 text-base max-w-xl">
                  {getCareerMessage()}
                </p>
              </div>

              {/* FIX #2 - Smarter Next Best Step */}
              <div className="lg:w-80 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center gap-2 text-gold-300 font-semibold mb-3">
                  <Target className="w-5 h-5" />
                  Your Next Best Step
                </div>
                {nextLesson ? (
                  <>
                    <p className="text-white font-medium mb-1">
                      Complete "{nextLesson.title}"
                    </p>
                    <p className="text-burgundy-200 text-sm mb-4">
                      This moves you closer to {currentCareer.title} status.
                    </p>
                    <Link href={`/courses/${nextLesson.courseSlug}/learn/${nextLesson.lessonId}`}>
                      <Button size="sm" className="w-full bg-white text-burgundy-700 hover:bg-white/90 font-semibold">
                        Continue Lesson
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : enrollments.length === 0 ? (
                  <>
                    <p className="text-white font-medium mb-1">
                      Start your free mini diploma
                    </p>
                    <p className="text-burgundy-200 text-sm mb-4">
                      Begin your journey to becoming a certified practitioner.
                    </p>
                    <Link href="/roadmap">
                      <Button size="sm" className="w-full bg-white text-burgundy-700 hover:bg-white/90 font-semibold">
                        View Roadmap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-white font-medium mb-1">
                      Explore your next certification
                    </p>
                    <p className="text-burgundy-200 text-sm mb-4">
                      Continue advancing your career path.
                    </p>
                    <Link href="/roadmap">
                      <Button size="sm" className="w-full bg-white text-burgundy-700 hover:bg-white/90 font-semibold">
                        View Roadmap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MISSION/PROMISE STRIP */}
        <div className="bg-gradient-to-r from-gold-50 via-white to-gold-50 border border-gold-200/50 rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-gold-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">9x Accredited Certifications</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gold-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Practice with Full Legitimacy</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gold-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-burgundy-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Join 500+ Certified Practitioners</span>
            </div>
          </div>
        </div>

        {/* FIX #2 - Stats Grid with Meaningful Labels */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-burgundy-100 to-burgundy-50">
                  <BookOpen className="w-5 h-5 text-burgundy-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{inProgressCourses}</p>
                  <p className="text-xs text-gray-500">Courses In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                  <p className="text-xs text-gray-500">Milestones Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold-100 to-gold-50">
                  <Award className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{certificates}</p>
                  <p className="text-xs text-gray-500">Certificates Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatWatchTime(totalWatchTime)}</p>
                  <p className="text-xs text-gray-500">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userStreak?.currentStreak || 0}</p>
                  <p className="text-xs text-gray-500">Consistency Streak</p>
                </div>
              </div>
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
                        <Link href={`/courses/${nextLesson.courseSlug}/learn/${nextLesson.lessonId}`}>
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
            {/* FIX #4 & #7 - Career Milestones with Clear Status */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold-600" />
                  Career Milestones
                </h3>
                <div className="space-y-3">
                  {CAREER_STAGES.map((stage) => {
                    const isUnlocked = currentCareer.stage >= stage.id;
                    const isCurrent = currentCareer.stage === stage.id - 1;

                    return (
                      <div
                        key={stage.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isUnlocked
                            ? "bg-gold-50 border border-gold-200"
                            : isCurrent
                              ? "bg-burgundy-50 border border-burgundy-200"
                              : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isUnlocked
                            ? "bg-gold-100"
                            : isCurrent
                              ? "bg-burgundy-100"
                              : "bg-gray-200"
                        }`}>
                          {isUnlocked ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {isUnlocked ? "✅" : isCurrent ? "🔄" : "🔒"}
                            </span>
                            <p className={`text-sm font-medium ${
                              isUnlocked ? "text-gold-700" : isCurrent ? "text-burgundy-700" : "text-gray-500"
                            }`}>
                              {stage.title}
                            </p>
                          </div>
                          <p className={`text-xs ${
                            isUnlocked ? "text-green-600" : isCurrent ? "text-burgundy-600" : "text-gray-400"
                          }`}>
                            {isUnlocked ? "Completed" : isCurrent ? "In Progress" : "Locked"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Each level unlocks only after completing the previous one.
                </p>
              </CardContent>
            </Card>

            {/* FIX #8 - Enhanced Coach Card */}
            {coach && (
              <Card className="card-premium overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-burgundy-500 to-burgundy-600 relative">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400 rounded-full blur-2xl -translate-y-1/2" />
                  </div>
                </div>
                <CardContent className="p-5 -mt-8 relative">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-xl mb-3">
                      <AvatarImage src={coach.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-lg font-bold">
                        {getInitials(coach.firstName, coach.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="mb-2 bg-gold-100 text-gold-700 border-0 text-xs">
                      Your Coach
                    </Badge>
                    <h3 className="font-semibold text-gray-900">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Lead {specialization.name} Educator
                    </p>

                    <p className="text-sm text-gray-600 mt-3">
                      Have a question or feeling unsure? Send a message — real support is part of your journey.
                    </p>

                    <Link href={`/messages?to=${coach.id}`} className="w-full mt-4">
                      <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Your Coach
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

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
