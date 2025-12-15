import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin/instructor/mentor to use AI replies
    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Initialize Anthropic client inside the handler to ensure env var is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log("ANTHROPIC_API_KEY exists:", !!apiKey, "length:", apiKey?.length);
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }
    const anthropic = new Anthropic({ apiKey });

    const { conversationUserId } = await req.json();

    if (!conversationUserId) {
      return NextResponse.json({ error: "Missing conversationUserId" }, { status: 400 });
    }

    // Get conversation history
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: conversationUserId },
          { senderId: conversationUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 20, // Last 20 messages for context
    });

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: conversationUserId },
      include: {
        enrollments: {
          include: {
            course: {
              select: { id: true, title: true, description: true },
            },
          },
        },
        streak: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Build conversation history for AI
    const conversationHistory = messages.map((msg) => ({
      role: msg.senderId === session.user.id ? "coach" : "student",
      content: msg.content,
    }));

    // Build student context
    const studentContext = {
      name: `${student.firstName} ${student.lastName}`,
      enrolledCourses: student.enrollments.map((e) => ({
        title: e.course.title,
        progress: Number(e.progress),
        status: e.status,
      })),
      currentStreak: student.streak?.currentStreak || 0,
      totalPoints: student.streak?.totalPoints || 0,
    };

    // Load knowledge base
    let knowledgeContext = "";

    // 1. Try to load MENTOR-SPECIFIC knowledge first
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { knowledgeBase: true }
    });

    if (currentUser?.knowledgeBase) {
      console.log("Using MENTOR knowledge base for", session.user.id);
      knowledgeContext = `\n\nMentor's Specific Knowledge Base:\n${currentUser.knowledgeBase}\n\nINSTRUCTION: Use the above specific knowledge to answer the student's question. If the answer is in this knowledge base, prioritize it over general knowledge.`;
    }

    // 2. Fallback to generic JSON file if no mentor knowledge or as supplement (optional)
    // For now, we'll only look at the JSON if the mentor hasn't set anything, OR we could append it.
    // Let's Append but prioritize Mentor knowledge.

    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const knowledgePath = path.join(process.cwd(), "src/data/knowledge-base.json");
      const knowledgeData = await fs.readFile(knowledgePath, "utf-8");
      const knowledge = JSON.parse(knowledgeData);

      // Get the last student message to find relevant knowledge
      const lastStudentMessage = conversationHistory
        .filter((m) => m.role === "student")
        .pop()?.content?.toLowerCase() || "";

      // Search for relevant knowledge entries
      const relevantEntries: string[] = [];
      for (const category of knowledge.categories || []) {
        for (const entry of category.entries || []) {
          const question = (entry.question || "").toLowerCase();
          const answer = entry.answer || "";
          // Simple keyword matching
          const keywords = lastStudentMessage.split(/\s+/).filter((w: string) => w.length > 3);
          if (keywords.some((kw: string) => question.includes(kw))) {
            relevantEntries.push(`Q: ${entry.question}\nA: ${answer}`);
          }
        }
      }

      if (relevantEntries.length > 0) {
        knowledgeContext += `\n\nGeneral System Knowledge Base:\n${relevantEntries.slice(0, 3).join("\n\n")}`;
      }
    } catch (error) {
      console.log("General knowledge base not found or error reading:", error);
    }

    // Generate AI response
    const systemPrompt = `You are a supportive educational coach for AccrediPro LMS specializing in Functional Medicine and Integrative Health. Your role is to:
- Be warm, encouraging, and professional
- Help students with their learning journey
- Answer questions about functional medicine, gut health, inflammation, and holistic wellness
- Provide motivation and support
- Keep responses concise (2-3 sentences max)
- Use your knowledge base information when relevant

Student Information:
- Name: ${studentContext.name}
- Enrolled Courses: ${studentContext.enrolledCourses.map((c) => `${c.title} (${c.progress}% complete, ${c.status})`).join(", ") || "None"}
- Current Streak: ${studentContext.currentStreak} days
- Total Points: ${studentContext.totalPoints}
${knowledgeContext}

Recent Conversation:
${conversationHistory.map((m) => `${m.role === "coach" ? "Coach" : "Student"}: ${m.content}`).join("\n")}

Generate a helpful, warm response to the student's last message. If relevant knowledge base information is provided, incorporate it naturally. Keep it brief and actionable.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    const suggestedReply = response.content[0].type === "text"
      ? response.content[0].text
      : "";

    return NextResponse.json({
      success: true,
      suggestedReply,
      studentContext: {
        name: studentContext.name,
        courses: studentContext.enrolledCourses.length,
        streak: studentContext.currentStreak,
      },
    });
  } catch (error) {
    console.error("AI suggest reply error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
