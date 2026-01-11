import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { profileId, isPublicDirectory } = await req.json();

        if (!profileId) {
            return NextResponse.json({ error: "profileId required" }, { status: 400 });
        }

        // Update the profile
        const updated = await prisma.user.update({
            where: { id: profileId },
            data: { isPublicDirectory },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                isPublicDirectory: true,
            },
        });

        return NextResponse.json({
            success: true,
            profile: updated
        });
    } catch (error) {
        console.error("Error updating zombie profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

// GET - Fetch all zombie profiles
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const profiles = await prisma.user.findMany({
            where: { isFakeProfile: true },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                location: true,
                professionalTitle: true,
                specialties: true,
                acceptingClients: true,
                isPublicDirectory: true,
                slug: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ profiles });
    } catch (error) {
        console.error("Error fetching zombie profiles:", error);
        return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }
}
