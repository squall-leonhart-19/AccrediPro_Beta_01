import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch notes for a lesson
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "lessonId is required" },
        { status: 400 }
      );
    }

    const notes = await prisma.lessonNote.findMany({
      where: {
        userId: session.user.id,
        lessonId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId, type, content, noteText, position, color } =
      await request.json();

    if (!lessonId || !content) {
      return NextResponse.json(
        { success: false, error: "lessonId and content are required" },
        { status: 400 }
      );
    }

    const note = await prisma.lessonNote.create({
      data: {
        userId: session.user.id,
        lessonId,
        type: type || "NOTE",
        content,
        noteText,
        position,
        color,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    );
  }
}
