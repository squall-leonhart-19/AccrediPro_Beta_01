import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch coach availability
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                availabilityNote: true,
                socialLinks: true, // We'll store availability schedule in socialLinks.availability
            },
        });

        // Parse availability from socialLinks if it exists
        const socialLinks = user?.socialLinks as Record<string, unknown> | null;
        const availability = socialLinks?.availability || null;
        const timezone = socialLinks?.timezone || "America/New_York";

        return NextResponse.json({
            success: true,
            data: {
                availability,
                timezone,
                availabilityNote: user?.availabilityNote,
            }
        });
    } catch (error) {
        console.error("Fetch availability error:", error);
        return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
    }
}

// PUT - Update coach availability
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { availability, timezone, availabilityNote } = body;

        // Get current socialLinks
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { socialLinks: true },
        });

        const currentSocialLinks = (currentUser?.socialLinks as Record<string, unknown>) || {};

        // Update user with new availability
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                availabilityNote: availabilityNote || null,
                socialLinks: {
                    ...currentSocialLinks,
                    availability,
                    timezone,
                },
            },
            select: {
                availabilityNote: true,
                socialLinks: true,
            },
        });

        const updatedSocialLinks = updatedUser.socialLinks as Record<string, unknown> | null;

        return NextResponse.json({
            success: true,
            data: {
                availability: updatedSocialLinks?.availability,
                timezone: updatedSocialLinks?.timezone,
                availabilityNote: updatedUser.availabilityNote,
            }
        });
    } catch (error) {
        console.error("Update availability error:", error);
        return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
    }
}
