
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const knowledgeUpdateSchema = z.object({
    knowledgeBase: z.string().optional(),
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

        // Only MENTOR and ADMIN can update knowledge base
        if (session.user.role !== "MENTOR" && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Only mentors and admins can update knowledge base" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = knowledgeUpdateSchema.parse(body);

        // Update user profile with knowledge base
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                knowledgeBase: validatedData.knowledgeBase || "", // Allow clearing it
            },
            select: {
                id: true,
                knowledgeBase: true,
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

        console.error("Knowledge base update error:", error);
        return NextResponse.json(
            { error: "Failed to update knowledge base" },
            { status: 500 }
        );
    }
}
