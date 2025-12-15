import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { generateSarahVoice } from "@/lib/elevenlabs";
import { createClient } from "@supabase/supabase-js";

/**
 * AI Voice Reply Endpoint
 *
 * This endpoint combines:
 * 1. Anthropic Claude for generating an AI text reply
 * 2. ElevenLabs for converting the reply to Sarah's voice
 *
 * Returns both the text reply and the audio URL
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin/instructor/mentor to use AI voice replies
    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { conversationUserId, generateVoice = true } = await req.json();

    if (!conversationUserId) {
      return NextResponse.json({ error: "Missing conversationUserId" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey.length < 10) {
      console.error("ANTHROPIC_API_KEY is not set or invalid");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Get conversation history
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: conversationUserId },
          { senderId: conversationUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: conversationUserId },
      include: {
        enrollments: {
          include: {
            course: { select: { id: true, title: true, description: true } },
          },
        },
        streak: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Build conversation history
    const conversationHistory = messages.map((msg) => ({
      role: msg.senderId === session.user.id ? "coach" : "student",
      content: msg.content,
    }));

    // Build student context
    const studentContext = {
      name: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "there",
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

    // Load mentor-specific knowledge
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { knowledgeBase: true }
    });

    if (currentUser?.knowledgeBase) {
      knowledgeContext = `\n\nMentor's Knowledge Base:\n${currentUser.knowledgeBase}`;
    }

    // Generate AI response
    const systemPrompt = `You are Sarah, a warm and supportive educational coach for AccrediPro Academy specializing in Functional Medicine. Your personality is:
- Warm, encouraging, and genuinely caring
- Professional but approachable
- Uses natural, conversational language (not robotic)
- Sometimes uses "!" for enthusiasm but not excessively
- Signs off as "Sarah" or "- Sarah"

Student: ${studentContext.name}
Enrolled: ${studentContext.enrolledCourses.map((c) => `${c.title} (${c.progress}%)`).join(", ") || "None"}
Streak: ${studentContext.currentStreak} days | Points: ${studentContext.totalPoints}
${knowledgeContext}

Recent Conversation:
${conversationHistory.slice(-10).map((m) => `${m.role === "coach" ? "Sarah" : "Student"}: ${m.content}`).join("\n")}

IMPORTANT: Keep your response natural and conversational. 2-4 sentences max. Sound like a real person, not an AI.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
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

    // Step 2: Generate voice using ElevenLabs (if requested)
    let voiceUrl: string | null = null;
    let voiceDuration: number | null = null;

    if (generateVoice && suggestedReply && process.env.ELEVENLABS_API_KEY) {
      console.log(`🎙️ Generating voice reply with ElevenLabs...`);

      const voiceResult = await generateSarahVoice(suggestedReply);

      if (voiceResult.success && voiceResult.audioBase64) {
        // Upload to Supabase storage
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const bucket = "chat-attachments";
          const filePath = `coach-voice-replies/${session.user.id}-${Date.now()}.mp3`;

          const buffer = Buffer.from(voiceResult.audioBase64, "base64");

          const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
              contentType: "audio/mpeg",
              cacheControl: "3600",
              upsert: false,
            });

          if (!error) {
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
            voiceUrl = urlData.publicUrl;
            voiceDuration = voiceResult.duration || 30;
            console.log(`✅ Voice reply uploaded: ${voiceUrl}`);
          } else {
            console.warn(`Failed to upload voice to Supabase: ${error.message}`);
          }
        }
      } else {
        console.warn(`ElevenLabs voice generation failed: ${voiceResult.error}`);
      }
    }

    return NextResponse.json({
      success: true,
      suggestedReply,
      voice: voiceUrl ? {
        url: voiceUrl,
        duration: voiceDuration,
        provider: "elevenlabs",
      } : null,
      studentContext: {
        name: studentContext.name,
        courses: studentContext.enrolledCourses.length,
        streak: studentContext.currentStreak,
      },
    });
  } catch (error) {
    console.error("AI voice reply error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice reply" },
      { status: 500 }
    );
  }
}
