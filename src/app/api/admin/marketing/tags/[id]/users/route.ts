import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/marketing/tags/[id]/users - Add tag to users
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tagId } = await params;
    const body = await request.json();
    const { userIds, source = "manual" } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Verify tag exists
    const tag = await prisma.marketingTag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Add tag to users (skip if already exists)
    const results = await Promise.all(
      userIds.map(async (userId: string) => {
        try {
          await prisma.userMarketingTag.upsert({
            where: {
              userId_tagId: { userId, tagId },
            },
            update: {}, // Don't update if exists
            create: {
              userId,
              tagId,
              source,
            },
          });
          return { userId, success: true };
        } catch (error) {
          return { userId, success: false, error: "Failed to add tag" };
        }
      })
    );

    // Update tag user count
    const count = await prisma.userMarketingTag.count({
      where: { tagId },
    });
    await prisma.marketingTag.update({
      where: { id: tagId },
      data: { userCount: count },
    });

    const successCount = results.filter((r) => r.success).length;
    return NextResponse.json({
      success: true,
      added: successCount,
      total: userIds.length,
      results,
    });
  } catch (error) {
    console.error("Error adding tag to users:", error);
    return NextResponse.json(
      { error: "Failed to add tag to users" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/tags/[id]/users - Remove tag from users
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tagId } = await params;
    const body = await request.json();
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Remove tags
    await prisma.userMarketingTag.deleteMany({
      where: {
        tagId,
        userId: { in: userIds },
      },
    });

    // Update tag user count
    const count = await prisma.userMarketingTag.count({
      where: { tagId },
    });
    await prisma.marketingTag.update({
      where: { id: tagId },
      data: { userCount: count },
    });

    return NextResponse.json({
      success: true,
      removed: userIds.length,
    });
  } catch (error) {
    console.error("Error removing tag from users:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from users" },
      { status: 500 }
    );
  }
}
