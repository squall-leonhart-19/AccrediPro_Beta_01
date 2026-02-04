import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/seed-zombies
 * Check current zombie profiles (no auth for debugging)
 */
export async function GET() {
    try {
        const zombies = await prisma.zombieProfile.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                tier: true,
                isActive: true,
                isGraduate: true,
            },
            take: 20,
        });

        const total = await prisma.zombieProfile.count({ where: { isActive: true } });

        return NextResponse.json({
            total,
            zombies,
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

/**
 * POST /api/admin/seed-zombies
 * Create test zombie profiles for circle pods (no auth for quick testing)
 */
export async function POST() {
    try {
        const zombies = [
            {
                name: "Jessica Parker",
                avatar: "/zombies/jessica.webp",
                personalityType: "enthusiastic",
                background: "nurse",
                tier: 1,
                isActive: true,
                isGraduate: false,
            },
            {
                name: "Amanda Rodriguez",
                avatar: "/zombies/amanda.webp",
                personalityType: "supportive",
                background: "mom",
                tier: 1,
                isActive: true,
                isGraduate: false,
            },
            {
                name: "Rachel Thompson",
                avatar: "/zombies/rachel.webp",
                personalityType: "curious",
                background: "corporate",
                tier: 1,
                isActive: true,
                isGraduate: false,
            },
            {
                name: "Michelle Chen",
                avatar: "/zombies/michelle.webp",
                personalityType: "analytical",
                background: "teacher",
                tier: 2,
                isActive: true,
                isGraduate: false,
            },
            {
                name: "Sarah Gonzalez",
                avatar: "/zombies/sarah-g.webp",
                personalityType: "empathetic",
                background: "pharmacist",
                tier: 1,
                isActive: true,
                isGraduate: true,
                incomeLevel: "$4.2K/mo",
            },
        ];

        let created = 0;
        let skipped = 0;

        for (const zombie of zombies) {
            // Check if name already exists
            const existing = await prisma.zombieProfile.findFirst({
                where: { name: zombie.name },
            });

            if (existing) {
                // Update existing
                await prisma.zombieProfile.update({
                    where: { id: existing.id },
                    data: zombie,
                });
                skipped++;
            } else {
                // Create new
                await prisma.zombieProfile.create({ data: zombie });
                created++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${created} new, updated ${skipped} existing zombie profiles`,
        });
    } catch (error) {
        console.error("[SEED ZOMBIES] Error:", error);
        return NextResponse.json(
            { error: "Failed to seed zombies", details: String(error) },
            { status: 500 }
        );
    }
}

