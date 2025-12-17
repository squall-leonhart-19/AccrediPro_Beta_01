import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addTagSchema = z.object({
  userId: z.string(),
  tag: z.string().min(1, "Tag is required"),
  value: z.string().optional(),
});

// GET - Fetch all unique tags for dropdown
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique tags from the database
    const tags = await prisma.userTag.findMany({
      select: {
        tag: true,
      },
      distinct: ["tag"],
      orderBy: {
        tag: "asc",
      },
    });

    // Get unique tag names
    const uniqueTags = [...new Set(tags.map((t) => t.tag))];

    return NextResponse.json({
      success: true,
      tags: uniqueTags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can add tags
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = addTagSchema.parse(body);

    // Check if tag already exists for this user
    const existingTag = await prisma.userTag.findFirst({
      where: {
        userId: data.userId,
        tag: data.tag,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "This tag already exists for this user" },
        { status: 400 }
      );
    }

    // Create the tag
    const tag = await prisma.userTag.create({
      data: {
        userId: data.userId,
        tag: data.tag,
        value: data.value || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tag added successfully",
      tag,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Add tag error:", error);
    return NextResponse.json(
      { error: "Failed to add tag" },
      { status: 500 }
    );
  }
}

// Delete tag endpoint
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    await prisma.userTag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
