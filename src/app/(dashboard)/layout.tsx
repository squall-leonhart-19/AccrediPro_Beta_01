import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { LeadSidebar } from "@/components/lead-portal/LeadSidebar";
import { SessionProvider } from "@/components/providers/session-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper";
import { AchievementProvider } from "@/components/gamification/achievement-toast";
import { FloatingCoachWidget } from "@/components/dashboard/floating-coach-widget";

// All mini diploma course slugs
const MINI_DIPLOMA_SLUGS = [
  "womens-health-mini-diploma",
  "functional-medicine-mini-diploma",
  "gut-health-mini-diploma",
  "health-coach-mini-diploma",
  "holistic-nutrition-mini-diploma",
  "hormone-health-mini-diploma",
  "nurse-coach-mini-diploma",
];

// Map mini diploma slug to tag prefix for completion tracking
const DIPLOMA_TAG_PREFIX: Record<string, string> = {
  "womens-health-mini-diploma": "wh-lesson-complete",
  "functional-medicine-mini-diploma": "functional-medicine-lesson-complete",
  "gut-health-mini-diploma": "gut-health-lesson-complete",
  "health-coach-mini-diploma": "health-coach-lesson-complete",
  "holistic-nutrition-mini-diploma": "holistic-nutrition-lesson-complete",
  "hormone-health-mini-diploma": "hormone-health-lesson-complete",
  "nurse-coach-mini-diploma": "nurse-coach-lesson-complete",
};

// Map mini diploma slug to lead portal route
const DIPLOMA_ROUTES: Record<string, string> = {
  "womens-health-mini-diploma": "/womens-health-diploma",
  "functional-medicine-mini-diploma": "/functional-medicine-diploma",
  "gut-health-mini-diploma": "/gut-health-diploma",
  "health-coach-mini-diploma": "/health-coach-diploma",
  "holistic-nutrition-mini-diploma": "/holistic-nutrition-diploma",
  "hormone-health-mini-diploma": "/hormone-health-diploma",
  "nurse-coach-mini-diploma": "/nurse-coach-diploma",
};

