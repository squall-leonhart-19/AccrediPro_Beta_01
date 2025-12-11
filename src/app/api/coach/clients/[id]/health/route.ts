import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT: Update client health profile
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        // Verify client belongs to coach
        const existing = await prisma.client.findFirst({
            where: { id, coachId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const client = await prisma.client.update({
            where: { id },
            data: {
                // Health Profile
                primaryConcerns: data.primaryConcerns,
                healthGoals: data.healthGoals,
                currentHealth: data.currentHealth,

                // Health History
                conditions: data.conditions || [],
                medications: data.medications || [],
                supplements: data.supplements || [],
                allergies: data.allergies || [],
                surgeries: data.surgeries,
                familyHistory: data.familyHistory,

                // Lifestyle
                dietType: data.dietType,
                sleepHours: data.sleepHours,
                exerciseFreq: data.exerciseFreq,
                stressLevel: data.stressLevel,

                // Personal
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                gender: data.gender,
                occupation: data.occupation,

                // Notes
                notes: data.notes,
            },
        });

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        console.error("Update health profile error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
