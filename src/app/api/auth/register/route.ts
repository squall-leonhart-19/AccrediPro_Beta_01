import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { triggerWebhook } from "@/lib/webhooks";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  leadSource: z.string().optional(),      // e.g., "freebie", "webinar", "direct"
  leadSourceDetail: z.string().optional(), // e.g., specific freebie name
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        leadSource: validatedData.leadSource || "direct",
        leadSourceDetail: validatedData.leadSourceDetail,
      },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    // Send welcome email
    await sendWelcomeEmail({ to: user.email, firstName: user.firstName || "there" });

    // Trigger webhook
    await triggerWebhook("user.registered", {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      registeredAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
