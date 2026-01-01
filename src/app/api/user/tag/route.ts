import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tag, value, metadata } = await request.json();

    if (!tag) {
      return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }

    // Upsert the tag (create or update)
    const userTag = await prisma.userTag.upsert({
      where: {
        userId_tag: {
          userId: session.user.id,
          tag,
        },
      },
      update: {
        value: value || null,
        metadata: metadata || null,
        createdAt: new Date(),
      },
      create: {
        userId: session.user.id,
        tag,
        value: value || null,
        metadata: metadata || null,
      },
    });

    return NextResponse.json({
      success: true,
      tag: userTag,
    });
  } catch (error) {
    console.error("Error saving user tag:", error);
    return NextResponse.json(
      { error: "Failed to save tag" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix");

    const where: any = { userId: session.user.id };
    if (prefix) {
      where.tag = { startsWith: prefix };
    }

    const tags = await prisma.userTag.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("Error fetching user tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
