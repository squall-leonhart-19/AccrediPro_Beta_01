import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OnboardingClient } from "@/components/onboarding/onboarding-client";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user already completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      hasCompletedProfile: true,
      phone: true,
      location: true,
      timezone: true,
      healthBackground: true,
      certificationGoal: true,
      learningGoal: true,
      weeklyHours: true,
      experienceLevel: true,
      focusAreas: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // If already completed, redirect to dashboard
  if (user.hasCompletedProfile) {
    redirect("/dashboard");
  }

  return (
    <OnboardingClient
      userId={user.id}
      initialData={{
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        location: user.location || "",
        timezone: user.timezone || "",
        healthBackground: user.healthBackground || "",
        certificationGoal: user.certificationGoal || "",
        learningGoal: user.learningGoal || "",
        weeklyHours: user.weeklyHours || undefined,
        experienceLevel: user.experienceLevel || "",
        focusAreas: user.focusAreas || [],
      }}
    />
  );
}
