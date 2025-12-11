import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isActive } = await request.json();

    const workflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const updated = await prisma.workflow.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      workflow: updated,
    });
  } catch (error) {
    console.error("Error toggling workflow:", error);
    return NextResponse.json(
      { error: "Failed to toggle workflow" },
      { status: 500 }
    );
  }
}
