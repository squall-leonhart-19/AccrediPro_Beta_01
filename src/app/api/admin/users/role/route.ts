import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["STUDENT", "MENTOR", "INSTRUCTOR", "ADMIN", "SUPERUSER", "SUPPORT"]),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins/superusers can change roles - SUPPORT cannot modify
    if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = roleSchema.parse(body);

    // Prevent changing own role (safety measure)
    if (data.userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    // Update user role
    const user = await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Role updated to ${data.role}`,
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Role change error:", error);
    return NextResponse.json(
      { error: "Failed to change role" },
      { status: 500 }
    );
  }
}
