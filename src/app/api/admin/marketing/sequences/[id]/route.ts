import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences/[id] - Get single sequence with all details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // Read operation - allow SUPPORT for read-only access
    if (!session?.user || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const sequence = await prisma.sequence.findUnique({
      where: { id },
      include: {
        emails: {
          orderBy: { order: "asc" },
          include: {
            emailTemplate: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
        },
        triggerTag: true,
        exitTag: true,
        enrollments: {
          take: 50,
          orderBy: { enrolledAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            emails: true,
          },
        },
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    return NextResponse.json({
      sequence: {
        ...sequence,
        emailCount: sequence._count.emails,
        enrollmentCount: sequence._count.enrollments,
      },
    });
  } catch (error) {
    console.error("Error fetching sequence:", error);
    return NextResponse.json(
      { error: "Failed to fetch sequence" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/marketing/sequences/[id] - Update sequence
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // Write operation - SUPPORT cannot update sequences
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      triggerTagId,
      exitTagId,
      triggerEvent,
      fromName,
      fromEmail,
      isActive,
    } = body;

    const existing = await prisma.sequence.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    const sequence = await prisma.sequence.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        triggerTagId: triggerTagId !== undefined ? triggerTagId : existing.triggerTagId,
        exitTagId: exitTagId !== undefined ? exitTagId : existing.exitTagId,
        triggerEvent: triggerEvent !== undefined ? triggerEvent : existing.triggerEvent,
        fromName: fromName ?? existing.fromName,
        fromEmail: fromEmail ?? existing.fromEmail,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
      include: {
        triggerTag: true,
        exitTag: true,
        emails: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ sequence });
  } catch (error) {
    console.error("Error updating sequence:", error);
    return NextResponse.json(
      { error: "Failed to update sequence" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/sequences/[id] - Delete sequence
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // Write operation - SUPPORT cannot delete sequences
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const sequence = await prisma.sequence.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    // Check if there are active enrollments
    if (sequence._count.enrollments > 0) {
      // Optionally: Exit all active enrollments first
      await prisma.sequenceEnrollment.updateMany({
        where: {
          sequenceId: id,
          status: "ACTIVE",
        },
        data: {
          status: "EXITED",
          exitedAt: new Date(),
          exitReason: "Sequence deleted",
        },
      });
    }

    await prisma.sequence.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sequence:", error);
    return NextResponse.json(
      { error: "Failed to delete sequence" },
      { status: 500 }
    );
  }
}
