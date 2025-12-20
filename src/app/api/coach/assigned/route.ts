import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get the user's assigned coach (Sarah for mini-diploma users)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // First try to get the user's niche-matched coach
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { niche: true },
        });

        // For now, return Sarah as the default coach for all mini-diploma users
        // Later can be expanded to match based on niche
        const sarah = await prisma.user.findFirst({
            where: {
                email: "sarah@accredipro-certificate.com",
                role: { in: ["MENTOR", "ADMIN", "SUPER_ADMIN"] },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                email: true,
            },
        });

        if (!sarah) {
            // Fall back to any admin/mentor
            const fallbackCoach = await prisma.user.findFirst({
                where: {
                    role: { in: ["ADMIN", "SUPER_ADMIN", "MENTOR"] },
                    isActive: true,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    bio: true,
                },
            });

            if (fallbackCoach) {
                return NextResponse.json({
                    success: true,
                    coach: {
                        ...fallbackCoach,
                        avatar: fallbackCoach.avatar || "/coaches/sarah-coach.webp",
                    },
                });
            }

            return NextResponse.json(
                { success: false, error: "No coach found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            coach: {
                ...sarah,
                avatar: sarah.avatar || "/coaches/sarah-coach.webp",
            },
        });
    } catch (error) {
        console.error("Get assigned coach error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get assigned coach" },
            { status: 500 }
        );
    }
}
