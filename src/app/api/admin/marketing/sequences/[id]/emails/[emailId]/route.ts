import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences/[id]/emails/[emailId] - Get single email
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailId } = await params;

    const email = await prisma.sequenceEmail.findUnique({
      where: { id: emailId },
      include: {
        emailTemplate: true,
        sequence: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Failed to fetch email" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/marketing/sequences/[id]/emails/[emailId] - Update email
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailId } = await params;
    const body = await request.json();
    const {
      emailTemplateId,
      subject,
      customSubject,
      htmlContent,
      customContent,
      textContent,
      delayDays,
      delayHours,
      delayMinutes,
      sendCondition,
      isActive,
    } = body;

    const existing = await prisma.sequenceEmail.findUnique({
      where: { id: emailId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Accept both field name conventions
    const newSubject = customSubject ?? subject;
    const newContent = customContent ?? htmlContent;

    const email = await prisma.sequenceEmail.update({
      where: { id: emailId },
      data: {
        emailTemplateId: emailTemplateId !== undefined ? emailTemplateId : existing.emailTemplateId,
        customSubject: newSubject !== undefined ? newSubject : existing.customSubject,
        customContent: newContent !== undefined ? newContent : existing.customContent,
        delayDays: delayDays !== undefined ? delayDays : existing.delayDays,
        delayHours: delayHours !== undefined ? delayHours : existing.delayHours,
        requiresTagId: body.requiresTagId !== undefined ? body.requiresTagId : existing.requiresTagId,
        skipIfTagId: body.skipIfTagId !== undefined ? body.skipIfTagId : existing.skipIfTagId,
        isActive: isActive !== undefined ? isActive : existing.isActive,
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

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/sequences/[id]/emails/[emailId] - Delete email
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId, emailId } = await params;

    const email = await prisma.sequenceEmail.findUnique({
      where: { id: emailId },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    await prisma.sequenceEmail.delete({
      where: { id: emailId },
    });

    // Reorder remaining emails
    const remainingEmails = await prisma.sequenceEmail.findMany({
      where: { sequenceId },
      orderBy: { order: "asc" },
    });

    // Update order for all remaining emails
    await prisma.$transaction(
      remainingEmails.map((e, index) =>
        prisma.sequenceEmail.update({
          where: { id: e.id },
          data: { order: index + 1 },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
