import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Write operation - SUPPORT cannot delete conversations
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
    }

    // Delete all messages for this visitor
    await prisma.salesChat.deleteMany({
      where: { visitorId },
    });

    // Also delete the optin if exists
    await prisma.chatOptin.deleteMany({
      where: { visitorId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}
