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

  // Check if user is mini-diploma-only (single mini-diploma enrollment, not completed)
  const isWomensHealthLead =
    enrollments.length === 1 &&
    enrollments[0].course.slug === "womens-health-mini-diploma" &&
    enrollments[0].status !== "COMPLETED";

  const isFMLead =
    enrollments.length === 1 &&
    enrollments[0].course.slug === "fm-mini-diploma" &&
    enrollments[0].status !== "COMPLETED";

  const isMiniDiplomaOnly = isWomensHealthLead || isFMLead;

  // Get completed lessons for diploma progress
  let diplomaCompleted = false;
  if (isWomensHealthLead) {
    const completedLessons = await prisma.userTag.count({
      where: {
        userId,
        tag: { startsWith: "wh-lesson-complete:" },
      },
    });
    diplomaCompleted = completedLessons >= 9;
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
    isWomensHealthLead,
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
    isWomensHealthLead,
    diplomaCompleted,
    certificateClaimed,
    lessonCount,
  } = await getUserOnboardingData(session.user.id);

  // Calculate next milestone for coach widget
  const MILESTONE_INTERVALS = [5, 10, 15, 25, 50, 75, 100];
  const nextMilestone = MILESTONE_INTERVALS.find(m => m > lessonCount) || 100;

  // Lead users see the LeadSidebar instead of DashboardNav
  if (isWomensHealthLead) {
    return (
      <SessionProvider>
        <SWRProvider>
          <NotificationProvider>
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

                {/* Main content - adjusted for lead sidebar */}
                <main className="pl-64 pt-0 overflow-x-hidden">
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
        <NotificationProvider>
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
