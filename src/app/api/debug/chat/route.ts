import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Debug endpoint to check chat data - REMOVE IN PRODUCTION
export async function GET() {
  try {
    const optinsCount = await prisma.chatOptin.count();
    const messagesCount = await prisma.salesChat.count();

    const recentOptins = await prisma.chatOptin.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentMessages = await prisma.salesChat.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      optinsCount,
      messagesCount,
      recentOptins,
      recentMessages,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown"
    }, { status: 500 });
  }
}
