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

// GET - Fetch all unique tags for dropdown (includes UserTags + suggested from leadSource)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique tags from UserTag table
    const tags = await prisma.userTag.findMany({
      select: {
        tag: true,
      },
      distinct: ["tag"],
      orderBy: {
        tag: "asc",
      },
    });

    // Get unique leadSource values to suggest as tags
    const leadSources = await prisma.user.findMany({
      where: {
        leadSource: { not: null },
      },
      select: {
        leadSource: true,
        leadSourceDetail: true,
      },
      distinct: ["leadSource", "leadSourceDetail"],
    });

    // Build suggested tags from leadSource
    const suggestedFromLeadSource: string[] = [];
    for (const ls of leadSources) {
      if (ls.leadSource) {
        suggestedFromLeadSource.push(`source:${ls.leadSource}`);
      }
      if (ls.leadSourceDetail) {
        suggestedFromLeadSource.push(`source:${ls.leadSourceDetail}`);
      }
    }

    // Combine all tags and remove duplicates
    const allTags = [
      ...new Set([
        ...tags.map((t) => t.tag),
        ...suggestedFromLeadSource,
      ]),
    ].sort();

    return NextResponse.json({
      success: true,
      tags: allTags,
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

    // Special tag: fm_free_mini_diploma_lead grants mini-diploma access
    if (data.tag === "fm_free_mini_diploma_lead") {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          miniDiplomaCategory: "functional-medicine",
          miniDiplomaOptinAt: new Date(),
          leadSource: "admin-tag-grant",
          leadSourceDetail: "fm_free_mini_diploma_lead",
        },
      });

      // Also add related tags for consistency
      const relatedTags = [
        "source:mini-diploma-freebie",
        "source:functional-medicine",
        "mini_diploma_category:functional-medicine",
      ];
      for (const relatedTag of relatedTags) {
        await prisma.userTag.upsert({
          where: { userId_tag: { userId: data.userId, tag: relatedTag } },
          update: {},
          create: { userId: data.userId, tag: relatedTag },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Tag added + Mini Diploma access granted!",
        tag,
        miniDiplomaGranted: true,
      });
    }

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
