import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/tags - List all tags with user counts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Read operation - allow SUPPORT for read-only access
    if (!session?.user || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const tags = await prisma.marketingTag.findMany({
      where: category ? { category: category as any } : undefined,
      include: {
        _count: {
          select: { userTags: true },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Map user counts
    const tagsWithCounts = tags.map((tag) => ({
      ...tag,
      userCount: tag._count.userTags,
      _count: undefined,
    }));

    return NextResponse.json({ tags: tagsWithCounts });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Write operation - SUPPORT cannot create tags
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, category, color, description } = body;

    if (!name || !slug || !category) {
      return NextResponse.json(
        { error: "Name, slug, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.marketingTag.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A tag with this slug already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.marketingTag.create({
      data: {
        name,
        slug,
        category,
        color: color || "#6B7280",
        description,
        isSystem: false,
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
