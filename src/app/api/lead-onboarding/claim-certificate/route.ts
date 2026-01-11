import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.leadOnboarding.upsert({
            where: { userId: session.user.id },
            update: { claimedCertificate: true },
            create: {
                userId: session.user.id,
                claimedCertificate: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error claiming certificate:", error);
        return NextResponse.json({ error: "Failed to claim" }, { status: 500 });
    }
}
