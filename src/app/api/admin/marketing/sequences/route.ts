import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences - List all sequences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sequences = await prisma.sequence.findMany({
      include: {
        emails: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            customSubject: true,
            customContent: true,
            delayDays: true,
            delayHours: true,
            order: true,
            isActive: true,
            sentCount: true,
            openCount: true,
            clickCount: true,
          },
        },
        triggerTag: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        exitTag: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            emails: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      sequences: sequences.map((seq) => ({
        ...seq,
        emails: seq.emails.map((email) => ({
          ...email,
          subject: email.customSubject || "Untitled",
        })),
        emailCount: seq._count.emails,
        enrollmentCount: seq._count.enrollments,
      })),
    });
  } catch (error) {
    console.error("Error fetching sequences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sequences" },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/sequences - Create new sequence
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      triggerTagId,
      exitTagId,
      triggerType,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Sequence name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const sequence = await prisma.sequence.create({
      data: {
        name,
        slug,
        description: description || null,
        triggerType: triggerType || (triggerTagId ? "TAG_ADDED" : "MANUAL"),
        triggerTagId: triggerTagId || null,
        exitTagId: exitTagId || null,
        isActive: false, // Start inactive
      },
      include: {
        triggerTag: true,
        exitTag: true,
      },
    });

    return NextResponse.json({ sequence }, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence:", error);
    return NextResponse.json(
      { error: "Failed to create sequence" },
      { status: 500 }
    );
  }
}
