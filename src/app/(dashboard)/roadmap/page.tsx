import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CareerGraph } from "@/components/career";

async function getRoadmapData(userId: string) {
  const [enrollments, allCourses, userStreak] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { enrolledAt: "asc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: {
        category: true,
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
    }),
    prisma.userStreak.findUnique({
      where: { userId },
    }),
  ]);

  return { enrollments, allCourses, userStreak };
}

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { enrollments, allCourses, userStreak } = await getRoadmapData(session.user.id);

  // Build course data with enrollment status
  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED");

  const coursesData = allCourses.map((course) => {
    const enrollment = enrollmentMap.get(course.id);
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      shortDescription: course.shortDescription,
      difficulty: course.difficulty,
      certificateType: course.certificateType,
      category: course.category
        ? { id: course.category.id, name: course.category.name }
        : null,
      duration: course.duration,
      isEnrolled: !!enrollment,
      isCompleted: enrollment?.status === "COMPLETED",
      progress: enrollment ? Number(enrollment.progress) : 0,
    };
  });

  // Calculate user level based on completed courses and points
  const totalPoints = userStreak?.totalPoints || completedCourses.length * 100;
  const userLevel = Math.floor(totalPoints / 500) + 1;

  return (
    <div className="animate-fade-in">
      <CareerGraph
        courses={coursesData}
        userLevel={userLevel}
        totalPoints={totalPoints}
        completedCourses={completedCourses.length}
      />
    </div>
  );
}
