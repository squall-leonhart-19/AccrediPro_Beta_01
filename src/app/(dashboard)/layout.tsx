import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SessionProvider } from "@/components/providers/session-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper";
import { AchievementProvider } from "@/components/gamification/achievement-toast";

async function getUserOnboardingData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasCompletedOnboarding: true,
      firstName: true,
    },
  });

  // Get all enrollments to check Mini Diploma status
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { slug: true, coachId: true, coach: { select: { firstName: true, lastName: true } } },
      },
    },
  });

  // Check if user is mini-diploma-only (single mini-diploma enrollment, not completed)
  const isMiniDiplomaOnly =
    enrollments.length === 1 &&
    (enrollments[0].course.slug === "fm-mini-diploma" || enrollments[0].course.slug === "womens-health-mini-diploma") &&
    enrollments[0].status !== "COMPLETED";

  // Get coach name from first enrollment with a coach
  const enrollmentWithCoach = enrollments.find((e) => e.course.coachId);
  const coachName = enrollmentWithCoach?.course?.coach
    ? `${enrollmentWithCoach.course.coach.firstName} ${enrollmentWithCoach.course.coach.lastName}`
    : undefined;

  return {
    // Mini Diploma users skip onboarding for max conversion
    hasCompletedOnboarding: isMiniDiplomaOnly ? true : (user?.hasCompletedOnboarding ?? false),
    userName: user?.firstName || "Learner",
    coachName,
    isMiniDiplomaOnly,
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

  const { hasCompletedOnboarding, userName, coachName } = await getUserOnboardingData(
    session.user.id
  );

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

            </div>
          </AchievementProvider>
        </NotificationProvider>
      </SWRProvider>
    </SessionProvider>
  );
}
