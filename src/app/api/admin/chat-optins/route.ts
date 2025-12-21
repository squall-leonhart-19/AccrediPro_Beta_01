import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all chat optins with message counts
    const optins = await prisma.chatOptin.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Get message counts for each visitor
    const messageCounts = await prisma.salesChat.groupBy({
      by: ["visitorId"],
      where: {
        isFromVisitor: true,
      },
      _count: {
        id: true,
      },
    });

    const messageCountMap = new Map(
      messageCounts.map((mc) => [mc.visitorId, mc._count.id])
    );

    const optinsWithCounts = optins.map((optin) => ({
      ...optin,
      messageCount: messageCountMap.get(optin.visitorId) || 0,
    }));

    return NextResponse.json({ optins: optinsWithCounts });
  } catch (error) {
    console.error("Failed to fetch chat optins:", error);
    return NextResponse.json({ error: "Failed to fetch optins" }, { status: 500 });
  }
}
