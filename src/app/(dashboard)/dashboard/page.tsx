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
import { IncomeProjectionWidget, DaysCountdownWidget, StreakWidget, ContinueLearningWidget } from "@/components/dashboard/completion-widgets";
import { SuccessFeedCompact } from "@/components/success-feed";
import { StudyPodWidgetCompact } from "@/components/study-pod-widget";
import { generateZombieSuccessEvents } from "@/lib/success-events";
import { getZombiesForPod, getRandomPodName, ZOMBIE_PROFILES, getZombieProgress } from "@/lib/zombies";
import { getSpecializationTrack } from "@/lib/specialization-tracks";
import { getSocialProofStats, getMilestoneCountdown } from "@/lib/social-proof";

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
  const [enrollments, certificates, recentActivity, coach, userStreak, badges, user, userTags, trainingTag] = await Promise.all([
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
                  select: { id: true, title: true, order: true },
                  orderBy: { order: "asc" },
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
    // Check for training watched tags
    prisma.userTag.findFirst({
      where: {
        userId,
        tag: { in: ["training_video_70", "training_video_80", "training_video_90", "training_video_100"] },
      },
    }),
  ]);

  // Get completed lessons for this user
  const completedLessonIds = await prisma.lessonProgress.findMany({
    where: { userId, isCompleted: true },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedLessonIds.map((l) => l.lessonId));

  // Calculate session-based platform time (same as dispute section)
  const activityTimestamps = await prisma.userActivity.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" }
  });

  const loginHistory = await prisma.loginHistory.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  let totalPlatformTime = 0;
  const SESSION_GAP_MS = 30 * 60 * 1000; // 30 minutes
  const timestamps = [
    ...loginHistory.map(l => new Date(l.createdAt).getTime()),
    ...activityTimestamps.map(a => new Date(a.createdAt).getTime())
  ].sort((a, b) => a - b);

  if (timestamps.length > 0) {
    let sessionStart = timestamps[0];
    let lastActivity = timestamps[0];
    for (let i = 1; i < timestamps.length; i++) {
      const gap = timestamps[i] - lastActivity;
      if (gap > SESSION_GAP_MS) {
        totalPlatformTime += lastActivity - sessionStart;
        sessionStart = timestamps[i];
      }
      lastActivity = timestamps[i];
    }
    const finalSessionDuration = lastActivity - sessionStart;
    totalPlatformTime += finalSessionDuration > 0 ? finalSessionDuration : 5 * 60 * 1000;
  }

  const totalWatchTime = Math.round(totalPlatformTime / 1000); // Convert to seconds

  const completedLessons = completedLessonIds.length;

  // Get specialization from tags
  const tagStrings = userTags.map((t) => t.tag);
  const specialization = getSpecializationTrack(tagStrings);

  // Calculate progress for each enrollment
  const enrollmentsWithProgress = enrollments.map(enrollment => {
    const courseLessonIds = enrollment.course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedInCourse = courseLessonIds.filter(id => completedSet.has(id)).length;
    const progress = courseLessonIds.length > 0 ? completedInCourse / courseLessonIds.length : 0;
    return { enrollment, progress, completedInCourse };
  });

  // Sort enrollments: prioritize in-progress courses (0 < progress < 1), then by most progress
  const sortedEnrollments = enrollmentsWithProgress
    .filter(e => e.enrollment.status !== "COMPLETED")
    .sort((a, b) => {
      // First priority: courses with some progress (started but not complete)
      const aStarted = a.progress > 0 && a.progress < 1;
      const bStarted = b.progress > 0 && b.progress < 1;
      if (aStarted && !bStarted) return -1;
      if (!aStarted && bStarted) return 1;

      // Second priority: most progress within started courses
      if (aStarted && bStarted) return b.progress - a.progress;

      // Third priority: recently accessed
      const aAccess = a.enrollment.lastAccessedAt?.getTime() || 0;
      const bAccess = b.enrollment.lastAccessedAt?.getTime() || 0;
      return bAccess - aAccess;
    });

  // Find next incomplete lesson from prioritized enrollment
  let nextLesson: { title: string; courseSlug: string; lessonId: string; moduleName: string } | null = null;
  for (const { enrollment } of sortedEnrollments) {
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
    if (nextLesson) break;
  }

  return {
    enrollments,
    certificates,
    recentActivity,
    totalWatchTime,
    coach: coach?.course?.coach || null,
    userStreak,
    badges,
    hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
    specialization,
    nextLesson,
    completedLessonsCount: completedLessons,
    hasWatchedTraining: !!trainingTag,
    // Calculate total lessons for countdown
    totalLessons: enrollments.reduce((acc, e) => {
      return acc + e.course.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0);
    }, 0),
    // Get first enrollment date
    firstEnrolledAt: enrollments.length > 0
      ? enrollments.reduce((oldest, e) => e.enrolledAt < oldest ? e.enrolledAt : oldest, enrollments[0].enrolledAt)
      : new Date(),
    // Check if user has Pro Accelerator
    hasPro: enrollments.some(e => e.course.slug.includes('pro') || e.course.title.toLowerCase().includes('accelerator')),
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
    hasWatchedTraining,
    totalLessons,
    firstEnrolledAt,
    hasPro,
  } = await getDashboardData(session.user.id);

  // Check if user ONLY has Mini Diploma enrollment (redirect to Mini Diploma dashboard)
  const hasFMMiniDiplomaOnly =
    enrollments.length === 1 &&
    enrollments[0].course.slug === "fm-mini-diploma" &&
    enrollments[0].status !== "COMPLETED";

  const hasWomensHealthMiniDiplomaOnly =
    enrollments.length === 1 &&
    enrollments[0].course.slug === "womens-health-mini-diploma" &&
    enrollments[0].status !== "COMPLETED";

  if (hasFMMiniDiplomaOnly) {
    const { redirect } = await import("next/navigation");
    redirect("/mini-diploma");
  }

  if (hasWomensHealthMiniDiplomaOnly) {
    const { redirect } = await import("next/navigation");
    redirect("/womens-health-diploma");
  }

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

  // Get social proof stats
  const socialProof = getSocialProofStats();
  const milestoneData = getMilestoneCountdown();

  // Calculate client-ready progress
  const clientReadyLessons = 15; // Lessons needed to be client-ready
  const clientReadyProgress = Math.min(100, Math.round((completedLessonsCount / clientReadyLessons) * 100));
  const lessonsToClientReady = Math.max(0, clientReadyLessons - completedLessonsCount);

  // Income potential based on progress
  const getIncomeRange = () => {
    if (completedLessonsCount >= 40) return "$10K-$30K/mo";
    if (completedLessonsCount >= 25) return "$5K-$10K/mo";
    if (completedLessonsCount >= 15) return "$3K-$5K/mo";
    return "$0 (in training)";
  };

  return (
    <DashboardWrapper userName={firstName} userId={session.user.id} hasCompletedOnboarding={hasCompletedOnboarding}>
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">

        {/* ========== SECTION 1: SIMPLIFIED HERO ========== */}
        <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-800 to-burgundy-900 border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left: Welcome */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Shield className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <p className="text-burgundy-200 text-sm">Welcome back</p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{firstName}</h1>
                </div>
              </div>

              {/* Right: Income Potential (moved here from separate widget) */}
              <div className="flex items-center gap-4">
                <div className="px-5 py-3 bg-gradient-to-r from-gold-400/20 to-gold-500/20 backdrop-blur-sm rounded-xl border border-gold-400/30">
                  <p className="text-gold-200 text-xs uppercase tracking-wide">Income Potential</p>
                  <p className="text-2xl font-bold text-gold-100">{getIncomeRange()}</p>
                  <p className="text-gold-300 text-xs mt-0.5">Based on your progress</p>
                </div>
              </div>
            </div>

            {/* Social Proof Bar - Minimal */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white font-semibold">{socialProof.liveFormatted}</span>
                <span className="text-burgundy-200">learning now</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold-400" />
                <span className="text-white font-semibold">{socialProof.totalFormatted}</span>
                <span className="text-burgundy-200 hidden sm:inline">in community</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== SECTION 2: GIANT CONTINUE LEARNING CTA ========== */}
        {nextLesson && enrollments.length > 0 && (
          <Card className="border-2 border-burgundy-200 bg-gradient-to-br from-white to-burgundy-50 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Progress Info */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <Play className="w-3 h-3 mr-1" />
                      Up Next
                    </Badge>
                    {lessonsToClientReady > 0 && (
                      <Badge variant="outline" className="border-gold-300 text-gold-700">
                        {lessonsToClientReady} lessons to client-ready!
                      </Badge>
                    )}
                  </div>

                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {nextLesson.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {nextLesson.moduleName} • ~12 min
                  </p>

                  {/* Client-Ready Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Client-Ready Progress</span>
                      <span className="font-semibold text-burgundy-600">{clientReadyProgress}%</span>
                    </div>
                    <Progress value={clientReadyProgress} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">
                      {clientReadyProgress >= 100
                        ? "✅ You're ready to take on clients!"
                        : `Complete ${lessonsToClientReady} more lessons to start earning`}
                    </p>
                  </div>

                  <Link href={`/courses/${nextLesson.courseSlug}/learn-v2/${nextLesson.lessonId}`}>
                    <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg w-full sm:w-auto text-lg py-6">
                      Continue Learning
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Right: Stats */}
                <div className="lg:w-64 bg-burgundy-50 p-6 border-t lg:border-t-0 lg:border-l border-burgundy-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userStreak?.currentStreak || 0}</p>
                        <p className="text-xs text-gray-500">Day Streak</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{certificates}</p>
                        <p className="text-xs text-gray-500">Certificates</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-burgundy-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{completedLessonsCount}</p>
                        <p className="text-xs text-gray-500">Lessons Done</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========== MAIN GRID: COURSES + SIDEBAR ========== */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ========== LEFT COLUMN: COURSES ========== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Your Courses */}
            {enrollments.length > 0 ? (
              <Card className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-burgundy-600" />
                      Your Courses
                    </h2>
                    <Link href="/my-courses">
                      <Button variant="ghost" size="sm" className="text-burgundy-600">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {enrollments.slice(0, 3).map((enrollment) => {
                      const courseTitle = enrollment.course.title.toLowerCase();
                      const isCertification = courseTitle.includes("certification");
                      const stepLabel = isCertification ? "CERTIFICATION" : "TRAINING";

                      return (
                        <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`}>
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 border border-transparent hover:border-burgundy-100 transition-all group">
                            <div className="w-12 h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-xs border-0 bg-burgundy-100 text-burgundy-700">
                                  {stepLabel}
                                </Badge>
                                {enrollment.status === "COMPLETED" && (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">✓ Done</Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-gray-900 truncate text-sm">
                                {enrollment.course.title}
                              </h3>
                              <div className="mt-1.5 flex items-center gap-2">
                                <Progress value={enrollment.progress} className="h-1.5 flex-1" />
                                <span className="text-xs font-semibold text-burgundy-600">{Math.round(enrollment.progress)}%</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-burgundy-500" />
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
                  <GraduationCap className="w-12 h-12 text-burgundy-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                  <p className="text-gray-500 mb-4">Start your certification journey today</p>
                  <Link href="/my-personal-roadmap-by-coach-sarah">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">View Roadmap</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Client-Ready Checklist (NEW - Outcome Focus) */}
            <Card className="border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-white">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-gold-600" />
                  Client-Ready Checklist
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Complete these milestones to start earning {CAREER_STAGES[0].income}
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Complete 15 core lessons", done: completedLessonsCount >= 15 },
                    { label: "Pass Module 1 Quiz", done: completedLessonsCount >= 5 },
                    { label: "Complete Client Assessment training", done: completedLessonsCount >= 12 },
                    { label: "Get your certification", done: certificates > 0 },
                    { label: "Set up your practice profile", done: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {item.done ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========== RIGHT SIDEBAR ========== */}
          <div className="space-y-6">

            {/* Career Ladder - Compact */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold-400" />
                  Your Career Path
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {CAREER_STAGES.map((stage, i) => {
                    const isUnlocked = currentCareer.stage >= stage.id;
                    const isCurrent = currentCareer.stage === stage.id - 1;
                    return (
                      <div key={stage.id} className={`flex items-center gap-3 p-2.5 rounded-lg ${isUnlocked ? 'bg-green-50' : isCurrent ? 'bg-burgundy-50 ring-1 ring-burgundy-200' : 'bg-gray-50 opacity-50'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {isUnlocked ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{stage.title}</p>
                          <p className="text-xs text-gray-500">{stage.income}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Coach Sarah - Quick Help */}
            <Card className="border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy-200">
                      <img src="/coaches/sarah-coach.webp" alt="Coach Sarah" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Need Help?</p>
                    <p className="text-xs text-gray-500">Sarah responds in &lt;2 hours</p>
                  </div>
                  <Link href="/messages">
                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Community Wins - Real Data Placeholder */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Community Wins Today
                </h3>
                <div className="space-y-2">
                  {generateZombieSuccessEvents(3).map((event, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">🎉</span>
                      <span className="text-gray-700">{event.zombieName}</span>
                      <span className="text-gray-500">{event.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links - Compact */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: "/certificates", icon: Award, label: "Certificates", color: "text-green-600" },
                    { href: "/community", icon: Users, label: "Community", color: "text-purple-600" },
                    { href: "/my-circle", icon: Users, label: "Study Pod", color: "text-burgundy-600" },
                    { href: "/career-center", icon: Target, label: "Career", color: "text-gold-600" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <link.icon className={`w-4 h-4 ${link.color}`} />
                        <span className="text-sm text-gray-700">{link.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
