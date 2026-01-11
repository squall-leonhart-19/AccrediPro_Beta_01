import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// GET - Get user's referral link and stats
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                referralCode: true,
                referralCount: true,
            },
        });

        // Generate referral code if doesn't exist
        if (!user?.referralCode) {
            const referralCode = nanoid(8);
            user = await prisma.user.update({
                where: { id: session.user.id },
                data: { referralCode },
                select: {
                    referralCode: true,
                    referralCount: true,
                },
            });
        }

        return NextResponse.json({
            referralCode: user.referralCode,
            referralCount: user.referralCount || 0,
        });
    } catch (error) {
        console.error("Error fetching referral data:", error);
        return NextResponse.json({ error: "Failed to fetch referral data" }, { status: 500 });
    }
}
