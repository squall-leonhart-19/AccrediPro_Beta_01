import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin
    const adminUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (adminUser?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { userId, action, membershipId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        switch (action) {
            case "remove_from_pod": {
                if (!membershipId) {
                    return NextResponse.json({ error: "membershipId is required" }, { status: 400 });
                }

                // Delete the specific pod membership
                await prisma.podMember.delete({
                    where: { id: membershipId },
                });

                return NextResponse.json({
                    success: true,
                    message: "User removed from pod successfully"
                });
            }

            case "remove_from_all_pods": {
                // Delete all pod memberships for this user
                const result = await prisma.podMember.deleteMany({
                    where: { userId },
                });

                return NextResponse.json({
                    success: true,
                    message: `Removed user from ${result.count} pod(s)`,
                    count: result.count
                });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Pod Management Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
