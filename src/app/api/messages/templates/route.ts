import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch message templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow coaches to get templates
    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const templates = await prisma.messageTemplate.findMany({
      where: {
        isActive: true,
        category: {
          in: ["WELCOME", "PROGRESS", "ENCOURAGEMENT", "REMINDER", "MILESTONE", "SUPPORT"],
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Group by category
    const grouped = templates.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = [];
      }
      acc[t.category].push(t);
      return acc;
    }, {} as Record<string, typeof templates>);

    return NextResponse.json({
      success: true,
      templates: grouped,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      { error: "Failed to get templates" },
      { status: 500 }
    );
  }
}

// POST - Apply template with variable substitution
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { templateId, studentId } = await req.json();

    if (!templateId || !studentId) {
      return NextResponse.json({ error: "Missing templateId or studentId" }, { status: 400 });
    }

    // Get template
    const template = await prisma.messageTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Get student data for variable substitution
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
          },
          orderBy: { enrolledAt: "desc" },
        },
        streak: true,
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: "desc" },
          take: 3,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get coach data
    const coach = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });

    // Prepare variables for substitution
    const latestCourse = student.enrollments[0]?.course?.title || "your course";
    const latestProgress = student.enrollments[0]?.progress || 0;
    const variables: Record<string, string> = {
      firstName: student.firstName || "there",
      lastName: student.lastName || "",
      fullName: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student",
      courseName: latestCourse,
      progress: `${Math.round(latestProgress)}%`,
      streak: `${student.streak?.currentStreak || 0}`,
      points: `${student.streak?.totalPoints || 0}`,
      badgeCount: `${student.badges.length}`,
      coachName: `${coach?.firstName || ""} ${coach?.lastName || ""}`.trim() || "Your Coach",
    };

    // Substitute variables in content
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }

    return NextResponse.json({
      success: true,
      content,
      variables,
    });
  } catch (error) {
    console.error("Apply template error:", error);
    return NextResponse.json(
      { error: "Failed to apply template" },
      { status: 500 }
    );
  }
}
