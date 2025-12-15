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

  // Get coach name if user has enrollments
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, course: { coachId: { not: null } } },
    include: {
      course: {
        include: {
          coach: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  const coachName = enrollment?.course?.coach
    ? `${enrollment.course.coach.firstName} ${enrollment.course.coach.lastName}`
    : undefined;

  return {
    hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false,
    userName: user?.firstName || "Learner",
    coachName,
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
            <div className="min-h-screen bg-gray-50">
              <DashboardNav />

          {/* Main content */}
          <main className="lg:pl-72 pt-16 lg:pt-0">
            <div className="p-4 lg:p-8">
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
