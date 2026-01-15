import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import { HeroCard } from "@/components/dashboard/hero-card";
import { DailyFocusCard } from "@/components/dashboard/daily-focus-card";
import { AnnouncementBanner } from "@/components/dashboard/announcement-banner";
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card";
import { CareerLadder } from "@/components/dashboard/career-ladder";
import { CredentialPath } from "@/components/dashboard/credential-path";
import { ClientProgressRing } from "@/components/dashboard/client-progress-ring";
import { CoursesList } from "@/components/dashboard/courses-list";
import { CommunityWins } from "@/components/dashboard/community-wins";
import { PodLeaderboardPreview } from "@/components/dashboard/pod-leaderboard-preview";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { DashboardPWABanner } from "@/components/dashboard/pwa-banner";
import { generateZombieSuccessEvents } from "@/lib/success-events";
import { getSpecializationTrack } from "@/lib/specialization-tracks";
import { getSocialProofStats } from "@/lib/social-proof";
import { buildCredentialPath, SPECIALTY_ABBREVIATIONS } from "@/lib/credential-path";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

// Career stages with income potential
const CAREER_STAGES = [
  { id: 1, title: "Certified Practitioner", income: "$3K-$5K/month" },
  { id: 2, title: "Working Practitioner", income: "$5K-$10K/month" },
  { id: 3, title: "Advanced & Master", income: "$10K-$30K/month" },
  { id: 4, title: "Business Scaler", income: "$30K-$50K/month" },
];

