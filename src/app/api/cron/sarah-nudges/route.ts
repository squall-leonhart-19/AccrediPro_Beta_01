import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  NUDGE_RULES,
  evaluateNudge,
  fillMessageTemplate,
  getNudgeCooldownDays,
  type StudentNudgeData,
} from "@/lib/sarah-nudges";

// Cron job to send proactive Sarah nudges
// Board-approved: Musk - "Sarah should push, not wait"
// Schedule: Daily at 9 AM user's timezone (or 9 AM EST as default)

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get Coach Sarah's user ID
    const sarah = await prisma.user.findFirst({
      where: { email: "sarah@accredipro-certificate.com" },
    });

    if (!sarah) {
      return NextResponse.json({ error: "Sarah not found" }, { status: 500 });
    }

    // Get all active students with their enrollments and progress
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        lastLoginAt: true,
        enrollments: {
          where: { status: "ACTIVE" },
          select: {
            courseId: true,
            lastAccessedAt: true,
            course: {
              select: {
                title: true,
                modules: {
                  where: { isPublished: true },
                  select: {
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
        },
        streak: {
          select: { currentStreak: true },
        },
        lessonProgress: {
          where: { isCompleted: true },
          select: { lessonId: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    const now = new Date();
    const nudgesSent: { student: string; rule: string }[] = [];
    const errors: string[] = [];

    for (const student of students) {
      try {
        // Build student nudge data
        const completedLessonIds = new Set(student.lessonProgress.map((lp) => lp.lessonId));
        const lastProgressAt = student.lessonProgress[0]?.updatedAt || null;

        const enrollmentData: StudentNudgeData["enrollments"] = student.enrollments.map(
          (enrollment) => {
            const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
            const completedCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
            const totalLessons = allLessons.length;
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            // Find current and next lesson
            let currentLessonTitle: string | null = null;
            let nextLessonTitle: string | null = null;

            for (const lesson of allLessons) {
              if (!completedLessonIds.has(lesson.id)) {
                if (!currentLessonTitle) currentLessonTitle = lesson.title;
                else if (!nextLessonTitle) nextLessonTitle = lesson.title;
                if (nextLessonTitle) break;
              }
            }

            return {
              courseId: enrollment.courseId,
              courseName: enrollment.course.title,
              progress,
              lastProgressAt: enrollment.lastAccessedAt || lastProgressAt,
              currentLessonTitle,
              nextLessonTitle: nextLessonTitle || currentLessonTitle,
              lessonsRemaining: totalLessons - completedCount,
              totalLessons,
            };
          }
        );

        const studentData: StudentNudgeData = {
          id: student.id,
          firstName: student.firstName || "there",
          email: student.email,
          lastLoginAt: student.lastLoginAt,
          currentStreak: student.streak?.currentStreak || 0,
          enrollments: enrollmentData,
        };

        // Evaluate which nudge (if any) to send
        const rule = evaluateNudge(studentData, now);

        if (!rule) continue;

        // Check if we already sent this nudge type recently (cooldown)
        const cooldownDays = getNudgeCooldownDays(rule);
        const cooldownDate = new Date(now.getTime() - cooldownDays * 24 * 60 * 60 * 1000);

        const recentNudge = await prisma.message.findFirst({
          where: {
            senderId: sarah.id,
            receiverId: student.id,
            content: { contains: `<!-- nudge:${rule.id} -->` },
            createdAt: { gte: cooldownDate },
          },
        });

        if (recentNudge) continue; // Skip - already sent recently

        // Get primary enrollment for message template
        const primaryEnrollment = enrollmentData[0];

        // Fill in the message template
        const message = fillMessageTemplate(rule.message, studentData, primaryEnrollment);

        // Add emoji prefix if available
        const formattedMessage = rule.emoji ? `${rule.emoji} ${message}` : message;

        // Send the nudge as a message from Sarah
        await prisma.message.create({
          data: {
            senderId: sarah.id,
            receiverId: student.id,
            content: `${formattedMessage}\n\n<!-- nudge:${rule.id} -->`,
          },
        });

        nudgesSent.push({ student: student.email, rule: rule.id });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${student.email}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      studentsProcessed: students.length,
      nudgesSent: nudgesSent.length,
      details: nudgesSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Sarah nudges cron error:", error);
    return NextResponse.json(
      { error: "Failed to send nudges", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
