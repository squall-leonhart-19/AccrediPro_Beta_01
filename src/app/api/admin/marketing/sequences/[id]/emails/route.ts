import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences/[id]/emails - Get all emails in sequence
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;

    const emails = await prisma.sequenceEmail.findMany({
      where: { sequenceId },
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
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching sequence emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/sequences/[id]/emails - Add email to sequence
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const body = await request.json();
    const {
      emailTemplateId,
      subject,
      htmlContent,
      delayDays,
      delayHours,
    } = body;

    // Verify sequence exists
    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        _count: { select: { emails: true } },
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    // Get next order number
    const nextOrder = sequence._count.emails + 1;

    const email = await prisma.sequenceEmail.create({
      data: {
        sequenceId,
        emailTemplateId: emailTemplateId || null,
        customSubject: subject || "Untitled Email",
        customContent: htmlContent || "",
        delayDays: delayDays || 0,
        delayHours: delayHours || 0,
        order: nextOrder,
        isActive: true,
      },
      include: {
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
    });

    // Transform response
    const transformedEmail = {
      ...email,
      subject: email.customSubject || "Untitled",
    };

    return NextResponse.json({ email: transformedEmail }, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence email:", error);
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/marketing/sequences/[id]/emails - Reorder emails
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const body = await request.json();
    const { emailOrder } = body; // Array of { id: string, order: number }

    if (!Array.isArray(emailOrder)) {
      return NextResponse.json(
        { error: "emailOrder array is required" },
        { status: 400 }
      );
    }

    // Update all email orders in a transaction
    await prisma.$transaction(
      emailOrder.map(({ id, order }: { id: string; order: number }) =>
        prisma.sequenceEmail.update({
          where: { id },
          data: { order },
        })
      )
    );

    // Fetch updated emails
    const emails = await prisma.sequenceEmail.findMany({
      where: { sequenceId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error reordering emails:", error);
    return NextResponse.json(
      { error: "Failed to reorder emails" },
      { status: 500 }
    );
  }
}
