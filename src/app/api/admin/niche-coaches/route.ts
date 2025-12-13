import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NICHE_DEFINITIONS } from "@/lib/niche-coach";

// GET - List all niche coach assignments
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all niche coaches with coach details
        const nicheCoaches = await prisma.nicheCoach.findMany({
            orderBy: { niche: "asc" },
        });

        // Get coach details for each
        const coachIds = [...new Set(nicheCoaches.map((nc) => nc.coachId))];
        const coaches = await prisma.user.findMany({
            where: { id: { in: coachIds } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                specialties: true,
            },
        });

        const coachMap = new Map(coaches.map((c) => [c.id, c]));

        // Get all available coaches (for dropdown)
        const availableCoaches = await prisma.user.findMany({
            where: {
                role: { in: ["MENTOR", "INSTRUCTOR", "ADMIN"] },
                isActive: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                specialties: true,
            },
            orderBy: { firstName: "asc" },
        });

        // Build response with all niches (including unassigned)
        const allNiches = Object.entries(NICHE_DEFINITIONS).map(([slug, def]) => {
            const assignment = nicheCoaches.find((nc) => nc.niche === slug);
            const coach = assignment ? coachMap.get(assignment.coachId) : null;

            return {
                niche: slug,
                displayName: def.displayName,
                description: def.description,
                leadTags: def.leadTags,
                assignment: assignment
                    ? {
                          id: assignment.id,
                          coachId: assignment.coachId,
                          isActive: assignment.isActive,
                          coach: coach,
                      }
                    : null,
            };
        });

        return NextResponse.json({
            niches: allNiches,
            availableCoaches,
        });
    } catch (error) {
        console.error("Error fetching niche coaches:", error);
        return NextResponse.json({ error: "Failed to fetch niche coaches" }, { status: 500 });
    }
}

// POST - Assign or update a coach for a niche
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { niche, coachId } = await request.json();

        if (!niche || !coachId) {
            return NextResponse.json({ error: "Niche and coachId are required" }, { status: 400 });
        }

        // Validate niche exists
        if (!(niche in NICHE_DEFINITIONS)) {
            return NextResponse.json({ error: "Invalid niche" }, { status: 400 });
        }

        // Validate coach exists
        const coach = await prisma.user.findUnique({
            where: { id: coachId },
            select: { id: true, role: true },
        });

        if (!coach || !["MENTOR", "INSTRUCTOR", "ADMIN"].includes(coach.role)) {
            return NextResponse.json({ error: "Invalid coach" }, { status: 400 });
        }

        const nicheDef = NICHE_DEFINITIONS[niche as keyof typeof NICHE_DEFINITIONS];

        // Upsert the niche coach assignment
        const nicheCoach = await prisma.nicheCoach.upsert({
            where: { niche },
            update: {
                coachId,
                isActive: true,
            },
            create: {
                niche,
                coachId,
                displayName: nicheDef.displayName,
                description: nicheDef.description,
                isActive: true,
            },
        });

        return NextResponse.json({
            success: true,
            nicheCoach,
        });
    } catch (error) {
        console.error("Error assigning niche coach:", error);
        return NextResponse.json({ error: "Failed to assign coach" }, { status: 500 });
    }
}

// DELETE - Remove a coach from a niche
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const niche = searchParams.get("niche");

        if (!niche) {
            return NextResponse.json({ error: "Niche is required" }, { status: 400 });
        }

        await prisma.nicheCoach.delete({
            where: { niche },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing niche coach:", error);
        return NextResponse.json({ error: "Failed to remove coach" }, { status: 500 });
    }
}
