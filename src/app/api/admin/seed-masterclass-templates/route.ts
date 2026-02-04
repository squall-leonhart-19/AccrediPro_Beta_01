import { NextRequest, NextResponse } from "next/server";
import { seedMasterclassTemplates, seedGenericTemplates } from "@/lib/masterclass-templates-seed";

/**
 * One-time seed endpoint for masterclass templates.
 * Call this once to populate the MasterclassTemplate table.
 * 
 * Usage: POST /api/admin/seed-masterclass-templates
 * Authorization: Bearer {CRON_SECRET}
 */
export async function POST(request: NextRequest) {
    // Verify secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Seed FM templates
        await seedMasterclassTemplates();

        // Seed generic fallback templates
        await seedGenericTemplates();

        return NextResponse.json({
            success: true,
            message: "Masterclass templates seeded successfully",
        });
    } catch (error) {
        console.error("[SEED] Error:", error);
        return NextResponse.json(
            { error: "Seed failed", details: String(error) },
            { status: 500 }
        );
    }
}
