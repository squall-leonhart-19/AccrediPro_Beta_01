
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const knowledgeUpdateSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    knowledgeBase: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = knowledgeUpdateSchema.parse(body);

        // Update user profile with knowledge base
        const updatedUser = await prisma.user.update({
            where: { id: validatedData.userId },
            data: {
                knowledgeBase: validatedData.knowledgeBase || "",
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

        console.error("Admin knowledge base update error:", error);
        return NextResponse.json(
            { error: "Failed to update knowledge base" },
            { status: 500 }
        );
    }
}
