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
    const assignedTo = searchParams.get("assignedTo"); // userId or "UNASSIGNED"
    const dateRange = searchParams.get("dateRange"); // TODAY, WEEK, MONTH
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

    // Assignment filter logic
    if (assignedToMe) {
      where.assignedToId = session.user.id;
    } else if (assignedTo) {
      if (assignedTo === "UNASSIGNED") {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedTo;
      }
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "TODAY":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "WEEK":
          startDate.setDate(now.getDate() - 7);
          break;
        case "MONTH":
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (["TODAY", "WEEK", "MONTH"].includes(dateRange)) {
        where.createdAt = { gte: startDate };
      }
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
          orderBy: { createdAt: "asc" },
          include: {
            sentBy: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { messages: true } },
      },
      take: 100,
    });

    // --- ANALYTICS CALCULATIONS ---

    // 1. Status Counts
    const statusGroups = await prisma.supportTicket.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const statsMap: any = {
      total: 0,
      NEW: 0,
      OPEN: 0,
      PENDING: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    statusGroups.forEach((s) => {
      statsMap[s.status as keyof typeof statsMap] = s._count.status;
      statsMap.total += s._count.status;
    });

    // 2. Average Rating (Customers)
    const ratingAgg = await prisma.supportTicket.aggregate({
      where: {
        rating: { not: null },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // 3. 30-Day Volume
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newTicketsLast30d = await prisma.supportTicket.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const resolvedTicketsLast30d = await prisma.supportTicket.count({
      where: {
        status: { in: ["RESOLVED", "CLOSED"] },
        updatedAt: { gte: thirtyDaysAgo }
      },
    });

    // 4. Recent Feedback
    const recentFeedback = await prisma.supportTicket.findMany({
      where: { rating: { not: null } },
      select: {
        rating: true,
        ratingComment: true,
        customerName: true,
        ratedAt: true,
      },
      orderBy: { ratedAt: "desc" },
      take: 5,
    });

    // 5. Avg Response Time (Last 30 days)
    const ticketsWithResponse = await prisma.supportTicket.findMany({
      where: {
        firstResponseAt: { not: null },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true, firstResponseAt: true },
    });

    let totalResponseTime = 0;
    if (ticketsWithResponse.length > 0) {
      ticketsWithResponse.forEach(t => {
        if (t.firstResponseAt) {
          totalResponseTime += t.firstResponseAt.getTime() - t.createdAt.getTime();
        }
      });
    }
    const avgResponseTimeHours = ticketsWithResponse.length > 0
      ? (totalResponseTime / ticketsWithResponse.length / (1000 * 60 * 60))
      : 0;

    return NextResponse.json({
      tickets,
      stats: {
        ...statsMap,
        avgRating: ratingAgg._avg.rating || 0,
        ratingCount: ratingAgg._count.rating || 0,
        newTickets30d: newTicketsLast30d,
        resolvedTickets30d: resolvedTicketsLast30d,
        recentFeedback,
        avgResponseTime: avgResponseTimeHours,
      }
    });
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
