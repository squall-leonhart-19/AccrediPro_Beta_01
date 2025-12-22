import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all tickets with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const assignedToMe = searchParams.get("assignedToMe") === "true";
    const assignedTo = searchParams.get("assignedTo");
    const dateRange = searchParams.get("dateRange");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }
    if (priority && priority !== "ALL") {
      where.priority = priority;
    }
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (assignedToMe) {
      where.assignedToId = session.user.id;
    }
    if (assignedTo && assignedTo !== "ALL") {
      if (assignedTo === "UNASSIGNED") {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedTo;
      }
    }
    if (dateRange && dateRange !== "ALL") {
      const now = new Date();
      let startDate: Date;

      if (dateRange === "TODAY") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateRange === "WEEK") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "MONTH") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(0);
      }

      where.createdAt = { gte: startDate };
    }
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { ticketNumber: { equals: parseInt(search) || -1 } },
      ];
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: [
        { status: "asc" }, // NEW first
        { priority: "desc" }, // URGENT first
        { createdAt: "desc" },
      ],
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true, isFromCustomer: true },
        },
        _count: { select: { messages: true } },
      },
      take: 100,
    });

    // Calculate stats
    const stats = await prisma.supportTicket.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const statsMap = {
      total: tickets.length,
      NEW: 0,
      OPEN: 0,
      PENDING: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    stats.forEach((s) => {
      statsMap[s.status as keyof typeof statsMap] = s._count.status;
    });

    return NextResponse.json({ tickets, stats: statsMap });
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST - Create a new ticket (from admin or customer form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message, customerName, customerEmail, category, priority, userId } = body;

    if (!subject || !message || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Subject, message, name, and email are required" },
        { status: 400 }
      );
    }

    // Create ticket with initial message
    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        customerName,
        customerEmail,
        category: category || "GENERAL",
        priority: priority || "MEDIUM",
        userId: userId || null,
        messages: {
          create: {
            content: message,
            isFromCustomer: true,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
