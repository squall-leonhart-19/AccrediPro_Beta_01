import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Add a free resource to user's library
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId, resourceType } = body;

    if (!resourceId || !resourceType) {
      return NextResponse.json(
        { error: "Missing resourceId or resourceType" },
        { status: 400 }
      );
    }

    // Use UserTag to track unlocked resources
    const tagName = `library:${resourceId}`;

    // Check if already added
    const existingTag = await prisma.userTag.findUnique({
      where: {
        userId_tag: {
          userId: session.user.id,
          tag: tagName
        }
      }
    });

    if (existingTag) {
      return NextResponse.json({
        success: true,
        message: "Resource already in library",
        alreadyAdded: true
      });
    }

    // Add to library via UserTag
    await prisma.userTag.create({
      data: {
        userId: session.user.id,
        tag: tagName,
        value: resourceType,
        metadata: {
          addedAt: new Date().toISOString(),
          resourceId,
          resourceType
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Resource added to library",
      resourceId
    });

  } catch (error) {
    console.error("Error adding resource to library:", error);
    return NextResponse.json(
      { error: "Failed to add resource to library" },
      { status: 500 }
    );
  }
}

// GET - Check if user has a resource in their library
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId");

    if (!resourceId) {
      // Return all unlocked resources
      const tags = await prisma.userTag.findMany({
        where: {
          userId: session.user.id,
          tag: { startsWith: "library:" }
        }
      });

      const unlockedResources = tags.map(t => t.tag.replace("library:", ""));

      return NextResponse.json({
        success: true,
        unlockedResources
      });
    }

    // Check specific resource
    const tagName = `library:${resourceId}`;
    const tag = await prisma.userTag.findUnique({
      where: {
        userId_tag: {
          userId: session.user.id,
          tag: tagName
        }
      }
    });

    return NextResponse.json({
      success: true,
      hasResource: !!tag,
      resourceId
    });

  } catch (error) {
    console.error("Error checking library:", error);
    return NextResponse.json(
      { error: "Failed to check library" },
      { status: 500 }
    );
  }
}