async function getDashboardData(userId: string) {
  const [enrollments, certificatesData, userStreak, user, userTags] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        lastAccessedAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            modules: {
              where: { isPublished: true },
              select: {
                id: true,
                title: true,
                order: true,
                lessons: {
                  where: { isPublished: true },
                  select: { id: true, title: true, order: true },
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId },
      select: { type: true, issuedAt: true },
    }),
    prisma.userStreak.findUnique({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        hasCompletedOnboarding: true,
        avatar: true,
        firstName: true,
      },
    }),
    prisma.userTag.findMany({
      where: { userId },
      select: { tag: true },
    }),
  ]);

  const certificates = certificatesData.length;

  // Get completed lessons for this user
  const completedLessonIds = await prisma.lessonProgress.findMany({
    where: { userId, isCompleted: true },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedLessonIds.map((l) => l.lessonId));
  const completedLessons = completedLessonIds.length;

  // Get specialization from tags
  const tagStrings = userTags.map((t) => t.tag);
  const specialization = getSpecializationTrack(tagStrings);

  // Calculate progress for each enrollment
  const enrollmentsWithProgress = enrollments.map(enrollment => {
    const courseLessonIds = enrollment.course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedInCourse = courseLessonIds.filter(id => completedSet.has(id)).length;
    const progress = courseLessonIds.length > 0 ? Math.round((completedInCourse / courseLessonIds.length) * 100) : 0;
    return {
      id: enrollment.id,
      status: enrollment.status,
      progress,
      course: enrollment.course,
      lastAccessedAt: enrollment.lastAccessedAt,
    };
  });

  // Sort enrollments: prioritize in-progress courses
  const sortedEnrollments = enrollmentsWithProgress
    .filter(e => e.status !== "COMPLETED")
    .sort((a, b) => {
      const aStarted = a.progress > 0 && a.progress < 100;
      const bStarted = b.progress > 0 && b.progress < 100;
      if (aStarted && !bStarted) return -1;
      if (!aStarted && bStarted) return 1;
      if (aStarted && bStarted) return b.progress - a.progress;
      const aAccess = a.lastAccessedAt?.getTime() || 0;
      const bAccess = b.lastAccessedAt?.getTime() || 0;
      return bAccess - aAccess;
    });

  // Find next incomplete lesson with full info for Daily Focus
  let nextLesson: {
    title: string;
    courseSlug: string;
    lessonId: string;
    lessonSlug: string;
    moduleName: string;
  } | null = null;

  for (const enrollment of sortedEnrollments) {
    for (const module of enrollment.course.modules) {
      for (const lesson of module.lessons) {
        if (!completedSet.has(lesson.id)) {
          nextLesson = {
            title: lesson.title,
            courseSlug: enrollment.course.slug,
            lessonId: lesson.id,
            lessonSlug: lesson.id, // Use id as slug since lessons don't have slugs
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
    enrollments: enrollmentsWithProgress,
    certificates,
    certificatesData,
    userStreak,
    hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
    avatar: user?.avatar || null,
    firstName: user?.firstName || null,
    specialization,
    nextLesson,
    completedLessonsCount: completedLessons,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  let dashboardData;
  try {
    dashboardData = await getDashboardData(session.user.id);
  } catch (error: any) {
    console.error("[DASHBOARD] Data fetch error:", error?.message || error);
    // Show a friendly error page
    return (
      <DashboardWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Loading Issue</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re performing a database update. Please wait a moment and refresh the page.
            </p>
            <p className="text-sm text-gray-400">
              Error: {error?.message || "Unknown database error"}
            </p>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  const {
    enrollments,
    certificates,
    certificatesData,
    userStreak,
    hasCompletedOnboarding,
    avatar,
    firstName: dbFirstName,
    specialization,
    nextLesson,
    completedLessonsCount,
  } = dashboardData;

  // Check for mini diploma only users - redirect them to their lead portal
  const MINI_DIPLOMA_SLUGS = [
    "womens-health-mini-diploma",
    "functional-medicine-mini-diploma",
    "gut-health-mini-diploma",
    "health-coach-mini-diploma",
    "holistic-nutrition-mini-diploma",
    "hormone-health-mini-diploma",
    "nurse-coach-mini-diploma",
  ];

  const MINI_DIPLOMA_REDIRECTS: Record<string, string> = {
    "womens-health-mini-diploma": "/womens-health-diploma",
    "functional-medicine-mini-diploma": "/functional-medicine-diploma",
    "gut-health-mini-diploma": "/gut-health-diploma",
    "health-coach-mini-diploma": "/health-coach-diploma",
    "holistic-nutrition-mini-diploma": "/holistic-nutrition-diploma",
    "hormone-health-mini-diploma": "/hormone-health-diploma",
    "nurse-coach-mini-diploma": "/nurse-coach-diploma",
  };

  // Check if user ONLY has mini diploma enrollments (no paid courses)
  const allEnrollmentsAreMiniDiploma = enrollments.length > 0 &&
    enrollments.every(e => MINI_DIPLOMA_SLUGS.includes(e.course.slug));

  const incompleteMiniDiploma = enrollments.find(
    e => MINI_DIPLOMA_SLUGS.includes(e.course.slug) && e.status !== "COMPLETED"
  );

  // If all enrollments are mini diplomas and at least one is incomplete, redirect
  if (allEnrollmentsAreMiniDiploma && incompleteMiniDiploma) {
    const redirectPath = MINI_DIPLOMA_REDIRECTS[incompleteMiniDiploma.course.slug];
    if (redirectPath) {
      const { redirect } = await import("next/navigation");
      redirect(redirectPath);
    }
  }

  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE").length;
  const firstName = dbFirstName || session.user.firstName || "Practitioner";

  // Determine current career stage
  const getCurrentStage = () => {
    if (completedCourses >= 4) return 4;
    if (completedCourses >= 3) return 3;
    if (completedCourses >= 2) return 2;
    if (completedCourses >= 1 || inProgressCourses > 0) return 1;
    return 0;
  };

  // Income potential based on progress
  const getIncomeRange = () => {
    if (completedLessonsCount >= 40) return "$10K-$30K/mo";
    if (completedLessonsCount >= 25) return "$5K-$10K/mo";
    if (completedLessonsCount >= 15) return "$3K-$5K/mo";
    return "Up to $3K/mo";
  };

  // Client-ready calculations
  const clientReadyLessons = 15;
  const clientReadyProgress = Math.min(100, Math.round((completedLessonsCount / clientReadyLessons) * 100));
  const lessonsToClientReady = Math.max(0, clientReadyLessons - completedLessonsCount);

  // Next milestone calculation
  const MILESTONE_INTERVALS = [5, 10, 15, 25, 50, 75, 100];
  const nextMilestone = MILESTONE_INTERVALS.find(m => m > completedLessonsCount) || 100;
  const lessonsToMilestone = nextMilestone - completedLessonsCount;

  // Social proof
  const socialProof = getSocialProofStats();

  // Community wins
  const successEvents = generateZombieSuccessEvents(3);

  // Build credential path for user
  const completedCourseSlugs = enrollments
    .filter(e => e.status === "COMPLETED")
    .map(e => e.course.slug);

  const inProgressEnrollment = enrollments.find(e => e.status === "ACTIVE" && e.progress > 0);

  const credentialPathData = buildCredentialPath(specialization, {
    completedCourses: completedCourseSlugs,
    inProgressCourse: inProgressEnrollment
      ? { slug: inProgressEnrollment.course.slug, progress: inProgressEnrollment.progress }
      : undefined,
    certificates: certificatesData.map(c => ({
      type: c.type,
      earnedAt: c.issuedAt,
    })),
  });

  // Get specialty abbreviation for display
  const specialtyAbbrev = SPECIALTY_ABBREVIATIONS[specialization.slug] || "FM";

  // Announcements (could come from DB in future)
  const announcements = hasCompletedOnboarding ? [
    {
      id: "new-feature-pod",
      message: "🚀 NEW: My Pod is now live! Connect with your accountability group.",
      link: "/my-circle",
      linkText: "View Pod",
      type: "new" as const,
    },
  ] : [
    {
      id: "complete-onboarding",
      message: "🎯 Complete your profile to unlock personalized recommendations!",
      link: "/start-here",
      linkText: "Get Started",
      type: "new" as const,
    },
  ];

  return (
    <DashboardWrapper userName={firstName} userId={session.user.id} hasCompletedOnboarding={hasCompletedOnboarding}>
      <div className="space-y-4 sm:space-y-5 animate-fade-in">

        {/* ========== ANNOUNCEMENT BANNER ========== */}
        <AnnouncementBanner announcements={announcements} />

        {/* ========== PWA INSTALL BANNER ========== */}
        <DashboardPWABanner />

        {/* ========== SECTION 1: HERO WITH AVATAR ========== */}
        <HeroCard
          firstName={firstName}
          avatar={avatar}
          incomeRange={getIncomeRange()}
          liveFormatted={socialProof.liveFormatted}
          totalFormatted={socialProof.totalFormatted}
        />

        {/* ========== SECTION 2: DAILY FOCUS ========== */}
        {nextLesson && enrollments.length > 0 && (
          <DailyFocusCard
            nextLesson={{
              title: nextLesson.title,
              moduleTitle: nextLesson.moduleName,
              courseSlug: nextLesson.courseSlug,
              lessonSlug: nextLesson.lessonSlug,
              estimatedMinutes: 12,
            }}
            lessonsToMilestone={lessonsToMilestone}
            currentStreak={userStreak?.currentStreak || 0}
          />
        )}

        {/* ========== SECTION 3: CONTINUE LEARNING CTA ========== */}
        {nextLesson && enrollments.length > 0 && (
          <ContinueLearningCard
            nextLesson={nextLesson}
            clientReadyProgress={clientReadyProgress}
            lessonsToClientReady={lessonsToClientReady}
            currentStreak={userStreak?.currentStreak || 0}
            certificates={certificates}
            completedLessonsCount={completedLessonsCount}
          />
        )}

        {/* ========== SECTION 4: CREDENTIAL PATH (Mobile Priority) ========== */}
        <div className="lg:hidden">
          <CredentialPath
            credentials={credentialPathData}
            specialty={specialtyAbbrev}
            specialtyName={specialization.name}
          />
        </div>

        {/* ========== MAIN GRID: COURSES + SIDEBAR ========== */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ========== LEFT COLUMN: COURSES ========== */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Courses List */}
            <CoursesList enrollments={enrollments} />

            {/* Client Progress Ring (Replaces Client Checklist) */}
            <ClientProgressRing
              completedLessonsCount={completedLessonsCount}
              certificates={certificates}
              incomeGoal={CAREER_STAGES[0].income}
            />
          </div>

          {/* ========== RIGHT SIDEBAR (Desktop Only) ========== */}
          <div className="hidden lg:block space-y-6">
            {/* Credential Path (Board-approved: Zuckerberg) */}
            <CredentialPath
              credentials={credentialPathData}
              specialty={specialtyAbbrev}
              specialtyName={specialization.name}
            />

            {/* Career Ladder (Income view) */}
            <CareerLadder currentStage={getCurrentStage()} />

            {/* Referral Card */}
            <ReferralCard userId={session.user.id} firstName={firstName} />

            {/* Pod Leaderboard Preview */}
            <PodLeaderboardPreview currentUserRank={3} />

            {/* Community Wins */}
            <CommunityWins events={successEvents} />
          </div>
        </div>

        {/* ========== POD LEADERBOARD (Mobile) ========== */}
        <div className="lg:hidden">
          <PodLeaderboardPreview currentUserRank={3} />
        </div>

        {/* ========== COMMUNITY WINS (Mobile) ========== */}
        <div className="lg:hidden">
          <CommunityWins events={successEvents} />
        </div>
      </div>
    </DashboardWrapper>
  );
}
