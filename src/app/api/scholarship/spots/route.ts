import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/scholarship/spots - Get real-time scholarship spot availability
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "fm-certification";

        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        // Find or create spot record for this month/category
        let spotRecord = await prisma.scholarshipSpot.findUnique({
            where: {
                month_year_category: { month, year, category }
            }
        });

        // If no record exists, create one with defaults
        if (!spotRecord) {
            spotRecord = await prisma.scholarshipSpot.create({
                data: {
                    month,
                    year,
                    category,
                    totalSpots: 50,  // 50 spots per month
                    usedSpots: 0,
                    claimedBy: [],
                }
            });
        }

        const remaining = spotRecord.totalSpots - spotRecord.usedSpots;
        const percentFilled = Math.round((spotRecord.usedSpots / spotRecord.totalSpots) * 100);

        // Scholarship "Reason Why" - Hormozi principle
        const SCHOLARSHIP_REASONS = [
            {
                reason: "February Network Expansion",
                why: "We're actively building our practitioner network in your state. The Institute subsidizes 50 scholarships this month to fast-track regional coverage.",
                icon: "🌎"
            },
            {
                reason: "Testimonial Sprint",
                why: "We're collecting 100 new success stories before our accreditation renewal. In exchange for your testimonial after certification, we cover most of your tuition.",
                icon: "⭐"
            },
            {
                reason: "Founder's Circle",
                why: "Dr. Sarah Mitchell's personal mission is making functional medicine accessible to nurses who can't afford traditional programs. She personally funds 3 scholarships per month.",
                icon: "💜"
            },
        ];

        // Rotate reason based on day of month (so it stays consistent for a user within a day)
        const dayOfMonth = now.getDate();
        const reasonIndex = dayOfMonth % SCHOLARSHIP_REASONS.length;
        const currentReason = SCHOLARSHIP_REASONS[reasonIndex];

        return NextResponse.json({
            success: true,
            data: {
                totalSpots: spotRecord.totalSpots,
                usedSpots: spotRecord.usedSpots,
                remaining,
                percentFilled,
                category,
                month,
                year,
                // Reason Why
                scholarshipReason: currentReason,
                // Urgency messaging
                urgencyLevel: remaining <= 3 ? "critical" : remaining <= 7 ? "high" : remaining <= 15 ? "medium" : "low",
                urgencyMessage: remaining <= 3
                    ? `🔴 CRITICAL: Only ${remaining} scholarship spots left this month!`
                    : remaining <= 7
                        ? `🟠 Only ${remaining} spots remaining — act fast!`
                        : `🟢 ${remaining} spots still available this month`
            }
        });
    } catch (error) {
        console.error("[Scholarship Spots] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch scholarship spots" },
            { status: 500 }
        );
    }
}

// POST /api/scholarship/spots - Claim a scholarship spot
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category = "fm-certification", userId, email } = body;

        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Find the spot record
        const spotRecord = await prisma.scholarshipSpot.findUnique({
            where: {
                month_year_category: { month, year, category }
            }
        });

        if (!spotRecord) {
            return NextResponse.json(
                { success: false, error: "No scholarship spots available for this category" },
                { status: 404 }
            );
        }

        const remaining = spotRecord.totalSpots - spotRecord.usedSpots;
        if (remaining <= 0) {
            return NextResponse.json(
                { success: false, error: "No scholarship spots remaining this month", soldOut: true },
                { status: 400 }
            );
        }

        // Check if user already claimed
        const claimId = userId || email;
        if (claimId && spotRecord.claimedBy.includes(claimId)) {
            return NextResponse.json(
                { success: false, error: "You've already claimed a scholarship spot", alreadyClaimed: true },
                { status: 400 }
            );
        }

        // Claim the spot
        await prisma.scholarshipSpot.update({
            where: { id: spotRecord.id },
            data: {
                usedSpots: spotRecord.usedSpots + 1,
                claimedBy: claimId ? [...spotRecord.claimedBy, claimId] : spotRecord.claimedBy,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Scholarship spot claimed successfully!",
            remaining: remaining - 1,
        });
    } catch (error) {
        console.error("[Scholarship Spots] Claim error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to claim scholarship spot" },
            { status: 500 }
        );
    }
}
