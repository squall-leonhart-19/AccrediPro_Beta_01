import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.knowledgeBaseArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PATCH - Update article (edit, publish/unpublish)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, question, answer, keywords, category, isPublished, helpful } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (category !== undefined) updateData.category = category;

    // Handle publish status
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle helpful votes (from public help center)
    if (helpful === true) {
      updateData.helpfulCount = { increment: 1 };
    } else if (helpful === false) {
      updateData.notHelpfulCount = { increment: 1 };
    }

    const article = await prisma.knowledgeBaseArticle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.knowledgeBaseArticle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
