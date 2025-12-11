import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
    avatar: z.string().optional(),
    bio: z.string().max(500).optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
});

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = profileUpdateSchema.parse(body);

        // Build update object with only provided fields
        const updateData: Record<string, string | boolean> = {};

        if (validatedData.avatar !== undefined) {
            updateData.avatar = validatedData.avatar;
        }
        if (validatedData.bio !== undefined) {
            updateData.bio = validatedData.bio;
            updateData.hasCompletedProfile = true;
        }
        if (validatedData.firstName !== undefined) {
            updateData.firstName = validatedData.firstName;
        }
        if (validatedData.lastName !== undefined) {
            updateData.lastName = validatedData.lastName;
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                avatar: true,
                bio: true,
                firstName: true,
                lastName: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                avatar: true,
                bio: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
