import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/messages/conversation?userId=xxx
// Delete all messages between current user and target user
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Only admins and mentors can delete conversations
        if (!["ADMIN", "MENTOR", "INSTRUCTOR"].includes(session.user.role || "")) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
        }

        // Delete all messages between the two users (in both directions)
        const deleted = await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: userId },
                    { senderId: userId, receiverId: session.user.id },
                ],
            },
        });

        return NextResponse.json({
            success: true,
            deletedCount: deleted.count,
        });
    } catch (error) {
        console.error("Delete conversation error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete conversation" },
            { status: 500 }
        );
    }
}