async function getUserOnboardingData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasCompletedOnboarding: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
    },
  });

  // Get all enrollments to check Mini Diploma status - using explicit select to avoid P2022
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      course: {
        select: {
          slug: true,
          coachId: true,
          coach: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  // Get lesson progress for milestone calculation
  const lessonCount = await prisma.lessonProgress.count({
    where: { userId, isCompleted: true },
  });

  // Check if user ONLY has mini-diploma enrollments (no paid courses)
  // This handles users with multiple mini diplomas (e.g., both womens-health AND functional-medicine)
  const allEnrollmentsAreMiniDiploma = enrollments.length > 0 &&
    enrollments.every(e => MINI_DIPLOMA_SLUGS.includes(e.course.slug));

  const hasAnyIncompleteMiniDiploma = enrollments.some(
    e => MINI_DIPLOMA_SLUGS.includes(e.course.slug) && e.status !== "COMPLETED"
  );

  const isMiniDiplomaOnly = allEnrollmentsAreMiniDiploma && hasAnyIncompleteMiniDiploma;

  // Get the most recent mini diploma enrollment for redirect
  const mostRecentMiniDiploma = enrollments.find(
    e => MINI_DIPLOMA_SLUGS.includes(e.course.slug) && e.status !== "COMPLETED"
  );
  const miniDiplomaSlug = isMiniDiplomaOnly && mostRecentMiniDiploma ? mostRecentMiniDiploma.course.slug : null;
  const miniDiplomaRoute = miniDiplomaSlug ? DIPLOMA_ROUTES[miniDiplomaSlug] : null;

  // Get completed lessons for diploma progress (check correct tag prefix)
  let diplomaCompleted = false;
  if (isMiniDiplomaOnly && miniDiplomaSlug) {
    const tagPrefix = DIPLOMA_TAG_PREFIX[miniDiplomaSlug];
    if (tagPrefix) {
      const completedLessons = await prisma.userTag.count({
        where: {
          userId,
          tag: { startsWith: `${tagPrefix}:` },
        },
      });
      diplomaCompleted = completedLessons >= 9;
    }
  }

  // Check if certificate was claimed
  const leadOnboarding = await prisma.leadOnboarding.findUnique({
    where: { userId },
    select: { claimedCertificate: true },
  }).catch(() => null);

  // Get coach name from first enrollment with a coach
  const enrollmentWithCoach = enrollments.find((e) => e.course.coachId);
  const coachName = enrollmentWithCoach?.course?.coach
    ? `${enrollmentWithCoach.course.coach.firstName} ${enrollmentWithCoach.course.coach.lastName}`
    : undefined;

  return {
    // Mini Diploma users skip onboarding for max conversion
    hasCompletedOnboarding: isMiniDiplomaOnly ? true : (user?.hasCompletedOnboarding ?? false),
    userName: user?.firstName || "Learner",
    lastName: user?.lastName || "",
    email: user?.email || "",
    avatar: user?.avatar || null,
    coachName,
    isMiniDiplomaOnly,
    miniDiplomaRoute,
    diplomaCompleted,
    certificateClaimed: leadOnboarding?.claimedCertificate || false,
    lessonCount,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const {
    hasCompletedOnboarding,
    userName,
    lastName,
    email,
    avatar,
    coachName,
    isMiniDiplomaOnly,
    miniDiplomaRoute,
    diplomaCompleted,
    certificateClaimed,
    lessonCount,
  } = await getUserOnboardingData(session.user.id);

  // Calculate next milestone for coach widget
  const MILESTONE_INTERVALS = [5, 10, 15, 25, 50, 75, 100];
  const nextMilestone = MILESTONE_INTERVALS.find(m => m > lessonCount) || 100;

  // Mini Diploma lead users see the LeadSidebar instead of DashboardNav
  if (isMiniDiplomaOnly) {
    return (
      <SessionProvider>
        <SWRProvider>
          <NotificationProvider userId={session.user.id}>
            <AchievementProvider>
              <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                {/* Lead Sidebar */}
                <LeadSidebar
                  firstName={userName}
                  lastName={lastName}
                  email={email}
                  avatar={avatar}
                  diplomaCompleted={diplomaCompleted}
                  certificateClaimed={certificateClaimed}
                />

                {/* Main content - responsive padding for mobile */}
                <main className="pt-14 lg:pt-0 lg:pl-64 overflow-x-hidden">
                  <div className="p-4 lg:p-8 max-w-full overflow-x-hidden">
                    {children}
                  </div>
                </main>

                {/* Floating Coach Sarah Widget */}
                <FloatingCoachWidget
                  userName={userName}
                  userId={session.user.id}
                  currentLessonCount={lessonCount}
                  nextMilestone={nextMilestone}
                />
              </div>
            </AchievementProvider>
          </NotificationProvider>
        </SWRProvider>
      </SessionProvider>
    );
  }

  // Regular users see the full dashboard
  return (
    <SessionProvider>
      <SWRProvider>
        <NotificationProvider userId={session.user.id}>
          <AchievementProvider>
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
              <DashboardNav />

              {/* Main content */}
              <main className="lg:pl-72 pt-16 lg:pt-0 overflow-x-hidden">
                <div className="p-4 lg:p-8 max-w-full overflow-x-hidden">
                  <OnboardingWrapper
                    hasCompletedOnboarding={hasCompletedOnboarding}
                    userName={userName}
                    coachName={coachName}
                    userId={session.user.id}
                  >
                    {children}
                  </OnboardingWrapper>
                </div>
              </main>

              {/* Floating Coach Sarah Widget - Always visible */}
              <FloatingCoachWidget
                userName={userName}
                userId={session.user.id}
                currentLessonCount={lessonCount}
                nextMilestone={nextMilestone}
              />
            </div>
          </AchievementProvider>
        </NotificationProvider>
      </SWRProvider>
    </SessionProvider>
  );
}
