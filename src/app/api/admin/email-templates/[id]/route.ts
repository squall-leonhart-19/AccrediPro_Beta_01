import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// GET - Get single email template with full content
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Read operation - allow SUPPORT for read-only access
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching email template:", error);
    return NextResponse.json(
      { error: "Failed to fetch email template" },
      { status: 500 }
    );
  }
}

// PUT - Update email template
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Write operation - SUPPORT cannot update templates
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const {
      name,
      description,
      category,
      subject,
      preheader,
      htmlContent,
      textContent,
      courseTag,
      placeholders,
      isActive,
    } = body;

    // Check if template exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(subject !== undefined && { subject }),
        ...(preheader !== undefined && { preheader }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(textContent !== undefined && { textContent }),
        ...(courseTag !== undefined && { courseTag }),
        ...(placeholders !== undefined && { placeholders }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error updating email template:", error);
    return NextResponse.json(
      { error: "Failed to update email template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete email template (only non-system templates)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Write operation - SUPPORT cannot delete templates
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template.isSystem) {
      return NextResponse.json(
        { error: "System templates cannot be deleted" },
        { status: 403 }
      );
    }

    await prisma.emailTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return NextResponse.json(
      { error: "Failed to delete email template" },
      { status: 500 }
    );
  }
}
