import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { WomensHealthLessonContainer } from "./lesson-container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lessonNumber: string }>;
}

// Hardcoded lessons matching the React components
const LESSONS = [
  { id: 1, title: "Meet Your Hormones" },
  { id: 2, title: "The Monthly Dance" },
  { id: 3, title: "When Hormones Go Rogue" },
  { id: 4, title: "The Gut-Hormone Axis" },
  { id: 5, title: "Thyroid & Energy" },
  { id: 6, title: "Stress & Your Adrenals" },
  { id: 7, title: "Food as Medicine" },
  { id: 8, title: "Life Stage Support" },
  { id: 9, title: "Your Next Step" },
];

export default async function WomensHealthLessonPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { lessonNumber: lessonNumberParam } = await params;
  const lessonNumber = parseInt(lessonNumberParam, 10);

  if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 9) {
    notFound();
  }

  // Check enrollment exists
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id,
      course: { slug: "womens-health-mini-diploma" },
    },
  });

  if (!enrollment) {
    redirect("/dashboard");
  }

  // Get user data for access check
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      email: true,
      userType: true,
      accessExpiresAt: true,
    },
  });

  // Check access expiry for LEAD users
  if (user?.userType === "LEAD" && user?.accessExpiresAt) {
    const now = new Date();
    if (now > new Date(user.accessExpiresAt)) {
      redirect("/womens-health-diploma?expired=true");
    }
  }

  // Get completed lessons from user tags
  const completionTags = await prisma.userTag.findMany({
    where: {
      userId: session.user.id,
      tag: { startsWith: "wh-lesson-complete:" },
    },
  });

  const completedLessons = new Set(
    completionTags.map((t) => parseInt(t.tag.replace("wh-lesson-complete:", "")))
  );

  // Test user bypasses sequential access
  const isTestUser = user?.email === "at.seed019@gmail.com";

  // Check if previous lesson is completed (lesson 1 always accessible)
  if (lessonNumber > 1 && !isTestUser) {
    if (!completedLessons.has(lessonNumber - 1)) {
      redirect(`/womens-health-diploma/lesson/${lessonNumber - 1}`);
    }
  }

  const firstName = user?.firstName || session.user.firstName || "Student";
  const isCompleted = completedLessons.has(lessonNumber);

  return (
    <WomensHealthLessonContainer
      lessonNumber={lessonNumber}
      lessonId={`wh-lesson-${lessonNumber}`}
      firstName={firstName}
      isCompleted={isCompleted}
      userId={session.user.id}
      enrollmentId={enrollment.id}
      courseId={enrollment.courseId}
      moduleId="wh-module-1"
    />
  );
}
